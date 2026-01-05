import mongoose from "mongoose";

const policeStationSchema = new mongoose.Schema({
  policeStationId: {
    type: String,
    unique: true,
  },

  stationName: String,
  district: String,

  //  bug: email was incorrectly nested inside location
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

  location: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point",
      required: true,
    },
    coordinates: {
      type: [Number], // [lng, lat]
      required: true,
    },
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// correct 2dsphere index
policeStationSchema.index({ location: "2dsphere" });

export default mongoose.model("PoliceStation", policeStationSchema);
