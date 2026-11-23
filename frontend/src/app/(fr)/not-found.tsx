export default function NotFound() {
  return (
    <main style={{minHeight:"100vh",display:"grid",placeItems:"center",background:"#0b1f3a",color:"white",textAlign:"center",padding:"24px"}}>
      <div><span style={{color:"#f2b632",letterSpacing:".18em",fontSize:"11px"}}>ERREUR 404</span><h1 className="serif" style={{fontSize:"64px",margin:"18px 0"}}>Cette page s’est déplacée.</h1><a className="button" href="/">Retour à l’accueil</a></div>
    </main>
  );
}
