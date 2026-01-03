// models/PoliceStation.js
import mongoose from "mongoose";


const policeStationSchema = new mongoose.Schema({
  policeId: { type: String, unique: true },
  stationName: String,
  district: String,

  location: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point",
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please enter a valid email address",
      ],
    },
    coordinates: {
      type: [Number], // [lng, lat]
      required: true,
    },
  },

  createdAt: { type: Date, default: Date.now },
});

policeStationSchema.index({ location: "2dsphere" });

export default mongoose.model("PoliceStation", policeStationSchema);
