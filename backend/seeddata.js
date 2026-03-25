const mongoose = require("mongoose");
const Test = require("./models/Test");
require("dotenv").config();

const sampleTests = [
  {
    name: "Complete Blood Count (CBC)",
    description:
      "Measures different components of blood including red blood cells, white blood cells, and platelets.",
    price: 25.0,
    category: "Blood Test",
    duration: 15,
    preparationInstructions: "Fasting not required",
  },
  {
    name: "Lipid Profile",
    description:
      "Measures cholesterol and triglyceride levels to assess heart disease risk.",
    price: 35.0,
    category: "Blood Test",
    duration: 20,
    preparationInstructions: "Fasting for 9-12 hours required",
  },
  {
    name: "Urinalysis",
    description:
      "Examines the physical, chemical, and microscopic properties of urine.",
    price: 15.0,
    category: "Urine Test",
    duration: 10,
    preparationInstructions: "First morning urine sample preferred",
  },
];

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    await Test.deleteMany({});
    await Test.insertMany(sampleTests);

    console.log("Sample test data seeded successfully");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding data:", error);
    process.exit(1);
  }
};

seedData();
