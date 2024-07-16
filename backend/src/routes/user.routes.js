const router = require("express").Router();
const { User } = require("../models/user.models");

const { getAllUsers, registerUser } = require("../controllers/user.controller");

router.route("/").get(getAllUsers);
router.route("/register").post(registerUser);

module.exports = router;
