const express = require("express");
const cors = require("cors");
const session = require("express-session");
require("dotenv").config();
require("./DbConnection/DbConnection"); //Connecting to the database
const router = require("./Router/router");

const server = express();

server.use(
  cors({
    origin: "http://localhost:3000", // Allow requests from this origin
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true, // Allow cookies to be sent with requests
  })
);

server.use("/uploads", express.static("./uploads"));
server.use(express.json());
// configuring session
server.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false,
      maxAge: 60000,
    },
  })
);

server.get("/", (req, res) => {
  res.send("<h1>Server Is Running :)</h1>");
});

// Use the router for other routes
server.use(router);

const PORT = process.env.PORT || 5000; // Optionally use an environment variable for PORT

server.listen(PORT, () => {
  console.log(`Server is running on PORT : ${PORT}`);
});
