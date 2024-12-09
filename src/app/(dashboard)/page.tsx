import { auth } from "@/lib/auth";

export default async function DashboardPage() {
  const session = await auth();
  console.log(session);

  return (
    <main>
      Dashboard
      <div>Nama: {session?.user?.name}</div>
      <div>Email: {session?.user?.email}</div>
    </main>
  );
}
