// models/PoliceStation.js
import mongoose from "mongoose";

const policeStationSchema = new mongoose.Schema({
  policeId: { type: String, unique: true },
  stationName: String,
  district: String,

  location: {
    lat: Number,
    lng: Number
  },

  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("PoliceStation", policeStationSchema);
