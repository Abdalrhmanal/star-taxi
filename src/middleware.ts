import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// List of public routes (not protected)
const publicRoutes = [
  "/login",
  "/create-password",
  "/forgot-password",
  "/create-new-password",
  "/confirm-password",
  "/reset-password",
  "/platform",
];

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isProtectedRoute = !publicRoutes.includes(path);

  // Get the 'auth_user' cookie (which holds the token or user info)
  const authCookie = request.cookies.get("auth_user")?.value;

  let isAuthenticated = false;

  // If the auth cookie is present, consider the user authenticated
  if (authCookie) {
    // Here we assume that if the auth cookie exists, the user is authenticated
    // In case the token needs to be checked, you should call an API to verify the token here
    isAuthenticated = true; // Modify as necessary if you need more validation logic
  }

  // Case 1: If the user is authenticated and tries to access a public route (like login, register)
  // if (isAuthenticated && publicRoutes.includes(path)) {
  //   // Redirect to the dashboard because the user is already logged in
  //   return NextResponse.redirect(new URL("/", request.nextUrl));
  // }

  // Case 2: If the user is not authenticated and tries to access a protected route
  if (isProtectedRoute && !isAuthenticated) {
    // Redirect to the login page
    return NextResponse.redirect(new URL("/login", request.nextUrl));
  }

  // Case 3: If the user is authenticated, allow access to protected routes (no redirect)
  // The default behavior is to proceed with the request
  return NextResponse.next();
}

// Match all routes except those that should be excluded (e.g., API or static files)
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
