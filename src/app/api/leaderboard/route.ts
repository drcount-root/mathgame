import { NextRequest } from 'next/server';
import connectMongo from '@/lib/mongodb';
import { User } from '@/models/User';

export const runtime = 'nodejs'; // Ensures this API route runs on the Node.js runtime
export const dynamic = 'force-dynamic'; // Ensures dynamic behavior, required for streaming

export async function GET(request: NextRequest) {
  // Create a TransformStream for SSE
  const { readable, writable } = new TransformStream();
  const writer = writable.getWriter();
  const encoder = new TextEncoder();

  // Close if client disconnects
  request.signal.onabort = () => {
    console.log('Client disconnected');
    writer.close();
  };

  // Function to send data to the client
  function sendData(data: any) {
    const formattedData = `data: ${JSON.stringify(data)}\n\n`;
    writer.write(encoder.encode(formattedData));
  }

  try {
    // Connect to MongoDB
    await connectMongo();

    // Send initial leaderboard data
    const users = await User.find({}, 'name country totalScore');
    const leaderboard = users
      .map((user: any) => ({
        name: user.name,
        country: user.country,
        totalScore: user.totalScore || 0,
      }))
      .sort((a, b) => b.totalScore - a.totalScore);

    sendData({ leaderboard });

    // Send updates every 10 seconds (simulating real-time updates)
    const interval = setInterval(async () => {
      const updatedUsers = await User.find({}, 'name country totalScore');
      const updatedLeaderboard = updatedUsers
        .map((user: any) => ({
          name: user.name,
          country: user.country,
          totalScore: user.totalScore || 0,
        }))
        .sort((a, b) => b.totalScore - a.totalScore);

      sendData({ leaderboard: updatedLeaderboard });
    }, 10000);

    // Clean up when client disconnects
    request.signal.addEventListener('abort', () => {
      clearInterval(interval);
      writer.close();
    });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    sendData({ error: 'Failed to load leaderboard' });
    writer.close();
  }

  // Return the readable stream as the SSE response
  return new Response(readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Connection': 'keep-alive',
      'Cache-Control': 'no-cache, no-transform',
      'Access-Control-Allow-Origin': '*',
    },
  });
}


// import { NextRequest } from 'next/server';
// import connectMongo from '@/lib/mongodb';
// import { User } from '@/models/User';

// export const runtime = 'nodejs';  // Ensures this API route runs on the Node.js runtime
// export const dynamic = 'force-dynamic';  // Ensures dynamic behavior, required for streaming

// export async function GET(request: NextRequest) {
//   // Create a TransformStream for SSE
//   const { readable, writable } = new TransformStream();
//   const writer = writable.getWriter();
//   const encoder = new TextEncoder();

//   // Close if client disconnects
//   request.signal.onabort = () => {
//     console.log('Client disconnected');
//     writer.close();
//   };

//   // Function to send data to the client
//   function sendData(data: any) {
//     const formattedData = `data: ${JSON.stringify(data)}\n\n`;
//     writer.write(encoder.encode(formattedData));
//   }

//   try {
//     // Connect to MongoDB
//     await connectMongo();

//     // Send initial leaderboard data
//     const users = await User.find({}, 'name country totalScore');
//     const leaderboard = users
//       .map((user: any) => ({
//         name: user.name,
//         country: user.country,
//         totalScore: user.totalScore || 0,
//       }))
//       .sort((a, b) => b.totalScore - a.totalScore);

//     sendData({ leaderboard });

//     // Send updates every 10 seconds (simulating real-time updates)
//     const interval = setInterval(async () => {
//       const updatedUsers = await User.find({}, 'name country totalScore');
//       const updatedLeaderboard = updatedUsers
//         .map((user: any) => ({
//           name: user.name,
//           country: user.country,
//           totalScore: user.totalScore || 0,
//         }))
//         .sort((a, b) => b.totalScore - a.totalScore);

//       sendData({ leaderboard: updatedLeaderboard });
//     }, 10000);

//     // Close the writer if the client disconnects
//     request.signal.addEventListener('abort', () => {
//       clearInterval(interval);
//       writer.close();
//     });
//   } catch (error) {
//     console.error('Error fetching leaderboard:', error);
//     sendData({ error: 'Failed to load leaderboard' });
//     writer.close();
//   }

