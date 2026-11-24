import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import AdminShell from "@/components/AdminShell";
import { getSql, requireAdmin } from "@/lib/admin-auth";

export default async function AdminDashboardPage() {
  const session = await requireAdmin();
  const sql = getSql();
  const [counts] = await sql`
    SELECT
      (SELECT count(*)::int FROM articles) AS articles,
      (SELECT count(*)::int FROM articles WHERE status = 'published') AS published,
      (SELECT count(*)::int FROM contact_requests) AS requests,
      (SELECT count(*)::int FROM contact_requests WHERE status = 'new') AS new_requests,
      (SELECT count(*)::int FROM admin_users WHERE active = true) AS users
  `;
  const recentRequests = await sql`
    SELECT id::text, name, email, subject, status, created_at
    FROM contact_requests
    ORDER BY created_at DESC
    LIMIT 5
  `;

  return (
    <AdminShell sessionName={session.name}>
      <div className="admin-page">
        <header className="admin-page-heading">
          <div><span className="admin-eyebrow">Tableau de bord</span><h1>Bonjour, {session.name}</h1></div>
        </header>
        <section className="admin-metrics" aria-label="Indicateurs">
          <article><span>Actualités</span><strong>{counts.articles}</strong><small>{counts.published} publiées</small></article>
          <article><span>Demandes</span><strong>{counts.requests}</strong><small>{counts.new_requests} nouvelles</small></article>
          <article><span>Utilisateurs</span><strong>{counts.users}</strong><small>comptes actifs</small></article>
        </section>
        <section className="admin-panel">
          <header className="admin-panel-heading">
            <div><span className="admin-eyebrow">Réactivité</span><h2>Dernières demandes</h2></div>
            <Link href="/admin/requests">Voir toutes <ArrowUpRight size={14} aria-hidden="true" /></Link>
          </header>
          {recentRequests.length ? (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead><tr><th>Nom</th><th>Sujet</th><th>Statut</th><th>Date</th></tr></thead>
                <tbody>
                  {recentRequests.map((request) => (
                    <tr key={String(request.id)}>
                      <td><strong>{String(request.name)}</strong><small>{String(request.email)}</small></td>
                      <td>{String(request.subject)}</td>
                      <td><span className={`admin-status ${String(request.status)}`}>{String(request.status)}</span></td>
                      <td>{new Date(String(request.created_at)).toLocaleDateString("fr-FR")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="admin-empty">Aucune demande reçue pour le moment.</p>
          )}
        </section>
      </div>
    </AdminShell>
  );
}
