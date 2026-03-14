# Password-Based Authentication Architecture

## Overview

This project implements a **cookie-based password authentication** system using:

| Layer       | Technology                   | Port  |
|-------------|------------------------------|-------|
| Frontend    | React + Vite                 | 5173  |
| Backend     | Express.js (Node.js)         | 3000  |
| Database    | MongoDB (via Mongoose)       |       |
| Auth Token  | JWT (JSON Web Token)         |       |
| Hashing     | bcrypt (salt rounds: 10)     |       |

### Current Implementation Snapshot

- Auth is password-based (`username` + `password`) with bcrypt verification.
- `POST /login` issues **AccessToken** and **RefreshToken**.
- `GET /account` validates `req.cookies.AccessToken`.
- `GET /refresh` validates `req.cookies.RefreshToken`, compares against hashed token in DB, then rotates tokens.
- User model stores `username`, `password` (bcrypt hash), and `RefreshToken` (bcrypt hash of refresh token).
- Cookies currently use `httpOnly: true`, `sameSite: "lax"`, `secure: false` (development), `maxAge: 7 days`.

---

## System Architecture Diagram

```
┌──────────────────────────────────────────────────────────────────────────┐
│                          CLIENT (Browser)                                │
│                                                                          │
│   React App (localhost:5173)                                             │
│   ┌─────────────┐   ┌─────────────┐   ┌──────────────────┐              │
│   │  Signup.jsx  │   │  Login.jsx  │   │   Account.jsx    │              │
│   │  (Form)      │   │  (Form)     │   │  (Protected Page)│              │
│   └──────┬───────┘   └──────┬──────┘   └────────┬─────────┘              │
│          │                  │                    │                        │
│     POST /signup      POST /login          GET /account                  │
│     (JSON body)       (JSON body)       (Cookie auto-sent)               │
│          │           credentials:       credentials: "include"           │
│          │            "include"                  │                        │
└──────────┼──────────────────┼────────────────────┼───────────────────────┘
           │                  │                    │
           │    HTTP (Cross-Origin: 5173 → 3000)   │
           ▼                  ▼                    ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                      SERVER (Express.js - localhost:3000)                 │
│                                                                          │
│   Middleware Pipeline:                                                   │
│   ┌──────────┐  ┌───────────────┐  ┌──────────────┐  ┌──────────────┐   │
│   │   CORS   │→ │ cookie-parser │→ │  body-parser │→ │   Routes     │   │
│   │(credentials│ │(parses Cookie│  │ (parses JSON │  │              │   │
│   │  : true)  │ │   header)    │  │    body)     │  │              │   │
│   └──────────┘  └───────────────┘  └──────────────┘  └──────┬───────┘   │
│                                                              │           │
│              ┌───────────────┬───────────────┬───────────────┘           │
│              ▼               ▼               ▼                           │
│     ┌──────────────┐ ┌─────────────┐ ┌─────────────┐                    │
│     │  signup.js   │ │  login.js   │ │   auth.js   │                    │
│     │ (Controller) │ │ (Controller)│ │ (Controller) │                    │
│     │              │ │             │ │              │                    │
│     │ bcrypt.hash()│ │bcrypt       │ │ jwt.verify() │                    │
│     │              │ │ .compare()  │ │              │                    │
│     │              │ │ jwt.sign()  │ │              │                    │
│     │              │ │ res.cookie()│ │              │                    │
│     └──────┬───────┘ └──────┬──────┘ └──────┬──────┘                    │
│            │                │               │                            │
└────────────┼────────────────┼───────────────┼────────────────────────────┘
             │                │               │
             ▼                ▼               ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                        DATABASE (MongoDB)                                │
│                                                                          │
│   Collection: users                                                      │
│   ┌──────────────────────────────────────────────┐                       │
│   │  {                                           │                       │
│   │    _id:      ObjectId("..."),                │                       │
│   │    username: "danish",                        │                       │
│   │    password: "$2b$10$xK3f..." (bcrypt hash)  │                       │
│   │  }                                           │                       │
│   └──────────────────────────────────────────────┘                       │
│                                                                          │
│   Note: Plain-text passwords are NEVER stored.                           │
│         Only the bcrypt hash (60 chars) is saved.                        │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## Sequence Diagrams

### 1. Signup Flow

```
 Browser (React)            Express Server              MongoDB
       │                          │                        │
       │  POST /signup            │                        │
       │  {username, password}    │                        │
       │─────────────────────────▶│                        │
       │                          │                        │
       │                          │  findOne({username})   │
       │                          │───────────────────────▶│
       │                          │                        │
       │                          │  null (user not found) │
       │                          │◀───────────────────────│
       │                          │                        │
       │                          │                        │
       │                  bcrypt.hash(password, 10)        │
       │                  ┌───────┴───────┐                │
       │                  │ Generate salt │                │
       │                  │ Hash password │                │
       │                  └───────┬───────┘                │
       │                          │                        │
       │                          │  User.create({         │
       │                          │   username,            │
       │                          │   password: hash       │
       │                          │  })                    │
       │                          │───────────────────────▶│
       │                          │                        │
       │                          │  User document saved   │
       │                          │◀───────────────────────│
       │                          │                        │
       │  201 "User created       │                        │
       │       successfully"      │                        │
       │◀─────────────────────────│                        │
       │                          │                        │
