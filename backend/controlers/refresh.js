import jwt from "jsonwebtoken";
import User from "../models/login_user.js";
import bcrypt from "bcrypt";
import buildCookieOptions from "../lib/cookieOptions.js";

const getAccessTokenAndRefreshToken = (userID) => {
  const AccessToken = jwt.sign({ userID }, process.env.JWT_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRATION || "10minutes",
  });
  const RefreshToken = jwt.sign({ userID }, process.env.JWT_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRATION || "7d",
  });
  return { AccessToken, RefreshToken };
};

const refresh = async (req, res) => {
  try {
    const RefreshToken = req.cookies.RefreshToken;

    if (!RefreshToken) {
      return res.status(401).send({ ok: false, message: "Unauthorized" });
    }

    const decoded = jwt.verify(
      RefreshToken,
      process.env.JWT_SECRET,
      (err, decoded) => {
        if (err) {
          console.error("Error verifying refresh token:", err);
          return null;
        }
        return decoded;
      },
    );

    if (!decoded) {
      return res.status(401).send({ ok: false, message: "Unauthorized" });
    }

    const user = await User.findById(decoded.userID);

    if (!user) {
      return res.status(401).send({ ok: false, message: "Unauthorized" });
    }
    const isMatch = await bcrypt.compare(RefreshToken, user.RefreshToken);

    if (!isMatch) {
      user.RefreshToken = null;
      await user.save();
      return res.status(401).send({ ok: false, message: "Unauthorized" });
    }

    const { AccessToken, RefreshToken: newRefreshToken } =
      getAccessTokenAndRefreshToken(user._id);

    //hash refresh token and store in database
    const hashedRefreshToken = await bcrypt.hash(newRefreshToken, 10);
    user.RefreshToken = hashedRefreshToken;
    await user.save();

    const cookieOptions = buildCookieOptions();

    // set token in cookie
    res.cookie("AccessToken", AccessToken, cookieOptions);
    res.cookie("RefreshToken", newRefreshToken, cookieOptions);

    res
      .status(200)
      .json({ ok: true, AccessToken, RefreshToken: newRefreshToken });
  } catch (error) {
    console.error("Error occurred while refreshing tokens:", error);
    return res
      .status(500)
      .send({ ok: false, message: "Internal Server Error" });
  }
};

export default refresh;
