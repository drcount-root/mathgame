import connectMongo from "@/lib/mongodb";
import { User } from "@/models/User";

export const dynamic = "force-dynamic";

// SSE Endpoint to send live leaderboard updates
export async function GET(req: Request) {
  const encoder = new TextEncoder();

  // Create a readable stream for SSE
  const stream = new ReadableStream({
    async start(controller) {
      await connectMongo();

      const sendLeaderboardUpdates = async () => {
        const users = await User.find({}, "name country totalScore");

        const leaderboard = users
          .map((user: any) => ({
            name: user.name,
            country: user.country,
            totalScore: user.totalScore || 0,
          }))
          .sort((a, b) => b.totalScore - a.totalScore);

        const leaderboardJson = JSON.stringify(leaderboard);

        // Send the SSE data
        controller.enqueue(encoder.encode(`data: ${leaderboardJson}\n\n`));
      };

      // Send the initial leaderboard
      sendLeaderboardUpdates();

      // Optionally set an interval to send updates every X seconds
      const intervalId = setInterval(sendLeaderboardUpdates, 5000);

      // When the connection is closed, stop the interval
      req.signal.addEventListener("abort", () => {
        clearInterval(intervalId);
        controller.close();
      });
    },
  });

  // Return the response with the correct headers for SSE
  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform, must-revalidate",
      "Connection": "keep-alive",
      "Access-Control-Allow-Origin": "*", // CORS headers if necessary
    },
  });
}


// import { NextResponse } from "next/server";
// import connectMongo from "@/lib/mongodb";
// import { User } from "@/models/User";

// export const dynamic = "force-dynamic";

// // SSE Endpoint to send live leaderboard updates
// export async function GET(req: Request) {
//   const encoder = new TextEncoder();

//   // Create a readable stream for SSE
//   const stream = new ReadableStream({
//     async start(controller) {
//       await connectMongo();

//       const sendLeaderboardUpdates = async () => {
//         const users = await User.find({}, "name country totalScore");

//         const leaderboard = users
//           .map((user: any) => ({
//             name: user.name,
//             country: user.country,
//             totalScore: user.totalScore || 0,
//           }))
//           .sort((a, b) => b.totalScore - a.totalScore);

//         const leaderboardJson = JSON.stringify(leaderboard);

//         // Send the SSE data
//         controller.enqueue(encoder.encode(`data: ${leaderboardJson}\n\n`));
//       };

//       // Send the initial leaderboard
//       sendLeaderboardUpdates();

//       // Optionally set an interval to send updates every X seconds
//       const intervalId = setInterval(sendLeaderboardUpdates, 5000);

//       // When the connection is closed, stop the interval
//       req.signal.addEventListener("abort", () => {
//         clearInterval(intervalId);
//         controller.close();
//       });
//     },
//   });

//   // Return the response with the correct headers for SSE
//   return new Response(stream, {
//     headers: {
//       "Content-Type": "text/event-stream",
//       "Cache-Control": "no-cache, no-transform",
//       "Connection": "keep-alive",
//     },
//   });
// }


// import { NextResponse } from "next/server";
// import connectMongo from "@/lib/mongodb";
// import { User } from "@/models/User";

// // Get leaderboard route
// export async function GET() {
//   try {
//     await connectMongo();

//     // Fetch all users with their names, countries, and totalScore
//     const users = await User.find({}, "name country totalScore");

//     // Sort the users based on the totalScore (already stored in MongoDB)
//     const leaderboard = users
//       .map((user: any) => ({
//         name: user.name,
//         country: user.country,
//         totalScore: user.totalScore || 0, // Safeguard against undefined totalScore
//       }))
//       .sort((a, b) => b.totalScore - a.totalScore); // Sort by totalScore in descending order

//     return NextResponse.json(leaderboard, {
//       headers: {
//         "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
//       },
//     });
//   } catch (error) {
//     console.error("Error fetching leaderboard:", error);
//     return NextResponse.json(
//       { error: "Failed to load leaderboard" },
//       { status: 500 }
//     );
//   }
// }
