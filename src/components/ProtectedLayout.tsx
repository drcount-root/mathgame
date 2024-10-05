"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { ReactNode, useEffect } from "react";

interface ProtectedLayoutProps {
  children: ReactNode;
}

const ProtectedLayout = ({ children }: ProtectedLayoutProps) => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // If the user is unauthenticated, redirect to the login page
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  //   if (status === "loading") {
  // Optionally, show a loading state while checking the session
  // return <div>Loading...</div>;
  //   }

  if (session) {
    // If authenticated, render the protected content
    return <>{children}</>;
  }

  return null; // If not authenticated, this won't be shown because of the redirect
};

export default ProtectedLayout;
