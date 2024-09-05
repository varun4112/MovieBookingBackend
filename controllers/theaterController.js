const theaterSchema = require("../Models/theaterSchema");

exports.addTheater = async (req, res) => {
  const userId = req.payload;
  const { name, address, phone, email } = req.body;
  try {
    if (name == "" || address == "" || phone == "" || email == "") {
      res.status(500).json({ Message: "All Feilds Required" });
    }
    const response = await theaterSchema.create({
      userId,
      name,
      address,
      phone,
      email,
    });
    if (response) {
      res.status(201).json({ Message: "Successfully added", Status: 201 });
    }
  } catch (err) {
    res.status(500).json({ Message: "Add Theater Failed", error: err });
  }
};

// BACKEND NOT TESTED
exports.getTheaters = async (req, res) => {
  const id = req.payload;
  try {
    if (id) {
      const response = await theaterSchema.find({ userId: id });
      if (!response) {
        return res.status(404).json({ message: "theaters not found" });
      }
      return res.status(200).json({ message: "Success", theater: response });
    } else {
      return res.status(400).json({ message: "Id not provided" });
    }
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.deleteTheater = async (req, res) => {
  const { id } = req.body;
  try {
    if (id) {
      const response = await theaterSchema.findByIdAndDelete(id);
      if (!response) {
        return res.status(404).json({ message: "theater not found" });
      }
      return res.status(200).json({ message: "theater deleted successfully" });
    } else {
      return res.status(400).json({ message: "Id not provided" });
    }
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
