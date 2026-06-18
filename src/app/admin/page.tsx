import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import AdminTable from "./AdminTable";

export default async function AdminPage() {
  const session = await getSessionUser();
  if (!session) redirect("/login");

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      createdAt: true,
    },
  });

  // Serialize dates for the client component
  const serialized = users.map((u) => ({
    ...u,
    createdAt: u.createdAt.toISOString(),
  }));

  return (
    <main className="flex min-h-screen flex-col items-center bg-linear-to-br from-sky-100 via-blue-50 to-slate-100 px-4 py-16">
      <div className="w-full max-w-5xl space-y-6">

        <div className="rounded-3xl border border-white/60 bg-white/80 p-8 shadow-[0_18px_60px_rgba(15,23,42,0.12)] backdrop-blur-xl">
          <p className="mb-1 text-sm font-bold text-sky-600">Admin</p>
          <h1 className="text-2xl font-bold text-slate-900">Registered users</h1>
          <p className="mt-1 text-sm text-slate-500">
            {users.length} {users.length === 1 ? "user" : "users"} total
          </p>
        </div>

        <div className="overflow-hidden rounded-3xl border border-white/60 bg-white/80 shadow-[0_18px_60px_rgba(15,23,42,0.12)] backdrop-blur-xl">
          <AdminTable users={serialized} />
        </div>

      </div>
    </main>
  );
}
