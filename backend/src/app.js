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
        credentials: true, // This is crucial for sending cookies
    }),
);

// router imports
const userRouter = require("./routes/user.routes");
const authRouter = require("./routes/auth.routes");
// router declarations
app.use("/api/v1/users", userRouter);
app.use("/api/v1/auth", authRouter);

exports.app = app;
