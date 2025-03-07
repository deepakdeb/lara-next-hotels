"use client";
import { useState } from "react";
import { useRouter, useParams } from "next/navigation";

export default function EditHotel({ hotelData, token }) {
  const router = useRouter();
  const { id } = useParams();
  const [form, setForm] = useState(hotelData);
  const [image, setImage] = useState(null);
  const [error, setError] = useState(null); // State for error message
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [successMessage, setSuccessMessage] = useState(null); // Success message

  const validateForm = () => {
    if (!form.name || !form.address || !form.cost_per_night || !form.available_rooms) {
      setError("All fields are required.");
      return false;
    }

    if (isNaN(form.cost_per_night) || form.cost_per_night <= 0) {
      setError("Cost per night must be a positive number.");
      return false;
    }

    if (isNaN(form.available_rooms) || form.available_rooms <= 0) {
      setError("Available rooms must be a positive number.");
      return false;
    }

    if (isNaN(form.average_rating) || form.average_rating < 0 || form.average_rating > 5) {
      setError("Average rating must be between 0 and 5.");
      return false;
    }

    return true;
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null); // Clear previous errors
    setSuccessMessage(null); // Clear previous success message

    if (!validateForm()) {
      return;
    }

    setIsLoading(true); // Set loading state

    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("address", form.address);
      formData.append("cost_per_night", form.cost_per_night);
      formData.append("available_rooms", form.available_rooms);
      formData.append("average_rating", form.average_rating);
      if (image) {
        formData.append("image", image);
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/hotels/${id}`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || "Failed to update hotel.");
      } else {
        setSuccessMessage("Hotel updated successfully!");
        setTimeout(() => {
          router.push("/hotels"); // Redirect to hotels page after 2 seconds
        }, 2000);
      }
    } catch (err) {
      setError("An unexpected error occurred.");
      console.error("Failed to update hotel:", err);
    } finally {
      setIsLoading(false); // Reset loading state
    }
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow-lg border-0 rounded-lg">
            <div className="card-header bg-primary text-white text-center">
              <h3 className="mb-0">Edit Hotel</h3>
            </div>
            <div className="card-body p-4">
              {error && <div className="alert alert-danger">{error}</div>} {/* Show error message */}
              {successMessage && <div className="alert alert-success">{successMessage}</div>} {/* Show success message */}
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Hotel Name</label>
                  <input
                    className="form-control"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Name"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Address</label>
                  <input
                    className="form-control"
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    placeholder="Address"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Cost Per Night</label>
                  <input
                    type="number"
                    className="form-control"
                    value={form.cost_per_night}
                    onChange={(e) =>
                      setForm({ ...form, cost_per_night: e.target.value })
                    }
                    placeholder="Cost per night"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Available Rooms</label>
                  <input
                    type="number"
                    className="form-control"
                    value={form.available_rooms}
                    onChange={(e) =>
                      setForm({ ...form, available_rooms: e.target.value })
                    }
                    placeholder="Available Rooms"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Average Rating</label>
                  <input
                    type="number"
                    className="form-control"
                    value={form.average_rating}
                    onChange={(e) =>
                      setForm({ ...form, average_rating: parseFloat(e.target.value) })
                    }
                    placeholder="Average Rating"
                    min="0"
                    max="5"
                    step="0.1"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Upload Image</label>
                  <input
                    type="file"
                    className="form-control"
                    onChange={(e) => setImage(e.target.files[0])}
                    accept="image/*"
                  />
                </div>
                <div className="d-grid">
                  <button
                    className="btn btn-primary"
                    type="submit"
                    disabled={isLoading} // Disable button while loading
                  >
                    {isLoading ? "Updating..." : "Update Hotel"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}