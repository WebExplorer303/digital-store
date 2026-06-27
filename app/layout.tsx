import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { cookies } from "next/headers";
import Navbar from "@/components/navBar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Digital Store",
  icons: {
    icon: "/logo.svg",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  

  const hasSessionCookie = cookieStore.has("__session"); 

return (
  <html lang="en">
    <body className="bg-[#FAF8F4] min-h-screen">
      <Navbar key={hasSessionCookie.toString()} isLoggedIn={hasSessionCookie} />
      <main className="relative z-10">
        {children}
      </main>
    </body>
  </html>
);
}