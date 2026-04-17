import User from "../models/login_user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import buildCookieOptions from "../lib/cookieOptions.js";

const Login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find user in database
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).send("User not found");
    }

    // Check if password matches
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).send("Invalid password");
    }

    // Generate JWT access and refresh tokens
    const AccessToken = jwt.sign({ userID: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRATION || "10m",
    });
    const RefreshToken = jwt.sign(
      { userID: user._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.REFRESH_TOKEN_EXPIRATION || "7d" },
    );

    const cookieOptions = buildCookieOptions();

    // set token in cookie
    res.cookie("AccessToken", AccessToken, cookieOptions);
    res.cookie("RefreshToken", RefreshToken, cookieOptions);

    //hash refresh token and store in database
    const hashedRefreshToken = await bcrypt.hash(RefreshToken, 10);
    user.RefreshToken = hashedRefreshToken;
    await user.save();

    res.status(200).json({ AccessToken, RefreshToken });
  } catch (err) {
    console.log("Error during login:", err);
    res.status(500).send("Server error");
  }
};

export default Login;
