import { NextResponse } from "next/server";
import connectMongo from "@/lib/mongodb";
import { User } from "@/models/User";

export async function GET(req: Request) {
  try {
    const { readable, writable } = new TransformStream();
    const writer = writable.getWriter();

    await connectMongo();

    const users = await User.find({}, "name country totalScore");

    const leaderboard = users
      .map((user: any) => ({
        name: user.name,
        country: user.country,
        totalScore: user.totalScore || 0,
      }))
      .sort((a, b) => b.totalScore - a.totalScore);

    writer.write(`data: ${JSON.stringify(leaderboard)}\n\n`);

    // Here you could implement a mechanism to listen for score updates in your database
    // For this demo, let's simulate sending updates every 5 seconds
    const interval = setInterval(async () => {
      const updatedUsers = await User.find({}, "name country totalScore");
      const updatedLeaderboard = updatedUsers
        .map((user: any) => ({
          name: user.name,
          country: user.country,
          totalScore: user.totalScore || 0,
        }))
        .sort((a, b) => b.totalScore - a.totalScore);

      writer.write(`data: ${JSON.stringify(updatedLeaderboard)}\n\n`);
    }, 5000); // Adjust the interval as needed

    // Cleanup
    req.signal.addEventListener("abort", () => {
      clearInterval(interval);
      writer.close();
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return NextResponse.json(
      { error: "Failed to load leaderboard" },
      { status: 500 }
    );
  }
}
