const express = require("express");
const Appointment = require("../models/Appointment");
const Test = require("../models/Test");
const router = express.Router();

// Create appointment
router.post("/", async (req, res) => {
  try {
    const { patient, test, appointmentDate, appointmentTime, notes } = req.body;

    // Get test details for price
    const testDetails = await Test.findById(test);
    if (!testDetails) {
      return res.status(404).json({ message: "Test not found" });
    }

    const appointment = await Appointment.create({
      patient,
      test,
      appointmentDate,
      appointmentTime,
      notes,
      amount: testDetails.price,
    });

    await appointment.populate("test");
    await appointment.populate("patient", "name email phone");

    res.status(201).json(appointment);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get user appointments
router.get("/user/:userId", async (req, res) => {
  try {
    const appointments = await Appointment.find({ patient: req.params.userId })
      .populate("test")
      .sort({ createdAt: -1 });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get all appointments (for admin/lab staff)
router.get("/", async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate("test")
      .populate("patient", "name email phone")
      .sort({ createdAt: -1 });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Update appointment status
router.patch("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    )
      .populate("test")
      .populate("patient", "name email phone");

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
