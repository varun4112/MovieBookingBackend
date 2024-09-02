const express = require("express");
const router = new express.Router();
const userControllers = require("../controllers/userControllers");
const jwtMiddleware = require("../middleware/jwtAuthentication");

router.post("/register", userControllers.register);
router.post("/login", userControllers.login);
router.get("/getUser", jwtMiddleware, userControllers.getUser);

module.exports = router;
