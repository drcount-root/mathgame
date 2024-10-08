"use client";
import { useEffect, useState } from "react";
import { Box, CircularProgress } from "@mui/material"; // Ensure you're importing Material UI components

interface User {
  name: string;
  country: string;
  totalScore: number;
}

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true); // Track loading state
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch leaderboard data from the API
    const fetchLeaderboard = async () => {
      try {
        setLoading(true); // Start loading
        const response = await fetch("/api/leaderboard");

        if (!response.ok) {
          throw new Error("Failed to fetch leaderboard data");
        }

        const data = await response.json();
        setLeaderboard(data);
        setError(null); // Clear any previous errors
      } catch (err) {
        console.error("Error fetching leaderboard data:", err);
        setError("Error fetching leaderboard data. Please try again later.");
      } finally {
        setLoading(false); // Stop loading when fetch is done
      }
    };

    fetchLeaderboard();
  }, []); // Only fetch once when the component mounts

  // Display loader while fetching data
  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // Display error message if something went wrong
  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="container mx-auto my-10">
      <h1 className="text-3xl font-bold mb-4">Leaderboard</h1>
      <table className="min-w-full border border-gray-200 dark:text-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Rank</th>
            <th className="py-2 px-4 border-b">Name</th>
            <th className="py-2 px-4 border-b">Country</th>
            <th className="py-2 px-4 border-b">Total Score</th>
          </tr>
        </thead>
        <tbody>
          {leaderboard.map((user, index) => (
            <tr key={index}>
              <td className="py-2 px-4 border-b">{index + 1}</td>
              <td className="py-2 px-4 border-b">{user.name}</td>
              <td className="py-2 px-4 border-b">{user.country}</td>
              <td className="py-2 px-4 border-b">{user.totalScore}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Leaderboard;

// "use client";
// import { useEffect, useState } from "react";

// interface User {
//   name: string;
//   country: string;
//   totalScore: number;
// }

// const Leaderboard = () => {
//   const [leaderboard, setLeaderboard] = useState<User[]>([]);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     // Fetch leaderboard data from the API
//     const fetchLeaderboard = async () => {
//       try {
//         const response = await fetch("/api/leaderboard");

//         if (!response.ok) {
//           throw new Error("Failed to fetch leaderboard data");
//         }

//         const data = await response.json();
//         setLeaderboard(data);
//         setError(null); // Clear any previous errors
//       } catch (err) {
//         console.error("Error fetching leaderboard data:", err);
//         setError("Error fetching leaderboard data. Please try again later.");
//       }
//     };

//     fetchLeaderboard();
//   }, []); // Only fetch once when the component mounts

//   if (error) {
//     return <div>{error}</div>;
//   }

//   return (
//     <div className="container mx-auto my-10">
//       <h1 className="text-3xl font-bold mb-4">Leaderboard</h1>
//       <table className="min-w-full border border-gray-200 dark:text-white">
//         <thead>
//           <tr>
//             <th className="py-2 px-4 border-b">Rank</th>
//             <th className="py-2 px-4 border-b">Name</th>
//             <th className="py-2 px-4 border-b">Country</th>
//             <th className="py-2 px-4 border-b">Total Score</th>
//           </tr>
//         </thead>
//         <tbody>
//           {leaderboard.map((user, index) => (
//             <tr key={index}>
//               <td className="py-2 px-4 border-b">{index + 1}</td>
//               <td className="py-2 px-4 border-b">{user.name}</td>
//               <td className="py-2 px-4 border-b">{user.country}</td>
//               <td className="py-2 px-4 border-b">{user.totalScore}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default Leaderboard;
