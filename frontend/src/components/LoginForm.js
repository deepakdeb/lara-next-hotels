"use client";
import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginForm({ onClose }) {
  const router = useRouter();
  const { data: session, status } = useSession(); // Get session and status
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Redirect to /hotels if session exists
  useEffect(() => {
    if (status === "authenticated") {
      router.push("/hotels");
      if (onClose) {
        onClose();
      }
    }
  }, [status, router, onClose]);

  // Form validation
  const validateForm = () => {
    if (!form.email || !form.password) {
      setError("Email and password are required.");
      return false;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      setError("Please enter a valid email address.");
      return false;
    }

    return true;
  };

  async function handleLogin(e) {
    e.preventDefault();

    // Validate form
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email: form.email,
        password: form.password,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error || "Invalid email or password.");
      } else {
        router.push("/hotels");
        if (onClose) {
          onClose();
        }
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      console.error("Login Error", err);
    } finally {
      setIsLoading(false); // Reset loading state
    }
  }

  return (
    <>
      {error && <p className="text-danger">{error}</p>}
      <form onSubmit={handleLogin} className="mb-3">
        <input
          className="form-control mb-2"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <input
          className="form-control mb-2"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />
        <button
          className="btn btn-primary w-100"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? "Logging in..." : "Login"}
        </button>
      </form>
      <button
        className="btn btn-outline-primary mt-2 w-100"
        onClick={() => signIn("google")}
        disabled={isLoading}
      >
        Login with Google
      </button>
    </>
  );
}