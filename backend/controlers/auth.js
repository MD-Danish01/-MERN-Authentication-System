import jwt from "jsonwebtoken";
import User from "../models/login_user.js";

const Auth = async (req, res) => {
  try {
    const AccessToken = req.cookies.AccessToken;

    const RefreshToken = req.cookies.RefreshToken;

    if (!AccessToken) {
      return res.status(401).send({ message: "Unauthorized" });
    }

    const decoded = jwt.verify(AccessToken, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userID);

    if (!user) {
      return res.status(401).send({ message: "Unauthorized" });
    }

    return res
      .status(200)
      .json({
        ok: true,
        user: user,
        username: user.username,
        AccessToken: AccessToken,
        refreshToken: RefreshToken,
      });
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res
        .status(401)
        .send({ error: error, message: "Access token expired" });
    }
    console.error("Error occurred while authenticating user:", error);
    return res.status(500).send("Internal Server Error");
  }
};

export default Auth;
