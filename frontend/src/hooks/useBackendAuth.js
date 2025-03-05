"use client";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import axios from "axios";

export function useBackendAuth() {
  const { data: session } = useSession();

  useEffect(() => {
    console.log("Session Data:", session); // Debugging
    
    if (session?.accessToken) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${session.accessToken}`;
    }
  }, [session]);

  return session;
}
