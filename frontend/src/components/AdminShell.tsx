"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FileText, LayoutDashboard, LogOut, Mail, Users } from "lucide-react";
import type { ReactNode } from "react";

export default function AdminShell({
  children,
  sessionName,
}: {
  children: ReactNode;
  sessionName: string;
}) {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
  }

  const links = [
    { href: "/admin", label: "Vue d'ensemble", icon: LayoutDashboard },
    { href: "/admin/articles", label: "Actualités", icon: FileText },
    { href: "/admin/requests", label: "Demandes", icon: Mail },
    { href: "/admin/users", label: "Utilisateurs", icon: Users },
  ];

  return (
    <main className="admin-shell">
      <aside className="admin-sidebar">
        <Link className="brand" href="/" aria-label="SARC Consulting, accueil">
          <Image className="brand-logo brand-logo-light" src="/images/sarc-logo-light.png" alt="" width={268} height={75} priority />
        </Link>
        <nav className="admin-nav" aria-label="Navigation administrative">
          {links.map(({ href, label, icon: Icon }) => (
            <Link className={pathname === href ? "active" : ""} href={href} key={href}>
              <Icon size={17} strokeWidth={1.8} aria-hidden="true" />
              <span>{label}</span>
            </Link>
          ))}
        </nav>
        <button className="admin-logout" type="button" onClick={logout}>
          <LogOut size={17} strokeWidth={1.8} aria-hidden="true" />
          <span>Se déconnecter</span>
        </button>
      </aside>
      <section className="admin-content">
        <header className="admin-topbar">
          <span>Administration</span>
          <strong>{sessionName}</strong>
        </header>
        {children}
      </section>
    </main>
  );
}
