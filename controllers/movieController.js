const movie = require("../Models/movieSchema");

exports.handleAddMovies = async (req, res) => {
  const { name, desc, duration, rating, genre, poster } = req.body;
  console.log(name, desc, duration, rating, genre, poster);
  const posterImage = req.file.filename;
  const userId = req.payload;
  try {
    if (
      name == "" ||
      desc == "" ||
      duration == "" ||
      rating == "" ||
      genre == "" ||
      poster == "" ||
      userId == ""
    ) {
      res.status(401).json(`Add Movie API failed Error please Fill all feilds`);
    }
    const newMovie = new movie({
      vendorId: userId,
      name,
      desc,
      duration,
      rating,
      genre,
      poster: posterImage,
    });
    const result = await newMovie.save();
    console.log(result);
    res.status(200).json(newMovie);
  } catch (err) {
    res.status(401).json(`Add Movie API failed Error: ${err}`);
  }
};

exports.getMovie = async (req, res) => {
  const id = req.payload;
  try {
    if (id) {
      const response = await movie.find({ vendorId: id });
      console.log(response);
      if (!response) {
        return res.status(404).json({ message: "Movie not found" });
      }
      return res.status(200).json(response);
    } else {
      return res.status(400).json({ message: "Id not provided" });
    }
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.deleteMovie = async (req, res) => {
  const { id } = req.body;
  try {
    if (id) {
      const response = await movie.findByIdAndDelete(id);
      if (!response) {
        return res.status(404).json({ message: "Movie not found" });
      }
      return res.status(200).json({ message: "Movie deleted successfully" });
    } else {
      return res.status(400).json({ message: "Id not provided" });
    }
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
