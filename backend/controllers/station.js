import PoliceStation from "../models/PoliceStation.js";
import FcmToken from "../models/FcmToken.js";
import jwt from "jsonwebtoken";
import Device from "../models/device.model.js";
import { mail } from "../utilits/mail.js";
import jwt from "jsonwebtoken";

export const registerPoliceDevice = async (req, res) => {
  try {
    const { fcmToken, emailId, DeviceId } = req.body;

    if (!fcmToken || emailId) {
      return res.status(400).json({
        success: false,
        message: "emailId,and fcmToken required",
      });
    }
    if (!DeviceId) {
      return res.status(400).json({
        success: false,
        message: "Device id required",
      });
    }

    //  find police station
    const police = await PoliceStation.findOne({ emailId });//assuming each station has unique email

    if (!police) {
      return res.status(404).json({
        success: false,
        message: "Police station not found",
      });
    }

    const verificationCode = Math.floor(1000 + Math.random() * 9000);
    const verificationCodeExpiry = new Date(Date.now() + 4 * 60 * 1000);
    const device = await Device.create(
      police.policeId,
      DeviceId,
      verificationCode,
      verificationCodeExpiry
    );

    await mail({
      html: <p>{verificationCode}within 4 minutes</p>,
      to: emailId,
    });
    return res.json({ msg: "mail Send", emailId, fcmToken });
  } catch (err) {
    res.json({ msg: err });
  }
};

export const verifyPoliceDevice = async (req, res) => {
  try {
    const { code, emailId, DeviceId, fcmToken } = req.body;
    const police = await PoliceStation.findOne({ emailId });
    const time = Date.now();
    const device = await Device.findOne({ deviceId: DeviceId });
    if (!device) return res.status(400).json({ msg: "try again" });
    if (!device.verificationCode || !device.verificationCodeExpiry)
      return res.status(400).json({ msg: "try again" });

    if (new Date() > device.verificationCodeExpiry)
      return res.status(400).json({ msg: "code expired" });
    if (device.verificationCode !== verificationCode)
      return res.status(400).json({ msg: "invalid code" });
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
// const payload = {
// policeStationId:police.policeId
// };

// const token = jwt.sign(
//   payload,
//   process.env.JWT_SECRET,
//   {
//     expiresIn: "7d",
//   }
// );//no need

    res.json({
      success: true,
      message: "Police device registered",
     PoliceStationId: police.policeId
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
