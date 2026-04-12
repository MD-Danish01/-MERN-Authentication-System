import express from "express";
// import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import connectDB from "./lib/connectdb.js";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });

await connectDB();

const app = express();
const port = process.env.PORT || 3000;

// app.use(cors({ origin: process.env.ORIGIN, credentials: true }));

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//importing controllers
import Signup from "./controlers/signup.js";
import Login from "./controlers/login.js";
import Auth from "./controlers/auth.js";
import refresh from "./controlers/refresh.js";

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// // SIGNUP - Create new user
app.post("/signup", Signup);

// LOGIN - Validate existing user
app.post("/login", Login);

// ACCOUNT - Get user account details (protected route)
app.get("/account", Auth);

// REFRESH - Refresh access token using refresh token
app.get("/refresh", refresh);

// LOGOUT - Clear tokens from cookies
app.get("/logout", (req, res) => {
  res.clearCookie("AccessToken");
  res.clearCookie("RefreshToken");
  res.status(200).send("Logged out successfully");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
