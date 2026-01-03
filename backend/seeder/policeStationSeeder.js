//  import mongoose from "mongoose";
// import PoliceStation from "../models/policeStation.model.js";

// const MONGO_URI = "mongodb://127.0.0.1:27017";

// const seedPoliceStation = async () => {
//   try {
//     await mongoose.connect(MONGO_URI);

//     await PoliceStation.create({
//       _id: new mongoose.Types.ObjectId("65bb11111111111111111111"),
//       stationName: "Park Street PS",
//       location: {
//         type: "Point",
//         coordinates: [88.3650, 22.5728], // [lng, lat]
//       },
//       fcmTokens: ["FCM_TOKEN_POLICE"],
//     });

//     console.log("✅ Police Station seeded");
//     process.exit(0);
//   } catch (error) {
//     console.error("❌ Seeder error:", error);
//     process.exit(1);
//   }
// };

// seedPoliceStation();
// import mongoose from "mongoose";
// import User from "../models/user.model.js";

// const MONGO_URI = "mongodb://127.0.0.1:27017/your_db_name";

// const seedUser = async () => {
//   try {
//     await mongoose.connect(MONGO_URI);

//     await User.create({
//       _id: new mongoose.Types.ObjectId("65aa11111111111111111111"),
//       name: "Alice",
//       friends: [
//         new mongoose.Types.ObjectId("65aa22222222222222222222"),
//       ],
//       location: {
//         type: "Point",
//         coordinates: [88.3639, 22.5726], // [lng, lat]
//       },
//       fcmTokens: [
//         { token: "FCM_TOKEN_ALICE" },
//       ],
//     });

//     console.log("✅ User seeded");
//     process.exit(0);
//   } catch (error) {
//     console.error("❌ Seeder error:", error);
//     process.exit(1);
//   }
// };

// seedUser();

