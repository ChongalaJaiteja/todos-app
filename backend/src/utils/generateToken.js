const { User } = require("../models/user.models");
const { ApiError } = require("./ApiError");

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

module.exports = { generateAccessAndRefreshToken };
