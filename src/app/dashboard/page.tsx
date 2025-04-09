import { auth } from "@/auth";

export default async function Dashboard() {
  const session = await auth(); // ✅ Fetch session in Server Component

  console.log("Session Debug:", session); // ✅ Log session for debugging

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
