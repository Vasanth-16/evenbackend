const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const QRCode = require('qrcode');
dotenv.config();
const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(cors());

// Ensure these paths are correct and files exist
app.use("/api", require("./router/eventMasterRoutes")); // Ensure this path is correct
app.use("/api", require("./router/eventRecordRoutes")); // Ensure this path is correct
// app.use("/api2", require("./router/eventImageRoutes")); // Ensure this path is correct
app.use("/api", require("./router/loginRoutes")); // Ensure this path is correct

// Start the server
app.listen(port, () => {
    console.log(`Express.js app listening on port ${port}`);
});
