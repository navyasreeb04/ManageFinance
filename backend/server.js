const dns = require('node:dns');
dns.setServers(['8.8.8.8', '8.8.4.4']); // Forces Google Public DNS
//requrire dotenv to use it 
require('dotenv').config();
// //server starts here and is created at app.js
const server  = require("./src/app");
const connectDB = require("./src/config/db");

//connect to database
connectDB();

//start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log("Server is running on port 3000");
});