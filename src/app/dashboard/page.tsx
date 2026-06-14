import { redirect } from "next/navigation";
import { getSessionFromCookies } from "@/lib/auth";
import prisma from "@/lib/prisma";
import LogoutButton from "./LogoutButton";

export default async function DashboardPage() {
  // getSessionFromCookies() reads the HttpOnly cookie server-side.
  // Middleware already verified the JWT, but we still call this to get userId
  // so we can load the full user row (name + phone aren't stored in the token).
  const session = await getSessionFromCookies();
  if (!session) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { name: true, email: true, phone: true, createdAt: true },
  });

  if (!user) redirect("/login");

  const joinedDate = new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(user.createdAt));

  return (
    <main className="flex min-h-screen items-start justify-center bg-linear-to-br from-sky-100 via-blue-50 to-slate-100 px-4 py-16">
      <div className="w-full max-w-lg space-y-6">

        {/* Header card */}
        <div className="rounded-3xl border border-white/60 bg-white/80 p-8 shadow-[0_18px_60px_rgba(15,23,42,0.12)] backdrop-blur-xl">
          <p className="mb-1 text-sm font-bold text-sky-600">Dashboard</p>
          <h1 className="text-2xl font-bold text-slate-900">
            Welcome, {user.name}!
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            You&apos;re signed in and ready to go.
          </p>
        </div>

        {/* Profile card */}
        <div className="rounded-3xl border border-white/60 bg-white/80 p-8 shadow-[0_18px_60px_rgba(15,23,42,0.12)] backdrop-blur-xl">
          <h2 className="mb-5 text-sm font-bold uppercase tracking-widest text-slate-400">
            Your details
          </h2>

          <dl className="space-y-4">
            <Row label="Full name" value={user.name} />
            <Row label="Email" value={user.email} />
            <Row label="Phone" value={user.phone ?? "—"} />
            <Row label="Member since" value={joinedDate} />
          </dl>
        </div>

        {/* Logout */}
        <LogoutButton />

      </div>
    </main>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-4 last:border-0 last:pb-0">
      <dt className="text-sm font-semibold text-slate-500">{label}</dt>
      <dd className="text-right text-sm font-medium text-slate-900">{value}</dd>
    </div>
  );
}
