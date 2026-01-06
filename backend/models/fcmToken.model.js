import mongoose from "mongoose";

const FcmTokenSchema = new mongoose.Schema({
  token: {
    type: String,
    unique: true,
    required: true,
  },


  ownerType: {
    type: String,
    enum: ["User", "PoliceStation"],
    required: true,
  },

  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: "ownerType",
  },

  lastActiveAt: {
    type: Date,
    default: Date.now,
  },

  isActive: {
    type: Boolean,
    default: true,
  },
});

export default mongoose.model("FcmToken", FcmTokenSchema);
