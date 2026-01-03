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

  // 🔥 ADD THIS
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

  friends: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  }],

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// 🔥 ADD INDEX
UserSchema.index({ location: "2dsphere" });

export default mongoose.model("User", UserSchema);
