const asyncHandler = require("express-async-handler");
const selectFunction = require("../utils/selectFunction");


  const selectEventRecord = asyncHandler(async (req, res) => {
    const eventId = req.params.eventId;
  const { userId } = req.body; 
    try {
      const result = await selectFunction.functionSelect(
        `SELECT 
          EVENT_ID_AB, 
          USER_ID, 
          ENTRY_TIME
          
        FROM EVENT_RECORD`,
      [],
        "devuser"
      );
      res.json(result);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Internal server error");
    }
  });


  const selectEventRecordbyID= asyncHandler(async (req, res) => {
    
    try {
      const { eventId } = req.params; // Extract EVENT_ID from the request parameters
  
      const query = `
        SELECT 
          EVENT_ID_AB, 
          USER_ID, 
          ENTRY_TIME
       FROM EVENT_RECORD
        WHERE EVENT_ID_AB = :EVENT_ID
      `;
  
      // Create a simpler bind parameter
      const params = [{ name: 'EVENT_ID', val: eventId }];
  
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
  


  const insertEventRecord =asyncHandler(async(req,res)=>{
    const eventId = req.params.eventId; // Corrected parameter extraction
    const { userId, ENTRY_TIME } = req.body;
    try{
        const{
            EVENT_ID_AB,
            USER_ID,
            ENTRY_TIME
        }=req.body
        console.log("Incoming data:", {
            EVENT_ID_AB,
            USER_ID,
            ENTRY_TIME
          });
          const existingRecord = await selectFunction.functionSelect(
            `SELECT * FROM EVENT_RECORD 
             WHERE EVENT_ID_AB = :eventId AND USER_ID = :userId`,
            { eventId, userId }, // Parameters for the query
            "devuser"
          );
      
          // If a record exists, prevent duplicate registration
          if (existingRecord.length > 0) {
            return res.status(409).json({ message: "User is already registered for this event." });
          }
          // Prepare SQL query
      const query = `INSERT INTO EVENT_RECORD (
         EVENT_ID_AB,
            USER_ID,
            ENTRY_TIME 
        
      ) VALUES (
        :EVENT_ID_AB, 
        :USER_ID, 
        SYSDATE
      )`;

// Set parameters for the query
const params = {
    EVENT_ID_AB: eventId,
    USER_ID: userId,
   
};


console.log("Parameters for SQL query:", params);

// Execute the query
const result= await selectFunction.functionInsert_Update(query, params, "devuser");

// Send success response
res.status(201).json(result);
} catch (err) {
console.log("Error:", err); 
res.status(500).json({
Error: err.message,
});
}
});



  

  module.exports={selectEventRecord,insertEventRecord,selectEventRecordbyID};