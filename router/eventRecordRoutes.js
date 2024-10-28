const express = require("express");
const router = express.Router();

const {
    selectEventRecord,
    insertEventRecord,
    selectEventRecordbyID
} = require("../controller/eventRecordController");

router.route("/eventrecord").get(selectEventRecord);
router.route("/eventrecord/:eventId").get(selectEventRecordbyID);
router.route("/eventrecord/:eventId").post(insertEventRecord);

module.exports = router; // Ensure this exports the router
