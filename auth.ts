import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import Mailgun from 'next-auth/providers/mailgun';
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/prisma/prisma"

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [Google, Mailgun],
});
