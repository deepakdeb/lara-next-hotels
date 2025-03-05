"use client";
import { useRouter } from "next/navigation";

export default function Modal({ children }) {
  const router = useRouter();

  function closeModal() {
    router.back(); // Navigate back to close the modal
  }

  return (
    <div className="modal-overlay" onClick={closeModal}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {children}
        <button className="btn btn-secondary w-100 mt-2" onClick={closeModal}>
          Close
        </button>
      </div>
    </div>
  );
}
