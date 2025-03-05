"use client";
import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Modal from "react-modal";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "", password_confirmation: "" });
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

  async function handleRegister(e) {
    e.preventDefault();
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await response.json();
    if (response.ok) {
      router.push("/login");
    } else {
      setError(data.errors ? Object.values(data.errors).flat().join(" ") : data.message);
    }
  }

  return (
    pathname === "/register" && (
      // <h1>gggg</h1>
      <Modal isOpen={showModal} style={customStyles} ariaHideApp={false} >
        <h2 className="mb-2 text-black">Register</h2>
        {error && <p className="text-danger">{error}</p>}
        <form onSubmit={handleRegister} className="mb-3">
          <input className="form-control mb-2" placeholder="Name" onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <input className="form-control mb-2" type="email" placeholder="Email" onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          <input className="form-control mb-2" type="password" placeholder="Password" onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          <input className="form-control mb-2" type="password" placeholder="Confirm Password" onChange={(e) => setForm({ ...form, password_confirmation: e.target.value })} required />
          <button className="btn btn-primary w-100" type="submit">Register</button>
        </form>
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