import User from "../models/login_user.js";
import bycrypt from "bcrypt";
import jwt from "jsonwebtoken";

const Login = async (req, res) =>{
    try {
    const { username, password } = req.body;

    // Find user in database
    const user = await User.findOne({ username });
    
    if (!user) {
      return res.status(401).send("User not found");
    }


    // Check if password matches
    const isMatch = await bycrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).send("Invalid password");
    }

    // Generate JWT token
    const token = jwt.sign({userID : user._id}, process.env.JWT_SECRET, {expiresIn: "1h"});

    // set token in cookie
    res.cookie("token", token, { httpOnly: true, secure: false, sameSite: "lax", maxAge: 60 * 60 * 24 * 7 * 1000 }); // 7 days (secure:false for localhost HTTP)

    res.status(200).json({ token });
    console.log("User logged in:", username);
  } catch (err) {
    console.log("Error during login:", err);
    res.status(500).send("Server error");
  }
}

export default Login;