const { User } = require("../models/user.models");
const { ApiError } = require("../utils/ApiError");
const { ApiResponse } = require("../utils/ApiResponse");
const { removeFieldsFromObject } = require("../utils/removeObjectFields");

const checkUserExistence = async ({ email, username }) => {
    const user = await User.findOne({
        $or: [{ email }, { username }],
    });
    return user;
};

const sanitizeUser = (user) => {
    return removeFieldsFromObject(user, [
        "password",
        "refreshToken",
        "projects",
        "collaborations",
    ]);
};

module.exports = {
    checkUserExistence,
    sanitizeUser,
};
