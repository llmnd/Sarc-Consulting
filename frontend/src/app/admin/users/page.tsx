"use client";

import { useEffect, useState } from "react";
import AdminShell from "@/components/AdminShell";

type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "editor";
  active: boolean;
  created_at: string;
};

export default function AdminUsersPage() {
  const [sessionName, setSessionName] = useState("Administration");
  const [users, setUsers] = useState<AdminUser[]>([]);

  useEffect(() => {
    fetch("/api/admin/users")
      .then((response) => response.ok ? response.json() : Promise.reject())
      .then((body) => {
        setSessionName(body.sessionName);
        setUsers(body.users);
      })
      .catch(() => window.location.assign("/admin/login"));
  }, []);

  return (
    <AdminShell sessionName={sessionName}>
      <div className="admin-page">
        <header className="admin-page-heading"><div><span className="admin-eyebrow">Accès</span><h1>Utilisateurs administrateurs</h1></div></header>
        <section className="admin-panel">
          {users.length ? (
            <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Utilisateur</th><th>Rôle</th><th>Accès</th><th>Créé le</th></tr></thead><tbody>{users.map((user) => <tr key={user.id}><td><strong>{user.name}</strong><small>{user.email}</small></td><td>{user.role}</td><td><span className={`admin-status ${user.active ? "published" : "closed"}`}>{user.active ? "Actif" : "Inactif"}</span></td><td>{new Date(user.created_at).toLocaleDateString("fr-FR")}</td></tr>)}</tbody></table></div>
          ) : <p className="admin-empty">Aucun utilisateur configuré.</p>}
        </section>
      </div>
    </AdminShell>
  );
}
