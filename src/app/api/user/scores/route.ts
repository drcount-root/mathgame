import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import connectMongo from "@/lib/mongodb";
import { User } from "@/models/User";
import { authOptions } from "@/lib/auth";

export async function PUT(req: NextRequest) {
  try {
    // Check if the user is authenticated
    // const session = await getServerSession();
    // if (!session || !session.user) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }
    // Authenticate the user using getServerSession with authOptions
    const session = await getServerSession(authOptions); // Pass the authOptions explicitly
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Connect to MongoDB
    await connectMongo();

    // Parse the request body
    const { scores, totalScore } = await req.json();

    // Validate the scores data
    if (!Array.isArray(scores) || scores.length === 0) {
      return NextResponse.json(
        { error: "Invalid scores data" },
        { status: 400 }
      );
    }

    // Update the user's scores in the database
    const updatedUser = await User.findOneAndUpdate(
      { email: session.user.email },
      { $set: { scores: scores, totalScore: totalScore } },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Scores updated successfully", scores: updatedUser.scores, totalScore: updatedUser.totalScore },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating scores:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
