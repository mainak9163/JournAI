import { auth } from "@/auth"

export default auth((req) => {
  const { pathname, origin } = req.nextUrl

  // If session exists and trying to access /login, redirect to /journals
  if (req.auth && pathname === "/login") {
    const newUrl = new URL("/journals", origin)
    return Response.redirect(newUrl)
  }

  // If no session and trying to access any route except /login or /, redirect to /login
  if (!req.auth && pathname !== "/" && pathname !== "/login") {
    const newUrl = new URL("/login", origin)
    return Response.redirect(newUrl)
  }

  // Allow requests to proceed as normal for / or when session exists
  return
})
