const showSchema = require("../Models/showSchema");

exports.addShows = async (req, res) => {
  const id = req.payload;
  const { showName, showStart, movieId, theaterId, price } = req.body;
  try {
    if (
      showName == "" ||
      showStart == "" ||
      movieId == "" ||
      theaterId == "" ||
      price == ""
    ) {
      res.status(500).json({ message: "All Feilds Are required" });
    }
    const response = await showSchema.create({
      showName,
      showStart,
      vendorId: id,
      movieId,
      theaterId,
      price,
    });
    if (response) {
      res
        .status(201)
        .json({ Message: "Successfully added", Status: 201, data: response });
    }
  } catch (err) {
    res.status(500).json({ Message: "Failed to Add Show", error: err });
  }
};

exports.getShows = async (req, res) => {
  const id = req.payload;
  try {
    if (id) {
      const response = await showSchema.find({ vendorId: id });
      console.log(response);
      if (!response) {
        return res.status(404).json({ message: "Shows not found" });
      }
      return res.status(200).json(response);
    } else {
      return res.status(400).json({ message: "Id not provided" });
    }
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
