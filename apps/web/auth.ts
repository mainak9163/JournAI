import NextAuth from "next-auth"
import authConfig from "./auth.config"
 
import { PrismaClient } from "@prisma/client"
import { PrismaAdapter } from "@auth/prisma-adapter"
 
const prisma = new PrismaClient()
 
export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  ...authConfig,
  // callbacks: {
  //   authorized: async ({ auth }) => {
  //     // Logged in users are authenticated, otherwise redirect to login page
  //     return !!auth
  //   },
  // },
})