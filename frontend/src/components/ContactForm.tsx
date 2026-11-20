"use client";

import { FormEvent, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { ui, type Locale } from "@/content/ui";

export default function ContactForm({ locale }: { locale: Locale }) {
  const [status,setStatus] = useState<"idle"|"loading"|"success"|"error">("idle");
  const [message,setMessage] = useState("");
  const copy = ui[locale].form;

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
      if (!res.ok) throw new Error(body.detail || copy.sendFailure);
      setStatus("success");
      setMessage(copy.success);
      form.reset();
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : copy.failure);
    }
  }

  return (
    <form className="contact-form" onSubmit={submit}>
      <div className="field"><label htmlFor="name">{copy.name} *</label><input id="name" name="name" autoComplete="name" required minLength={2} maxLength={120} /></div>
      <div className="field"><label htmlFor="email">{copy.email} *</label><input id="email" name="email" type="email" autoComplete="email" required /></div>
      <div className="field"><label htmlFor="organization">{copy.organization}</label><input id="organization" name="organization" autoComplete="organization" maxLength={160} /></div>
      <div className="field"><label htmlFor="subject">{copy.subject} *</label><select id="subject" name="subject" required defaultValue=""><option value="" disabled>{copy.chooseSubject}</option>{copy.subjects.map(subject=><option key={subject}>{subject}</option>)}</select></div>
      <div className="field full"><label htmlFor="message">{copy.message} *</label><textarea id="message" name="message" required minLength={10} maxLength={3000} /></div>
      <div className="honeypot" aria-hidden="true"><label htmlFor="website">{copy.honeypot}</label><input id="website" name="website" tabIndex={-1} autoComplete="off" /></div>
      <div className="form-bottom"><small>{copy.privacy}</small><button type="submit" disabled={status==="loading"}>{status==="loading" ? copy.sending : <>{copy.send} <ArrowUpRight className="action-icon" size={14} strokeWidth={1.8} aria-hidden="true" /></>}</button></div>
      <p className="form-message" role="status" aria-live="polite">{message}</p>
    </form>
  );
}
