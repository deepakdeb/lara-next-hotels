import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import CreateHotelForm from "./CreateHotelForm"; // Create the client component

export default async function CreateHotelPage() {
  const session = await getServerSession(authOptions);

  if (!session?.backendToken) {
    return <p>You need to login to view this page.</p>;
  }

  return <CreateHotelForm backendToken={session.backendToken} />;
}