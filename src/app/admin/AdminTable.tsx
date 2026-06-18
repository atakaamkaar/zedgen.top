"use client";

import { useMemo, useState } from "react";

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  createdAt: string;
};

type SortKey = keyof Omit<AdminUser, "id">;
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

export default function AdminTable({ users }: { users: AdminUser[] }) {
  const [sortKey, setSortKey] = useState<SortKey>("createdAt");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  function handleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
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

  if (users.length === 0) {
    return (
      <p className="px-8 py-12 text-center text-sm text-slate-400">
        No users yet.
      </p>
    );
  }

  return (
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
            <tr key={user.id} className="transition hover:bg-sky-50/40">
              <td className="px-6 py-4 font-medium text-slate-900">{user.name}</td>
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
  );
}
