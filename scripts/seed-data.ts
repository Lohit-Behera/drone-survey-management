import dbConnect from "../lib/db";
import Drone from "../models/Drone";
import Mission from "../models/Mission";
import Report from "../models/Report";
import User from "../models/User";

const initialDrones = [
  {
    id: "DR-001",
    name: "Falcon-1",
    status: "idle",
    battery: 98,
    location: "Nevada Test Range",
    lastCheckIn: new Date(),
  },
  {
    id: "DR-002",
    name: "Falcon-2",
    status: "in-mission",
    battery: 66,
    location: "Qatar Field",
    lastCheckIn: new Date(),
  },
  {
    id: "DR-003",
    name: "Raven-A",
    status: "charging",
    battery: 24,
    location: "Berlin Yard",
    lastCheckIn: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
  {
    id: "DR-004",
    name: "Raven-B",
    status: "offline",
    battery: 0,
    location: "Unknown",
    lastCheckIn: null,
  },
  {
    id: "DR-005",
    name: "Eagle-X",
    status: "in-mission",
    battery: 71,
    location: "Pilbara, AU",
    lastCheckIn: new Date(Date.now() - 1 * 60 * 1000),
  },
  {
    id: "DR-006",
    name: "Eagle-Y",
    status: "idle",
    battery: 83,
    location: "Saskatchewan",
    lastCheckIn: new Date(Date.now() - 12 * 60 * 1000),
  },
  {
    id: "DR-007",
    name: "Condor-7",
    status: "charging",
    battery: 39,
    location: "Nevada Test Range",
    lastCheckIn: new Date(Date.now() - 30 * 60 * 1000),
  },
  {
    id: "DR-008",
    name: "Hawk-8",
    status: "idle",
    battery: 91,
    location: "Berlin Yard",
    lastCheckIn: new Date(Date.now() - 3 * 60 * 1000),
  },
  {
    id: "DR-009",
    name: "Hawk-9",
    status: "offline",
    battery: 0,
    location: "Unknown",
    lastCheckIn: null,
  },
  {
    id: "DR-010",
    name: "Kestrel",
    status: "in-mission",
    battery: 52,
    location: "Gobi Site",
    lastCheckIn: new Date(),
  },
  {
    id: "DR-011",
    name: "Merlin",
    status: "idle",
    battery: 64,
    location: "Qatar Field",
    lastCheckIn: new Date(Date.now() - 8 * 60 * 1000),
  },
  {
    id: "DR-012",
    name: "Osprey",
    status: "charging",
    battery: 18,
    location: "Pilbara, AU",
    lastCheckIn: new Date(Date.now() - 60 * 60 * 1000),
  },
];

const initialMissions = [
  {
    name: "North Quarry Sweep",
    location: "Nevada Test Range",
    altitude: 120,
    pattern: "crosshatch",
    overlap: 70,
    sensors: { rgb: true, thermal: false, lidar: true },
    notes: "Comprehensive survey of north quarry area",
    status: "completed",
    progress: 100,
    startTime: new Date(Date.now() - 24 * 60 * 60 * 1000),
    endTime: new Date(Date.now() - 23 * 60 * 60 * 1000),
    actualDuration: 78,
    distanceCovered: 45,
    areaCovered: 320,
  },
  {
    name: "Pilbara LiDAR Pass",
    location: "Pilbara, AU",
    altitude: 150,
    pattern: "perimeter",
    overlap: 65,
    sensors: { rgb: true, thermal: false, lidar: true },
    notes: "LiDAR survey for mining operations",
    status: "completed",
    progress: 100,
    startTime: new Date(Date.now() - 48 * 60 * 60 * 1000),
    endTime: new Date(Date.now() - 46 * 60 * 60 * 1000),
    actualDuration: 112,
    distanceCovered: 62,
    areaCovered: 510,
  },
  {
    name: "Qatar Thermal Grid",
    location: "Qatar Field",
    altitude: 100,
    pattern: "crosshatch",
    overlap: 80,
    sensors: { rgb: true, thermal: true, lidar: false },
    notes: "Thermal imaging for infrastructure inspection",
    status: "completed",
    progress: 100,
    startTime: new Date(Date.now() - 72 * 60 * 60 * 1000),
    endTime: new Date(Date.now() - 71 * 60 * 60 * 1000),
    actualDuration: 54,
    distanceCovered: 28,
    areaCovered: 210,
  },
];

const initialReports = [
  {
    name: "North Quarry Sweep",
    date: new Date(Date.now() - 24 * 60 * 60 * 1000),
    durationMin: 78,
    areaHa: 320,
    distanceKm: 45,
    drones: 3,
    site: "Nevada Test Range",
    sensorData: { rgb: true, thermal: false, lidar: true },
    qualityMetrics: {
      imageQuality: 95,
      coverageEfficiency: 92,
      dataCompleteness: 98,
    },
  },
  {
    name: "Pilbara LiDAR Pass",
    date: new Date(Date.now() - 48 * 60 * 60 * 1000),
    durationMin: 112,
    areaHa: 510,
    distanceKm: 62,
    drones: 4,
    site: "Pilbara, AU",
    sensorData: { rgb: true, thermal: false, lidar: true },
    qualityMetrics: {
      imageQuality: 98,
      coverageEfficiency: 95,
      dataCompleteness: 99,
    },
  },
  {
    name: "Qatar Thermal Grid",
    date: new Date(Date.now() - 72 * 60 * 60 * 1000),
    durationMin: 54,
    areaHa: 210,
    distanceKm: 28,
    drones: 2,
    site: "Qatar Field",
    sensorData: { rgb: true, thermal: true, lidar: false },
    qualityMetrics: {
      imageQuality: 92,
      coverageEfficiency: 88,
      dataCompleteness: 95,
    },
  },
];

const initialUsers = [
  {
    username: "admin",
    email: "admin@dronesurvey.com",
    password: "admin123",
    role: "admin",
    organization: "Drone Survey Enterprise",
  },
  {
    username: "operator",
    email: "operator@dronesurvey.com",
    password: "operator123",
    role: "operator",
    organization: "Drone Survey Enterprise",
  },
];

async function seedData() {
  try {
    await dbConnect();

    // Clear existing data
    await Drone.deleteMany({});
    await Mission.deleteMany({});
    await Report.deleteMany({});
    await User.deleteMany({});

    // Insert users
    const createdUsers = await User.insertMany(initialUsers);
    console.log(`Created ${createdUsers.length} users`);

    // Insert drones
    const createdDrones = await Drone.insertMany(initialDrones);
    console.log(`Created ${createdDrones.length} drones`);

    // Insert missions
    const createdMissions = await Mission.insertMany(initialMissions);
    console.log(`Created ${createdMissions.length} missions`);

    // Insert reports with mission references
    const reportsWithMissions = initialReports.map((report, index) => ({
      ...report,
      missionId: createdMissions[index]._id,
    }));
    const createdReports = await Report.insertMany(reportsWithMissions);
    console.log(`Created ${createdReports.length} reports`);

    console.log("Database seeded successfully!");
    console.log("\nDefault login credentials:");
    console.log("Admin: username=admin, password=admin123");
    console.log("Operator: username=operator, password=operator123");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding data:", error);
    process.exit(1);
  }
}

seedData();
