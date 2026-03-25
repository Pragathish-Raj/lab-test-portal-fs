const mongoose = require("mongoose");

const testSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: ["Blood Test", "Urine Test", "Imaging", "Biopsy", "Other"],
    },
    duration: {
      type: Number, // in minutes
      required: true,
    },
    preparationInstructions: {
      type: String,
      default: "No special preparation required",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Test", testSchema);
