const { User } = require("../models/user.models");
const { ApiError } = require("../utils/ApiError");
const { ApiResponse } = require("../utils/ApiResponse");
const { asyncHandler } = require("../utils/asyncHandler");
const jwt = require("jsonwebtoken");
const { generateAccessAndRefreshToken } = require("../utils/generateToken");

const validateToken = asyncHandler(async (_, response) => {
    return response.status(200).json(new ApiResponse(200, {}, "Valid token"));
});

const refreshAccessToken = asyncHandler(async (request, response) => {
    const incomingRefreshToken =
        request.cookies?.refreshToken || request.body?.refreshToken;

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
        console.log("Error refreshing token:", error);
        throw new ApiError(401, error?.message || "Invalid refresh token");
    }
});

module.exports = {
    validateToken,
    refreshAccessToken,
};