```

**What happens step-by-step:**
1. React sends `{ username, password }` as JSON to `POST /signup`
2. Server checks if username already exists in MongoDB
3. If not, **bcrypt hashes** the password with 10 salt rounds
4. The **hashed** password (not plain text) is stored in MongoDB
5. Server responds with `201 Created`

---

### 2. Login Flow

```
 Browser (React)            Express Server              MongoDB
       │                          │                        │
       │  POST /login             │                        │
       │  {username, password}    │                        │
       │  credentials: "include"  │                        │
       │─────────────────────────▶│                        │
       │                          │                        │
       │                          │  findOne({username})   │
       │                          │───────────────────────▶│
       │                          │                        │
       │                          │  User {_id, username,  │
       │                          │   password: hash}      │
       │                          │◀───────────────────────│
       │                          │                        │
       │                  bcrypt.compare(                   │
       │                    password,                       │
       │                    user.password                   │
       │                  )                                 │
       │                  ┌───────┴───────┐                │
       │                  │ Extract salt  │                │
       │                  │ from stored   │                │
       │                  │ hash, rehash  │                │
       │                  │ input, compare│                │
       │                  └───────┬───────┘                │
       │                          │                        │
       │                  match = true ✓                    │
       │                          │                        │
       │                  jwt.sign(                         │
       │                    {userID: user._id},             │
       │                    JWT_SECRET,                     │
       │                    {expiresIn: "1h"}               │
       │                  )                                 │
       │                  ┌───────┴───────┐                │
       │                  │ Create JWT    │                │
       │                  │ token with    │                │
       │                  │ user ID       │                │
       │                  └───────┬───────┘                │
       │                          │                        │
       │  200 OK                  │                        │
      │  Set-Cookie: AccessToken │                        │
      │  + RefreshToken          │                        │
       │  (httpOnly, sameSite:lax)│                        │
       │◀─────────────────────────│                        │
       │                          │                        │
       │  Browser stores cookie   │                        │
       │  automatically ✓         │                        │
       │                          │                        │
       │  navigate("/account")    │                        │
       │                          │                        │
```

**What happens step-by-step:**
1. React sends `{ username, password }` with `credentials: "include"` to `POST /login`
2. Server finds the user in MongoDB
3. **bcrypt.compare()** re-hashes the input password using the stored salt and compares
4. If match → server issues two JWTs containing `{ userID: user._id }`: **AccessToken** and **RefreshToken**
5. Both tokens are set as **httpOnly cookies** via `Set-Cookie` headers
6. Browser **automatically stores** these cookies (not directly readable by client JS)
7. React navigates user to `/account`

---

### 3. Authenticated Request Flow (Account Page)

```
 Browser (React)            Express Server              MongoDB
       │                          │                        │
       │  GET /account            │                        │
      │  Cookie: AccessToken=... │                        │
       │  (auto-attached by       │                        │
       │   browser because        │                        │
       │   credentials:"include") │                        │
       │─────────────────────────▶│                        │
       │                          │                        │
       │                  cookie-parser extracts           │
      │                  req.cookies.AccessToken          │
       │                          │                        │
       │                  jwt.verify(                       │
      │                    AccessToken,                    │
       │                    JWT_SECRET                      │
       │                  )                                 │
       │                  ┌───────┴───────┐                │
       │                  │ Decode JWT    │                │
       │                  │ Verify sig    │                │
       │                  │ Check expiry  │                │
       │                  └───────┬───────┘                │
       │                          │                        │
       │                  decoded = {userID: "..."}        │
       │                          │                        │
       │                          │  findById(userID)      │
       │                          │───────────────────────▶│
       │                          │                        │
       │                          │  User {username: "..." }│
       │                          │◀───────────────────────│
       │                          │                        │
       │  200 {username: "danish"}│                        │
       │◀─────────────────────────│                        │
       │                          │                        │
       │  Display:                │                        │
       │  "welcome danish"        │                        │
       │                          │                        │
