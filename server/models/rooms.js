const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  itemId: {
    type: String,
    required: true,
  }
});

const roomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  capacity: {
    type: Number,
    required: true,
  },
  items: [itemSchema],
  roomId: {
    type: String,
    required: true,
  }
});

module.exports = mongoose.model("Room", roomSchema);
