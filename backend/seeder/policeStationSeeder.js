import mongoose from "mongoose";
import dotenv from "dotenv";
import policeStation from "../models/policeStation.model.js";

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("MongoDB connected");
  } catch (err) {
    console.error("DB connection failed", err);
    process.exit(1);
  }
};

const PoliceStations = [
  {
    policeId: "PS001",
    stationName: "Bhubaneswar Central Police Station",
    district: "Bhubaneswar",
    location: { lat: 20.2961, lng: 85.8245 },
  },
  {
    policeId: "PS002",
    stationName: "Cuttack Town Police Station",
    district: "Cuttack",
    location: { lat: 20.4625, lng: 85.883 },
  },
  {
    policeId: "PS003",
    stationName: "Puri Sea Beach Police Station",
    district: "Puri",
    location: { lat: 19.8135, lng: 85.8312 },
  },
  {
    policeId: "PS004",
    stationName: "Sundargram Police Station",
    district: "Cuttack",
    location: { lat: 20.4012, lng: 85.8456 }, // fake but realistic
  },
  {
    policeId: "PS005",
    stationName: "Sundargram East Police Outpost",
    district: "Cuttack",
    location: { lat: 20.4058, lng: 85.8519 },
  },
  {
    policeId: "PS006",
    stationName: "Sundargram West Police Checkpost",
    district: "Cuttack",
    location: { lat: 20.3967, lng: 85.8382 },
  },
  {
    policeId: "PS005",
    stationName: "Burla VSSUT Police Station",
    district: "Sambalpur",
    location: { lat: 21.4927, lng: 83.9028 } // near VSSUT Burla
  },

  /* 🔹 Extra nearby fake stations (useful for testing radius logic) */
  {
    policeId: "PS006",
    stationName: "Burla Town Police Outpost",
    district: "Sambalpur",
    location: { lat: 21.4891, lng: 83.9062 }
  }
];

const seedPoliceStations = async () => {
  try {
    await connectDB();

    await policeStation.deleteMany(); // optional
    await policeStation.insertMany(PoliceStations);

    console.log("Police stations seeded successfully");
    process.exit();
  } catch (error) {
    console.error("Seeding failed", error);
    process.exit(1);
  }
};

seedPoliceStations();
//bad me arry bana ke each police from station ka location se 5km bala complex logic karuga
//agar time bacha
