import { useState, createContext, useContext, useEffect } from "react";

// ─── RESPONSIVE HOOK ─────────────────────────────────────────────────────────
function useWindowSize() {
  const [size, setSize] = useState({ width: window.innerWidth });
  useEffect(() => {
    const handler = () => setSize({ width: window.innerWidth });
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return size;
}

// ─── DATA ────────────────────────────────────────────────────────────────────
const PRODUCTS = [
  { id: 1, name: "Panneau Solaire 400W Monocristallin", category: "solaire", price: 185000, badge: "Populaire", emoji: "🌞", desc: "Haute efficacité 21%, certifié IEC 61215, garantie 25 ans sur le rendement.", specs: ["Puissance: 400W", "Efficacité: 21%", "Dimensions: 1755×1038mm", "Garantie: 25 ans"] },
  { id: 2, name: "Batterie Lithium LiFePO4 200Ah", category: "solaire", price: 320000, badge: "Nouveau", emoji: "🔋", desc: "Technologie fer-phosphate, 6000 cycles, BMS intégré, sécurité thermique optimale.", specs: ["Capacité: 200Ah / 25.6kWh", "Cycles: 6000+", "Garantie: 10 ans", "Température: -20°C à 60°C"] },
  { id: 3, name: "Onduleur Hybride NPlus 5KW", category: "solaire", price: 275000, badge: null, emoji: "⚡", desc: "Hybride solaire/réseau avec MPPT intégré, écran LCD couleur, WiFi monitoring.", specs: ["Puissance: 5KW", "MPPT: 80A", "Efficacité: 98%", "Monitoring WiFi inclus"] },
  { id: 4, name: "Kit Solaire Résidentiel 3KW", category: "kits", price: 890000, badge: "Clé en main", emoji: "🏠", desc: "Kit complet : 8 panneaux 375W + batterie 150Ah + onduleur + câblage + installation.", specs: ["Production: 12-15 kWh/jour", "Panneaux: 8×375W", "Stockage: 150Ah", "Installation incluse"] },
  { id: 5, name: "Kit Solaire Industriel 20KW", category: "kits", price: 4500000, badge: "Pro", emoji: "🏭", desc: "Solution industrielle complète pour entreprises, écoles, cliniques.", specs: ["Production: 80+ kWh/jour", "Panneaux: 50×400W", "Batteries: 400Ah Lithium", "Monitoring SCADA"] },
  { id: 6, name: "Groupe Électrogène 50KVA", category: "energie", price: 1200000, badge: null, emoji: "🔌", desc: "Diesel insonorisé, démarrage automatique, tableau de bord numérique.", specs: ["Puissance: 50KVA", "Carburant: Diesel", "Démarrage: Automatique", "Insonorisé: 65dB"] },
  { id: 7, name: "Antenne VSAT Ku-Band 1.8m", category: "telecom", price: 750000, badge: "Connectivité", emoji: "📡", desc: "Connectivité satellite haut débit jusqu'à 100Mbps, zones reculées, installation incluse.", specs: ["Débit: jusqu'à 100Mbps", "Diamètre: 1.8m", "Bande: Ku-Band", "Latence: <600ms"] },
  { id: 8, name: "Solution 5G Rurale — Pack Complet", category: "telecom", price: 2800000, badge: "Nouveau", emoji: "📶", desc: "Déploiement réseau 5G en zone rurale, couverture 10km², équipements Huawei certifiés.", specs: ["Couverture: 10km²", "Standard: 5G NR", "Capacité: 1000+ utilisateurs", "Garantie: 3 ans"] },
  { id: 9, name: "Station de Base GSM/4G", category: "telecom", price: 5500000, badge: "Enterprise", emoji: "🗼", desc: "Infrastructure télécoms complète pour opérateurs, déploiement clé en main au Niger.", specs: ["Standard: 4G LTE / GSM", "Portée: 30km rural", "Alimentation: Solaire", "Installation: 2 semaines"] },
];

const SERVICES = [
  { id: 1, icon: "☀️", title: "Études & Dimensionnement", desc: "Audit énergétique gratuit, dimensionnement personnalisé selon vos besoins réels." },
  { id: 2, icon: "🔧", title: "Installation Professionnelle", desc: "Techniciens certifiés, installation selon normes IEC, partout au Niger." },
  { id: 3, icon: "🛡️", title: "Maintenance & SAV", desc: "Contrats de maintenance préventive, support 24/7, pièces de rechange garanties." },
  { id: 4, icon: "📊", title: "Monitoring à Distance", desc: "Suivi en temps réel de votre installation via application mobile ou web dashboard." },
  { id: 5, icon: "🏗️", title: "Projets Clé en Main", desc: "De la conception à la mise en service, nous gérons l'intégralité de votre projet." },
  { id: 6, icon: "🎓", title: "Formation Technique", desc: "Formation de vos équipes à l'utilisation et à la maintenance de vos équipements." },
];

// ─── CONTEXT ─────────────────────────────────────────────────────────────────
const CartContext = createContext();
function useCart() { return useContext(CartContext); }

function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const add = (product) => setItems(prev => {
    const ex = prev.find(i => i.id === product.id);
    return ex ? prev.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i) : [...prev, { ...product, qty: 1 }];
  });
  const remove = (id) => setItems(prev => prev.filter(i => i.id !== id));
  const updateQty = (id, qty) => qty < 1 ? remove(id) : setItems(prev => prev.map(i => i.id === id ? { ...i, qty } : i));
  const total = items.reduce((s, i) => s + i.price * i.qty, 0);
  const count = items.reduce((s, i) => s + i.qty, 0);
  return <CartContext.Provider value={{ items, add, remove, updateQty, total, count }}>{children}</CartContext.Provider>;
}

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const fmt = (n) => new Intl.NumberFormat('fr-FR').format(n) + ' FCFA';
const CAT_LABELS = { all: "Tous", solaire: "Panneaux Solaires", kits: "Kits Complets", energie: "Énergie", telecom: "Télécom" };

