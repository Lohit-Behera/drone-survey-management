import mongoose from "mongoose";

const MissionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    altitude: {
      type: Number,
      min: 20,
      max: 500,
      default: 120,
    },
    pattern: {
      type: String,
      enum: ["perimeter", "crosshatch"],
      default: "perimeter",
    },
    overlap: {
      type: Number,
      min: 30,
      max: 95,
      default: 65,
    },
    sensors: {
      rgb: { type: Boolean, default: true },
      thermal: { type: Boolean, default: false },
      lidar: { type: Boolean, default: false },
    },
    notes: {
      type: String,
      default: "",
    },
    polygons: [[[Number]]], // Array of polygon coordinates
    polylines: [[[Number]]], // Array of polyline coordinates
    status: {
      type: String,
      enum: [
        "planned",
        "starting",
        "in-progress",
        "paused",
        "completed",
        "aborted",
      ],
      default: "planned",
    },
    progress: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    estimatedDuration: {
      type: Number, // in minutes
      default: 0,
    },
    startTime: {
      type: Date,
    },
    endTime: {
      type: Date,
    },
    assignedDrones: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Drone",
      },
    ],
    actualDuration: {
      type: Number, // in minutes
      default: 0,
    },
    distanceCovered: {
      type: Number, // in kilometers
      default: 0,
    },
    areaCovered: {
      type: Number, // in hectares
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Mission ||
  mongoose.model("Mission", MissionSchema);
