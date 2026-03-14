import mongoose from "mongoose";

// Define the schema for a user
const UserSchema = new mongoose.Schema({
  username: String,
  password: String
});
// Create the User model using the schema
const User = mongoose.model("User", UserSchema);

export default User;