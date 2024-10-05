import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

// Define the paths that need authentication
const protectedRoutes = ["/dashboard", "/quiz"];

export async function middleware(req: NextRequest) {
  // Retrieve the token from the request
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // Check if the current request path is one of the protected routes
  if (protectedRoutes.some((path) => req.nextUrl.pathname.startsWith(path))) {
    // If no token is found, redirect to the login page
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  // If the user is authenticated or the route is not protected, allow the request
  return NextResponse.next();
}

// Only run the middleware for these routes
export const config = {
  matcher: ["/dashboard", "/quiz"],
};
