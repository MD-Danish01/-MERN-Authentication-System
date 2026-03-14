import jwt from "jsonwebtoken";
import User from "../models/login_user.js";

const Auth = async (req, res) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).send("Unauthorized");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userID);

    if (!user) {
      return res.status(401).send("Unauthorized");
    }

    return res.status(200).json({ username: user.username });
  } catch (error) {
    console.error("Error occurred while authenticating user:", error);
    return res.status(500).send("Internal Server Error");
  }
};

export default Auth;