// ─── STYLES RESPONSIVE ───────────────────────────────────────────────────────
const styles = {
  // Grid responsive
  grid3: (isMobile, isTablet) => ({
    display: "grid",
    gridTemplateColumns: isMobile ? "1fr" : isTablet ? "repeat(2,1fr)" : "repeat(3,1fr)",
    gap: isMobile ? "1rem" : "1.5rem",
  }),
  grid4stats: (isMobile) => ({
    display: "grid",
    gridTemplateColumns: isMobile ? "repeat(2,1fr)" : "repeat(4,1fr)",
  }),
  grid2: (isMobile) => ({
    display: "grid",
    gridTemplateColumns: isMobile ? "1fr" : "1fr 1.2fr",
    gap: isMobile ? "2rem" : "3rem",
    alignItems: "start",
  }),
  grid2contact: (isMobile) => ({
    display: "grid",
    gridTemplateColumns: isMobile ? "1fr" : "1fr 1.5fr",
    gap: isMobile ? "2rem" : "3rem",
    alignItems: "start",
  }),
  gridCart: (isMobile) => ({
    display: "grid",
    gridTemplateColumns: isMobile ? "1fr" : "1.5fr 1fr",
    gap: "2rem",
    alignItems: "start",
  }),
};

// ─── COMPONENTS ──────────────────────────────────────────────────────────────

