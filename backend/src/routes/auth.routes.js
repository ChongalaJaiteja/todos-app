const express = require("express");
const router = express.Router();
const { verifyJwt } = require("../middlewares/auth.middleware");

const {
    validateToken,
    refreshAccessToken,
} = require("../controllers/auth.controller");

router.get("/validate-token", verifyJwt, validateToken);
router.post("/refresh-token", refreshAccessToken);

module.exports = router;
