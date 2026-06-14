"use client";

import { useEffect, useState, useMemo } from "react";

type User = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  createdAt: string;
};

type SortKey = keyof Omit<User, "id">;
type SortDir = "asc" | "desc";

const COLUMNS: { key: SortKey; label: string }[] = [
  { key: "name",      label: "Name" },
  { key: "email",     label: "Email" },
  { key: "phone",     label: "Phone" },
  { key: "createdAt", label: "Joined" },
];

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(iso));
}

export default function AdminPage() {
  const [users, setUsers]     = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("createdAt");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  useEffect(() => {
    fetch("/api/admin/users")
      .then((r) => {
        if (!r.ok) throw new Error(`${r.status} ${r.statusText}`);
        return r.json();
      })
      .then((data) => setUsers(data.users))
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  function handleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      // Newest-first for dates, A-Z for text
      setSortDir(key === "createdAt" ? "desc" : "asc");
    }
  }

  const sorted = useMemo(() => {
    return [...users].sort((a, b) => {
      const av = a[sortKey] ?? "";
      const bv = b[sortKey] ?? "";
      const cmp = av < bv ? -1 : av > bv ? 1 : 0;
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [users, sortKey, sortDir]);

  const chevron = (key: SortKey) =>
    sortKey === key ? (sortDir === "asc" ? " ↑" : " ↓") : "";

  return (
    <main className="flex min-h-screen flex-col items-center bg-linear-to-br from-sky-100 via-blue-50 to-slate-100 px-4 py-16">
      <div className="w-full max-w-5xl space-y-6">

        {/* Header */}
        <div className="rounded-3xl border border-white/60 bg-white/80 p-8 shadow-[0_18px_60px_rgba(15,23,42,0.12)] backdrop-blur-xl">
          <p className="mb-1 text-sm font-bold text-sky-600">Admin</p>
          <h1 className="text-2xl font-bold text-slate-900">Registered users</h1>
          {!loading && !error && (
            <p className="mt-1 text-sm text-slate-500">
              {users.length} {users.length === 1 ? "user" : "users"} total
            </p>
          )}
        </div>

        {/* Table card */}
        <div className="overflow-hidden rounded-3xl border border-white/60 bg-white/80 shadow-[0_18px_60px_rgba(15,23,42,0.12)] backdrop-blur-xl">
          {loading && (
            <p className="px-8 py-12 text-center text-sm text-slate-400">
              Loading users…
            </p>
          )}

          {error && (
            <p className="px-8 py-12 text-center text-sm font-medium text-rose-600">
              {error}
            </p>
          )}

          {!loading && !error && users.length === 0 && (
            <p className="px-8 py-12 text-center text-sm text-slate-400">
              No users yet.
            </p>
          )}

          {!loading && !error && users.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/80">
                    {COLUMNS.map(({ key, label }) => (
                      <th
                        key={key}
                        onClick={() => handleSort(key)}
                        className="cursor-pointer select-none whitespace-nowrap px-6 py-4 text-left text-xs font-bold uppercase tracking-widest text-slate-400 transition hover:text-sky-600"
                      >
                        {label}
                        <span className="ml-0.5 text-sky-500">{chevron(key)}</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {sorted.map((user) => (
                    <tr
                      key={user.id}
                      className="transition hover:bg-sky-50/40"
                    >
                      <td className="px-6 py-4 font-medium text-slate-900">
                        {user.name}
                      </td>
                      <td className="px-6 py-4 text-slate-600">{user.email}</td>
                      <td className="px-6 py-4 text-slate-600">
                        {user.phone ?? <span className="text-slate-300">—</span>}
                      </td>
                      <td className="px-6 py-4 tabular-nums text-slate-500">
                        {formatDate(user.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </main>
  );
}
