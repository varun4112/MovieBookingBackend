const express = require("express");
const cors = require("cors");
require("dotenv").config();
require("./DbConnection/DbConnection"); //Connecting to the database
const router = require("./Router/router");

const server = express();
server.use(cors());

server.use(express.json());

server.get("/", (req, res) => {
  res.send("<h1>Server Is Running :)</h1>");
});

// Use the router for other routes
server.use(router);

const PORT = process.env.PORT || 5000; // Optionally use an environment variable for PORT

server.listen(PORT, () => {
  console.log(`Server is running on PORT : ${PORT}`);
});
