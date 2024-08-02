const express = require("express");
const router = express.Router();
const updateRouter = express.Router();
const {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    verifyUser,
    updateUserDetails,
    updatePassword,
    updateUserAvatar,
    resetPassword,
    validateToken,
} = require("../controllers/user.controller");
const { upload } = require("../middlewares/multer.middleware");
const { verifyJwt } = require("../middlewares/auth.middleware");

// public routes
router.post("/register", upload.single("avatar"), registerUser);
router.post("/login", loginUser);
router.post("/verify", verifyUser);

router.get("/validate-token", verifyJwt, validateToken);
router.put("/reset-password", resetPassword);
router.post("/refresh-token", refreshAccessToken);

//secured routes
router.post("/logout", verifyJwt, logoutUser);
// Use the update router as a sub-router
router.use("/update", verifyJwt, updateRouter);

// update routes
// router.put("/update", upload.single("avatar"), updateUserDetails);
updateRouter.put("/password", updatePassword);
updateRouter.put("/avatar", upload.single("avatar"), updateUserAvatar);

module.exports = router;
