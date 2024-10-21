const asyncHandler = require("express-async-handler");
const selectFunction = require("../utils/selectFunction");


  const selectEventImage = asyncHandler(async (req, res) => {
    try {
      const result = await selectFunction.functionSelect(
        `SELECT 
        EVENT_ID_AA,
         EVENT_IMAGE
          
        FROM EVENT_IMAGE`,
        [],
        "devuser"
      );
      res.json(result);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Internal server error");
    }
  });
