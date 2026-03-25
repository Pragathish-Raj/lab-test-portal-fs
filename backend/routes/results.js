const express = require("express");
const Result = require("../models/Result");
const Appointment = require("../models/Appointment");
const router = express.Router();

// Get results for patient
router.get("/patient/:patientId", async (req, res) => {
  try {
    const results = await Result.find({
      patient: req.params.patientId,
      isPublished: true,
    })
      .populate("test")
      .populate("appointment")
      .sort({ createdAt: -1 });
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get single result
router.get("/:id", async (req, res) => {
  try {
    const result = await Result.findById(req.params.id)
      .populate("test")
      .populate("appointment")
      .populate("patient", "name email phone dateOfBirth gender")
      .populate("testedBy", "name email")
      .populate("verifiedBy", "name email");

    if (!result) {
      return res.status(404).json({ message: "Result not found" });
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Create/Update result
router.post("/", async (req, res) => {
  try {
    const { appointmentId, results, findings, recommendations } = req.body;

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    let result = await Result.findOne({ appointment: appointmentId });

    if (result) {
      // Update existing result
      result.results = results;
      result.findings = findings;
      result.recommendations = recommendations;
      result.isPublished = true;
      await result.save();
    } else {
      // Create new result
      result = await Result.create({
        appointment: appointmentId,
        patient: appointment.patient,
        test: appointment.test,
        results,
        findings,
        recommendations,
        isPublished: true,
      });
    }

    // Update appointment status to completed
    appointment.status = "completed";
    await appointment.save();

    await result.populate("test");
    await result.populate("patient", "name email phone dateOfBirth gender");

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
