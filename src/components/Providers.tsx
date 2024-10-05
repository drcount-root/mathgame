"use client";

import { SessionProvider, useSession } from "next-auth/react";
import { ThemeProvider } from "@/components/theme-provider";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

const RouteGuard = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, status } = useSession(); // Session data and status

  const protectedRoutes = ["/dashboard", "/quiz"]; // Add more protected routes if needed
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Redirect to login if user is not authenticated and trying to access protected routes
  useEffect(() => {
    if (isProtectedRoute && status === "unauthenticated") {
      router.push("/login");
    }
  }, [pathname, session, status]);

  return null; // This component doesn't need to render anything
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
