// app/your-route/HotelDetailsPage.js (Server Component)
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import HotelDetails from "./HotelDetails"; // Import the client component

async function getHotel(id, token) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/hotels/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Hotel not found");
  }

  return res.json();
}

export default async function HotelDetailsPage({ params }) {
  const session = await getServerSession(authOptions);

  if (!session?.accessToken) {
    return <p className="text-danger">You need to login to view this page.</p>;
  }

  try {
    const hotel = await getHotel(params.id, session.accessToken);
    return <HotelDetails hotel={hotel} params={params} />;
  } catch (error) {
    return <p className="text-danger">{error.message || "An error occurred."}</p>;
  }
}