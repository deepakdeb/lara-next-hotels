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

  if (!session?.accessToken) {
    return <p className="text-danger">You need to login to view this page.</p>;
  }

  const page = searchParams?.page || 1;
  const hotels = await getHotels(page, session.accessToken);

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Manage Hotels</h1>
        <Link href="/hotels/create" className="btn btn-primary">
          Create Hotel
        </Link>
      </div>

      {hotels.data.length === 0 ? (
        <div className="alert alert-info">No hotels available.</div>
      ) : (
        <div className="row">
          {hotels.data.map((hotel) => (
            <div key={hotel.id} className="col-md-4 mb-4">
              <div className="card h-100">
                <Link href={`/hotels/${hotel.id}`} className="text-decoration-none">
                  <img
                    src={hotel.image_url}
                    className="card-img-top"
                    alt={hotel.name}
                    style={{ height: "200px", objectFit: "cover" }}
                  />
                  <div className="card-body">
                    <h5 className="card-title">{hotel.name}</h5>
                    <p className="card-text">{hotel.address}</p>
                    <p className="text-muted">${hotel.cost_per_night} per night</p>
                  </div>
                </Link>
                <div className="card-footer d-flex justify-content-between">
                  <Link
                    href={`/hotels/edit/${hotel.id}`}
                    className="btn btn-warning text-white"
                  >
                    Edit
                  </Link>
                  <DeleteHotelButton hotelId={hotel.id} token={session.accessToken} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      <nav aria-label="Page navigation" className="mt-4">
        <ul className="pagination justify-content-center">
          {hotels.prev_page_url && (
            <li className="page-item">
              <Link
                href={`?page=${hotels.current_page - 1}`}
                className="page-link"
                aria-label="Previous"
              >
                <span aria-hidden="true">&laquo; Previous</span>
              </Link>
            </li>
          )}
          <li className="page-item disabled">
            <span className="page-link">
              Page {hotels.current_page} of {hotels.last_page}
            </span>
          </li>
          {hotels.next_page_url && (
            <li className="page-item">
              <Link
                href={`?page=${hotels.current_page + 1}`}
                className="page-link"
                aria-label="Next"
              >
                <span aria-hidden="true">Next &raquo;</span>
              </Link>
            </li>
          )}
        </ul>
      </nav>
    </div>
  );
}