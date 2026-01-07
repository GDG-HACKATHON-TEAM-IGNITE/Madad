import User from "../models/user.model.js";
import FcmToken from "../models/fcmToken.model.js";
import { Report } from "../models/report.model.js";

export const userCreate = async (req, res) => {
  try {
    const { uid, email, name, picture } = req.user;
    const { fcmToken, phone } = req.body;

    // Find user by uid
    let user = await User.findOne({ uid });

    // Ensure we do not update existing user data (name, email, photo) from req.user
    // This preserves any edits the user made to their profile.
    if (!user) {
      user = await User.create({
        uid,
        name,
        email,
        photo: picture,
        provider: "google",
        phone,
      });
    }

    // Register / update FCM token
    if (fcmToken) {
      let tokenDoc = await FcmToken.findOne({ token: fcmToken });

      if (!tokenDoc) {
        tokenDoc = await FcmToken.create({
          token: fcmToken,
          ownerType: "User",
          owner: user._id,
        });

        //  bug: fcmTokens array must exist in schema
        user.fcmTokens.push(tokenDoc._id);
        await user.save();
      } else {
        tokenDoc.ownerType = "User";
        tokenDoc.owner = user._id;
        tokenDoc.isActive = true;
        tokenDoc.lastActiveAt = new Date();
        await tokenDoc.save();
      }
    }

    return res.json({
      success: true,
      userdetails: {
        name: user.name,
        photo: user.photo,
        phone: user.phone,
        uid: user._id,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false });
  }
};

import mongoose from "mongoose";
import e from "express";

export const addFriends = async (req, res) => {
  try {
    console.log("addFriends route hit, body:", req.body);
    const { uid } = req.user;
    const { friends } = req.body;

    // 1️⃣ Validate input
    if (!Array.isArray(friends) || friends.length === 0) {
      return res.status(400).json({
        message: "friends must be a non-empty array of User IDs",
      });
    }

    // 2️⃣ Filter valid ObjectIds
    const validObjectIds = friends.filter((id) =>
      mongoose.Types.ObjectId.isValid(id)
    );

    if (validObjectIds.length === 0) {
      return res.status(400).json({
        message: "No valid MongoDB ObjectIds provided",
      });
    }

    // 3️⃣ Find current user (using Firebase UID from token)
    const currentUser = await User.findOne({ uid });
    if (!currentUser) {
      return res.status(400).json({ message: "Invalid user" });
    }

    // 4️⃣ Find existing users by _id (Mongoose ID)
    const existingUsers = await User.find({
      _id: { $in: validObjectIds },
    }).select("_id uid");

    if (existingUsers.length === 0) {
      return res.status(404).json({
        message: "No valid users found for provided IDs",
      });
    }

    // IDs to add
    const existingIds = existingUsers.map((u) => u._id);

    // 5️⃣ Add these IDs to the current user's friends list
    // safe because the schema defines friends array of ObjectIds
    await User.updateOne(
      { uid },
      {
        $addToSet: {
          friends: { $each: existingIds },
        },
      }
    );

    // 6️⃣ Detect invalid / non-existing UIDs
    const invalidIds = friends.filter((fuid) => !existingUids.has(fuid)); //change 1

    return res.status(200).json({
      message: "Friends added successfully",
      addedFriends: existingIds,
      notAddedFriends: notAddedFriends,
    });
  } catch (error) {
    console.error("addFriends error:", error);
    return res.status(500).json({ message: error.message });
  }
};

// {
//   "friends": [
//     "65fa1c0b1234567890abcd12",
//     "invalid-id",
//     "65fa1c0b0000000000000000"
//   ]
// }

// {
//   "message": "Friends added successfully",
//   "addedFriends": ["65fa1c0b1234567890abcd12"],
//   "notAddedFriends": ["invalid-id", "65fa1c0b0000000000000000"]
// }

export const report = async (req, res) => {
  try {
    if (!req.user || !req.user.uid) {
      return res.status(401).json({ msg: "Unauthorized" });
    }
    console.log(req.body); //test
    const {
      whatHappened, // numeric (1..6)
      firstName,
      lastName,
      riskVal,
      lng,
      lat,
      phone,
      description,
      location,
    } = req.body;

    // Explicit validation (no falsy bugs)
    if (
      whatHappened === undefined ||
      riskVal === undefined ||
      lng === undefined ||
      lat === undefined
    ) {
      return res.status(400).json({ msg: "Missing required fields" });
    }
    //  Map numeric whatHappened → string enum
    const INCIDENT_MAP = {
      1: "Harassment",
      2: "Theft",
      3: "Assault",
      4: "Stalking",
      5: "PoorLighting",
      6: "Others",
    };

    const incidentType = INCIDENT_MAP[whatHappened];
    if (!incidentType) {
      return res.status(400).json({ msg: "Invalid whatHappened value" });
    }

    // Validate risk properly
    if (riskVal < 1 || riskVal > 3) {
      return res.status(400).json({ msg: "Invalid risk value" });
    }

    const address = location?.address || null;
    //Create Report
    await Report.create({
      whatHappened: incidentType,
      firstName,
      lastName,
      phone,
      risk: riskVal,
      describe: description,
      address,

      location: {
        type: "Point",
        coordinates: [Number(lng), Number(lat)],
      },
    });

    return res.status(201).json({
      success: true,
      message: "Report created",
    });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};
export const scoreCalculator = async (req, res) => {
  try {
    //  missing auth guard response
    if (!req.user || !req.user.uid) {
      return res.status(401).json({ msg: "Unauthorized" });
    }

    //  bug: res.quary → req.query
    const { lng, lat } = req.query;

    //  bug: lng/lat are strings from query params
    if (lng === undefined || lat === undefined) {
      return res.status(400).json({ msg: "lng and lat are required" });
    }

    const longitude = Number(lng);
    const latitude = Number(lat);

    if (Number.isNaN(longitude) || Number.isNaN(latitude)) {
      return res.status(400).json({ msg: "Invalid coordinates" });
    }

    const data = await Report.find(
      {
        location: {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: [longitude, latitude],
            },
            $maxDistance: 5000, // meters
          },
        },
      },
      { whatHappened: 1, risk: 1, location: 1 } // projection
    );

    const totalCases = data.length;

    //  bug: reduce without initial value can crash on empty array
    const totalRating = data.reduce((sum, curr) => sum + curr.risk, 0);

    //  bug: const reassignment + unsafe math
    let safeScoreIntensity = totalCases * totalRating;

    if (safeScoreIntensity < 1) {
      safeScoreIntensity = 1;
    }

    //  bug: safescore was undeclared
    const safescore = (1 / safeScoreIntensity) * 100;

    return res.json({
      safescore,
      totalCases,
      data,
    });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

export const addFriendsByPhone = async (req, res) => {
  try {
    const { uid } = req.user;
    const { phones } = req.body;

    // Validate input
    if (!Array.isArray(phones) || phones.length === 0) {
      return res.status(400).json({
        message: "phones must be a non-empty array",
      });
    }

    // Find logged-in user
    const user = await User.findOne({ uid });
    if (!user) {
      return res.status(400).json({
        message: "Invalid user",
      });
    }

    // Find users matching phone numbers (excluding self)
    const matchedUsers = await User.find({
      phone: { $in: phones },
      uid: { $ne: uid },
    }).select("_id phone");

    if (matchedUsers.length === 0) {
      return res.status(404).json({
        message: "No users found for provided phone numbers",
      });
    }

    // Extract Mongo IDs
    const friendIds = matchedUsers.map((u) => u._id);

    // Add friends (avoid duplicates automatically)
    await User.findOneAndUpdate(
      { uid },
      {
        $addToSet: {
          friends: { $each: friendIds },
        },
      }
    );

    // Detect phones not registered
    const existingPhones = new Set(matchedUsers.map((u) => u.phone));
    const notRegisteredPhones = phones.filter((p) => !existingPhones.has(p));

    return res.status(200).json({
      message: "Friends added successfully",
      addedFriendsCount: friendIds.length,
      notRegisteredPhones,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
export const editProfile = async (req, res) => {
  try {
    console.log("editProfile hit. Body:", req.body);
    const { uid } = req.user;

    const { name, email, photo, phone, provider } = req.body;

    // Build allowed update object
    const updates = {};
    if (email) updates.email = email;
    if (name) updates.name = name;
    if (photo) updates.photo = photo;
    if (phone) updates.phone = phone;
    if (provider) updates.provider = provider;

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        message: "No valid fields provided for update",
      });
    }

    // Update user safely
    const updatedUser = await User.findOneAndUpdate(
      { uid },
      { $set: updates },
      {
        new: true,
        runValidators: true,
      }
    ).select("uid name email phone photo provider");

    if (!updatedUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    // Handle duplicate phone/email errors
    if (error.code === 11000) {
      return res.status(409).json({
        message: "Phone number already in use",
      });
    }

    return res.status(500).json({
      message: error.message,
    });
  }
};

export const getReports = async (req, res) => {
  try {
    const reports = await Report.find().sort({ createdAt: -1 });
    return res.status(200).json(reports);
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

export const getProfile = async (req, res) => {
  try {
    const { uid } = req.user;
    const user = await User.findOne({ uid });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      name: user.name,
      email: user.email,
      photo: user.photo,
      uid: user.uid,
      phone: user.phone,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
