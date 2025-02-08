import Google from "next-auth/providers/google"
import type { NextAuthConfig } from "next-auth"
import MailGun from "next-auth/providers/mailgun"
 
// Notice this is only an object, not a full Auth.js instance
export default {
  providers: [Google,MailGun],
} satisfies NextAuthConfig