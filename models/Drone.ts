import mongoose from "mongoose";

const DroneSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["idle", "in-mission", "charging", "offline"],
      default: "idle",
    },
    battery: {
      type: Number,
      min: 0,
      max: 100,
      default: 100,
    },
    location: {
      type: String,
      required: true,
    },
    lastCheckIn: {
      type: Date,
      default: Date.now,
    },
    altitude: {
      type: Number,
      default: 0,
    },
    speed: {
      type: Number,
      default: 0,
    },
    coordinates: {
      lat: { type: Number, default: 0 },
      lng: { type: Number, default: 0 },
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Drone || mongoose.model("Drone", DroneSchema);
