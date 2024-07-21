const { User } = require("../models/user.models");
const { ApiError } = require("../utils/ApiError");
const { ApiResponse } = require("../utils/ApiResponse");
const { uploadOnCloudinary } = require("../utils/cloudinary");
const { asyncHandler } = require("../utils/asyncHandler");
const { deleteFile } = require("../utils/files");
const jwt = require("jsonwebtoken");

const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
        user.refreshToken = refreshToken;
        await user.save({
            validateBeforeSave: false,
        });
        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(500, "Error generating tokens");
    }
};

exports.registerUser = asyncHandler(async (request, response) => {
    const { email, password, username, fullName } = request.body;
    const avatarUrlFromBody = request.body?.avatar; // Avatar URL from the body, if provided
    const avatarLocalPath = request.file?.path; // File path if a file was uploaded

    if ([fullName, email, username].some((field) => field?.trim() === "")) {
        deleteFile(avatarLocalPath); // Delete the file if it exists
        throw new ApiError(400, "All fields are required");
    }

    const existedUser = await User.findOne({
        $or: [{ email }, { username }],
    });
    if (existedUser) {
        deleteFile(avatarLocalPath);
        throw new ApiError(409, "User with email or username already exists");
    }

    let avatarUrl;
    if (avatarUrlFromBody) {
        // If avatar URL is provided in the body, use it directly
        avatarUrl = avatarUrlFromBody;
    } else if (avatarLocalPath) {
        // If a file is uploaded, process it
        const uploadedAvatar = await uploadOnCloudinary(avatarLocalPath);
        if (!uploadedAvatar) {
            throw new ApiError(500, "Error uploading avatar");
        }
        avatarUrl = uploadedAvatar.secure_url;
    } else {
        // If neither URL nor file is provided, handle it as needed
        throw new ApiError(400, "Avatar is required");
    }
    const user = await User.create({
        username: username.toLowerCase(),
        email,
        password,
        fullName,
        avatar: avatarUrl,
    });

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken -projects -collaborations",
    );
    if (!createdUser) {
        throw new ApiError(500, "Error registering user");
    }
    return response
        .status(201)
        .json(
            new ApiResponse(200, createdUser, "User registered successfully"),
        );
});

exports.loginUser = asyncHandler(async (request, response) => {
    const { username, email, password } = request.body;
    if (!username && !email) {
        throw new ApiError(400, "Username or email is required");
    }

    const user = await User.findOne({
        $or: [{ username }, { email }],
    });
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid password");
    }
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
        user._id,
    );
    const loggedInUser = await User.findById(user._id).select(
        "-password -refreshToken -projects -collaborations",
    );

    const options = {
        httpOnly: true,
        secure: true,
    };
    return response
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser,
                    accessToken,
                    refreshToken,
                },
                "User logged in successfully",
            ),
        );
});

exports.logoutUser = asyncHandler(async (request, response) => {
    await User.findByIdAndUpdate(
        request.user._id,
        {
            $set: {
                refreshToken: undefined,
            },
        },
        {
            new: true,
        },
    );

    const options = {
        httpOnly: true,
        secure: true,
    };
    return response
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User logged out successfully"));
});

exports.refreshAccessToken = asyncHandler(async (request, response) => {
    const incomingRefreshToken =
        request.cookie?.refreshToken || request.body?.refreshToken;
    if (!incomingRefreshToken) {
        throw new ApiError(401, "Unauthorized request");
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET,
        );

        const user = await User.findById(decodedToken._id);
        if (!user) {
            throw new ApiError(401, "Invalid refresh token");
        }
        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh token is expired or used");
        }
        const options = {
            httpOnly: true,
            secure: true,
        };
        const { accessToken, refreshToken: newRefreshToken } =
            await generateAccessAndRefreshToken(user._id);
        return response
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", newRefreshToken, options)
            .json(
                new ApiResponse(
                    200,
                    {
                        accessToken,
                        refreshToken: newRefreshToken,
                    },
                    "Token refreshed successfully",
                ),
            );
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token");
    }
});