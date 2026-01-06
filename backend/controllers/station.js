import PoliceStation from "../models/policeStation.model.js";
import FcmToken from "../models/fcmToken.model.js";
import Device from "../models/device.model.js";
import { mail } from "../utilits/mail.js";

export const registerPoliceDevice = async (req, res) => {
  try {
    const { fcmToken, emailId, DeviceId } = req.body;

    //  bug: condition was wrong (emailId was not negated)
    if (!fcmToken || !emailId) {
      return res.status(400).json({
        success: false,
        message: "emailId and fcmToken required",
      });
    }

    if (!DeviceId) {
      return res.status(400).json({
        success: false,
        message: "Device id required",
      });
    }

    //  bug: schema uses `email`, not `emailId`
    const police = await PoliceStation.findOne({ email: emailId });

    if (!police) {
      return res.status(404).json({
        success: false,
        message: "Police station not found",
      });
    }

    const verificationCode = Math.floor(1000 + Math.random() * 9000);
    const verificationCodeExpiry = new Date(Date.now() + 4 * 60 * 1000);

    //  bug: field name mismatch (policeid vs policeId)
    const device = await Device.create({
      policeStationId: police._id, // store ObjectId, not string policeId
      deviceId: DeviceId,
      verificationCode,
      verificationCodeExpiry,
    });

    //without $ not valid in Node.js
    await mail({
      html: `<p>${verificationCode} (valid for 4 minutes)</p>`,
      to: emailId,
    });

    return res.json({
      success: true,
      message: "Mail sent",
      deviceId: device._id,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


export const verifyPoliceDevice = async (req, res) => {
  try {
    const { code, emailId, DeviceId, fcmToken } = req.body;

    //  bug: PoliceStation schema uses `email`, not `emailId`
    const police = await PoliceStation.findOne({ email: emailId });
    if (!police) {
      return res.status(404).json({ msg: "Police station not found" });
    }

    //  bug: deviceId field name mismatch handled correctly here
    const device = await Device.findOne({ deviceId: DeviceId });
    if (!device) {
      return res.status(400).json({ msg: "try again" });
    }

    if (!device.verificationCode || !device.verificationCodeExpiry) {
      return res.status(400).json({ msg: "try again" });
    }

    //  bug: unnecessary Date.now() variable removed
    if (new Date() > device.verificationCodeExpiry) {
      return res.status(400).json({ msg: "code expired" });
    }

    //  bug: code may come as string → ensure number comparison
    if (Number(device.verificationCode) !== Number(code)) {
      return res.status(400).json({ msg: "invalid code" });
    }

    //  bug: DO NOT create new Device document
    //  update existing device instead
    device.isVerified = true;
    device.verificationCode = null;
    device.verificationCodeExpiry = null;
    await device.save();

    //  bug: fcmToken validation missing
    if (!fcmToken) {
      return res.status(400).json({ msg: "fcmToken required" });
    }

    let tokenDoc = await FcmToken.findOne({ token: fcmToken });

    if (!tokenDoc) {
      tokenDoc = await FcmToken.create({
        token: fcmToken,
        ownerType: "PoliceStation",
        owner: police._id,
      });
    } else {
      // token reused / refreshed
      tokenDoc.ownerType = "PoliceStation";
      tokenDoc.owner = police._id;
      tokenDoc.isActive = true;
      tokenDoc.lastActiveAt = new Date();
      await tokenDoc.save();
    }

    return res.json({
      success: true,
      message: "Police device registered",
      policeStationId: police.policeStationId,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};