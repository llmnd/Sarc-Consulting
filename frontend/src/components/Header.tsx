"use client";

import { useEffect, useRef, useState, type FocusEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, ChevronDown, Plus, Search, UserRound } from "lucide-react";
import { site as siteFr } from "@/content/site";
import { siteEn } from "@/content/site.en";
import { ui, type Locale } from "@/content/ui";

function LanguageFlag({ locale }: { locale: Locale }) {
  if (locale === "fr") {
    return (
      <svg className="language-flag" viewBox="0 0 3 2" aria-hidden="true" focusable="false">
        <rect width="1" height="2" fill="#002395" />
        <rect x="1" width="1" height="2" fill="#fff" />
        <rect x="2" width="1" height="2" fill="#ed2939" />
      </svg>
    );
  }
  return (
    <svg className="language-flag" viewBox="0 0 3 2" aria-hidden="true" focusable="false">
      <rect width="3" height="2" fill="#fff" />
      <path d="M1.25 0h.5v.75h1.25v.5H1.75V2h-.5v-.75H0v-.5h1.25z" fill="#c8102e" />
    </svg>
  );
}

export default function Header({ locale }: { locale: Locale }) {
  const [open,setOpen] = useState(false);
  const [exploreOpen,setExploreOpen] = useState(false);
  const [searchOpen,setSearchOpen] = useState(false);
  const [searchValue,setSearchValue] = useState("");
  const [scrolled,setScrolled] = useState(false);
  const [hidden,setHidden] = useState(false);
  const lastY = useRef(0);
  const menuRef = useRef<HTMLButtonElement>(null);
  const exploreTriggerRef = useRef<HTMLButtonElement>(null);
  const exploreDismissedRef = useRef(false);
  const navRef = useRef<HTMLElement>(null);
  const pathname = usePathname();
  const site = locale === "en" ? siteEn : siteFr;
  const copy = ui[locale];
  const homePath = locale === "en" ? "/en" : "/";
  const explorePaths = new Set(locale === "en"
    ? ["/en/approach", "/en/sectors", "/en/news", "/en/contact"]
    : ["/methode", "/secteurs", "/actualites", "/contact"]);
  const mainNavLinks = site.nav.filter(([, path]) => !explorePaths.has(path));
  const exploreLinks = site.nav.filter(([, path]) => explorePaths.has(path));
  const exploreIsActive = exploreLinks.some(([, path]) => pathname === path);
  const localizedRoutes = [["a-propos", "about"], ["prestations", "expertise"], ["ia-automatisation", "ai-automation"], ["methode", "approach"], ["secteurs", "sectors"], ["actualites", "news"], ["engagements", "commitments"], ["contact", "contact"], ["cabinet", "about"], ["expertises", "expertise"], ["approche", "approach"]] as const;
  const routeWithoutLocale = pathname === "/en" ? "" : pathname.startsWith("/en/") ? pathname.slice(4) : pathname.slice(1);
  const routePair = localizedRoutes.find(([french, english]) => routeWithoutLocale === french || routeWithoutLocale === english);
  const frenchPath = pathname === "/en" ? "/" : pathname.startsWith("/en/") ? `/${routePair?.[0] ?? routeWithoutLocale}` : pathname;
  const englishPath = pathname === "/" || pathname === "/en" ? "/en" : pathname.startsWith("/en/") ? pathname : `/en/${routePair?.[1] ?? routeWithoutLocale}`;

  useEffect(() => {
    exploreDismissedRef.current = false;
    setExploreOpen(false);
    document.documentElement.lang = locale;
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
  },[pathname, locale]);

  const handleExploreBlur = (event: FocusEvent<HTMLDivElement>) => {
    if (!(event.relatedTarget instanceof Node) || !event.currentTarget.contains(event.relatedTarget)) {
      const pointerInside = event.currentTarget.matches(":hover");
      exploreDismissedRef.current = false;
      setExploreOpen(pointerInside);
    }
  };

  useEffect(() => {
    if (!open) return;
    setSearchOpen(false);
    const body = document.body;
    const scrollY = window.scrollY;
    const previousBodyStyles = {
      position: body.style.position,
      top: body.style.top,
      left: body.style.left,
      right: body.style.right,
      width: body.style.width,
    };
    body.classList.add("menu-open");
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.left = "0";
    body.style.right = "0";
    body.style.width = "100%";
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
    return () => {
      body.classList.remove("menu-open");
      window.removeEventListener("keydown",onKey);
      Object.assign(body.style,previousBodyStyles);
      const root = document.documentElement;
      const previousScrollBehavior = root.style.scrollBehavior;
      root.style.scrollBehavior = "auto";
      window.scrollTo(0,scrollY);
      root.style.scrollBehavior = previousScrollBehavior;
    };
  },[open]);

  return (
    <>
      <div className="progress" id="reading-progress" aria-hidden="true" />
      <header className={`site-header ${scrolled ? "scrolled" : ""} ${hidden && !open ? "hidden" : ""} ${open ? "menu-open" : ""}`}>
        <Link className="brand" href={homePath} aria-label={copy.brandHome}>
          <Image className="brand-logo brand-logo-dark" src="/images/sarc-logo-dark.png" alt="" width={268} height={75} priority />
        </Link>
        <nav className="main-nav" id="navigation" aria-label={copy.navLabel}>
          {mainNavLinks.map(([label,path]) => <Link className={pathname===path ? "active" : ""} href={path} key={path}>{label}</Link>)}
          <div
            className={`nav-dropdown ${exploreOpen ? "open" : ""}`}
            onMouseEnter={() => {exploreDismissedRef.current = false; setExploreOpen(true);}}
            onMouseLeave={(event) => setExploreOpen(!exploreDismissedRef.current && event.currentTarget.matches(":focus-within"))}
            onFocusCapture={() => {
              if (!exploreDismissedRef.current) setExploreOpen(true);
            }}
            onBlur={handleExploreBlur}
            onKeyDown={(event) => {
              if (event.key === "Escape") {
                event.preventDefault();
                exploreDismissedRef.current = true;
                setExploreOpen(false);
                exploreTriggerRef.current?.focus();
              }
            }}
          >
            <button
              ref={exploreTriggerRef}
              className={`nav-dropdown-trigger ${exploreIsActive ? "active" : ""}`}
              type="button"
              aria-expanded={exploreOpen}
              aria-controls="desktop-explore-menu"
              onClick={() => {exploreDismissedRef.current = false; setExploreOpen(true);}}
            >
              {copy.navExplore}
              <ChevronDown className="nav-dropdown-chevron" size={14} aria-hidden="true" />
            </button>
            <div className="nav-dropdown-menu" id="desktop-explore-menu" aria-hidden={!exploreOpen}>
              {exploreLinks.map(([label,path]) => (
                <Link
                  className={pathname===path ? "active" : ""}
                  href={path}
                  key={path}
                  onClick={() => setExploreOpen(false)}
                >
                  {label}
                  <ArrowUpRight size={14} strokeWidth={1.8} aria-hidden="true" />
                </Link>
              ))}
            </div>
          </div>
        </nav>
        <Link className={`nav-cta header-nav-cta ${pathname=== (locale === "en" ? "/en/contact" : "/contact") ? "active" : ""}`} href={locale === "en" ? "/en/contact" : "/contact"}>{copy.navCta} <ArrowUpRight className="action-icon" size={14} strokeWidth={1.8} aria-hidden="true" /></Link>
        <div className="language-switch" aria-label={copy.languageLabel}>
          <Link className={`language-option ${locale === "fr" ? "active" : ""}`} href={frenchPath} lang="fr" aria-label="Français" aria-current={locale === "fr" ? "page" : undefined}><LanguageFlag locale="fr" /><span>FR</span></Link>
          <Link className={`language-option ${locale === "en" ? "active" : ""}`} href={englishPath} lang="en" aria-label="English" aria-current={locale === "en" ? "page" : undefined}><LanguageFlag locale="en" /><span>EN</span></Link>
        </div>
        <button ref={menuRef} className={`menu-toggle ${open ? "open" : ""}`} type="button"
          aria-label={open ? copy.closeMenu : copy.openMenu} aria-expanded={open} aria-controls="mobile-navigation"
          onClick={()=>{setOpen(v=>!v);setExploreOpen(false);exploreDismissedRef.current=false;}}><span/><span/></button>
        <div className="header-utility" aria-label="Liens secondaires">
          <a
            className="header-linkedin"
            href="https://www.linkedin.com/company/sarc-consulting"
            target="_blank"
            rel="noreferrer"
            aria-label="SARC Consulting sur LinkedIn"
          >
            <Image className="header-linkedin-logo" src="/images/linkedin.svg" alt="" width={28} height={28} />
            <span className="header-linkedin-label">LinkedIn</span>
          </a>
          <div className="header-utility-center" aria-label={locale === "en" ? "Areas of expertise" : "Nos expertises"}>
            {locale === "en" ? "Compliance · Legal · Process · AI" : "Conformité · Juridique · Process · IA"}
          </div>
          <div className="header-utility-actions">
            <button
              className="header-utility-button header-search-button"
              type="button"
              aria-label={locale === "en" ? "Search" : "Rechercher"}
              aria-expanded={searchOpen}
              onClick={() => setSearchOpen((value) => !value)}
            >
              <Search size={16} strokeWidth={1.8} aria-hidden="true" />
            </button>
            <Link
              className="header-utility-button header-plus-button"
              href={locale === "en" ? "/en/contact" : "/contact"}
              aria-label={locale === "en" ? "Start a request" : "Faire une demande"}
            >
              <Plus size={17} strokeWidth={2} aria-hidden="true" />
            </Link>
            <Link
              className="header-utility-button header-login"
              href="/admin/login"
              aria-label={locale === "en" ? "Sign in" : "Se connecter"}
            >
              <UserRound size={16} strokeWidth={1.8} aria-hidden="true" />
            </Link>
            {searchOpen && (
              <div className="header-search-popover" role="search">
                <label htmlFor="header-search">{locale === "en" ? "Search the site" : "Rechercher sur le site"}</label>
                <input
                  id="header-search"
                  value={searchValue}
                  onChange={(event) => setSearchValue(event.target.value)}
                  placeholder={locale === "en" ? "Page or topic…" : "Page ou sujet…"}
                  autoFocus
                />
                <div className="header-search-results">
                  {site.nav
                    .filter(([label]) => label.toLowerCase().includes(searchValue.trim().toLowerCase()))
                    .slice(0, 5)
                    .map(([label, path]) => (
                      <Link href={path} key={path} onClick={() => setSearchOpen(false)}>{label}</Link>
                    ))}
                  {searchValue.trim() && !site.nav.some(([label]) => label.toLowerCase().includes(searchValue.trim().toLowerCase())) && (
                    <span>{locale === "en" ? "No page found" : "Aucune page trouvée"}</span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </header>
      <nav
        ref={navRef}
        className={`mobile-menu ${open ? "open" : ""}`}
        id="mobile-navigation"
        aria-label={copy.mobileNavLabel}
        aria-hidden={!open}
        onClick={(event)=>{if(event.target===event.currentTarget)setOpen(false);}}
      >
        {mainNavLinks.map(([label,path],index) => <Link className={pathname===path ? "active" : ""} style={{transitionDelay:open ? `${index*55}ms` : "0ms"}} href={path} key={path} onClick={()=>{setOpen(false);setExploreOpen(false);}}>{label}</Link>)}
        <div className="mobile-explore-group">
          <button
            className={`mobile-explore-toggle ${exploreIsActive ? "active" : ""}`}
            type="button"
            aria-expanded={exploreOpen}
            aria-controls="mobile-explore-links"
            style={{transitionDelay:open ? `${mainNavLinks.length*55}ms` : "0ms"}}
            onClick={() => setExploreOpen((value) => !value)}
          >
            {copy.navExplore}
            <ChevronDown size={20} aria-hidden="true" />
          </button>
          <div className="mobile-explore-links" id="mobile-explore-links" hidden={!exploreOpen}>
            {exploreLinks.map(([label,path],index) => (
              <Link
                className={pathname===path ? "active" : ""}
                style={{transitionDelay:open && exploreOpen ? `${(mainNavLinks.length+index+1)*45}ms` : "0ms"}}
                href={path}
                key={path}
                onClick={() => {setOpen(false); setExploreOpen(false);}}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
        <Link className="nav-cta" href={locale === "en" ? "/en/contact" : "/contact"} onClick={()=>{setOpen(false);setExploreOpen(false);}}>{copy.navCta} <ArrowUpRight className="action-icon" size={14} strokeWidth={1.8} aria-hidden="true" /></Link>
      </nav>
    </>
  );
}
