const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      unique: true,
      required: true,
    },

    password: {
      type: String,
      required: true,
    },

    image: {
      type: String,
      default:
        "https://i.pravatar.cc/150?img=12",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);