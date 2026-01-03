// export const authMiddleware = (req, res, next) => {
//   const token = req.headers.authorization?.split(" ")[1];
//   if (!token) return res.status(401).json({ message: "No token" });

//   const decoded = jwt.verify(token, process.env.JWT_SECRET);
//   req.user = decoded; // safe payload
//   next();
// };

//for now police id is everything i cant socket middle wire and make it more complex for now thats it
