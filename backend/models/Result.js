const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema(
  {
    appointment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
      required: true,
    },
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    test: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Test",
      required: true,
    },
    results: [
      {
        parameter: {
          type: String,
          required: true,
        },
        value: {
          type: String,
          required: true,
        },
        unit: {
          type: String,
        },
        normalRange: {
          type: String,
        },
        status: {
          type: String,
          enum: ["normal", "abnormal", "critical"],
          default: "normal",
        },
      },
    ],
    findings: {
      type: String,
    },
    recommendations: {
      type: String,
    },
    testedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    reportFile: {
      type: String, // PDF file path
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Result", resultSchema);
