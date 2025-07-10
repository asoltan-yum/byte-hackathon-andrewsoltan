import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { DarkModeToggle } from "@/components/DarkModeToggle";
import { darkModeScript } from "./darkModeScript";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BYTE Receipt Designer",
  description: "Design and customize receipt layouts",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: darkModeScript }} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <DarkModeToggle />
        {children}
      </body>
    </html>
  );
}
