import PoliceStation from "../models/PoliceStation.js";
import FcmToken from "../models/FcmToken.js";

export const registerPoliceDevice = async (req, res) => {
  try {
    const { policeId, fcmToken } = req.body;

    if (!policeId || !fcmToken) {
      return res.status(400).json({
        success: false,
        message: "policeId and fcmToken required",
      });
    }

    //  find police station
    const police = await PoliceStation.findOne({ policeId });

    if (!police) {
      return res.status(404).json({
        success: false,
        message: "Police station not found",
      });
    }

    //  find or create token
    let tokenDoc = await FcmToken.findOne({ token: fcmToken });

    if (!tokenDoc) {
      tokenDoc = await FcmToken.create({
        token: fcmToken,
        ownerType: "PoliceStation",
        owner: police._id,
      });

      police.fcmTokens.push(tokenDoc._id);
      await police.save();
    } else {
      // token reused / refreshed
      tokenDoc.ownerType = "PoliceStation";
      tokenDoc.owner = police._id;
      tokenDoc.isActive = true;
      tokenDoc.lastActiveAt = new Date();
      await tokenDoc.save();
    }

    res.json({
      success: true,
      message: "Police device registered",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
