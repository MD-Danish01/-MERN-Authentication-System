# MERN Authentication System

A full-stack authentication system built with the MERN stack (MongoDB, Express.js, React, Node.js) featuring user registration and login functionality.

## 🚀 Features

- **User Registration**: Secure signup with username validation
- **User Login**: Authentication system with credential verification
- **RESTful API**: Express.js backend with MongoDB integration
- **Modern UI**: React frontend with Tailwind CSS styling
- **Form Validation**: React Hook Form for client-side validation
- **Routing**: React Router DOM for seamless navigation

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS 4** - Utility-first CSS framework
- **React Router DOM** - Client-side routing
- **React Hook Form** - Form validation and management

### Backend
- **Node.js** - Runtime environment
- **Express.js 5** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management

## 📋 Prerequisites

Before running this application, make sure you have:

- Node.js (v14 or higher)
- MongoDB installed and running locally or MongoDB Atlas account
- npm or yarn package manager

## ⚙️ Installation

1. **Clone the repository**
   ```bash
   git clone <your-repository-url>
   cd React_Express_MongDB_Project
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```

3. **Frontend Setup**
   ```bash
   cd "React App"
   npm install
   ```

4. **Environment Configuration**
   
   Create a `.env` file in the `backend` directory:
   ```env
   DATABASE_URL=mongodb://localhost:27017/your_database_name
   # Or for MongoDB Atlas:
   # DATABASE_URL=mongodb+srv://username:password@cluster.mongodb.net/database_name
   ```

## 🚀 Running the Application

### Start Backend Server
```bash
cd backend
npm start
# Or with nodemon for development:
npx nodemon index.js
```
The backend server will run on `http://localhost:3000`

### Start Frontend Development Server
```bash
cd "React App"
npm run dev
```
The frontend will run on `http://localhost:5173` (Vite default)

## 📁 Project Structure

```
React_Express_MongDB_Project/
├── backend/
│   ├── models/
│   │   └── login_user.js       # User schema
│   ├── index.js                # Express server & API routes
│   ├── package.json
│   └── .env                    # Environment variables (create this)
│
└── React App/
    ├── src/
    │   ├── components/
    │   │   ├── Authentication.jsx
    │   │   ├── Login.jsx
    │   │   └── Signup.jsx
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── package.json
    └── vite.config.js
```

## 🔌 API Endpoints

### POST `/signup`
- **Description**: Register a new user
- **Body**: `{ "username": "string", "password": "string" }`
- **Response**: 
  - `201` - User created successfully
  - `400` - User already exists or validation error
  - `500` - Server error

### POST `/login`
- **Description**: Authenticate existing user
- **Body**: `{ "username": "string", "password": "string" }`
- **Response**:
  - `200` - Login successful
  - `401` - User not found or invalid password
  - `500` - Server error

## 🔐 Security Note

⚠️ **Important**: This is a basic authentication system for learning purposes. For production use, please implement:
- Password hashing (bcrypt)
- JWT tokens for session management
- Input sanitization
- Rate limiting
- HTTPS encryption
- Password strength requirements

## 🔐 Auth Tokens & Flow

- **Auth type:** Password-based authentication using `bcrypt` (salt rounds: 10) and JWTs.
- **Access token:** Short-lived JWT issued at login (current backend sets `expiresIn: "1minute"` in the access token generator). Access token is returned in JSON and also set as an `httpOnly` cookie named `AccessToken`.
- **Refresh token:** JWT issued at login (current backend sets `expiresIn: "1h"` in `login.js`, while `refresh.js`'s generator uses `1d` for new tokens). The refresh token is set as an `httpOnly` cookie named `RefreshToken` and stored in the database as a bcrypt hash.
- **Cookies (current implementation):** `httpOnly: true`, `sameSite: "lax"`, `secure: false` (development), `maxAge: 7 days`.
- **Refresh flow (endpoint):** `POST /refresh` — the server reads the `RefreshToken` cookie, verifies the JWT, `bcrypt.compare()`s it with the stored hashed value on the user record, and if valid issues a new access token and refresh token, persists the hashed refresh token, and sets updated cookies.

Implementation notes / gotchas:
- The backend persists refresh tokens hashed with bcrypt (10 salt rounds) instead of storing raw tokens — this reduces risk if the DB is leaked.
- There is a small implementation inconsistency: `login.js` issues a refresh token with `expiresIn: "1h"`, while `refresh.js`'s helper issues a refresh token with `expiresIn: "1d"`. Additionally, `refresh.js` currently hashes the old cookie value instead of the newly-issued refresh token before saving it to the DB; consider fixing that to store the newly-generated refresh token.

Production recommendations:
- Set `secure: true` for cookies and always serve over HTTPS.
- Keep access tokens short and refresh tokens longer, rotate refresh tokens on use, and always store only hashed refresh tokens server-side.
- Use a strong `JWT_SECRET` from environment variables and rotate secrets when necessary.
- Consider additional protections such as refresh token rotation detection, IP/device checks, and revocation lists for compromised tokens.

## 📝 License

ISC

## 👤 Author

**Md Danish**

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

---

Made with ❤️ using the MERN stack