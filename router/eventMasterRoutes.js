const express = require("express");
const router = express.Router();

const {
    selectEventDetails,
    selectEventDetailsByID,
eventDetailInsert
} = require("../controller/eventMasterController");

router.route("/event").get(selectEventDetails);
router.route("/event/:id").get(selectEventDetailsByID);

router.post('/events', eventDetailInsert);


module.exports = router;
