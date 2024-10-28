const asyncHandler = require("express-async-handler");
const selectFunction = require("../utils/selectFunction");
const QRCode = require('qrcode');

// /api/event
// select event details
const selectEventDetails = asyncHandler(async (req, res) => {
    try {
      const result = await selectFunction.functionSelect(
        `SELECT 
          EVENT_ID, 
          EVENT_NAME, 
          EVENT_FROM_DATE, 
          EVENT_TO_DATE, 
          EVENT_LOCATION, 
          EVENT_ORGANIZATION, 
          EVENT_DEPARTMENT, 
          ENTRY_BY, 
          ENTRY_ON, 
          EVENT_DETAILS, 
          EVENT_REMARKS, 
          EVENT_FEES,
          USER_ID 
        FROM EVENT_MASTER`,
        [],
        "devuser"
      );
      res.json(result);
    } catch (err) {
      console.error(err.message);
      res.status(500).json("Internal server error");
    }
  });
  
  const selectEventDetailsByID = asyncHandler(async (req, res) => {
    try {
      const { id } = req.params; // Extract EVENT_ID from the request parameters
  
      const query = `
        SELECT 
          EVENT_ID, 
          EVENT_NAME, 
          EVENT_FROM_DATE, 
          EVENT_TO_DATE, 
          EVENT_LOCATION, 
          EVENT_ORGANIZATION, 
          EVENT_DEPARTMENT, 
          ENTRY_BY, 
          ENTRY_ON, 
          EVENT_DETAILS, 
          EVENT_REMARKS, 
          EVENT_FEES,
          USER_ID
        FROM EVENT_MASTER 
        WHERE EVENT_ID = :EVENT_ID
      `;
  
      // Create a simpler bind parameter
      const params = [{ name: 'EVENT_ID', val: id }];
  
      const result = await selectFunction.functionSelect(query, params, "devuser");
  
      // Check if the result is empty
      if (result.length === 0) {
        return res.status(404).json({ message: "Event not found" });
      }
  
      res.json(result[0]); // Return the first matched result
    } catch (err) {
      console.error(err.message);
      res.status(500).json("Internal server error");
    }
  });
  

  const eventDetailInsert = asyncHandler(async (req, res) => {
    try {
      const {
        EVENT_NAME,
        EVENT_FROM_DATE,
        EVENT_TO_DATE,
        EVENT_LOCATION,
        EVENT_ORGANIZATION,
        EVENT_DEPARTMENT,
        ENTRY_BY,
        EVENT_DETAILS,
        EVENT_REMARKS,
        EVENT_FEES,
        USER_ID
      } = req.body;
  
      // Validate required fields
      if (!EVENT_NAME || !EVENT_FROM_DATE || !EVENT_TO_DATE) {
        return res.status(400).json({ Error: "Missing required fields." });
      }
  
//      // Logic to generate EVENT_ID
// const currentYear = new Date().getFullYear();
// const currentMonth = String(new Date().getMonth() + 1).padStart(2, '0'); // Get current month and format
// const yearSuffix = String(currentYear).slice(-2); // Last two digits of the current year

// // Fetch current event count for this month
// const eventCountQuery = `SELECT COUNT(*) AS count FROM EVENT_MASTER 
//                          WHERE TO_CHAR(EVENT_FROM_DATE, 'YYYY-MM') = TO_CHAR(SYSDATE, 'YYYY-MM')`;

// const countResult = await selectFunction.functionSelect(eventCountQuery, {}, "devuser");
// console.log("Event Count Result:", countResult); // Log the count result

// // Incrementing the count correctly
// const newEventCount = countResult[0].COUNT ? parseInt(countResult[0].COUNT) + 1 : 1; // Ensure it's not NaN
// console.log(newEventCount, "new event count");

// // Formatting the EVENT_ID
// const eventIdFormatted = `${yearSuffix}${currentMonth}${String(newEventCount).padStart(4, '0')}`; // Correctly pad the number
// console.log("Formatted EVENT_ID:", eventIdFormatted); // Log the formatted EVENT_ID


//   console.log(eventIdFormatted);
//       // Check for uniqueness of EVENT_ID
//       const existingIdQuery = `SELECT COUNT(*) AS count FROM EVENT_MASTER WHERE EVENT_ID = :EVENT_ID`;
//       console.log(eventCountQuery,existingIdQuery);
//       const existingIdResult = await selectFunction.functionSelect(existingIdQuery, { EVENT_ID: eventIdFormatted }, "devuser");
  


//       if (existingIdResult[0].count > 0) {
//         console.error("Duplicate EVENT_ID generated:", eventIdFormatted);
//         return res.status(409).json({ Error: "Duplicate EVENT_ID generated." });
//       }
        const id = await selectFunction.functionSelect(`select max(EVENT_ID)+1 MAX  from EVENT_MASTER`, [], "devuser");
        const eventId = id[0]?.MAX || 1;
      // Prepare SQL query
      const query = `INSERT INTO EVENT_MASTER (
                       EVENT_ID, 
                       EVENT_NAME, 
                       EVENT_FROM_DATE, 
                       EVENT_TO_DATE, 
                       EVENT_LOCATION, 
                       EVENT_ORGANIZATION, 
                       EVENT_DEPARTMENT, 
                       ENTRY_BY, 
                       ENTRY_ON, 
                       EVENT_DETAILS, 
                       EVENT_REMARKS, 
                       EVENT_FEES,
                       USER_ID
                     ) VALUES (
                       :EVENT_ID, 
                       :EVENT_NAME, 
                       TO_DATE(:EVENT_FROM_DATE, 'DD-MM-YYYY'), 
                       TO_DATE(:EVENT_TO_DATE, 'DD-MM-YYYY'), 
                       :EVENT_LOCATION, 
                       :EVENT_ORGANIZATION, 
                       :EVENT_DEPARTMENT, 
                       :ENTRY_BY, 
                       SYSDATE, 
                       :EVENT_DETAILS, 
                       :EVENT_REMARKS, 
                       :EVENT_FEES,
                       :USER_ID
                     )`;
  
      const params = {
        EVENT_ID: eventId, // Use the generated EVENT_ID
        EVENT_NAME,
        EVENT_FROM_DATE,
        EVENT_TO_DATE,
        EVENT_LOCATION,
        EVENT_ORGANIZATION,
        EVENT_DEPARTMENT,
        ENTRY_BY,
        EVENT_DETAILS,
        EVENT_REMARKS,
        EVENT_FEES: Number(EVENT_FEES),
        USER_ID // Ensure this is a number
      };
  
      // Log parameters before execution
      console.log("Parameters for SQL query:", params);
  
      // Execute the query
      const result = await selectFunction.functionInsert_Update(query, params, "devuser");


      const insertedIdResult = await selectFunction.functionSelect(`SELECT MAX(EVENT_ID) AS ID FROM EVENT_MASTER`, [], "devuser");
      const insertedEventId = insertedIdResult[0]?.ID;
  
      if (!insertedEventId) {
        throw new Error("Failed to retrieve inserted event ID.");
      }
     const qrCodeUrl = `http://192.168.90.209:${process.env.PORT}/register/${insertedEventId}`;
      const qrCode = await QRCode.toDataURL(qrCodeUrl);
      console.log("Generated QR Code URL:", qrCodeUrl);
      console.log("Generated QR Code Data URL:", qrCode);
  
      res.json({ message: 'Event created successfully', qrCode });
      // Send success response
      // res.status(201).json(result);
    } catch (err) {
      console.error("Error in eventDetailInsert:", err);
      res.status(500).json({ Error: err.message });
    }
  });
  
  
  
  
  module.exports = {
    selectEventDetails,eventDetailInsert,selectEventDetailsByID
  };
  

  