"use client";

import { FormEvent, useEffect, useState } from "react";
import { ChevronDown, Pencil, Plus, Trash2 } from "lucide-react";
import AdminShell from "@/components/AdminShell";

type Article = {
  id: string;
  slug: string;
  title_fr: string;
  excerpt_fr: string;
  content_fr: string;
  title_en: string | null;
  excerpt_en: string | null;
  content_en: string | null;
  status: "draft" | "published";
  published_at: string | null;
  created_at: string;
};

const emptyDraft = {
  slug: "",
  titleFr: "",
  excerptFr: "",
  contentFr: "",
  titleEn: "",
  excerptEn: "",
  contentEn: "",
  status: "draft",
};

export default function AdminArticlesPage() {
  const [sessionName, setSessionName] = useState("Administration");
  const [articles, setArticles] = useState<Article[]>([]);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState(emptyDraft);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function loadArticles() {
    const response = await fetch("/api/admin/content");
    if (response.status === 401) {
      window.location.assign("/admin/login");
      return;
    }
    if (!response.ok) throw new Error("Chargement impossible.");
    const body = await response.json();
    setSessionName(body.sessionName);
    setArticles(body.articles);
  }

  useEffect(() => {
    loadArticles().catch(() => window.location.assign("/admin/login"));
  }, []);

  function openNewArticle() {
    setEditingId(null);
    setDraft(emptyDraft);
    setMessage("");
    setStatus("idle");
    setEditorOpen(true);
  }

  function editArticle(article: Article) {
    setEditingId(article.id);
    setDraft({
      slug: article.slug,
      titleFr: article.title_fr,
      excerptFr: article.excerpt_fr,
      contentFr: article.content_fr,
      titleEn: article.title_en ?? "",
      excerptEn: article.excerpt_en ?? "",
      contentEn: article.content_en ?? "",
      status: article.status,
    });
    setMessage("");
    setStatus("idle");
    setEditorOpen(true);
    window.setTimeout(() => document.getElementById("article-editor")?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch("/api/admin/articles", {
        method: editingId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editingId, ...draft }),
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.detail);
      setStatus("success");
      setMessage(editingId ? "Actualité modifiée." : "Actualité enregistrée.");
      setEditingId(null);
      setDraft(emptyDraft);
      setEditorOpen(false);
      await loadArticles();
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Enregistrement impossible.");
    }
  }

  async function deleteArticle(article: Article) {
    if (!window.confirm(`Supprimer « ${article.title_fr} » ? Cette action est définitive.`)) return;
    try {
      const response = await fetch(`/api/admin/articles?id=${encodeURIComponent(article.id)}`, { method: "DELETE" });
      const body = await response.json();
      if (!response.ok) throw new Error(body.detail);
      await loadArticles();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Suppression impossible.");
      setStatus("error");
    }
  }

  return (
    <AdminShell sessionName={sessionName}>
      <div className="admin-page">
        <header className="admin-page-heading">
          <div><span className="admin-eyebrow">Contenus</span><h1>Actualités</h1></div>
          <button className="admin-new-button" type="button" onClick={openNewArticle}>
            <Plus size={16} aria-hidden="true" />
            Nouvelle publication
          </button>
        </header>

        <details
          id="article-editor"
          className="admin-panel admin-article-editor"
          open={editorOpen}
          onToggle={(event) => setEditorOpen(event.currentTarget.open)}
        >
          <summary className="admin-panel-heading">
            <div>
              <span className="admin-eyebrow">{editingId ? "Modifier" : "Nouvel article"}</span>
              <h2>{editingId ? "Modifier la publication" : "Rédiger une publication"}</h2>
            </div>
            <ChevronDown className="admin-details-icon" size={18} aria-hidden="true" />
          </summary>
          <form className="admin-form" onSubmit={submit}>
            <label>URL courte
              <input
                name="slug"
                required
                placeholder="nouvelle-offre-ia"
                value={draft.slug}
                onChange={(event) => setDraft((current) => ({ ...current, slug: event.target.value }))}
              />
            </label>
            <label>Statut
              <select value={draft.status} onChange={(event) => setDraft((current) => ({ ...current, status: event.target.value }))}>
                <option value="draft">Brouillon</option>
                <option value="published">Publié</option>
              </select>
            </label>
            <fieldset>
              <legend>Français</legend>
              <label>Titre
                <input value={draft.titleFr} onChange={(event) => setDraft((current) => ({ ...current, titleFr: event.target.value }))} required />
              </label>
              <label>Résumé
                <textarea value={draft.excerptFr} onChange={(event) => setDraft((current) => ({ ...current, excerptFr: event.target.value }))} required rows={3} />
              </label>
              <label>Contenu
                <textarea value={draft.contentFr} onChange={(event) => setDraft((current) => ({ ...current, contentFr: event.target.value }))} required rows={8} />
              </label>
            </fieldset>
            <fieldset>
              <legend>English</legend>
              <label>Title
                <input value={draft.titleEn} onChange={(event) => setDraft((current) => ({ ...current, titleEn: event.target.value }))} />
              </label>
              <label>Summary
                <textarea value={draft.excerptEn} onChange={(event) => setDraft((current) => ({ ...current, excerptEn: event.target.value }))} rows={3} />
              </label>
              <label>Content
                <textarea value={draft.contentEn} onChange={(event) => setDraft((current) => ({ ...current, contentEn: event.target.value }))} rows={8} />
              </label>
            </fieldset>
            <button className="admin-primary-button" type="submit" disabled={status === "loading"}>
              {status === "loading" ? "Enregistrement..." : editingId ? "Modifier la publication" : "Publier l’actualité"}
            </button>
            {editingId && (
              <button className="admin-secondary-button" type="button" onClick={() => { setEditingId(null); setDraft(emptyDraft); setEditorOpen(false); }}>
                Annuler
              </button>
            )}
            <p className="admin-form-message" role="status">{message}</p>
          </form>
        </details>

        <section className="admin-panel">
          <header className="admin-panel-heading">
            <div><span className="admin-eyebrow">Bibliothèque</span><h2>Toutes les publications</h2></div>
          </header>
          {articles.length ? (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead><tr><th>Titre</th><th>Statut</th><th>Date</th><th>Actions</th></tr></thead>
                <tbody>
                  {articles.map((article) => (
                    <tr key={article.id}>
                      <td><strong>{article.title_fr}</strong><small>/actualites/{article.slug}</small></td>
                      <td><span className={`admin-status ${article.status}`}>{article.status}</span></td>
                      <td>{new Date(article.published_at ?? article.created_at).toLocaleDateString("fr-FR")}</td>
                      <td>
                        <div className="admin-row-actions">
                          <button type="button" onClick={() => editArticle(article)} aria-label={`Modifier ${article.title_fr}`}><Pencil size={15} /></button>
                          <button className="danger" type="button" onClick={() => deleteArticle(article)} aria-label={`Supprimer ${article.title_fr}`}><Trash2 size={15} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : <p className="admin-empty">Aucune actualité publiée.</p>}
        </section>
      </div>
    </AdminShell>
  );
}
