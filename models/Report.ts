import mongoose from "mongoose";

const ReportSchema = new mongoose.Schema(
  {
    missionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Mission",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    durationMin: {
      type: Number,
      required: true,
    },
    areaHa: {
      type: Number,
      required: true,
    },
    distanceKm: {
      type: Number,
      required: true,
    },
    drones: {
      type: Number,
      required: true,
    },
    site: {
      type: String,
      required: true,
    },
    coverageData: {
      type: String, // JSON string of coverage heatmap data
      default: "",
    },
    sensorData: {
      rgb: { type: Boolean, default: false },
      thermal: { type: Boolean, default: false },
      lidar: { type: Boolean, default: false },
    },
    weatherConditions: {
      temperature: Number,
      windSpeed: Number,
      visibility: Number,
      humidity: Number,
    },
    qualityMetrics: {
      imageQuality: { type: Number, min: 0, max: 100 },
      coverageEfficiency: { type: Number, min: 0, max: 100 },
      dataCompleteness: { type: Number, min: 0, max: 100 },
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Report || mongoose.model("Report", ReportSchema);
