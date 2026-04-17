import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import connectDB from "./lib/connectdb.js";
import buildCookieOptions from "./lib/cookieOptions.js";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });

await connectDB();

const app = express();
const port = process.env.PORT || 3000;

const allowedOrigins = [
  process.env.LOCALHOST_ORIGIN || "http://localhost:5173",
  process.env.DEPLOYED_ORIGIN ||
    "https://mern-authentication-system-flax.vercel.app",
]
  .map((origin) => origin.trim())
  .filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    // Allow server-to-server tools or same-origin requests with no Origin header.
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use((req, res, next) => {
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }
  next();
});

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//importing controllers
import Signup from "./controlers/signup.js";
import Login from "./controlers/login.js";
import Auth from "./controlers/auth.js";
import refresh from "./controlers/refresh.js";
import logout from "./controlers/logout.js";

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
app.get("/logout", logout);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
