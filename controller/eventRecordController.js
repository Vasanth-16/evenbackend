const asyncHandler = require("express-async-handler");
const selectFunction = require("../utils/selectFunction");


  const selectEventRecord = asyncHandler(async (req, res) => {
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

  const insertEventRecord =asyncHandler(async(req,res)=>{
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
          // Prepare SQL query
      const query = `INSERT INTO EVENT_RECORD (
         EVENT_ID_AB,
            USER_ID,
            ENTRY_TIME 
        
      ) VALUES (
        :EVENT_ID_AB, 
        :USER_ID, 
        TO_DATE(:ENTRY_TIME, 'DD-MM-YYYY')
     
      )`;

// Set parameters for the query
const params = {
    EVENT_ID_AB,
    USER_ID,
    ENTRY_TIME
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



  

  module.exports={selectEventRecord,insertEventRecord}