# MERN Authentication Project

Cookie-based authentication system built with React, Express, MongoDB, JWT, and bcrypt.

## Features

- User signup with hashed password (`bcrypt`)
- User login with JWT access + refresh tokens
- Protected account route (`/account`)
- Refresh flow (`/refresh`) using refresh token cookie
- Logout route to clear auth cookies
- React form handling with `react-hook-form`

## Tech Stack

### Frontend
- React 19 + Vite
- React Router DOM
- React Hook Form
- Tailwind CSS 4

### Backend
- Node.js + Express 5
- MongoDB + Mongoose
- JWT (`jsonwebtoken`)
- bcrypt
- CORS + cookie-parser + body-parser

## Project Structure

```text
React_Express_MongDB_Project/
├── Authentication_Architecture.md
├── Readme.md
├── backend/
│   ├── index.js
│   ├── package.json
│   ├── controlers/
│   │   ├── auth.js
│   │   ├── login.js
│   │   ├── refresh.js
│   │   └── signup.js
│   ├── lib/
│   │   └── connectdb.js
│   └── models/
│       └── login_user.js
└── React App/
    ├── package.json
    ├── vite.config.js
    └── src/
        ├── App.jsx
        └── components/
            ├── Authentication.jsx
            ├── Login.jsx
            ├── Signup.jsx
            └── Account.jsx
```

## Prerequisites

- Node.js (recommended v18+)
- npm
- MongoDB (local or Atlas)

## Environment Variables

Create a `.env` file inside `backend/`:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/mern_auth
JWT_SECRET=your_super_secret_key
```

> Note: backend code reads `MONGODB_URI` and `JWT_SECRET`.

## Installation

### 1) Backend

```bash
cd backend
npm install
```

### 2) Frontend

```bash
cd "React App"
npm install
```

## Run the Project

Open two terminals.

### Terminal 1: Start backend (port 3000)

```bash
cd backend
node index.js
```

Optional (auto-reload):

```bash
cd backend
npx nodemon index.js
```

### Terminal 2: Start frontend (port 5173)

```bash
cd "React App"
npm run dev
```

Frontend URL: `http://localhost:5173`  
Backend URL: `http://localhost:3000`

## API Endpoints

### `POST /signup`
- Body: `{ "username": "string", "password": "string" }`
- Success: `201 User created successfully`
- Errors: `400 User already exists`, `500 Server error`

### `POST /login`
- Body: `{ "username": "string", "password": "string" }`
- Success: `200` + sets `AccessToken` and `RefreshToken` cookies
- Errors: `401 User not found` / `401 Invalid password`

### `GET /account`
- Protected route
- Requires valid `AccessToken` cookie
- Success: `200 { username }`
- Errors: `401 Unauthorized`, `401 Access token expired`

### `GET /refresh`
- Uses `RefreshToken` cookie
- Verifies JWT + compares against hashed token in DB
- Success: `200` + rotates tokens + sets new cookies

### `GET /logout`
- Clears `AccessToken` and `RefreshToken` cookies
- Success: `200 Logged out successfully`

## Auth Flow (Current Implementation)

1. User signs up (`/signup`) → password stored as bcrypt hash.
2. User logs in (`/login`) → access + refresh tokens are created.
3. Tokens are set in `httpOnly` cookies (`sameSite: "lax"`, `secure: false` for local dev).
4. Protected calls use the access token cookie (`/account`).
5. If access token expires, frontend calls `/refresh` to get new tokens.

## Important Notes

- In `backend/package.json`, there is currently no `start` script, so use `node index.js`.
- Access token expiry is currently set to `1minute`.
- Refresh token expiry is currently set to `1h`.
- For production, use HTTPS and set cookie `secure: true`.

