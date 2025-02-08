import type { Metadata } from "next";
import "@/styles/globals.css";
import "@/styles/prosemirror.css";
import { ThemeProvider } from "@/components/theme-provider";
import { fonts } from "@/lib/fonts";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "AI Journal App",
  description: "AI Journal App to record your daily thoughts and ideas",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("min-h-screen font-sans antialiased", fonts)}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
