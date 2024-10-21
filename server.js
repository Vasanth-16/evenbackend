// server.js

const express = require("express");


const dotenv = require("dotenv");


const app = express();


const cors = require("cors");
dotenv.config();
const port = process.env.PORT;
app.use(express.json());
app.use(cors());

app.use("/api", require("./router/eventMasterRoutes"));
app.use("/api1", require("./router/eventRecordRoutes"));
// app.use("/api2", require("./router/eventImageRoutes"));


// Start the server
app.listen(port, () => {
    console.log(`Express.js app listening on port ${port}`);
});
