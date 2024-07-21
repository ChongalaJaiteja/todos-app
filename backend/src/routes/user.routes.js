const express = require("express");
const router = express.Router();
const { getAllUsers, registerUser } = require("../controllers/user.controller");
const { upload } = require("../middlewares/multer.middleware");

router.get("/", getAllUsers);
router.post("/register", upload.single("avatar"), registerUser);

module.exports = router;
