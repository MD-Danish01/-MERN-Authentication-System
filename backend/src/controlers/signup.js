import User from "../models/login_user.js";
import bcrypt from "bcrypt";

const Signup = async (req, res) => {
  try {
    const { username, password } = req.body;

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).send("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({ username, password: hashedPassword });

    res.status(201).send("User created successfully");
  } catch (err) {
    console.log("Error creating user:", err);
    if (err.name === "ValidationError") {
      return res.status(400).send(err.message);
    }
    res.status(500).send("Server error");
  }
};

export default Signup;
