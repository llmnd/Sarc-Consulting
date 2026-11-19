"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { site } from "@/content/site";

export default function Header() {
  const [open,setOpen] = useState(false);
  const [scrolled,setScrolled] = useState(false);
  const [hidden,setHidden] = useState(false);
  const lastY = useRef(0);
  const menuRef = useRef<HTMLButtonElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const progress = document.getElementById("reading-progress");
    lastY.current = 0;
    setHidden(false);
    const canAutoHide = window.matchMedia("(min-width: 761px)").matches;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(pathname !== "/" || y > 30);
      if (canAutoHide) setHidden(y > 180 && y > lastY.current);
      else setHidden(false);
      lastY.current = y;
      const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (progress) {
        progress.style.transform = `scaleX(${Math.min(y / Math.max(scrollableHeight, 1), 1)})`;
      }
    };
    window.addEventListener("scroll",onScroll,{passive:true});
    onScroll();
    return () => window.removeEventListener("scroll",onScroll);
  },[pathname]);

  useEffect(() => {
    document.body.classList.toggle("menu-open",open);
    if (open) navRef.current?.querySelector<HTMLAnchorElement>("a")?.focus();
    const onKey = (e:KeyboardEvent) => {
      if (!open) return;
      if (e.key === "Escape") {
        setOpen(false);
        menuRef.current?.focus();
        return;
      }
      if (e.key === "Tab") {
        const focusable = navRef.current?.querySelectorAll<HTMLElement>("a[href]");
        if (!focusable?.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown",onKey);
    return () => { document.body.classList.remove("menu-open"); window.removeEventListener("keydown",onKey); };
  },[open]);

  return (
    <>
      <div className="progress" id="reading-progress" aria-hidden="true" />
      <header className={`site-header ${scrolled ? "scrolled" : ""} ${hidden && !open ? "hidden" : ""} ${open ? "menu-open" : ""}`}>
        <Link className="brand" href="/" aria-label="SARC Consulting, accueil">
          <span className="brand-mark" aria-hidden="true">S</span>
          <span className="brand-name">SARC <small>CONSULTING</small></span>
        </Link>
        <button ref={menuRef} className={`menu-toggle ${open ? "open" : ""}`} type="button"
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"} aria-expanded={open} aria-controls="mobile-navigation"
          onClick={()=>setOpen(v=>!v)}><span/><span/></button>
        <nav className="main-nav" id="navigation" aria-label="Navigation principale">
          {site.nav.map(([label,path]) => <Link className={pathname===path ? "active" : ""} href={path} key={path}>{label}</Link>)}
          <Link className={`nav-cta ${pathname==="/contact" ? "active" : ""}`} href="/contact">Parlons de vos enjeux <ArrowUpRight className="action-icon" size={14} strokeWidth={1.8} aria-hidden="true" /></Link>
        </nav>
      </header>
      <nav
        ref={navRef}
        className={`mobile-menu ${open ? "open" : ""}`}
        id="mobile-navigation"
        aria-label="Navigation mobile"
        aria-hidden={!open}
        onClick={(event)=>{if(event.target===event.currentTarget)setOpen(false);}}
      >
        {site.nav.map(([label,path],index) => <Link className={pathname===path ? "active" : ""} style={{transitionDelay:open ? `${index*55}ms` : "0ms"}} href={path} key={path} onClick={()=>setOpen(false)}>{label}</Link>)}
        <Link className="nav-cta" href="/contact" onClick={()=>setOpen(false)}>Parlons de vos enjeux <ArrowUpRight className="action-icon" size={14} strokeWidth={1.8} aria-hidden="true" /></Link>
      </nav>
    </>
  );
}
