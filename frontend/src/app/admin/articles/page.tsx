"use client";

import { FormEvent, useEffect, useState } from "react";
import AdminShell from "@/components/AdminShell";

type Article = {
  id: string;
  slug: string;
  title_fr: string;
  status: string;
  published_at: string | null;
  created_at: string;
};

export default function AdminArticlesPage() {
  const [sessionName, setSessionName] = useState("Administration");
  const [articles, setArticles] = useState<Article[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/admin/content")
      .then((response) => response.ok ? response.json() : Promise.reject())
      .then((body) => {
        setSessionName(body.sessionName);
        setArticles(body.articles);
      })
      .catch(() => window.location.assign("/admin/login"));
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    setStatus("loading");
    setMessage("");
    const data = new FormData(form);
    try {
      const response = await fetch("/api/admin/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: data.get("slug"),
          titleFr: data.get("titleFr"),
          excerptFr: data.get("excerptFr"),
          contentFr: data.get("contentFr"),
          titleEn: data.get("titleEn"),
          excerptEn: data.get("excerptEn"),
          contentEn: data.get("contentEn"),
          status: data.get("status"),
        }),
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.detail);
      setStatus("success");
      setMessage("Actualité enregistrée.");
      form.reset();
      const refresh = await fetch("/api/admin/content").then((item) => item.json());
      setArticles(refresh.articles);
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Enregistrement impossible.");
    }
  }

  return (
    <AdminShell sessionName={sessionName}>
      <div className="admin-page">
        <header className="admin-page-heading">
          <div><span className="admin-eyebrow">Contenus</span><h1>Actualités</h1></div>
        </header>
        <section className="admin-panel admin-article-editor">
          <header className="admin-panel-heading"><div><span className="admin-eyebrow">Nouvel article</span><h2>Rédiger une publication</h2></div></header>
          <form className="admin-form" onSubmit={submit}>
            <label>URL courte<input name="slug" required placeholder="nouvelle-offre-ia" /></label>
            <label>Statut<select name="status" defaultValue="draft"><option value="draft">Brouillon</option><option value="published">Publié</option></select></label>
            <fieldset><legend>Français</legend><label>Titre<input name="titleFr" required /></label><label>Résumé<textarea name="excerptFr" required rows={3} /></label><label>Contenu<textarea name="contentFr" required rows={8} /></label></fieldset>
            <fieldset><legend>English</legend><label>Title<input name="titleEn" /></label><label>Summary<textarea name="excerptEn" rows={3} /></label><label>Content<textarea name="contentEn" rows={8} /></label></fieldset>
            <button className="admin-primary-button" type="submit" disabled={status === "loading"}>{status === "loading" ? "Enregistrement..." : "Enregistrer"}</button>
            <p className="admin-form-message" role="status">{message}</p>
          </form>
        </section>
        <section className="admin-panel">
          <header className="admin-panel-heading"><div><span className="admin-eyebrow">Bibliothèque</span><h2>Toutes les publications</h2></div></header>
          {articles.length ? (
            <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Titre</th><th>Statut</th><th>Date</th></tr></thead><tbody>{articles.map((article) => <tr key={article.id}><td><strong>{article.title_fr}</strong><small>/actualites/{article.slug}</small></td><td><span className={`admin-status ${article.status}`}>{article.status}</span></td><td>{new Date(article.published_at ?? article.created_at).toLocaleDateString("fr-FR")}</td></tr>)}</tbody></table></div>
          ) : <p className="admin-empty">Aucune actualité publiée.</p>}
        </section>
      </div>
    </AdminShell>
  );
}
