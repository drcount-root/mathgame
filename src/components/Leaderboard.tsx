"use client";
import { useEffect, useState } from "react";

interface User {
  name: string;
  country: string;
  totalScore: number;
}

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState<User[]>([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    const eventSource = new EventSource("/api/leaderboard");

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setLeaderboard(data);
        setError(false); // Clear any previous errors if the stream resumes
      } catch (e) {
        console.error("Error parsing SSE data:", e);
      }
    };

    eventSource.onerror = () => {
      console.error("SSE connection error");
      setError(true); // Indicate an error occurred
      eventSource.close(); // Close the stream to avoid constant retries
    };

    return () => {
      eventSource.close(); // Clean up the event source on component unmount
    };
  }, []);

  if (error) {
    return (
      <div>Error connecting to the leaderboard. Please try again later.</div>
    );
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

// export const dynamic = "force-dynamic";

// const Leaderboard = () => {
//   const [leaderboard, setLeaderboard] = useState<User[]>([]);

//   useEffect(() => {
//     const eventSource = new EventSource("/api/leaderboard");

//     eventSource.onmessage = (event) => {
//       const data = JSON.parse(event.data);
//       setLeaderboard(data);
//     };

//     eventSource.onerror = () => {
//       console.error("SSE connection error");
//       eventSource.close();
//     };

//     return () => {
//       eventSource.close();
//     };
//   }, []);

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

// "use client";

// import { useEffect, useState } from "react";

// interface User {
//   name: string;
//   country: string;
//   totalScore: number;
// }

// const Leaderboard = () => {
//   const [leaderboard, setLeaderboard] = useState<User[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchLeaderboard = async () => {
//       try {
//         // Add a cache-busting query parameter to the fetch request
//         const response = await fetch(`/api/leaderboard?_=${new Date().getTime()}`);
//         const data = await response.json();
//         setLeaderboard(data);
//         setLoading(false);
//       } catch (error) {
//         console.error("Failed to fetch leaderboard", error);
//         setLoading(false);
//       }
//     };

//     fetchLeaderboard();
//   }, []);

//   if (loading) {
//     return <div>Loading...</div>;
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
