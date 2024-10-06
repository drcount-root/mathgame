// /app/api/leaderboard/route.ts
import { NextResponse } from "next/server";
import connectMongo from "@/lib/mongodb";
import { User } from "@/models/User";

// Get leaderboard route
export async function GET() {
  try {
    await connectMongo();

    // Fetch all users with their names, countries, and totalScore
    const users = await User.find({}, "name country totalScore");

    // Sort the users based on the totalScore (already stored in MongoDB)
    const leaderboard = users
      .map((user: any) => ({
        name: user.name,
        country: user.country,
        totalScore: user.totalScore || 0, // Safeguard against undefined totalScore
      }))
      .sort((a, b) => b.totalScore - a.totalScore); // Sort by totalScore in descending order

    // return NextResponse.json(leaderboard);
    return NextResponse.json(leaderboard, {
      headers: {
        "Cache-Control":
          "no-store, no-cache, must-revalidate, proxy-revalidate",
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

// // /app/api/leaderboard/route.ts
// import { NextResponse } from "next/server";
// import connectMongo from "@/lib/mongodb";
// import { User } from "@/models/User";

// // Get leaderboard route
// export async function GET() {
//   try {
//     await connectMongo();

//     // Fetch all users
//     const users = await User.find({}, "name country scores");

//     // Calculate total scores for each user
//     const leaderboard = users
//       .map((user: any) => {
//         const totalScore = user.scores.reduce(
//           (acc: number, score: any) => acc + score.score,
//           0
//         );
//         return {
//           name: user.name,
//           country: user.country,
//           totalScore,
//         };
//       })
//       .sort((a, b) => b.totalScore - a.totalScore); // Sort by total score in descending order

//     return NextResponse.json(leaderboard);
//   } catch (error) {
//     console.error("Error fetching leaderboard:", error);
//     return NextResponse.json(
//       { error: "Failed to load leaderboard" },
//       { status: 500 }
//     );
//   }
// }
