"use client";
import { useState } from "react";
import { usePathname } from "next/navigation";
import Modal from "react-modal";
import LoginForm from "@/components/LoginForm"; // Import the component

export default function LoginPage() {
  const [showModal, setShowModal] = useState(true);
  const pathname = usePathname();

  const customStyles = {
    content: {
      width: "50%",
      margin: "auto",
      backgroundColor: "#51E1ED",
      height: "fit-content",
    },
  };

  return (
    pathname === "/login" && (
      <Modal isOpen={showModal} style={customStyles} ariaHideApp={false}>
        <h2 className="mb-3 text-black">Login Modal</h2>
        <LoginForm onClose={() => setShowModal(false)} />
        <div className="d-flex justify-content-center">
          <button
            className="btn btn-secondary mx-auto"
            onClick={() => setShowModal(false)}
          >
            Close
          </button>
        </div>
      </Modal>
    )
  );
}