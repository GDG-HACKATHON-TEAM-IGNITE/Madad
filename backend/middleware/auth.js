import admin from "../config/firebase-config.js";

export async function decodeToken(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    // Header exists?
    if (!authHeader) {
      return res.status(401).json({ msg: "Authorization header missing" });
    }

    // Correct format?
    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ msg: "Invalid authorization format" });
    }

    // Extract token safely
    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ msg: "Token missing" });
    }

    //  Verify Firebase ID token
    const decodedValue = await admin.auth().verifyIdToken(token);

    // Attach user & continue
    req.user = decodedValue;
    next();
  } catch (err) {
    console.error("Auth error:", err);
    return res.status(401).json({ msg: "Unauthorized" });
  }
}

export default decodeToken;