function Navbar({ page, setPage }) {
  const { count } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const { width } = useWindowSize();
  const isMobile = width < 768;

  const links = [
    { id: "home", label: "Accueil" },
    { id: "shop", label: "Boutique" },
    { id: "services", label: "Services" },
    { id: "telecom", label: "Télécom" },
    { id: "contact", label: "Contact" },
  ];

  const navigate = (id) => { setPage(id); setMenuOpen(false); };

  return (
    <nav style={{ background: "linear-gradient(90deg,#0d3d1e 0%,#1a6632 100%)", position: "sticky", top: 0, zIndex: 100, boxShadow: "0 2px 20px rgba(0,0,0,0.4)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 1rem", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
        {/* LOGO */}
        <button onClick={() => navigate("home")} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 38, height: 38, borderRadius: "50%", background: "#f5a623", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 14, color: "#0d3d1e", flexShrink: 0 }}>E</div>
          <div style={{ textAlign: "left" }}>
            <div style={{ fontFamily: "Georgia, serif", fontWeight: 700, fontSize: isMobile ? 14 : 17, color: "white", lineHeight: 1.1 }}>EATEL Niger</div>
            {!isMobile && <div style={{ fontSize: 10, color: "rgba(255,255,255,0.55)", letterSpacing: 1 }}>SARL · Énergie & Télécom</div>}
          </div>
        </button>

        {/* DESKTOP NAV */}
        {!isMobile && (
          <div style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
            {links.map(l => (
              <button key={l.id} onClick={() => navigate(l.id)}
                style={{ background: "none", border: "none", cursor: "pointer", color: page === l.id ? "#f5a623" : "rgba(255,255,255,0.8)", fontWeight: 600, fontSize: 14, padding: "4px 0", borderBottom: page === l.id ? "2px solid #f5a623" : "2px solid transparent", transition: "all 0.2s" }}>
                {l.label}
              </button>
            ))}
          </div>
        )}

        {/* RIGHT SIDE */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button onClick={() => navigate("cart")} style={{ background: "rgba(245,166,35,0.15)", border: "1.5px solid rgba(245,166,35,0.5)", borderRadius: 8, padding: isMobile ? "7px 10px" : "7px 14px", cursor: "pointer", color: "white", display: "flex", alignItems: "center", gap: 6, fontWeight: 600, fontSize: 13 }}>
            🛒 {!isMobile && "Panier"}
            {count > 0 && <span style={{ background: "#f5a623", color: "#0d3d1e", borderRadius: 10, fontSize: 11, fontWeight: 900, padding: "1px 7px" }}>{count}</span>}
          </button>
          {/* BURGER */}
          {isMobile && (
            <button onClick={() => setMenuOpen(!menuOpen)} style={{ background: "none", border: "none", cursor: "pointer", color: "white", fontSize: 22, padding: 4 }}>
              {menuOpen ? "✕" : "☰"}
            </button>
          )}
        </div>
      </div>

      {/* MOBILE MENU */}
      {isMobile && menuOpen && (
        <div style={{ background: "#0d3d1e", borderTop: "1px solid rgba(255,255,255,0.1)", padding: "0.5rem 0" }}>
          {links.map(l => (
            <button key={l.id} onClick={() => navigate(l.id)}
              style={{ display: "block", width: "100%", textAlign: "left", background: page === l.id ? "rgba(245,166,35,0.1)" : "none", border: "none", cursor: "pointer", color: page === l.id ? "#f5a623" : "rgba(255,255,255,0.85)", fontWeight: 600, fontSize: 15, padding: "12px 1.5rem", borderLeft: page === l.id ? "3px solid #f5a623" : "3px solid transparent" }}>
              {l.label}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
}

function Footer({ setPage }) {
  const { width } = useWindowSize();
  const isMobile = width < 768;
  return (
    <footer style={{ background: "#071a0d", color: "rgba(255,255,255,0.6)", padding: isMobile ? "2rem 1rem 1.5rem" : "3rem 2rem 2rem" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: isMobile ? "1fr" : "2fr 1fr 1fr", gap: isMobile ? "1.5rem" : "3rem", marginBottom: "2rem" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "1rem" }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#f5a623", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 13, color: "#071a0d" }}>E</div>
            <span style={{ fontFamily: "Georgia, serif", fontWeight: 700, fontSize: 15, color: "white" }}>EATEL Niger SARL</span>
          </div>
          <p style={{ fontSize: 13, lineHeight: 1.7, maxWidth: 300 }}>Votre partenaire de confiance en énergie solaire, solutions énergétiques et services télécom à travers tout le Niger.</p>
        </div>
        {!isMobile && (
          <div>
            <div style={{ color: "#f5a623", fontWeight: 700, marginBottom: "1rem", fontSize: 12, textTransform: "uppercase", letterSpacing: 1 }}>Navigation</div>
            {["home","shop","services","telecom","contact"].map(p => (
              <button key={p} onClick={() => setPage(p)} style={{ display: "block", background: "none", border: "none", color: "rgba(255,255,255,0.6)", cursor: "pointer", fontSize: 13, marginBottom: 8, padding: 0, textAlign: "left" }}>
                {p === "home" ? "Accueil" : p === "shop" ? "Boutique" : p === "services" ? "Services" : p === "telecom" ? "Télécom" : "Contact"}
              </button>
            ))}
          </div>
        )}
        <div>
          <div style={{ color: "#f5a623", fontWeight: 700, marginBottom: "1rem", fontSize: 12, textTransform: "uppercase", letterSpacing: 1 }}>Contact</div>
          <div style={{ fontSize: 13, lineHeight: 2 }}>
            <div>📞 +227 91 92 12 52</div>
            <div>✉️ ihamidoumaiga@icloud.com</div>
            <div>📍 Niamey, Niger</div>
            <div>🕐 Lun–Sam 8h–18h</div>
          </div>
        </div>
      </div>
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "1.5rem", textAlign: "center", fontSize: 12 }}>
        © 2025 EATEL Niger SARL · Énergie Solaire · Télécom · Innovation Durable
      </div>
    </footer>
  );
}

function ProductCard({ product, onView }) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);
  const handleAdd = () => { add(product); setAdded(true); setTimeout(() => setAdded(false), 1800); };
  const catColor = { solaire: "#fff3cd", kits: "#d4edda", energie: "#d1ecf1", telecom: "#e2d9f3" };
  const catText = { solaire: "#856404", kits: "#155724", energie: "#0c5460", telecom: "#491f87" };
  return (
    <div style={{ background: "white", borderRadius: 16, border: "1px solid #e8ede9", overflow: "hidden", display: "flex", flexDirection: "column", transition: "all 0.25s", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(26,102,50,0.15)"; }}
      onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.06)"; }}>
      <div style={{ height: 140, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "4rem", background: "linear-gradient(135deg,#f0f9f2,#e0f2e5)", position: "relative" }}>
        {product.badge && (
          <span style={{ position: "absolute", top: 10, left: 10, background: product.badge === "Nouveau" ? "#1a6632" : "#f5a623", color: product.badge === "Nouveau" ? "white" : "#0d3d1e", fontSize: 10, fontWeight: 700, padding: "3px 9px", borderRadius: 10 }}>{product.badge}</span>
        )}
        {product.emoji}
      </div>
      <div style={{ padding: "1rem", flexGrow: 1, display: "flex", flexDirection: "column" }}>
        <span style={{ background: catColor[product.category] || "#f0f9f2", color: catText[product.category] || "#155724", fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 8, alignSelf: "flex-start", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>
          {CAT_LABELS[product.category]}
        </span>
        <h3 style={{ fontFamily: "Georgia, serif", fontWeight: 700, fontSize: "0.9rem", marginBottom: 6, lineHeight: 1.35, color: "#0d2d14" }}>{product.name}</h3>
        <p style={{ fontSize: 12, color: "#6b7c6e", lineHeight: 1.5, flexGrow: 1, marginBottom: 12 }}>{product.desc}</p>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginTop: "auto" }}>
          <div>
            <div style={{ fontFamily: "Georgia, serif", fontWeight: 700, fontSize: "0.9rem", color: "#0d3d1e" }}>{fmt(product.price)}</div>
            <div style={{ fontSize: 10, color: "#9eada1" }}>Prix indicatif</div>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            <button onClick={() => onView(product)} style={{ background: "none", border: "1.5px solid #1a6632", color: "#1a6632", padding: "6px 10px", borderRadius: 8, cursor: "pointer", fontSize: 12, fontWeight: 600 }}>Détails</button>
            <button onClick={handleAdd} style={{ background: added ? "#1a6632" : "#f5a623", border: "none", color: added ? "white" : "#0d3d1e", padding: "6px 12px", borderRadius: 8, cursor: "pointer", fontSize: 12, fontWeight: 700, transition: "all 0.2s", whiteSpace: "nowrap" }}>
              {added ? "✓" : "+ Devis"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ServiceCard({ service }) {
  return (
    <div style={{ background: "white", borderRadius: 16, padding: "1.5rem", border: "1px solid #e8ede9", transition: "all 0.25s", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = "#1a6632"; e.currentTarget.style.transform = "translateY(-4px)"; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = "#e8ede9"; e.currentTarget.style.transform = ""; }}>
      <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>{service.icon}</div>
      <h3 style={{ fontFamily: "Georgia, serif", fontWeight: 700, fontSize: "1rem", color: "#0d2d14", marginBottom: 8 }}>{service.title}</h3>
      <p style={{ fontSize: 13, color: "#6b7c6e", lineHeight: 1.6 }}>{service.desc}</p>
    </div>
  );
}

// ─── PAGES ───────────────────────────────────────────────────────────────────

function HomePage({ setPage, setSelectedProduct }) {
  const { width } = useWindowSize();
  const isMobile = width < 768;
  const isTablet = width >= 768 && width < 1024;
  const featuredProducts = PRODUCTS.slice(0, 3);

  return (
    <div>
      {/* HERO */}
      <section style={{ background: "linear-gradient(135deg,#071a0d 0%,#0d3d1e 40%,#1a6632 100%)", padding: isMobile ? "3rem 1rem 2.5rem" : "6rem 2rem 5rem", position: "relative", overflow: "hidden" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(245,166,35,0.15)", border: "1px solid rgba(245,166,35,0.4)", borderRadius: 20, padding: "5px 14px", marginBottom: "1.25rem" }}>
            <span style={{ fontSize: 11 }}>⚡</span>
            <span style={{ color: "#f5a623", fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase" }}>Énergie & Télécom — Niger</span>
          </div>
          <h1 style={{ fontFamily: "Georgia, serif", fontWeight: 700, fontSize: isMobile ? "2rem" : "3.5rem", color: "white", lineHeight: 1.15, marginBottom: "1.25rem", maxWidth: 700 }}>
            Ensemble, éclairons<br />
            <span style={{ color: "#f5a623" }}>l'avenir du Niger</span>
          </h1>
          <p style={{ color: "rgba(255,255,255,0.75)", fontSize: isMobile ? "0.95rem" : "1.1rem", lineHeight: 1.7, maxWidth: 560, marginBottom: "2rem" }}>
            Solutions solaires certifiées, systèmes énergétiques fiables et connectivité télécom avancée.
          </p>
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            <button onClick={() => setPage("shop")} style={{ background: "#f5a623", color: "#0d3d1e", border: "none", padding: isMobile ? "12px 24px" : "14px 32px", borderRadius: 10, fontWeight: 700, fontSize: isMobile ? 14 : 15, cursor: "pointer", fontFamily: "Georgia, serif" }}>
              Voir nos produits →
            </button>
            <button onClick={() => setPage("contact")} style={{ background: "transparent", color: "white", border: "2px solid rgba(255,255,255,0.4)", padding: isMobile ? "12px 24px" : "14px 32px", borderRadius: 10, fontWeight: 600, fontSize: isMobile ? 14 : 15, cursor: "pointer" }}>
              Demander un devis
            </button>
          </div>
        </div>
      </section>

      {/* STATS BAR */}
      <div style={{ background: "#1a6632", ...styles.grid4stats(isMobile), textAlign: "center" }}>
        {[["500+","Installations"], ["8","Régions Niger"], ["15+","Ans d'expérience"], ["24/7","Support"]].map(([n, l]) => (
          <div key={l} style={{ padding: isMobile ? "1rem" : "1.5rem", borderRight: "1px solid rgba(255,255,255,0.12)" }}>
            <div style={{ fontFamily: "Georgia, serif", fontWeight: 700, fontSize: isMobile ? "1.5rem" : "2rem", color: "#f5a623" }}>{n}</div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.75)" }}>{l}</div>
          </div>
        ))}
      </div>

      {/* FEATURED PRODUCTS */}
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: isMobile ? "2.5rem 1rem" : "5rem 2rem" }}>
        <div style={{ textAlign: "center", marginBottom: isMobile ? "1.5rem" : "3rem" }}>
          <span style={{ background: "#e8f5eb", color: "#1a6632", fontSize: 11, fontWeight: 700, padding: "4px 14px", borderRadius: 20, textTransform: "uppercase", letterSpacing: 1 }}>Produits phares</span>
          <h2 style={{ fontFamily: "Georgia, serif", fontWeight: 700, fontSize: isMobile ? "1.6rem" : "2.2rem", color: "#0d2d14", marginTop: "0.75rem", marginBottom: "0.5rem" }}>Nos meilleures solutions</h2>
          <p style={{ color: "#6b7c6e", fontSize: "0.95rem" }}>Matériel certifié, livraison et installation dans tout le Niger</p>
        </div>
        <div style={{ ...styles.grid3(isMobile, isTablet), marginBottom: "2rem" }}>
          {featuredProducts.map(p => <ProductCard key={p.id} product={p} onView={(prod) => { setSelectedProduct(prod); setPage("product"); }} />)}
        </div>
        <div style={{ textAlign: "center" }}>
          <button onClick={() => setPage("shop")} style={{ background: "#1a6632", color: "white", border: "none", padding: "12px 32px", borderRadius: 10, fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "Georgia, serif" }}>
            Voir tout le catalogue →
          </button>
        </div>
      </section>

      {/* WHY US */}
      <section style={{ background: "#f5faf6", padding: isMobile ? "2.5rem 1rem" : "5rem 2rem" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: isMobile ? "1.5rem" : "3rem" }}>
            <span style={{ background: "#e8f5eb", color: "#1a6632", fontSize: 11, fontWeight: 700, padding: "4px 14px", borderRadius: 20, textTransform: "uppercase", letterSpacing: 1 }}>Pourquoi EATEL ?</span>
            <h2 style={{ fontFamily: "Georgia, serif", fontWeight: 700, fontSize: isMobile ? "1.6rem" : "2.2rem", color: "#0d2d14", marginTop: "0.75rem" }}>Votre partenaire de confiance</h2>
          </div>
          <div style={{ ...styles.grid3(isMobile, isTablet) }}>
            {[
              { icon: "🏆", title: "Matériel Certifié", desc: "Tous nos produits sont certifiés IEC, CE et conformes aux standards internationaux." },
              { icon: "🌍", title: "Couverture Nationale", desc: "Interventions dans les 8 régions du Niger, même dans les zones les plus reculées." },
              { icon: "💼", title: "Clé en Main", desc: "De l'étude technique à la mise en service, nous gérons tout pour vous." },
            ].map(w => (
              <div key={w.title} style={{ textAlign: "center", padding: "1.5rem", background: "white", borderRadius: 16, border: "1px solid #e8ede9" }}>
                <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>{w.icon}</div>
                <h3 style={{ fontFamily: "Georgia, serif", fontWeight: 700, fontSize: "1rem", color: "#0d2d14", marginBottom: 8 }}>{w.title}</h3>
                <p style={{ fontSize: 13, color: "#6b7c6e", lineHeight: 1.6 }}>{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: "linear-gradient(135deg,#0d3d1e,#1a6632)", padding: isMobile ? "3rem 1rem" : "5rem 2rem", textAlign: "center" }}>
        <h2 style={{ fontFamily: "Georgia, serif", fontWeight: 700, fontSize: isMobile ? "1.5rem" : "2rem", color: "white", marginBottom: "0.75rem" }}>Prêt à passer à l'énergie solaire ?</h2>
        <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "0.95rem", marginBottom: "1.5rem" }}>Obtenez une étude gratuite et un devis personnalisé sous 48h</p>
        <button onClick={() => setPage("contact")} style={{ background: "#f5a623", color: "#0d3d1e", border: "none", padding: "14px 36px", borderRadius: 10, fontWeight: 700, fontSize: 15, cursor: "pointer", fontFamily: "Georgia, serif" }}>
          Demander mon devis gratuit →
        </button>
      </section>
    </div>
  );
}

function ShopPage({ setPage, setSelectedProduct }) {
  const [cat, setCat] = useState("all");
  const [search, setSearch] = useState("");
  const { width } = useWindowSize();
  const isMobile = width < 768;
  const isTablet = width >= 768 && width < 1024;
  const cats = Object.keys(CAT_LABELS);
  const filtered = PRODUCTS.filter(p => (cat === "all" || p.category === cat) && p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: isMobile ? "1.5rem 1rem" : "3rem 2rem" }}>
      <div style={{ marginBottom: "1.5rem" }}>
        <h1 style={{ fontFamily: "Georgia, serif", fontWeight: 700, fontSize: isMobile ? "1.6rem" : "2.2rem", color: "#0d2d14", marginBottom: 6 }}>Notre Catalogue</h1>
        <p style={{ color: "#6b7c6e", fontSize: 13 }}>Matériel certifié — Installation dans tout le Niger</p>
      </div>

      {/* FILTERS */}
      <div style={{ marginBottom: "1.5rem" }}>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: "0.75rem" }}>
          {cats.map(c => (
            <button key={c} onClick={() => setCat(c)} style={{ background: cat === c ? "#1a6632" : "white", color: cat === c ? "white" : "#4b6350", border: "1.5px solid", borderColor: cat === c ? "#1a6632" : "#d4e0d6", padding: "6px 14px", borderRadius: 8, cursor: "pointer", fontWeight: 600, fontSize: 12, transition: "all 0.15s" }}>
              {CAT_LABELS[c]}
            </button>
          ))}
        </div>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher un produit..." style={{ border: "1.5px solid #d4e0d6", borderRadius: 8, padding: "8px 14px", fontSize: 13, outline: "none", width: "100%", maxWidth: 300, color: "#0d2d14", boxSizing: "border-box" }} />
      </div>

      <div style={{ marginBottom: "0.75rem", fontSize: 13, color: "#9eada1" }}>{filtered.length} produit{filtered.length > 1 ? "s" : ""} trouvé{filtered.length > 1 ? "s" : ""}</div>
      <div style={{ ...styles.grid3(isMobile, isTablet) }}>
        {filtered.map(p => <ProductCard key={p.id} product={p} onView={(prod) => { setSelectedProduct(prod); setPage("product"); }} />)}
      </div>
      {filtered.length === 0 && (
        <div style={{ textAlign: "center", padding: "3rem", color: "#9eada1" }}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🔍</div>
          <p>Aucun produit trouvé.</p>
        </div>
      )}
    </div>
  );
}

function ProductDetailPage({ product, setPage }) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);
  const { width } = useWindowSize();
  const isMobile = width < 768;
  if (!product) return <div style={{ textAlign: "center", padding: "4rem" }}><p>Produit introuvable.</p></div>;
  const handleAdd = () => { add(product); setAdded(true); setTimeout(() => setAdded(false), 2000); };

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: isMobile ? "1.5rem 1rem" : "3rem 2rem" }}>
      <button onClick={() => setPage("shop")} style={{ background: "none", border: "none", color: "#1a6632", cursor: "pointer", fontWeight: 600, fontSize: 13, marginBottom: "1.5rem", padding: 0, display: "flex", alignItems: "center", gap: 4 }}>
        ← Retour au catalogue
      </button>
      <div style={{ ...styles.grid2(isMobile) }}>
        <div style={{ background: "linear-gradient(135deg,#f0f9f2,#e0f2e5)", borderRadius: 20, padding: isMobile ? "2.5rem" : "4rem", textAlign: "center", fontSize: isMobile ? "5rem" : "8rem" }}>
          {product.emoji}
        </div>
        <div>
          <span style={{ background: "#e8f5eb", color: "#1a6632", fontSize: 11, fontWeight: 700, padding: "3px 12px", borderRadius: 10, textTransform: "uppercase", letterSpacing: 0.5 }}>{CAT_LABELS[product.category]}</span>
          {product.badge && <span style={{ marginLeft: 8, background: "#f5a623", color: "#0d3d1e", fontSize: 11, fontWeight: 700, padding: "3px 12px", borderRadius: 10 }}>{product.badge}</span>}
          <h1 style={{ fontFamily: "Georgia, serif", fontWeight: 700, fontSize: isMobile ? "1.4rem" : "1.8rem", color: "#0d2d14", margin: "0.75rem 0", lineHeight: 1.25 }}>{product.name}</h1>
          <p style={{ fontSize: "0.95rem", color: "#4b6350", lineHeight: 1.7, marginBottom: "1.5rem" }}>{product.desc}</p>
          <div style={{ background: "#f5faf6", borderRadius: 12, padding: "1.25rem", marginBottom: "1.5rem" }}>
            <div style={{ fontWeight: 700, color: "#0d2d14", marginBottom: "0.75rem", fontSize: 13, textTransform: "uppercase", letterSpacing: 0.5 }}>Caractéristiques techniques</div>
            {product.specs.map(s => (
              <div key={s} style={{ display: "flex", alignItems: "center", gap: 8, padding: "5px 0", borderBottom: "1px solid #e8ede9", fontSize: 13, color: "#4b6350" }}>
                <span style={{ color: "#1a6632", fontWeight: 700 }}>✓</span> {s}
              </div>
            ))}
          </div>
          <div style={{ marginBottom: "1.25rem" }}>
            <div style={{ fontFamily: "Georgia, serif", fontWeight: 700, fontSize: "1.4rem", color: "#0d2d14" }}>{fmt(product.price)}</div>
            <div style={{ fontSize: 12, color: "#9eada1" }}>Prix indicatif HT · Livraison incluse au Niger</div>
          </div>
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: isMobile ? "wrap" : "nowrap" }}>
            <button onClick={handleAdd} style={{ background: added ? "#155724" : "#f5a623", color: added ? "white" : "#0d3d1e", border: "none", padding: "12px 24px", borderRadius: 10, fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "Georgia, serif", transition: "all 0.2s", flex: 1, minWidth: 140 }}>
              {added ? "✓ Ajouté au panier" : "Ajouter au devis"}
            </button>
            <button onClick={() => setPage("contact")} style={{ background: "#1a6632", color: "white", border: "none", padding: "12px 20px", borderRadius: 10, fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
              Devis rapide
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function CartPage({ setPage }) {
  const { items, remove, updateQty, total } = useCart();
  const { width } = useWindowSize();
  const isMobile = width < 768;

  if (items.length === 0) return (
    <div style={{ textAlign: "center", padding: "5rem 1rem" }}>
      <div style={{ fontSize: "3.5rem", marginBottom: "1rem" }}>🛒</div>
      <h2 style={{ fontFamily: "Georgia, serif", fontWeight: 700, color: "#0d2d14", marginBottom: "1rem" }}>Votre panier est vide</h2>
      <button onClick={() => setPage("shop")} style={{ background: "#1a6632", color: "white", border: "none", padding: "12px 26px", borderRadius: 10, fontWeight: 700, cursor: "pointer", fontSize: 14 }}>Voir le catalogue</button>
    </div>
  );

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: isMobile ? "1.5rem 1rem" : "3rem 2rem" }}>
      <h1 style={{ fontFamily: "Georgia, serif", fontWeight: 700, fontSize: isMobile ? "1.5rem" : "2rem", color: "#0d2d14", marginBottom: "1.5rem" }}>Votre sélection — Demande de devis</h1>
      <div style={{ ...styles.gridCart(isMobile) }}>
        <div>
          {items.map(item => (
            <div key={item.id} style={{ background: "white", borderRadius: 12, padding: "1rem", marginBottom: "0.75rem", border: "1px solid #e8ede9", display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <div style={{ fontSize: "2rem", background: "#f0f9f2", borderRadius: 8, width: 52, height: 52, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{item.emoji}</div>
              <div style={{ flexGrow: 1, minWidth: 0 }}>
                <div style={{ fontFamily: "Georgia, serif", fontWeight: 700, fontSize: "0.85rem", color: "#0d2d14", marginBottom: 3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: isMobile ? "normal" : "nowrap" }}>{item.name}</div>
                <div style={{ fontSize: 12, color: "#1a6632", fontWeight: 700 }}>{fmt(item.price)}</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
                <button onClick={() => updateQty(item.id, item.qty - 1)} style={{ width: 26, height: 26, borderRadius: 6, border: "1.5px solid #d4e0d6", background: "white", cursor: "pointer", fontWeight: 700 }}>-</button>
                <span style={{ fontWeight: 700, minWidth: 20, textAlign: "center", fontSize: 14 }}>{item.qty}</span>
                <button onClick={() => updateQty(item.id, item.qty + 1)} style={{ width: 26, height: 26, borderRadius: 6, border: "1.5px solid #d4e0d6", background: "white", cursor: "pointer", fontWeight: 700 }}>+</button>
              </div>
              <button onClick={() => remove(item.id)} style={{ background: "none", border: "none", color: "#c0392b", cursor: "pointer", fontSize: 16, padding: "0 2px", flexShrink: 0 }}>✕</button>
            </div>
          ))}
        </div>
        <div style={{ background: "white", borderRadius: 16, padding: "1.25rem", border: "1px solid #e8ede9", position: isMobile ? "static" : "sticky", top: 80 }}>
          <h3 style={{ fontFamily: "Georgia, serif", fontWeight: 700, color: "#0d2d14", marginBottom: "1.25rem", fontSize: "1rem" }}>Récapitulatif</h3>
          {items.map(i => (
            <div key={i.id} style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#6b7c6e", marginBottom: 6 }}>
              <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "60%" }}>{i.name.substring(0, 22)}… ×{i.qty}</span>
              <span style={{ fontWeight: 600, flexShrink: 0 }}>{fmt(i.price * i.qty)}</span>
            </div>
          ))}
          <div style={{ borderTop: "2px solid #e8ede9", marginTop: "0.75rem", paddingTop: "0.75rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "Georgia, serif", fontWeight: 700, fontSize: "1rem", color: "#0d2d14" }}>
              <span>Total estimé</span><span>{fmt(total)}</span>
            </div>
            <div style={{ fontSize: 11, color: "#9eada1", marginTop: 4 }}>Devis définitif fourni sous 24h</div>
          </div>
          <button onClick={() => setPage("contact")} style={{ width: "100%", background: "#f5a623", color: "#0d3d1e", border: "none", padding: "13px", borderRadius: 10, fontWeight: 700, fontSize: 14, cursor: "pointer", marginTop: "1.25rem", fontFamily: "Georgia, serif" }}>
            Envoyer la demande →
          </button>
          <button onClick={() => setPage("shop")} style={{ width: "100%", background: "none", color: "#1a6632", border: "1.5px solid #1a6632", padding: "11px", borderRadius: 10, fontWeight: 600, fontSize: 13, cursor: "pointer", marginTop: 8 }}>
            Continuer mes achats
          </button>
        </div>
      </div>
    </div>
  );
}

function ServicesPage({ setPage }) {
  const { width } = useWindowSize();
  const isMobile = width < 768;
  const isTablet = width >= 768 && width < 1024;
  return (
    <div>
      <div style={{ background: "linear-gradient(135deg,#071a0d,#1a6632)", padding: isMobile ? "3rem 1rem 2rem" : "4rem 2rem 3rem", textAlign: "center" }}>
        <span style={{ background: "rgba(245,166,35,0.2)", border: "1px solid rgba(245,166,35,0.4)", color: "#f5a623", fontSize: 11, fontWeight: 700, padding: "4px 14px", borderRadius: 20, textTransform: "uppercase", letterSpacing: 1 }}>Nos services</span>
        <h1 style={{ fontFamily: "Georgia, serif", fontWeight: 700, fontSize: isMobile ? "1.8rem" : "2.5rem", color: "white", marginTop: "1rem", marginBottom: "0.75rem" }}>Solutions clé en main</h1>
        <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "0.95rem", maxWidth: 500, margin: "0 auto" }}>De l'étude à la maintenance, EATEL vous accompagne à chaque étape.</p>
      </div>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: isMobile ? "2rem 1rem" : "4rem 2rem" }}>
        <div style={{ ...styles.grid3(isMobile, isTablet), marginBottom: "3rem" }}>
          {SERVICES.map(s => <ServiceCard key={s.id} service={s} />)}
        </div>
        <div style={{ background: "linear-gradient(135deg,#f0f9f2,#e0f2e5)", borderRadius: 20, padding: isMobile ? "2rem 1rem" : "3rem", textAlign: "center" }}>
          <h2 style={{ fontFamily: "Georgia, serif", fontWeight: 700, fontSize: isMobile ? "1.4rem" : "1.75rem", color: "#0d2d14", marginBottom: "0.75rem" }}>Besoin d'un devis personnalisé ?</h2>
          <p style={{ color: "#4b6350", marginBottom: "1.25rem", fontSize: 14 }}>Nos ingénieurs vous répondent sous 24h, partout au Niger.</p>
          <button onClick={() => setPage("contact")} style={{ background: "#1a6632", color: "white", border: "none", padding: "13px 28px", borderRadius: 10, fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "Georgia, serif" }}>
            Contacter un expert →
          </button>
        </div>
      </div>
    </div>
  );
}

