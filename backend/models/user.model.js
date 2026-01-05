import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  uid: {
    type: String,
    required: true,
    unique: true,
  },

  name: String,

  email: {
    type: String,
    unique: true,
    required: true,
  },

  //  missing but used in controller
  photo: String,

  //  missing but used in controller
  provider: {
    type: String,
  },

  //  missing but used in controller
  phone: String,

  //  missing but used in controller
  fcmTokens: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FcmToken",
    },
  ],

  friends: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// 2dsphere index

export default mongoose.model("User", UserSchema);
