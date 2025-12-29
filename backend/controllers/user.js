import User from "../models/user.model.js";
import FcmToken from "../models/fcmToken.model.js";

const userCreate = async (req, res) => {
  try {
    const { uid, email, name, picture, phone } = req.user;
    const { fcmToken } = req.body;

    // Find or create user
    let user = await User.findOne({ uid });

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

    //  Register / update FCM token
    if (fcmToken) {
      let tokenDoc = await FcmToken.findOne({ token: fcmToken });

      if (!tokenDoc) {
        tokenDoc = await FcmToken.create({
          token: fcmToken,
          ownerType: "User",
          owner: user._id,
        });

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

    res.json({ success: true, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
}
export default userCreate;