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

## 📝 License

ISC

## 👤 Author

**Md Danish**

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

---

Made with ❤️ using the MERN stack