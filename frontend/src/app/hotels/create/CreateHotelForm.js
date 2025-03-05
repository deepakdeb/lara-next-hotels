// CreateHotelForm.js
"use client";
import { useState } from "react";

export default function CreateHotelForm({ accessToken }) {
  const [form, setForm] = useState({
    name: "",
    address: "",
    cost_per_night: "",
    available_rooms: "",
    image: null,
    average_rating: 0,
  });
  const [error, setError] = useState(null); // State for error message

  const handleImageChange = (e) => {
    setForm({ ...form, image: e.target.files[0] });
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null); // Clear previous errors

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
        console.log("Hotel Created");
      }
    } catch (error) {
      setError("An unexpected error occurred.");
      console.error("Error during fetch:", error);
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
              <form onSubmit={handleSubmit}>
                {error && <div className="alert alert-danger">{error}</div>} {/* Show error message */}
                {/* ... form inputs ... */}
                <div className="mb-3">
                  <label className="form-label">Hotel Name</label>
                  <input
                    className="form-control"
                    placeholder="Hotel Name"
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Address</label>
                  <input
                    className="form-control"
                    placeholder="Address"
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Cost per Night</label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Cost per Night"
                    onChange={(e) =>
                      setForm({ ...form, cost_per_night: e.target.value })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Available Rooms</label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Available Rooms"
                    onChange={(e) =>
                      setForm({ ...form, available_rooms: e.target.value })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Average Rating</label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Average Rating"
                    onChange={(e) =>
                      setForm({ ...form, average_rating: parseFloat(e.target.value) })
                    }
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
                  <button className="btn btn-success" type="submit">
                    Create Hotel
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