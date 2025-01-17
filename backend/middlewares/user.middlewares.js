import jwt from "jsonwebtoken";

export const isSignedIn = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]; 
    if (!token) {
      return res.status(401).json({ message: "Authorization token missing" });
    }

   
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; 
   console.log("hi try")
    next();
  } catch (error) {
    console.error(error);
    console.log("hi catch")
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};