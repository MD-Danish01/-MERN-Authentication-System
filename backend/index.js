import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import connectDB from "./lib/connectdb.js";

await connectDB();

const app = express();
const port = 3000;

app.use(cors({ origin: "http://localhost:5173", credentials: true }));

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//importing controllers
import Signup from "./controlers/signup.js";
import Login from "./controlers/login.js";
import Auth from "./controlers/auth.js";

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// // SIGNUP - Create new user
app.post("/signup", Signup);

// LOGIN - Validate existing user
app.post("/login", Login);

// ACCOUNT - Get user account details (protected route)
app.get("/account", Auth);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
