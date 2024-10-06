import mongoose, { Schema, Document } from "mongoose";

// Define the interface for a single score entry
interface IScore {
  level: number;
  score: number;
}

// Define the User interface for TypeScript
interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  country: string;
  age: number;
  scores: IScore[]; // Array of score objects
  totalScore?: number;
}

// Create the User schema
const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  country: { type: String, required: true },
  age: { type: Number, required: true },
  scores: {
    type: [
      {
        level: { type: Number, required: true },
        score: { type: Number, required: true },
      },
    ],
    default: [], // Default is an empty array for new users
  },
  totalScore: { type: Number, default: 0 },
});

// // Virtual to calculate the total score from the 'scores' array
// UserSchema.virtual("totalScore").get(function (this: IUser) {
//   return this.scores.reduce((total, score) => total + score.score, 0);
// });

// // To ensure that the virtual fields are included in JSON output
// UserSchema.set("toJSON", { virtuals: true });
// UserSchema.set("toObject", { virtuals: true });

// Export the User model (check if model exists to prevent OverwriteModelError in dev)
export const User =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
