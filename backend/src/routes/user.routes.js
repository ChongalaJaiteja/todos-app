const express = require("express");
const router = express.Router();
const {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
} = require("../controllers/user.controller");
const { upload } = require("../middlewares/multer.middleware");
const { verifyJwt } = require("../middlewares/auth.middleware");

router.post("/register", upload.single("avatar"), registerUser);
router.post("/login", loginUser);

//secured routes
router.post("/logout", verifyJwt, logoutUser);
router.post("/refresh-token", refreshAccessToken);
module.exports = router;
