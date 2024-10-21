const express = require("express");
const router = express.Router();



const {
    selectEventRecord,insertEventRecord
} = require("../controller/eventRecordController");

router.route("/eventrecord").get(selectEventRecord);
router.route("/eventrecord").post(insertEventRecord);

module.exports = router;