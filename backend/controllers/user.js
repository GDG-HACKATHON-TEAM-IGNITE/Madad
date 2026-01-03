import User from "../models/user.model.js";
import FcmToken from "../models/fcmToken.model.js";

export const userCreate = async (req, res) => {
  try {
    const { uid, email, name, picture } = req.user;
    const { fcmToken , phone} = req.body; //solved wrong data

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
 



export const addFriends = async (req, res) => {
  try {
    const { uid } = req.params;
    const { friends } = req.body;

    if (!Array.isArray(friends) || friends.length === 0) {
      return res.status(400).json({
        message: "friends must be a non-empty array of uids",
      });
    }

    const user = await User.findOne({ uid });
    if (!user) {
      return res.status(400).json({
        msg: "code error entered wrong uid in params",
      });
    }

    const friendArray = await User.find({
      uid: { $in: friends },
    });

    if (friendArray.length === 0) {
      return res.status(404).json({
        message: "No valid friends found",
      });
    }

    const friendIds = friendArray.map((f) => f._id);

    await User.findOneAndUpdate(
      { uid },
      {
        $addToSet: {
          friends: { $each: friendIds },
        },
      }
    );

    return res.status(200).json({
      message: "Friends added successfully",
      notExistFriends: friends.filter(
        (f) => !friendArray.map((u) => u.uid).includes(f)
      ),
    });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};
