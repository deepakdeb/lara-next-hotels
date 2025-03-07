import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import EditHotel from "./EditHotel"; // Import the client component

export default async function EditHotelPage({ params }) {
  const { id } = params;
  const session = await getServerSession(authOptions);

  if (!session?.accessToken) {
    return <p>You need to login to view this page.</p>;
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/hotels/${id}`,
    {
      headers: { Authorization: `Bearer ${session.accessToken}` },
    }
  );

  if (!res.ok) {
    return <p>Error fetching hotel data.</p>; // Handle fetch errors
  }

  const hotelData = await res.json();

  return <EditHotel hotelData={hotelData} token={session.accessToken} />;
}