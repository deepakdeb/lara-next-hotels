
// app/login/page.js
"use client";
import { useState } from "react";
import { signIn, getSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  async function handleLogin(e) {
    e.preventDefault();
    try {
      const result = await signIn("credentials", {
        email: form.email,
        password: form.password,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
      } else {
        router.push("/hotels");
      }
    } catch (err) {
      setError("An unexpected error occurred.");
      console.error("Login Error", err);
    }
  }

  return (
    <>
        <h2>Login</h2>
       {error && <p className="text-danger">{error}</p>}
       <form onSubmit={handleLogin} className="mb-3">
         <input className="form-control mb-2" type="email" placeholder="Email" onChange={(e) => setForm({ ...form, email: e.target.value })} required />
         <input className="form-control mb-2" type="password" placeholder="Password" onChange={(e) => setForm({ ...form, password: e.target.value })} required />
         <button className="btn btn-primary w-100" type="submit">Login</button>
       </form>
       <button className="btn btn-outline-danger w-100" onClick={() => signIn("google")}>Login with Google</button>
    </>
  );
}