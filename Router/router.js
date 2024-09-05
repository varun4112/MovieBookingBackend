const express = require("express");
const router = new express.Router();
const userControllers = require("../controllers/userControllers");
const jwtMiddleware = require("../middleware/jwtAuthentication");
const multerMiddleware = require("../middleware/multerMIddleware");
const movieController = require("../controllers/movieController");
const theaterController = require("../controllers/theaterController");
const showcontroller = require("../controllers/showController");

//user routes
router.post("/register", userControllers.register); //Route to register
router.post("/login", userControllers.login); //Route to login
router.post("/googleLogin", userControllers.googleLogin); // Route to googlelogin
router.get("/getUser", jwtMiddleware, userControllers.getUser); //route to getUser
router.post("/generate_email_otp", userControllers.genOtp); //route to generate otp
router.post("/verify_email_otp", userControllers.verOtp); //Route to verify otp

router.post(
  "/addMovie",
  jwtMiddleware,
  multerMiddleware.single("poster"),
  movieController.handleAddMovies
);
router.get("/getMovie", jwtMiddleware, movieController.getMovie);
router.delete("/deleteMovie", movieController.deleteMovie);

// Theater routes
router.post("/addTheater", jwtMiddleware, theaterController.addTheater);
router.post("/deleteTheater", theaterController.deleteTheater);
router.get("/getTheater", jwtMiddleware, theaterController.getTheaters);

//show routes
router.post("/addShow", jwtMiddleware, showcontroller.addShows);
router.get("/getShows", jwtMiddleware, showcontroller.getShows);

module.exports = router;
