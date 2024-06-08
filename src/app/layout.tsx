import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Streamscore",
  description: "an AI tool for music composition/education",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html className="h-full bg-white" lang="en">
        <body className={`h-full ${inter.className}`}>{children}</body>
      </html>
    </ClerkProvider>
  );
}
