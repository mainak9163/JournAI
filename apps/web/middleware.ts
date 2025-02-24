import { auth } from "@/auth";

export default auth((req) => {
  const { pathname, origin } = req.nextUrl;

  // If session exists and trying to access /login, redirect to /journals
  if (req.auth && pathname === "/login") {
    const newUrl = new URL("/journals", origin);
    return Response.redirect(newUrl);
  }

  // If no session and trying to access any route except /login or /, redirect to /login
  if (!req.auth && pathname !== "/" && pathname !== "/login") {
    const newUrl = new URL("/login", origin);
    return Response.redirect(newUrl);
  }

  // Allow requests to proceed as normal for / or when session exists
  return;
});

//this is very important otherwise when not logged in, you will caught in a loop for continuous fetch for /login page
//since pathname will be different when fetching favicons and all
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
