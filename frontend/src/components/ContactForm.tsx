"use client";

import { FormEvent, useState } from "react";

export default function ContactForm() {
  const [status,setStatus] = useState<"idle"|"loading"|"success"|"error">("idle");
  const [message,setMessage] = useState("");

  async function submit(e:FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.reportValidity()) return;
    setStatus("loading");
    const data = new FormData(form);
    try {
      const res = await fetch("/api/contact", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          name:data.get("name"), email:data.get("email"), organization:data.get("organization")||null,
          subject:data.get("subject"), message:data.get("message"), website:data.get("website")||""
        })
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.detail || "Votre message n’a pas pu être envoyé.");
      setStatus("success");
      setMessage("Merci. Votre message a bien été envoyé.");
      form.reset();
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Une erreur est survenue.");
    }
  }

  return (
    <form className="contact-form" onSubmit={submit}>
      <div className="field"><label htmlFor="name">Nom complet *</label><input id="name" name="name" autoComplete="name" required minLength={2} maxLength={120} /></div>
      <div className="field"><label htmlFor="email">Adresse e-mail *</label><input id="email" name="email" type="email" autoComplete="email" required /></div>
      <div className="field"><label htmlFor="organization">Organisation</label><input id="organization" name="organization" autoComplete="organization" maxLength={160} /></div>
      <div className="field"><label htmlFor="subject">Votre sujet *</label><select id="subject" name="subject" required defaultValue=""><option value="" disabled>Choisir un sujet</option><option>Conformité réglementaire</option><option>Gestion des obligations</option><option>Transformation digitale</option><option>Autre demande</option></select></div>
      <div className="field full"><label htmlFor="message">Quelques mots sur votre besoin *</label><textarea id="message" name="message" required minLength={10} maxLength={3000} /></div>
      <div className="honeypot" aria-hidden="true"><label htmlFor="website">Site web</label><input id="website" name="website" tabIndex={-1} autoComplete="off" /></div>
      <div className="form-bottom"><small>Vos informations sont utilisées uniquement pour répondre à votre demande.</small><button type="submit" disabled={status==="loading"}>{status==="loading" ? "Envoi…" : "Envoyer mon message ↗"}</button></div>
      <p className="form-message" role="status" aria-live="polite">{message}</p>
    </form>
  );
}
