import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Link from "next/link";
import DeleteHotelButton from "@/components/DeleteHotelButton"; // Import Delete Button Component

async function getHotels(page, token) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/hotels?page=${page}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch hotels");
  }

  return res.json();
}

export default async function HotelsPage({ searchParams }) {
  const session = await getServerSession(authOptions);

  if (!session?.backendToken) {
    return <p className="text-danger">You need to login to view this page.</p>;
  }

  const page = await searchParams?.page || 1;
  const hotels = await getHotels(page, session.backendToken);

  return (
    <div>
      <h1 className="mb-4">Manage Hotels</h1>
      <div className="row">
        {hotels.data.length === 0 ? (
          <p>No hotels available.</p>
        ) : (
          hotels.data.map((hotel) => (
            <div key={hotel.id} className="col-md-4 mb-4">
              <div className="card">
                <Link href={`/hotels/${hotel.id}`} className="text-decoration-none">
                  <img src={hotel.image_url} className="card-img-top" alt={hotel.name} />
                  <div className="card-body">
                    <h5 className="card-title">{hotel.name}</h5>
                    <p className="card-text">{hotel.address}</p>
                    <p className="text-muted">${hotel.cost_per_night} per night</p>
                  </div>
                </Link>
                <div className="card-footer d-flex justify-content-between">
                  <button className="btn btn-warning">
                    <Link href={`/hotels/edit/${hotel.id}`} className="text-white text-decoration-none">Edit</Link>
                  </button>
                  {/* ✅ Use DeleteHotelButton (Client Component) */}
                  <DeleteHotelButton hotelId={hotel.id} token={session.backendToken} />
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      <div className="mt-4">
        {hotels.prev_page_url && (
          <a href={`?page=${hotels.current_page - 1}`} className="btn btn-secondary me-2">
            Previous
          </a>
        )}
        <span>Page {hotels.current_page} of {hotels.last_page}</span>
        {hotels.next_page_url && (
          <a href={`?page=${hotels.current_page + 1}`} className="btn btn-secondary ms-2">
            Next
          </a>
        )}
      </div>
    </div>
  );
}
