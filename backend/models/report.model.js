import mongoose from "mongoose";

const reportSchema = new mongoose.Schema({
  //  bug: `string` → `String`
  whatHappened: {
    type: String,
    enum: [
      "Harassment",
      "Theft",
      "Assult",
      "Stalking",
      "Poorlighting",
      "Others",
    ],
    required: true,
  },

  //  bug: `string` → `String`
  firstName: { type: String },
  lastName: { type: String },
  phone: { type: Number },
  email: { type: String },

  risk: {
    type: Number,
    required: true,
    min: 1,
    max: 3,
  },

  //  unused in controller but kept
  describe: {
    type: String,
  },

  //  bug: GeoJSON structure totally wrong
  location: {
    type: {
      type: String,
      enum: ["Point"],
      required: true,
      default: "Point",
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

//  bug: index must match GeoJSON object
reportSchema.index({ location: "2dsphere" });

export const Report = mongoose.model("Report", reportSchema);
