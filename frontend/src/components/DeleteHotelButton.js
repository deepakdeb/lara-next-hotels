"use client";
import { useRouter } from "next/navigation";

export default function DeleteHotelButton({ hotelId, token }) {
  const router = useRouter();

  async function handleDelete() {
    if (confirm("Are you sure you want to delete this hotel?")) {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/hotels/${hotelId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        router.refresh(); // Refresh the page to reflect the deletion
      } else {
        alert("Failed to delete hotel.");
      }
    }
  }

  return (
    <button className="btn btn-danger" onClick={handleDelete}>
      Delete
    </button>
  );
}