```

**What happens step-by-step:**
1. Browser navigates to `/account` → React calls `GET /account` with `credentials: "include"`
2. Browser **automatically** attaches the stored cookie in the `Cookie` header
3. `cookie-parser` middleware parses it → `req.cookies.AccessToken` is available
4. **jwt.verify()** decodes the token and verifies it hasn't been tampered with
5. The `userID` from inside the JWT is used to look up the user in MongoDB
6. Server responds with the username → React displays "welcome danish"

---

### 4. Failed Authentication Flow

```
 Browser (React)            Express Server              MongoDB
       │                          │                        │
       │  GET /account            │                        │
       │  (no cookie / expired    │                        │
       │   / tampered token)      │                        │
       │─────────────────────────▶│                        │
       │                          │                        │
       │                  cookie-parser:                    │
      │                  req.cookies.AccessToken           │
       │                  = undefined                       │
       │                          │                        │
       │  401 "Unauthorized"      │                        │
       │◀─────────────────────────│                        │
       │                          │                        │
       │                    OR                              │
       │                          │                        │
      │                  jwt.verify() fails                │
      │                  (expired/invalid)                 │
       │                          │                        │
      │  401 "Access token       │                        │
      │       expired"           │                        │
       │◀─────────────────────────│                        │
       │                          │                        │
```

---

## Security Concepts Explained

### Why bcrypt?

```
Plain password:    "mypassword123"
                        │
                        ▼
              ┌─────────────────┐
              │  bcrypt.hash()  │
              │  salt rounds:10 │
              │                 │
              │ 1. Generate     │
              │    random salt  │
              │ 2. Hash password│
              │    + salt       │
              │ 3. Repeat 2^10  │
              │    = 1024 times │
              └────────┬────────┘
                       ▼
Stored hash:   "$2b$10$xK3fRz8vGk..."  (60 characters)
                 │  │  │
                 │  │  └─ Salt + Hash combined
                 │  └──── 10 = cost factor (2^10 iterations)
                 └─────── $2b = bcrypt version
```

- **One-way**: You cannot reverse a hash back to the password
- **Salted**: Each hash has a unique random salt → same password = different hash each time
- **Slow on purpose**: 1024 iterations makes brute-force attacks impractical

### Why JWT in httpOnly Cookie?

```
┌─────────────────────────────────────────────────────┐
│                   JWT Token                          │
│                                                      │
│  eyJhbGci.eyJ1c2VySUQ.SflKxwRJSM                   │
│  ─────── ──────────── ──────────                     │
│  Header    Payload     Signature                     │
│                                                      │
│  Header:  { alg: "HS256", typ: "JWT" }              │
│  Payload: { userID: "507f1f...", exp: 1741... }     │
│  Signature: HMACSHA256(header + payload, SECRET)     │
└─────────────────────────────────────────────────────┘

