// import { auth } from "@/auth";

// export default auth((req) => {
//   const { pathname, origin } = req.nextUrl;

//   // If session exists and trying to access /login, redirect to /journals
//   if (req.auth && pathname === "/login") {
//     const newUrl = new URL("/journals", origin);
//     return Response.redirect(newUrl);
//   }

//   // If no session and trying to access any route except /login or /, redirect to /login
//   if (!req.auth && pathname !== "/" && pathname !== "/login") {
//     const newUrl = new URL("/login", origin);
//     return Response.redirect(newUrl);
//   }

//   // Allow requests to proceed as normal for / or when session exists
//   return;
// });

// //this is very important otherwise when not logged in, you will caught in a loop for continuous fetch for /login page
// //since pathname will be different when fetching favicons and all
// export const config = {
//   matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
// };

//I DONT KNOW WHY THE ABOVE CODE WHICH WAS WORKING LOCALLY DOESNT WORK IN PORDUCTION , AUTHJS GUYS TELL TO DEGRADE NEXT VERSION WHICH DOESNT MAKE SENSE
//GOOD THING I TOOK NOTICE OF THE COOKIES THEY STORE IN THE BROWSER
//I WILL USE THAT TO CHECK IF THE USER IS LOGGED IN OR NOT

// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check for required auth cookies
  const csrfToken = request.cookies.get("__Host-authjs.csrf-token");
  const sessionToken = request.cookies.get("__Secure-authjs.session-token");
  const callbackUrl = request.cookies.get("__Secure-authjs.callback-url");

  // Check if all required cookies exist
  const isAuthenticated = csrfToken && sessionToken && callbackUrl;

  // If authenticated and trying to access /login, redirect to /journals
  if (isAuthenticated && pathname === "/login") {
    return NextResponse.redirect(new URL("/journals", request.url));
  }

  // If not authenticated and trying to access any route except /login or /, redirect to /login
  if (!isAuthenticated && pathname !== "/" && pathname !== "/login") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Allow the request to continue
  return NextResponse.next();
}

// This is very important to prevent redirect loops when fetching assets
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
