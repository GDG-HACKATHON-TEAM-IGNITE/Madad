import mongoose from "mongoose";

const deviceSchema = new mongoose.Schema({
  //  bug: field name inconsistent + ref mismatch
  policeStationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PoliceStation",
    required: true,
  },

  //  bug:string spelling
  deviceId: {
    type: String,
    required: true,
  },

  verificationCode: {
    type: Number,
    required: true,
  },

  verificationCodeExpiry: {
    type: Date,
    required: true,
  },
});

const Device = mongoose.model("Device", deviceSchema);
export default Device;
