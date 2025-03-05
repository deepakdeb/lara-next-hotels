"use client";
import { SessionProvider } from "next-auth/react";
import Navbar from "@/components/Navbar";
import "./globals.css"; // Ensure Bootstrap is included

export default function RootLayout({ children, modal }) {

  return (
    <html lang="en">
      <body>
        <SessionProvider>
          <Navbar />
          <main className="container mt-4">{children} {modal}</main>
        </SessionProvider>
      </body>
    </html>
  );
}
