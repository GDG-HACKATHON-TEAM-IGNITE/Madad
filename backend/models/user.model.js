import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  //Firebase / google Auth fields
  uid: {
    type: String,
    required: true,
    unique: true, // firebase UID is unique
  },

  name: {
    type: String,
  },

  email: {
    type: String,
    unique: true,
    required: true,
  },

  photo: {
    type: String, // google profile photo URL
  },

  firebase: {
    sign_in_provider: {
      type: String, // e.g. "google.com"
    },
  },
  //  fcm tokens (references)
  fcmTokens: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FcmToken",
    },
  ],

  phone: {
    type: String,
  },

  // close Friends
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

export default mongoose.model("User", UserSchema);
