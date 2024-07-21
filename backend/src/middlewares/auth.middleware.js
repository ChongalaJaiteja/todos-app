const { asyncHandler } = require("../utils/asyncHandler");
const jwt = require("jsonwebtoken");
const { User } = require("../models/user.models");
const { ApiError } = require("../utils/ApiError");

exports.verifyJwt = asyncHandler(async (request, _, next) => {
    try {
        const token =
            request.cookies?.accessToken ||
            request.headers["authorization"]?.replace("Bearer ", "");
        if (!token) {
            throw new ApiError(401, "Unauthorized request");
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        // optimize the selection of field
        const user = await User.findById(decodedToken?._id).select(
            "-password -refreshToken -projects -collaborations",
        );
        if (!user) {
            throw new ApiError(401, "Invalid Access Token ");
        }
        request.user = user;
        next();
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid Access Token");
    }
});