const { User } = require("../models/user.models");
const { ApiError } = require("../utils/ApiError");
const { ApiResponse } = require("../utils/ApiResponse");
const { uploadOnCloudinary } = require("../utils/cloudinary");
const { asyncHandler } = require("../utils/asyncHandler");
const { deleteFile } = require("../utils/files");
const { checkUserExistence, sanitizeUser } = require("../utils/userHelpers");
const { generateAccessAndRefreshToken } = require("../utils/generateToken");

const verifyUser = asyncHandler(async (request, response) => {
    const { username = "", email = "", password = "" } = request.body;

    if (!username && !email) {
        throw new ApiError(400, "Username or email is required");
    }

    const user = await checkUserExistence({ username, email });

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    if (password !== "") {
        const isPasswordValid = await user.isPasswordCorrect(password);
        if (!isPasswordValid) {
            throw new ApiError(401, "Invalid password");
        }
    }

    const verifiedUser = sanitizeUser(user);
    return response
        .status(200)
        .json(
            new ApiResponse(
                200,
                { user: verifiedUser },
                "User verified successfully",
            ),
        );
});

const registerUser = asyncHandler(async (request, response) => {
    const { email, password, username, fullName } = request.body;
    const avatarUrlFromBody = request.body?.avatar; // Avatar URL from the body, if provided
    const avatarLocalPath = request.file?.path; // File path if a file was uploaded

    if ([fullName, email, username].some((field) => field?.trim() === "")) {
        deleteFile(avatarLocalPath); // Delete the file if it exists
        throw new ApiError(400, "All fields are required");
    }

    const existedUser = await checkUserExistence({ email, username });

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
        if (!uploadedAvatar?.secure_url) {
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

    const createdUser = sanitizeUser(user);

    if (!createdUser) {
        throw new ApiError(500, "Error registering user");
    }
    // Generate tokens
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
        user._id,
    );

    const options = {
        httpOnly: true,
        secure: true,
    };

    return response
        .status(201)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(200, createdUser, "User registered successfully"),
        );
});

const updatePassword = asyncHandler(async (request, response) => {
    const { oldPassword, newPassword } = request.body;
    const user = await User.findById(request.user?._id);
    const isPasswordValid = await user.isPasswordCorrect(oldPassword);
    if (!isPasswordValid) {
        throw new ApiError(400, "Invalid password");
    }
    user.password = newPassword;
    await user.save({
        validateBeforeSave: false,
    });

    return response
        .status(200)
        .json(new ApiResponse(200, {}, "Password changed successfully"));
});

const updateUserAvatar = asyncHandler(async (request, response) => {
    const avatarUrlFromBody = request.body?.avatar; // Avatar URL from the body, if provided
    const avatarLocalPath = request.file?.path; // File path if a file was uploaded

    let avatarUrl;
    // handle avatar update
    if (avatarUrlFromBody) {
        avatarUrl = avatarUrlFromBody;
    } else if (avatarLocalPath) {
        const uploadedAvatar = await uploadOnCloudinary(avatarLocalPath);
        if (!uploadedAvatar?.secure_url) {
            deleteFile(avatarLocalPath);
            throw new ApiError(500, "Error uploading avatar");
        }
        avatarUrl = uploadedAvatar.secure_url;
        deleteFile(avatarLocalPath);
    }

    await User.findByIdAndUpdate(
        request.user._id,
        {
            $set: {
                avatar: avatarUrl,
            },
        },
        { new: true },
    );

    return response
        .status(200)
        .json(
            new ApiResponse(
                200,
                { avatar: avatarUrl },
                "Avatar updated successfully",
            ),
        );
});

const updateUserDetails = asyncHandler(async (request, response) => {
    const { fullName, email, username } = request.body;
    const userId = request.user?._id;
    const updates = {};
    if (email) updates.email = email;
    if (username) updates.username = username.toLowerCase();
    if (fullName) updates.fullName = fullName;

    // check if the user exists
    const user = await User.findById(userId);
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    // update the user details
    Object.assign(user, updates);
    await user.save({
        validateBeforeSave: false,
    });

    const updatedUser = sanitizeUser(user);
    return response
        .status(200)
        .json(
            new ApiResponse(
                200,
                { user: updatedUser },
                "User details updated successfully",
            ),
        );
});

const resetPassword = asyncHandler(async (request, response) => {
    const { email, password: newPassword } = request.body;
    if (!email) {
        throw new ApiError(400, "Email is required");
    }

    const user = await User.findOne({ email });
    if (!user) {
        throw new ApiError(404, "User not found");
    }
    user.password = newPassword;
    await user.save({
        validateBeforeSave: false,
    });
    return response
        .status(200)
        .json(new ApiResponse(200, {}, "Password reset successfully"));
});

const loginUser = asyncHandler(async (request, response) => {
    const { username, email, password = "", googleSignIn } = request.body;
    if (!username && !email) {
        throw new ApiError(400, "Username or email is required");
    }

    const user = await checkUserExistence({ username, email });
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    if (!googleSignIn) {
        const isPasswordValid = await user.isPasswordCorrect(password);
        if (!isPasswordValid) {
            throw new ApiError(401, "Invalid password");
        }
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
        user._id,
    );
    // Remove sensitive data from the user object
    const loggedInUser = sanitizeUser(user);

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

const logoutUser = asyncHandler(async (request, response) => {
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

module.exports = {
    verifyUser,
    registerUser,
    loginUser,
    logoutUser,
    updateUserDetails,
    updatePassword,
    updateUserAvatar,
    resetPassword,
};
