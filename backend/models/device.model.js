import mongoose from "mongoose";
import PoliceId from "./policeId.model";
const deviceSchema = new mongoose.Schema({
  policeid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "policeStation",
  },
  deviceId: {
    type: string,
    reqired: true,
  },
  verificationCode: {
    type: Number,
    required: true,
  },
   verificationCodeExpiry:{
    type:Date,
    required:true
   }
});
const Device = mongoose.model("Device",deviceSchema)
export default Device