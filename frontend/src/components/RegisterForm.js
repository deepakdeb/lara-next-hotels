"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterForm({ onClose }) {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Loading state

  // Form validation
  const validateForm = () => {
    if (!form.name || !form.email || !form.password || !form.password_confirmation) {
      setError("All fields are required.");
      return false;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      setError("Please enter a valid email address.");
      return false;
    }

    // Password confirmation validation
    if (form.password !== form.password_confirmation) {
      setError("Passwords do not match.");
      return false;
    }

    // Password length validation
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return false;
    }

    return true;
  };

  async function handleRegister(e) {
    e.preventDefault();

    // Validate form
    if (!validateForm()) {
      return;
    }

    setIsLoading(true); // Set loading state
    setError(""); // Clear previous errors

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (response.ok) {
        router.push("/login");
        if (onClose) {
          onClose(); // Close the modal after successful registration
        }
      } else {
        setError(data.errors ? Object.values(data.errors).flat().join(" ") : data.message);
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      console.error("Registration Error", err);
    } finally {
      setIsLoading(false); // Reset loading state
    }
  }

  return (
    <>
      {error && <p className="text-danger">{error}</p>}
      <form onSubmit={handleRegister} className="mb-3">
        <input
          className="form-control mb-2"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
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
        <input
          className="form-control mb-2"
          type="password"
          placeholder="Confirm Password"
          value={form.password_confirmation}
          onChange={(e) => setForm({ ...form, password_confirmation: e.target.value })}
          required
        />
        <button
          className="btn btn-primary w-100"
          type="submit"
          disabled={isLoading} // Disable button while loading
        >
          {isLoading ? "Registering..." : "Register"}
        </button>
      </form>
    </>
  );
}