const express = require("express");
const router = express.Router();
const updateRouter = express.Router();
const {
    registerUser,
    loginUser,
    logoutUser,
    verifyUser,
    updateUserDetails,
    updatePassword,
    updateUserAvatar,
    resetPassword,
} = require("../controllers/user.controller");
const { upload } = require("../middlewares/multer.middleware");
const { verifyJwt } = require("../middlewares/auth.middleware");

// public routes
router.post("/register", upload.single("avatar"), registerUser);
router.post("/login", loginUser);
router.post("/verify", verifyUser);
router.put("/reset-password", resetPassword);

//secured routes
router.post("/logout", verifyJwt, logoutUser);

// Use the update router as a sub-router
router.use("/update", verifyJwt, updateRouter);

// update routes
updateRouter.put("/password", updatePassword);
updateRouter.put("/avatar", upload.single("avatar"), updateUserAvatar);

module.exports = router;
