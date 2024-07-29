require("dotenv").config({ path: "../.env" });
const express = require("express");
app = express();

const cors = require("cors");
const cookieParser = require("cookie-parser");
app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
    }),
);

// router imports
const userRouter = require("./routes/user.routes");

// router declarations
app.use("/api/v1/users", userRouter);

exports.app = app;
