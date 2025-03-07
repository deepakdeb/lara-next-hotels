"use client";
import { useState } from "react";
import { usePathname } from "next/navigation";
import Modal from "react-modal";
import RegisterForm from "@/components/RegisterForm"; // Import the component

export default function RegisterPage() {
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
    pathname === "/register" && (
      <Modal isOpen={showModal} style={customStyles} ariaHideApp={false}>
        <h2 className="mb-2 text-black">Register</h2>
        <RegisterForm onClose={() => setShowModal(false)} />
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