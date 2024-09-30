import mongoose, { Schema, Document } from "mongoose";

// Define the User interface for TypeScript
interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  country: string;
  age: number;
}

// Create the User schema
const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  country: { type: String, required: true },
  age: { type: Number, required: true },
});

// Export the User model (check if model exists to prevent OverwriteModelError in dev)
export const User =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
