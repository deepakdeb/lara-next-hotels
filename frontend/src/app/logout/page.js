"use client";
import { signOut } from "next-auth/react";
import axios from "axios";

export default function Logout() {
  async function handleLogout() {
    await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/logout`);
    signOut(); // Logs out from NextAuth
  }

  return <button onClick={handleLogout}>Logout</button>;
}
