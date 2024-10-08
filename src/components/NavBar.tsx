"use client";

import React, { useState } from "react";
import { ModeToggle } from "./ModeToggle";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { Menu, X } from "lucide-react"; // Icons for the hamburger and close button

const NavBar = () => {
  const router = useRouter();
  const { data: session } = useSession(); // Get the session data
  const [menuOpen, setMenuOpen] = useState(false); // State to handle menu toggle

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" }); // Redirect to home after sign out
  };

  // Toggle menu
  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <>
      <header className="flex justify-between items-center my-6 w-full px-6 md:px-0">
        {/* Logo */}
        <Link href={"/"} className="text-2xl font-bold dark:text-yellow-500">
          MathMatrix
        </Link>

        {/* Mode Toggle (kept outside of the hamburger) */}
        <div className="md:hidden flex items-center gap-4">
          <ModeToggle />
          <div className="md:hidden">
            <button
              // variant="outline"
              className="dark:text-yellow-500 outline-1 outline outline-gray-800 p-1 rounded-md"
              onClick={toggleMenu}
              aria-label="Toggle navigation menu"
            >
              {menuOpen ? <X /> : <Menu />}{" "}
              {/* Toggle between open/close icons */}
            </button>
          </div>
        </div>

        {/* Hamburger Menu for mobile screens */}

        {/* Full Menu for larger screens */}
        <nav className="hidden md:flex gap-4">
          <Button
            variant="outline"
            className="dark:text-yellow-500"
            onClick={() => router.push("/leaderboard")}
          >
            Leaderboard
          </Button>
          {!session ? (
            <>
              <Button
                variant="outline"
                className="dark:text-yellow-500"
                onClick={() => router.push("/signup")}
              >
                SignUp
              </Button>
              <Button
                variant="outline"
                className="dark:text-yellow-500"
                onClick={() => router.push("/login")}
              >
                Login
              </Button>
            </>
          ) : (
            <Button
              variant="outline"
              className="dark:text-yellow-500"
              onClick={handleLogout}
            >
              Logout
            </Button>
          )}
          <ModeToggle />
        </nav>

        {/* Mobile Dropdown Menu */}
        {menuOpen && (
          <nav className="absolute top-16 right-4 bg-white dark:bg-gray-800 p-4 rounded shadow-md flex flex-col gap-4 md:hidden">
            <Button
              variant="outline"
              className="dark:text-yellow-500"
              onClick={() => {
                router.push("/leaderboard");
                setMenuOpen(false);
              }}
            >
              Leaderboard
            </Button>
            {!session ? (
              <>
                <Button
                  variant="outline"
                  className="dark:text-yellow-500"
                  onClick={() => {
                    router.push("/signup");
                    setMenuOpen(false);
                  }}
                >
                  SignUp
                </Button>
                <Button
                  variant="outline"
                  className="dark:text-yellow-500"
                  onClick={() => {
                    router.push("/login");
                    setMenuOpen(false);
                  }}
                >
                  Login
                </Button>
              </>
            ) : (
              <Button
                variant="outline"
                className="dark:text-yellow-500"
                onClick={() => {
                  handleLogout();
                  setMenuOpen(false);
                }}
              >
                Logout
              </Button>
            )}
          </nav>
        )}
      </header>
    </>
  );
};

export default NavBar;

// "use client";

// import React from "react";
// import { ModeToggle } from "./ModeToggle";
// import { Button } from "@/components/ui/button";
// import { useRouter } from "next/navigation";
// import Link from "next/link";
// import { signOut, useSession } from "next-auth/react";

// const NavBar = () => {
//   const router = useRouter();
//   const { data: session } = useSession(); // Get the session data

//   const handleLogout = async () => {
//     await signOut({ callbackUrl: "/" }); // Redirect to home after sign out
//   };

//   return (
//     <>
//       <header className="flex justify-between items-center my-6 w-full">
//         <Link href={"/"} className="text-2xl font-bold dark:text-yellow-500">
//           MathMatrix
//         </Link>
//         <nav className="flex gap-4">
//           <Button
//             variant="outline"
//             className="dark:text-yellow-500"
//             onClick={() => router.push("/leaderboard")}
//           >
//             Leaderboard
//           </Button>
//           {!session ? (
//             <>
//               <Button
//                 variant="outline"
//                 className="dark:text-yellow-500"
//                 onClick={() => router.push("/signup")}
//               >
//                 SignUp
//               </Button>
//               <Button
//                 variant="outline"
//                 className="dark:text-yellow-500"
//                 onClick={() => router.push("/login")}
//               >
//                 Login
//               </Button>
//             </>
//           ) : (
//             <Button
//               variant="outline"
//               className="dark:text-yellow-500"
//               onClick={handleLogout}
//             >
//               Logout
//             </Button>
//           )}
//           <ModeToggle />
//         </nav>
//       </header>
//     </>
//   );
// };

// export default NavBar;
