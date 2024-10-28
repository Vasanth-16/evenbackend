const express = require("express");
const router = express.Router();
const { selectLogin } = require("../controller/loginController");

router.route("/login").post(selectLogin);
module.exports = router;