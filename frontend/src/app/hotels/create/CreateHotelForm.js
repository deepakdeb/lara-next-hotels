"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateHotelForm({ accessToken }) {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    address: "",
    cost_per_night: "",
    available_rooms: "",
    image: null,
    average_rating: 0,
  });
  const [error, setError] = useState(null); // State for error message
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [successMessage, setSuccessMessage] = useState(null); // Success message

  const handleImageChange = (e) => {
    setForm({ ...form, image: e.target.files[0] });
  };

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
      if (form.image) {
        formData.append("image", form.image);
      }

      const response = await fetch("http://localhost:8000/api/hotels", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json(); // Parse error response
        setError(errorData.message || "Failed to create hotel."); // Set error message
      } else {
        setSuccessMessage("Hotel created successfully!");
        setTimeout(() => {
          router.push("/hotels"); // Redirect to hotels page after 2 seconds
        }, 2000);
      }
    } catch (error) {
      setError("An unexpected error occurred.");
      console.error("Error during fetch:", error);
    } finally {
      setIsLoading(false); // Reset loading state
    }
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow-lg border-0 rounded-lg">
            <div className="card-header bg-success text-white text-center">
              <h3 className="mb-0">Create Hotel</h3>
            </div>
            <div className="card-body p-4">
              {error && <div className="alert alert-danger">{error}</div>} {/* Show error message */}
              {successMessage && <div className="alert alert-success">{successMessage}</div>} {/* Show success message */}
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Hotel Name</label>
                  <input
                    className="form-control"
                    placeholder="Hotel Name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Address</label>
                  <input
                    className="form-control"
                    placeholder="Address"
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Cost per Night</label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Cost per Night"
                    value={form.cost_per_night}
                    onChange={(e) =>
                      setForm({ ...form, cost_per_night: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Available Rooms</label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Available Rooms"
                    value={form.available_rooms}
                    onChange={(e) =>
                      setForm({ ...form, available_rooms: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Average Rating</label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Average Rating"
                    value={form.average_rating}
                    onChange={(e) =>
                      setForm({ ...form, average_rating: parseFloat(e.target.value) })
                    }
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
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </div>
                <div className="d-grid">
                  <button
                    className="btn btn-success"
                    type="submit"
                    disabled={isLoading} // Disable button while loading
                  >
                    {isLoading ? "Creating..." : "Create Hotel"}
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