const { request } = require("express");
const { User } = require("../models/user.models");
const { ApiError } = require("../utils/ApiError");
const { ApiResponse } = require("../utils/ApiResponse");

const { uploadOnCloudinary } = require("../utils/cloudinary");
const { asyncHandler } = require("../utils/asyncHandler");
exports.getAllUsers = async (request, response) => {
    response.send("Register user");
};

exports.registerUser = asyncHandler(async (request, response) => {
    const { email, password, username, fullName } = request.body;
    console.log("signupUser", email, password, username, fullName);
    if ([fullName, email, username].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }

    const existedUser = await User.findOne({
        $or: [{ email }, { username }],
    });
    if (existedUser) {
        throw new ApiError(409, "User with email or username already exists");
    }

    const avatarLocalPath = request?.file?.path;
    console.log("avatarLocalPath", avatarLocalPath);
    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar is required");
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);
    console.log("avatar", avatar);
    if (!avatar) {
        throw new ApiError(500, "Avatar field is required");
    }
    const user = await User.create({
        username: username.toLowerCase(),
        email,
        password,
        fullName,
        avatar: avatar.secure_url,
    });

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken",
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
