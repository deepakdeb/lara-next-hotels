"use client";
import { useState, lazy, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import Modal from "react-modal";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(true);
  const pathname = usePathname();

  const customStyles = {
    content: {
      width: "50%",
      margin: "auto",
      backgroundColor: "#51E1ED",
      height: "fit-content"
    }
  };

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
    pathname === "/login" && (
      <Modal isOpen={showModal} style={customStyles} ariaHideApp={false} >
        <h2 className="mb-3 text-black">Login Modal</h2>
          {error && <p className="text-danger">{error}</p>}
          <form onSubmit={handleLogin} className="mb-3">
            <input className="form-control mb-2" type="email" placeholder="Email" onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            <input className="form-control mb-2" type="password" placeholder="Password" onChange={(e) => setForm({ ...form, password: e.target.value })} required />
            <button className="btn btn-primary w-100" type="submit">Login</button>
          </form>
          <button className="btn btn-outline-danger mb-2 w-100" onClick={() => signIn("google")}>Login with Google</button>
          <div className="d-flex justify-content-center">
            <button
              className="btn btn-secondary mx-auto" // Added mx-auto
              onClick={() => setShowModal(false)}
            >
              Close
            </button>
          </div>
      </Modal>
    )
  );
}