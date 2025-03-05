"use client";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import axios from "axios";

export function useBackendAuth() {
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.backendToken) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${session.backendToken}`;
    }
  }, [session]);

  return session;
}