function TelecomPage({ setPage }) {
  const telecomProducts = PRODUCTS.filter(p => p.category === "telecom");
  const [sel, setSel] = useState(null);
  const { add } = useCart();
  const { width } = useWindowSize();
  const isMobile = width < 768;
  const isTablet = width >= 768 && width < 1024;

  return (
    <div>
      <div style={{ background: "linear-gradient(135deg,#071a0d,#0d2d44)", padding: isMobile ? "3rem 1rem 2rem" : "4rem 2rem 3rem", textAlign: "center" }}>
        <span style={{ background: "rgba(59,130,246,0.2)", border: "1px solid rgba(59,130,246,0.4)", color: "#60a5fa", fontSize: 11, fontWeight: 700, padding: "4px 14px", borderRadius: 20, textTransform: "uppercase", letterSpacing: 1 }}>Télécom & Connectivité</span>
        <h1 style={{ fontFamily: "Georgia, serif", fontWeight: 700, fontSize: isMobile ? "1.8rem" : "2.5rem", color: "white", marginTop: "1rem", marginBottom: "0.75rem" }}>Infrastructure Télécom pour l'Afrique</h1>
        <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "0.95rem", maxWidth: 520, margin: "0 auto" }}>VSAT, 5G, stations de base — des solutions adaptées aux réalités du Niger.</p>
      </div>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: isMobile ? "2rem 1rem" : "4rem 2rem" }}>
        <div style={{ ...styles.grid3(isMobile, isTablet) }}>
          {telecomProducts.map(p => (
            <div key={p.id} style={{ background: "white", borderRadius: 16, border: "1.5px solid", borderColor: sel === p.id ? "#2563eb" : "#e8ede9", padding: "1.5rem", cursor: "pointer", transition: "all 0.2s", boxShadow: sel === p.id ? "0 8px 24px rgba(37,99,235,0.15)" : "0 2px 8px rgba(0,0,0,0.05)" }}
              onClick={() => setSel(sel === p.id ? null : p.id)}>
              <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>{p.emoji}</div>
              {p.badge && <span style={{ background: "#dbeafe", color: "#1d4ed8", fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 8 }}>{p.badge}</span>}
              <h3 style={{ fontFamily: "Georgia, serif", fontWeight: 700, fontSize: "0.95rem", color: "#0d2d14", margin: "0.6rem 0 0.4rem", lineHeight: 1.3 }}>{p.name}</h3>
              <p style={{ fontSize: 12, color: "#6b7c6e", lineHeight: 1.5, marginBottom: "0.75rem" }}>{p.desc}</p>
              {sel === p.id && (
                <div style={{ borderTop: "1px solid #e8ede9", paddingTop: "0.75rem" }}>
                  {p.specs.map(s => <div key={s} style={{ fontSize: 12, color: "#4b6350", padding: "3px 0", display: "flex", gap: 6 }}><span style={{ color: "#2563eb" }}>✓</span>{s}</div>)}
                  <div style={{ marginTop: "0.75rem", fontFamily: "Georgia, serif", fontWeight: 700, fontSize: "0.95rem", color: "#0d2d14", marginBottom: 8 }}>{fmt(p.price)}</div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={(e) => { e.stopPropagation(); add(p); }} style={{ background: "#2563eb", color: "white", border: "none", padding: "7px 14px", borderRadius: 8, cursor: "pointer", fontWeight: 700, fontSize: 12, flex: 1 }}>+ Devis</button>
                    <button onClick={(e) => { e.stopPropagation(); setPage("contact"); }} style={{ background: "none", border: "1.5px solid #2563eb", color: "#2563eb", padding: "7px 14px", borderRadius: 8, cursor: "pointer", fontWeight: 700, fontSize: 12 }}>Contact</button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);
  const { width } = useWindowSize();
  const isMobile = width < 768;
  const handleSubmit = () => { if (!form.name || !form.email || !form.message) return; setSent(true); };

  if (sent) return (
    <div style={{ maxWidth: 500, margin: "5rem auto", textAlign: "center", padding: "0 1rem" }}>
      <div style={{ fontSize: "3.5rem", marginBottom: "1.25rem" }}>✅</div>
      <h2 style={{ fontFamily: "Georgia, serif", fontWeight: 700, fontSize: "1.6rem", color: "#0d2d14", marginBottom: "0.75rem" }}>Message envoyé !</h2>
      <p style={{ color: "#4b6350", fontSize: "0.95rem", lineHeight: 1.6 }}>Notre équipe vous répondra sous 24h. Merci de votre confiance.</p>
      <button onClick={() => setSent(false)} style={{ marginTop: "1.5rem", background: "#1a6632", color: "white", border: "none", padding: "11px 24px", borderRadius: 10, fontWeight: 700, fontSize: 14, cursor: "pointer" }}>Nouveau message</button>
    </div>
  );

  const inp = { border: "1.5px solid #d4e0d6", borderRadius: 8, padding: "9px 12px", fontSize: 14, outline: "none", width: "100%", fontFamily: "inherit", color: "#0d2d14", background: "white", boxSizing: "border-box" };

  return (
    <div>
      <div style={{ background: "linear-gradient(135deg,#071a0d,#1a6632)", padding: isMobile ? "3rem 1rem 2rem" : "4rem 2rem 3rem", textAlign: "center" }}>
        <h1 style={{ fontFamily: "Georgia, serif", fontWeight: 700, fontSize: isMobile ? "1.8rem" : "2.5rem", color: "white", marginBottom: "0.5rem" }}>Contactez-nous</h1>
        <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "0.95rem" }}>Devis gratuit · Réponse sous 24h · Intervention nationale</p>
      </div>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: isMobile ? "2rem 1rem" : "4rem 2rem", ...styles.grid2contact(isMobile) }}>
        <div>
          <h2 style={{ fontFamily: "Georgia, serif", fontWeight: 700, fontSize: "1.3rem", color: "#0d2d14", marginBottom: "1.25rem" }}>Nos coordonnées</h2>
          {[
            { icon: "📞", label: "Téléphone", val: "+227 91 92 12 52" },
            { icon: "✉️", label: "Email", val: "ihamidoumaiga@icloud.com" },
            { icon: "📍", label: "Adresse", val: "Niamey, Niger" },
            { icon: "🕐", label: "Horaires", val: "Lun – Sam, 8h – 18h" },
          ].map(c => (
            <div key={c.label} style={{ display: "flex", gap: "0.75rem", padding: "0.75rem 0", borderBottom: "1px solid #e8ede9" }}>
              <div style={{ fontSize: "1.3rem", width: 34, textAlign: "center" }}>{c.icon}</div>
              <div>
                <div style={{ fontSize: 11, color: "#9eada1", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5 }}>{c.label}</div>
                <div style={{ fontWeight: 600, color: "#0d2d14", marginTop: 2, fontSize: 14 }}>{c.val}</div>
              </div>
            </div>
          ))}
          <div style={{ marginTop: "1.5rem", background: "#f0f9f2", borderRadius: 12, padding: "1rem", border: "1px solid #c8e6cb" }}>
            <div style={{ fontWeight: 700, color: "#1a6632", marginBottom: 4, fontSize: 14 }}>💬 WhatsApp disponible</div>
            <p style={{ fontSize: 13, color: "#4b6350" }}>Envoyez votre demande sur WhatsApp pour une réponse rapide.</p>
          </div>
        </div>
        <div style={{ background: "white", borderRadius: 20, padding: isMobile ? "1.5rem" : "2.5rem", border: "1px solid #e8ede9", boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}>
          <h2 style={{ fontFamily: "Georgia, serif", fontWeight: 700, fontSize: "1.3rem", color: "#0d2d14", marginBottom: "1.25rem" }}>Envoyer un message</h2>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "0.75rem", marginBottom: "0.75rem" }}>
            <div><label style={{ fontSize: 12, fontWeight: 600, color: "#4b6350", display: "block", marginBottom: 5 }}>Nom complet *</label><input style={inp} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Votre nom" /></div>
            <div><label style={{ fontSize: 12, fontWeight: 600, color: "#4b6350", display: "block", marginBottom: 5 }}>Email *</label><input style={inp} value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="votre@email.com" /></div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "0.75rem", marginBottom: "0.75rem" }}>
            <div><label style={{ fontSize: 12, fontWeight: 600, color: "#4b6350", display: "block", marginBottom: 5 }}>Téléphone</label><input style={inp} value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+227 ..." /></div>
            <div><label style={{ fontSize: 12, fontWeight: 600, color: "#4b6350", display: "block", marginBottom: 5 }}>Sujet</label>
              <select style={{ ...inp, cursor: "pointer" }} value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })}>
                <option value="">Choisir...</option>
                <option>Devis énergie solaire</option>
                <option>Installation</option>
                <option>Solutions télécom</option>
                <option>Maintenance & SAV</option>
                <option>Autre</option>
              </select>
            </div>
          </div>
          <div style={{ marginBottom: "1.25rem" }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: "#4b6350", display: "block", marginBottom: 5 }}>Message *</label>
            <textarea style={{ ...inp, minHeight: 120, resize: "vertical" }} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} placeholder="Décrivez votre projet ou votre besoin..." />
          </div>
          <button onClick={handleSubmit} style={{ width: "100%", background: "#f5a623", color: "#0d3d1e", border: "none", padding: "14px", borderRadius: 10, fontWeight: 700, fontSize: 15, cursor: "pointer", fontFamily: "Georgia, serif" }}>
            Envoyer ma demande →
          </button>
          <p style={{ fontSize: 11, color: "#9eada1", textAlign: "center", marginTop: 10 }}>Réponse garantie sous 24h ouvrables</p>
        </div>
      </div>
    </div>
  );
}

// ─── APP ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("home");
  const [selectedProduct, setSelectedProduct] = useState(null);
  useEffect(() => { window.scrollTo(0, 0); }, [page]);

  const renderPage = () => {
    switch (page) {
      case "home": return <HomePage setPage={setPage} setSelectedProduct={setSelectedProduct} />;
      case "shop": return <ShopPage setPage={setPage} setSelectedProduct={setSelectedProduct} />;
      case "product": return <ProductDetailPage product={selectedProduct} setPage={setPage} />;
      case "cart": return <CartPage setPage={setPage} />;
      case "services": return <ServicesPage setPage={setPage} />;
      case "telecom": return <TelecomPage setPage={setPage} />;
      case "contact": return <ContactPage />;
      default: return <HomePage setPage={setPage} setSelectedProduct={setSelectedProduct} />;
    }
  };

  return (
    <CartProvider>
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", fontFamily: "'Open Sans', Georgia, serif", background: "#f9faf7" }}>
        <Navbar page={page} setPage={setPage} />
        <main style={{ flexGrow: 1 }}>{renderPage()}</main>
        <Footer setPage={setPage} />
      </div>
    </CartProvider>
  );
}