Cookie Flags:
┌──────────────┬───────────────────────────────────────┐
│ httpOnly     │ JS cannot read it (document.cookie     │
│              │ won't show it) → prevents XSS theft    │
├──────────────┼───────────────────────────────────────┤
│ sameSite:lax │ Cookie sent on same-site navigations   │
│              │ + top-level GET cross-site             │
├──────────────┼───────────────────────────────────────┤
│ secure:false │ Allows HTTP (dev only). In production  │
│              │ set to true → HTTPS only               │
├──────────────┼───────────────────────────────────────┤
│ maxAge: 7d   │ Cookie expires in 7 days              │
└──────────────┴───────────────────────────────────────┘
```

### Why `credentials: "include"`?

```
Frontend (localhost:5173)  →  Backend (localhost:3000)
        │                              │
        │  Different ports = CROSS     │
        │  ORIGIN request              │
        │                              │
      Without credentials:           With credentials:
      "include"                      "include"
        │                              │
        ▼                              ▼
   ┌──────────┐                 ┌──────────────┐
   │ Browser  │                 │   Browser    │
   │ BLOCKS   │                 │ SENDS cookie │
   │ cookies  │                 │ in request   │
   │ from     │                 │ header ✓     │
   │ being    │                 └──────────────┘
   │ sent     │
   └──────────┘
```

---

## File Structure & Responsibilities

```
backend/
├── index.js                  ← Entry point: Express app, middleware, routes
├── .env                      ← MONGODB_URI, JWT_SECRET (never commit this!)
├── lib/
│   └── connectdb.js          ← MongoDB connection with caching
├── models/
│   └── login_user.js         ← Mongoose schema: { username, password }
└── controlers/
      ├── signup.js             ← Hash password → save to DB
      ├── login.js              ← Verify password → issue AccessToken + RefreshToken
      ├── auth.js               ← Verify AccessToken cookie → return user data
      └── refresh.js            ← Verify + rotate refresh token pair

React App/
└── src/
    ├── App.jsx               ← Router: "/" and "/account"
    └── components/
        ├── Authentication.jsx← Wrapper for Login/Signup toggle
        ├── Signup.jsx        ← Signup form → POST /signup
        ├── Login.jsx         ← Login form → POST /login → navigate to /account
        └── Account.jsx       ← GET /account (with cookie) → show username
```

---

## Complete Request Lifecycle (Everything Together)

```
    ┌─────────┐         ┌─────────────┐         ┌─────────┐
    │ Browser │         │   Express   │         │ MongoDB │
    │ (React) │         │   Server    │         │         │
    └────┬────┘         └──────┬──────┘         └────┬────┘
         │                     │                     │
   ══════╪═════════════════════╪═════════════════════╪══════  SIGNUP
         │  POST /signup       │                     │
         │  {usr, pwd}         │                     │
         │────────────────────▶│                     │
         │                     │──bcrypt.hash()──┐   │
         │                     │                 │   │
         │                     │◀────────────────┘   │
         │                     │  create({usr,hash}) │
         │                     │────────────────────▶│
         │                     │        saved ✓      │
         │                     │◀────────────────────│
         │  201 Created        │                     │
         │◀────────────────────│                     │
         │                     │                     │
   ══════╪═════════════════════╪═════════════════════╪══════  LOGIN
         │  POST /login        │                     │
         │  {usr, pwd}         │                     │
         │────────────────────▶│                     │
         │                     │  findOne({usr})     │
         │                     │────────────────────▶│
         │                     │  {_id, usr, hash}   │
         │                     │◀────────────────────│
         │                     │──bcrypt.compare()─┐ │
         │                     │                   │ │
         │                     │◀──────────────────┘ │
         │                     │──jwt.sign()───────┐ │
         │                     │                   │ │
         │                     │◀──────────────────┘ │
         │  200 + Set-Cookie   │                     │
         │  AccessToken,       │                     │
         │  RefreshToken       │                     │
         │◀────────────────────│                     │
         │                     │                     │
         │  🍪 Cookie stored   │                     │
         │  in browser         │                     │
         │                     │                     │
   ══════╪═════════════════════╪═════════════════════╪══════  AUTH CHECK
         │  GET /account       │                     │
         │  Cookie:            │                     │
         │  AccessToken=JWT    │                     │
         │────────────────────▶│                     │
         │                     │──jwt.verify()─────┐ │
         │                     │                   │ │
         │                     │◀──────────────────┘ │
         │                     │  findById(userID)   │
         │                     │────────────────────▶│
         │                     │  {username}         │
         │                     │◀────────────────────│
         │  200 {username}     │                     │
         │◀────────────────────│                     │
         │                     │                     │
         │  "welcome danish"   │                     │
         ▼                     ▼                     ▼
```

## Access & Refresh Token Details

- **Overview:** The app uses JWTs for session management and `bcrypt` for password hashing and refresh-token storage. On successful login the backend issues both an access token (short-lived) and a refresh token (longer-lived).
- **Login behavior:** `POST /login` verifies credentials with `bcrypt.compare()`, then issues an access token and a refresh token. Both tokens are set as `httpOnly` cookies and the refresh token is hashed (bcrypt) and stored on the user record in MongoDB.
- **Cookie settings (current implementation):** `httpOnly: true`, `sameSite: "lax"`, `secure: false` (development), `maxAge: 7 days`.
- **Expiry values (current code):**
      - Access token: `expiresIn: "1minute"` (short-lived)
      - Refresh token at login: `expiresIn: "1h"` (set in `login.js`)
      - Refresh token issued by `refresh.js` helper: `expiresIn: "1d"` (note mismatch with `login.js`)
- **Refresh flow (`refresh.js`):** The server reads the `RefreshToken` cookie, verifies it with `jwt.verify()`, checks the user exists, then uses `bcrypt.compare(cookieRefreshToken, user.RefreshToken)` to validate the cookie against the stored hashed token. If valid, it issues new tokens, stores the hashed refresh token and sets updated cookies.

### Implementation note (recommended fix)
`refresh.js` currently hashes and persists the old cookie value instead of the newly-issued refresh token; to properly rotate refresh tokens, update the code to hash and save the newly-created refresh token before responding.

### Production recommendations
- Serve cookies with `secure: true` and always use HTTPS.
- Keep access tokens short and rotate refresh tokens on each use.
- Persist only hashed refresh tokens server-side and implement a revocation or blacklist strategy for compromised tokens.

