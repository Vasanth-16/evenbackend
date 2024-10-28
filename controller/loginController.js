const asyncHandler = require("express-async-handler");
const selectFunction = require("../utils/selectFunction");

// /api/login
// login user
const selectLogin = asyncHandler(async (req, res) => {
    const { userId, password } = req.body; // Assuming you send username and password
    console.log("Received userId:", userId); // Log for debugging
    console.log("Received password:", password); 
    try {
        const result = await selectFunction.functionSelect(
            `SELECT 
              USER_ID,
              USER_PASSWORD
            FROM USER_LOGIN 
            WHERE USER_ID = :userId AND USER_PASSWORD = :password`, // Directly compare passwords
            [userId, password], // Parameters to prevent SQL injection
            "devuser"
        );

        if (result.length === 0) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Assuming you send the user ID and a token (or any other data) back
        res.json({
            message: "Login successful",
            userId: result[0].USER_ID, // Adjust based on your database schema
            // token: "example-token", // Placeholder; implement JWT or other token management in production
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = {
    selectLogin
};
