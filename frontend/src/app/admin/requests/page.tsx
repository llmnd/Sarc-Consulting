"use client";

import { useEffect, useState } from "react";
import AdminShell from "@/components/AdminShell";

type RequestItem = {
  id: string;
  name: string;
  email: string;
  organization: string | null;
  subject: string;
  message: string;
  status: "new" | "in_progress" | "closed";
  created_at: string;
};

export default function AdminRequestsPage() {
  const [sessionName, setSessionName] = useState("Administration");
  const [requests, setRequests] = useState<RequestItem[]>([]);

  async function load() {
    const response = await fetch("/api/admin/requests");
    if (response.status === 401) {
      window.location.assign("/admin/login");
      return;
    }
    const body = await response.json();
    setSessionName(body.sessionName);
    setRequests(body.requests);
  }

  useEffect(() => { load(); }, []);

  async function updateStatus(id: string, status: RequestItem["status"]) {
    await fetch("/api/admin/requests", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    await load();
  }

  return (
    <AdminShell sessionName={sessionName}>
      <div className="admin-page">
        <header className="admin-page-heading"><div><span className="admin-eyebrow">Contacts</span><h1>Demandes reçues</h1></div></header>
        <section className="admin-panel">
          {requests.length ? (
            <div className="admin-request-list">
              {requests.map((item) => (
                <article className="admin-request-card" key={item.id}>
                  <header><div><strong>{item.name}</strong><span>{item.email}{item.organization ? ` · ${item.organization}` : ""}</span></div><time>{new Date(item.created_at).toLocaleString("fr-FR")}</time></header>
                  <h2>{item.subject}</h2>
                  <p>{item.message}</p>
                  <select
                    value={item.status}
                    aria-label={`Statut de la demande de ${item.name}`}
                    onChange={(event) => updateStatus(item.id, event.target.value as RequestItem["status"])}
                  >
                    <option value="new">Nouvelle</option>
                    <option value="in_progress">En cours</option>
                    <option value="closed">Clôturée</option>
                  </select>
                </article>
              ))}
            </div>
          ) : <p className="admin-empty">Aucune demande reçue pour le moment.</p>}
        </section>
      </div>
    </AdminShell>
  );
}
