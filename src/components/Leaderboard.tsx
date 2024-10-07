"use client";

import { useEffect, useState } from "react";

interface User {
  name: string;
  country: string;
  totalScore: number;
}

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const eventSource = new EventSource("/api/leaderboard");

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.leaderboard) {
        setLeaderboard(data.leaderboard);
        setLoading(false);
      }
    };

    eventSource.onerror = (error) => {
      console.error("Error with SSE:", error);
      eventSource.close();
      setLoading(false);
    };

    return () => {
      eventSource.close(); // Clean up the connection when the component unmounts
    };
  }, []);

  if (loading) {
    return <div>Loading...</div>;
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
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const eventSource = new EventSource("/api/leaderboard");

//     eventSource.onmessage = (event) => {
//       const updatedLeaderboard = JSON.parse(event.data);
//       setLeaderboard(updatedLeaderboard);
//       setLoading(false);
//     };

//     eventSource.onerror = (error) => {
//       console.error("Error with SSE:", error);
//       eventSource.close();
//       setLoading(false);
//     };

//     return () => {
//       eventSource.close(); // Clean up the connection when the component unmounts
//     };
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

// // "use client";

// // import { useEffect, useState } from "react";

// // interface User {
// //   name: string;
// //   country: string;
// //   totalScore: number;
// // }

// // const Leaderboard = () => {
// //   const [leaderboard, setLeaderboard] = useState<User[]>([]);
// //   const [loading, setLoading] = useState(true);

// //   useEffect(() => {
// //     const fetchLeaderboard = async () => {
// //       try {
// //         const response = await fetch("/api/leaderboard");
// //         const data = await response.json();
// //         console.log("Leaderboard data:", data);
// //         setLeaderboard(data);
// //         setLoading(false);
// //       } catch (error) {
// //         console.error("Failed to fetch leaderboard", error);
// //         setLoading(false);
// //       }
// //     };

// //     fetchLeaderboard();
// //   }, []);

// //   if (loading) {
// //     return <div>Loading...</div>;
// //   }

// //   return (
// //     <div className="container mx-auto my-10">
// //       <h1 className="text-3xl font-bold mb-4">Leaderboard</h1>
// //       <table className="min-w-full border border-gray-200 dark:text-white">
// //         <thead>
// //           <tr>
// //             <th className="py-2 px-4 border-b">Rank</th>
// //             <th className="py-2 px-4 border-b">Name</th>
// //             <th className="py-2 px-4 border-b">Country</th>
// //             <th className="py-2 px-4 border-b">Total Score</th>
// //           </tr>
// //         </thead>
// //         <tbody>
// //           {leaderboard.map((user, index) => (
// //             <tr key={index}>
// //               <td className="py-2 px-4 border-b">{index + 1}</td>
// //               <td className="py-2 px-4 border-b">{user.name}</td>
// //               <td className="py-2 px-4 border-b">{user.country}</td>
// //               <td className="py-2 px-4 border-b">{user.totalScore}</td>
// //             </tr>
// //           ))}
// //         </tbody>
// //       </table>
// //     </div>
// //   );
// // };

// // export default Leaderboard;
