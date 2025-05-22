import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";

export default async function Dashboard() {
  const session = await getServerSession(authOptions);

  console.log("Session Debug:", session);

  if (!session) {
    return <p>You are not logged in.</p>; // Or redirect to /login
  }

  return (
    <div>
      <h1>Welcome, {session.user?.email}!</h1>
      <p>This is your dashboard.</p>
    </div>
  );
}
