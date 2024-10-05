import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectMongo from "@/lib/mongodb";
import { User } from "@/models/User";

// Signup route
export async function POST(req: Request) {
  try {
    const { name, email, password, country, age } = await req.json();
    
    await connectMongo();

    // Log the incoming data for debugging
    console.log("Incoming signup data:", { name, email, country, age });

    // Validate required fields
    if (!name || !email || !password || !country || !age) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      country,
      age,
      scores: [], // Optionally, initialize with default scores
    });

    // Save the new user to MongoDB
    await newUser.save();

    return NextResponse.json(
      { message: "User registered successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error during signup:", error); // Log the error
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}