const express = require("express");
const router = express.Router();


const {
    selectEventImage,
  
} = require("../controller/eventImageController");



router.route("/image").get(selectEventImage);

module.exports = router;
