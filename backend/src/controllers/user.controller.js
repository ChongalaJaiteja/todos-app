const { request } = require("express");
const { User } = require("../models/user.models");

exports.getAllUsers = async (request, response) => {
    response.send("Register user");
};

exports.registerUser = async (request, response) => {
    const { email, password, username } = request.body;
    console.log("signupUser", email, password);
    try {
        // Create a new instance of the User model
        const newUser = new User({
            username,
            email,
            password,
        });

        // Save the user to the database
        await newUser.save();

        response.send("signupUser");
    } catch (error) {
        console.error("Error registering user:", error);
        response.status(500).send("Error registering user");
    }
};
