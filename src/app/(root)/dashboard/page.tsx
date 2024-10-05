"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const page = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return <div>Loading...</div>; // Show loading state while checking session
  }

  if (session) {
    return <div>Welcome to the Dashboard, {session.user?.name}!</div>;
  }

  return null; // If unauthenticated, this won't show because of the redirect
};

export default page;
