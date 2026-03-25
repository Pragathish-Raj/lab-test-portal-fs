const mongoose = require("mongoose");
require("dotenv").config();

const User = require("./models/User");
const Test = require("./models/Test");
const Appointment = require("./models/Appointment");
const Result = require("./models/Result");

const sample = async () => {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/lab-portal"
    );
    console.log("Connected to MongoDB for seeding results...");

    // Find or create a test
    let test = await Test.findOne({ name: /Complete Blood Count/i });
    if (!test) {
      test = await Test.create({
        name: "Complete Blood Count (CBC)",
        description: "Measures different components of blood",
        price: 25,
        category: "Blood Test",
        duration: 15,
      });
      console.log("Created test:", test._id);
    }

    // Find or create a patient user
    let patient = await User.findOne({ email: "sample.patient@example.com" });
    if (!patient) {
      patient = await User.create({
        name: "Sample Patient",
        email: "sample.patient@example.com",
        password: "password123",
        phone: "9999999999",
        dateOfBirth: new Date(1990, 1, 1),
        gender: "Other",
      });
      console.log("Created patient user:", patient._id);
    }

    // Create an appointment
    let appointment = await Appointment.create({
      patient: patient._id,
      test: test._id,
      appointmentDate: new Date(),
      appointmentTime: "10:00 AM",
      status: "completed",
      paymentStatus: "paid",
      amount: test.price,
      notes: "Seed appointment",
    });

    console.log("Created appointment:", appointment._id);

    // Create a result
    const result = await Result.create({
      appointment: appointment._id,
      patient: patient._id,
      test: test._id,
      results: [
        {
          parameter: "Hemoglobin",
          value: "13.5",
          unit: "g/dL",
          normalRange: "13.0-17.0",
          status: "normal",
        },
        {
          parameter: "WBC",
          value: "6.2",
          unit: "10^3/µL",
          normalRange: "4.0-11.0",
          status: "normal",
        },
        {
          parameter: "Platelets",
          value: "250",
          unit: "10^3/µL",
          normalRange: "150-450",
          status: "normal",
        },
      ],
      findings: "All parameters within normal limits.",
      recommendations: "No specific action required.",
      isPublished: true,
    });

    console.log("Created sample result:", result._id);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

sample();
