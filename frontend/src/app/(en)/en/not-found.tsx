import Link from "next/link";
import { ui } from "@/content/ui";

export default function EnglishNotFound() {
  const copy = ui.en.notFound;
  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "#0E1D3C", color: "white", textAlign: "center", padding: "24px" }}>
      <div>
        <span style={{ color: "#f2b632", letterSpacing: ".18em", fontSize: "11px" }}>{copy.label}</span>
        <h1 className="serif" style={{ fontSize: "64px", margin: "18px 0" }}>{copy.title}</h1>
        <Link className="button" href="/en">{copy.home}</Link>
      </div>
    </main>
  );
}
