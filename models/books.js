const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    bookName: {
      type: String,
      maxlength: 50,
      required: true,
    },
    author: {
      name: {
        type: String,
        maxlength: 50,
        required: true,
      },
      age: {
        type: Number,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
    },
    genre: {
      type: String,
      required: true,
    },
    releaseDate: {
      type: Date,
      default: Date.now(),
    },
    bookImage: {
      type: String,
      required: true,
    },
    active: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Book", bookSchema);