//   // Return the readable stream as the SSE response
//   return new Response(readable, {
//     headers: {
//       'Content-Type': 'text/event-stream',
//       'Connection': 'keep-alive',
//       'Cache-Control': 'no-cache, no-transform',
//     },
//   });
// }


// // import { NextResponse } from "next/server";
// // import connectMongo from "@/lib/mongodb";
// // import { User } from "@/models/User";

// // export async function GET(req: Request) {
// //   try {
// //     await connectMongo();

// //     const { readable, writable } = new TransformStream();
// //     const writer = writable.getWriter();

// //     // Send initial leaderboard data
// //     const users = await User.find({}, "name country totalScore");
// //     const leaderboard = users
// //       .map((user: any) => ({
// //         name: user.name,
// //         country: user.country,
// //         totalScore: user.totalScore || 0,
// //       }))
// //       .sort((a, b) => b.totalScore - a.totalScore);

// //     writer.write(`data: ${JSON.stringify(leaderboard)}\n\n`);

// //     // Send updates every 5 seconds (for demonstration purposes)
// //     const interval = setInterval(async () => {
// //       const updatedUsers = await User.find({}, "name country totalScore");
// //       const updatedLeaderboard = updatedUsers
// //         .map((user: any) => ({
// //           name: user.name,
// //           country: user.country,
// //           totalScore: user.totalScore || 0,
// //         }))
// //         .sort((a, b) => b.totalScore - a.totalScore);

// //       writer.write(`data: ${JSON.stringify(updatedLeaderboard)}\n\n`);
// //     }, 5000);

// //     // Cleanup on abort
// //     req.signal.addEventListener("abort", () => {
// //       clearInterval(interval);
// //       writer.close();
// //     });

// //     return new Response(readable, {
// //       headers: {
// //         "Content-Type": "text/event-stream",
// //         "Cache-Control": "no-cache",
// //         "Connection": "keep-alive",
// //       },
// //     });
// //   } catch (error) {
// //     console.error("Error fetching leaderboard:", error);
// //     return NextResponse.json(
// //       { error: "Failed to load leaderboard" },
// //       { status: 500 }
// //     );
// //   }
// // }


// // // import { NextResponse } from "next/server";
// // // import connectMongo from "@/lib/mongodb";
// // // import { User } from "@/models/User";

// // // export async function GET(req: Request) {
// // //   try {
// // //     const { readable, writable } = new TransformStream();
// // //     const writer = writable.getWriter();

// // //     await connectMongo();

// // //     const users = await User.find({}, "name country totalScore");

// // //     const leaderboard = users
// // //       .map((user: any) => ({
// // //         name: user.name,
// // //         country: user.country,
// // //         totalScore: user.totalScore || 0,
// // //       }))
// // //       .sort((a, b) => b.totalScore - a.totalScore);

// // //     writer.write(`data: ${JSON.stringify(leaderboard)}\n\n`);

// // //     // Here you could implement a mechanism to listen for score updates in your database
// // //     // For this demo, let's simulate sending updates every 5 seconds
// // //     const interval = setInterval(async () => {
// // //       const updatedUsers = await User.find({}, "name country totalScore");
// // //       const updatedLeaderboard = updatedUsers
// // //         .map((user: any) => ({
// // //           name: user.name,
// // //           country: user.country,
// // //           totalScore: user.totalScore || 0,
// // //         }))
// // //         .sort((a, b) => b.totalScore - a.totalScore);

// // //       writer.write(`data: ${JSON.stringify(updatedLeaderboard)}\n\n`);
// // //     }, 5000); // Adjust the interval as needed

// // //     // Cleanup
// // //     req.signal.addEventListener("abort", () => {
// // //       clearInterval(interval);
// // //       writer.close();
// // //     });

// // //     return new Response(readable, {
// // //       headers: {
// // //         "Content-Type": "text/event-stream",
// // //         "Cache-Control": "no-cache",
// // //         "Connection": "keep-alive",
// // //       },
// // //     });
// // //   } catch (error) {
// // //     console.error("Error fetching leaderboard:", error);
// // //     return NextResponse.json(
// // //       { error: "Failed to load leaderboard" },
// // //       { status: 500 }
// // //     );
// // //   }
// // // }
