"use client";

import { SessionProvider, useSession } from "next-auth/react";
import { ThemeProvider } from "@/components/theme-provider";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Box, CircularProgress } from "@mui/material";

const RouteGuard = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, status } = useSession(); // Session data and status
  const [loading, setLoading] = useState(true); // Initialize loading state

  const protectedRoutes = ["/dashboard", "/quiz"]; // Add more protected routes if needed
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Redirect to login if user is not authenticated and trying to access protected routes
  useEffect(() => {
    if (status === "loading") {
      // Set loading state to true while checking session status
      setLoading(true);
    } else if (isProtectedRoute && status === "unauthenticated") {
      router.push("/login");
    } else {
      setLoading(false); // Set loading state to false if authenticated or on a public route
    }
  }, [pathname, session, status]);

  // Show loading state if checking session
  if (loading) {
    return (
      // <div className="flex justify-center items-center h-screen">
      //   Loading...
      // </div>
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

  return null; // This component doesn't need to render anything else
};

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <RouteGuard /> {/* Add RouteGuard component here */}
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        {children}
      </ThemeProvider>
    </SessionProvider>
  );
}

// 'use client'

// import { SessionProvider } from "next-auth/react"
// import { ThemeProvider } from "@/components/theme-provider"

// export function Providers({ children }: { children: React.ReactNode }) {
//   return (
//     <SessionProvider>
//       <ThemeProvider
//         attribute="class"
//         defaultTheme="system"
//         enableSystem
//         disableTransitionOnChange
//       >
//         {children}
//       </ThemeProvider>
//     </SessionProvider>
//   )
// }
