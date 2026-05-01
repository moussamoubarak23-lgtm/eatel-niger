import { useState, createContext, useContext, useEffect } from "react";

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

// ─── COMPONENTS ──────────────────────────────────────────────────────────────

function Navbar({ page, setPage }) {
  const { count } = useCart();
  const [open, setOpen] = useState(false);
  const links = [
    { id: "home", label: "Accueil" },
    { id: "shop", label: "Boutique" },
    { id: "services", label: "Services" },
    { id: "telecom", label: "Télécom" },
    { id: "contact", label: "Contact" },
  ];
  return (
    <nav style={{ background: "linear-gradient(90deg,#0d3d1e 0%,#1a6632 100%)", position: "sticky", top: 0, zIndex: 100, boxShadow: "0 2px 20px rgba(0,0,0,0.4)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between", height: 68 }}>
        <button onClick={() => setPage("home")} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 42, height: 42, borderRadius: "50%", background: "#f5a623", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 15, color: "#0d3d1e", fontFamily: "Georgia, serif", flexShrink: 0 }}>E</div>
          <div style={{ textAlign: "left" }}>
            <div style={{ fontFamily: "Georgia, serif", fontWeight: 700, fontSize: 17, color: "white", lineHeight: 1.1 }}>EATEL Niger</div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.55)", letterSpacing: 1 }}>SARL · Énergie & Télécom</div>
          </div>
        </button>

        <div style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
          {links.map(l => (
            <button key={l.id} onClick={() => setPage(l.id)}
              style={{ background: "none", border: "none", cursor: "pointer", color: page === l.id ? "#f5a623" : "rgba(255,255,255,0.8)", fontWeight: 600, fontSize: 14, padding: "4px 0", borderBottom: page === l.id ? "2px solid #f5a623" : "2px solid transparent", transition: "all 0.2s" }}>
              {l.label}
            </button>
          ))}
        </div>

        <button onClick={() => setPage("cart")} style={{ background: "rgba(245,166,35,0.15)", border: "1.5px solid rgba(245,166,35,0.5)", borderRadius: 8, padding: "8px 16px", cursor: "pointer", color: "white", display: "flex", alignItems: "center", gap: 8, fontWeight: 600, fontSize: 14, transition: "all 0.2s" }}>
          🛒 Panier
          {count > 0 && <span style={{ background: "#f5a623", color: "#0d3d1e", borderRadius: 10, fontSize: 11, fontWeight: 900, padding: "1px 8px" }}>{count}</span>}
        </button>
      </div>
    </nav>
  );
}

function Footer({ setPage }) {
  return (
    <footer style={{ background: "#071a0d", color: "rgba(255,255,255,0.6)", padding: "3rem 2rem 2rem" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: "3rem", marginBottom: "2rem" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: "1rem" }}>
            <div style={{ width: 38, height: 38, borderRadius: "50%", background: "#f5a623", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 14, color: "#071a0d" }}>E</div>
            <span style={{ fontFamily: "Georgia, serif", fontWeight: 700, fontSize: 16, color: "white" }}>EATEL Niger SARL</span>
          </div>
          <p style={{ fontSize: 14, lineHeight: 1.7, maxWidth: 320 }}>Votre partenaire de confiance en énergie solaire, solutions énergétiques et services télécom à travers tout le Niger.</p>
        </div>
        <div>
          <div style={{ color: "#f5a623", fontWeight: 700, marginBottom: "1rem", fontSize: 13, textTransform: "uppercase", letterSpacing: 1 }}>Navigation</div>
          {["home","shop","services","telecom","contact"].map(p => (
            <button key={p} onClick={() => setPage(p)} style={{ display: "block", background: "none", border: "none", color: "rgba(255,255,255,0.6)", cursor: "pointer", fontSize: 14, marginBottom: 8, padding: 0, textAlign: "left" }}>
              {p === "home" ? "Accueil" : p === "shop" ? "Boutique" : p === "services" ? "Services" : p === "telecom" ? "Télécom" : "Contact"}
            </button>
          ))}
        </div>
        <div>
          <div style={{ color: "#f5a623", fontWeight: 700, marginBottom: "1rem", fontSize: 13, textTransform: "uppercase", letterSpacing: 1 }}>Contact</div>
          <div style={{ fontSize: 14, lineHeight: 2 }}>
            <div>📞 +227 91 92 12 52</div>
            <div>✉️ ihamidoumaiga@icloud.com</div>
            <div>📍 Niamey, Niger</div>
            <div>🕐 Lun–Sam 8h–18h</div>
          </div>
        </div>
      </div>
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "1.5rem", textAlign: "center", fontSize: 13 }}>
        © 2025 EATEL Niger SARL · Énergie Solaire · Télécom · Innovation Durable
      </div>
    </footer>
  );
}

function ProductCard({ product, onView }) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);
  const handleAdd = () => {
    add(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };
  const catColor = { solaire: "#fff3cd", kits: "#d4edda", energie: "#d1ecf1", telecom: "#e2d9f3" };
  const catText = { solaire: "#856404", kits: "#155724", energie: "#0c5460", telecom: "#491f87" };
  return (
    <div style={{ background: "white", borderRadius: 16, border: "1px solid #e8ede9", overflow: "hidden", display: "flex", flexDirection: "column", transition: "all 0.25s", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-6px)"; e.currentTarget.style.boxShadow = "0 16px 40px rgba(26,102,50,0.15)"; }}
      onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.06)"; }}>
      <div style={{ height: 160, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "4.5rem", background: "linear-gradient(135deg,#f0f9f2,#e0f2e5)", position: "relative" }}>
        {product.badge && (
          <span style={{ position: "absolute", top: 12, left: 12, background: product.badge === "Nouveau" ? "#1a6632" : "#f5a623", color: product.badge === "Nouveau" ? "white" : "#0d3d1e", fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 12 }}>{product.badge}</span>
        )}
        {product.emoji}
      </div>
      <div style={{ padding: "1.25rem", flexGrow: 1, display: "flex", flexDirection: "column" }}>
        <span style={{ background: catColor[product.category] || "#f0f9f2", color: catText[product.category] || "#155724", fontSize: 11, fontWeight: 700, padding: "2px 10px", borderRadius: 10, alignSelf: "flex-start", marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>
          {CAT_LABELS[product.category]}
        </span>
        <h3 style={{ fontFamily: "Georgia, serif", fontWeight: 700, fontSize: "0.95rem", marginBottom: 8, lineHeight: 1.35, color: "#0d2d14" }}>{product.name}</h3>
        <p style={{ fontSize: 13, color: "#6b7c6e", lineHeight: 1.55, flexGrow: 1, marginBottom: 16 }}>{product.desc}</p>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginTop: "auto" }}>
          <div>
            <div style={{ fontFamily: "Georgia, serif", fontWeight: 700, fontSize: "1rem", color: "#0d3d1e" }}>{fmt(product.price)}</div>
            <div style={{ fontSize: 11, color: "#9eada1" }}>Prix indicatif</div>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            <button onClick={() => onView(product)} style={{ background: "none", border: "1.5px solid #1a6632", color: "#1a6632", padding: "7px 12px", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 600 }}>Détails</button>
            <button onClick={handleAdd} style={{ background: added ? "#1a6632" : "#f5a623", border: "none", color: added ? "white" : "#0d3d1e", padding: "7px 14px", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 700, transition: "all 0.2s", whiteSpace: "nowrap" }}>
              {added ? "✓ Ajouté" : "+ Devis"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ServiceCard({ service }) {
  return (
    <div style={{ background: "white", borderRadius: 16, padding: "2rem", border: "1px solid #e8ede9", transition: "all 0.25s", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = "#1a6632"; e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(26,102,50,0.12)"; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = "#e8ede9"; e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.05)"; }}>
      <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>{service.icon}</div>
      <h3 style={{ fontFamily: "Georgia, serif", fontWeight: 700, fontSize: "1.05rem", color: "#0d2d14", marginBottom: 10 }}>{service.title}</h3>
      <p style={{ fontSize: 14, color: "#6b7c6e", lineHeight: 1.6 }}>{service.desc}</p>
      <button style={{ marginTop: "1.25rem", background: "none", border: "none", color: "#1a6632", fontWeight: 700, fontSize: 13, cursor: "pointer", padding: 0, display: "flex", alignItems: "center", gap: 4 }}>
        En savoir plus →
      </button>
    </div>
  );
}

// ─── PAGES ───────────────────────────────────────────────────────────────────

function HomePage({ setPage, setSelectedProduct }) {
  const { add } = useCart();
  const featuredProducts = PRODUCTS.slice(0, 3);
  return (
    <div>
      {/* HERO */}
      <section style={{ background: "linear-gradient(135deg,#071a0d 0%,#0d3d1e 40%,#1a6632 100%)", padding: "6rem 2rem 5rem", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle at 80% 20%, rgba(245,166,35,0.08) 0%, transparent 60%), radial-gradient(circle at 20% 80%, rgba(26,102,50,0.4) 0%, transparent 50%)" }} />
        <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(245,166,35,0.15)", border: "1px solid rgba(245,166,35,0.4)", borderRadius: 20, padding: "5px 16px", marginBottom: "1.5rem" }}>
            <span style={{ fontSize: 11 }}>⚡</span>
            <span style={{ color: "#f5a623", fontSize: 12, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase" }}>Énergie & Télécom — Niger</span>
          </div>
          <h1 style={{ fontFamily: "Georgia, serif", fontWeight: 700, fontSize: "3.5rem", color: "white", lineHeight: 1.15, marginBottom: "1.5rem", maxWidth: 700 }}>
            Ensemble, éclairons<br />
            <span style={{ color: "#f5a623" }}>l'avenir du Niger</span>
          </h1>
          <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "1.15rem", lineHeight: 1.7, maxWidth: 580, marginBottom: "2.5rem" }}>
            Solutions solaires certifiées, systèmes énergétiques fiables et connectivité télécom avancée — pour alimenter vos ambitions à travers tout le Niger.
          </p>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <button onClick={() => setPage("shop")} style={{ background: "#f5a623", color: "#0d3d1e", border: "none", padding: "14px 32px", borderRadius: 10, fontWeight: 700, fontSize: 15, cursor: "pointer", fontFamily: "Georgia, serif", transition: "all 0.2s" }}
              onMouseEnter={e => e.target.style.background = "#e09510"} onMouseLeave={e => e.target.style.background = "#f5a623"}>
              Voir nos produits →
            </button>
            <button onClick={() => setPage("contact")} style={{ background: "transparent", color: "white", border: "2px solid rgba(255,255,255,0.4)", padding: "14px 32px", borderRadius: 10, fontWeight: 600, fontSize: 15, cursor: "pointer", transition: "all 0.2s" }}>
              Demander un devis
            </button>
          </div>
        </div>
      </section>

      {/* STATS BAR */}
      <div style={{ background: "#1a6632", display: "grid", gridTemplateColumns: "repeat(4,1fr)", textAlign: "center" }}>
        {[["500+","Installations"], ["8","Régions Niger"], ["15+","Ans d'expérience"], ["24/7","Support technique"]].map(([n, l]) => (
          <div key={l} style={{ padding: "1.5rem", borderRight: "1px solid rgba(255,255,255,0.12)" }}>
            <div style={{ fontFamily: "Georgia, serif", fontWeight: 700, fontSize: "2rem", color: "#f5a623" }}>{n}</div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.75)" }}>{l}</div>
          </div>
        ))}
      </div>

      {/* FEATURED PRODUCTS */}
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "5rem 2rem" }}>
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <span style={{ background: "#e8f5eb", color: "#1a6632", fontSize: 12, fontWeight: 700, padding: "4px 16px", borderRadius: 20, textTransform: "uppercase", letterSpacing: 1 }}>Produits phares</span>
          <h2 style={{ fontFamily: "Georgia, serif", fontWeight: 700, fontSize: "2.2rem", color: "#0d2d14", marginTop: "0.75rem", marginBottom: "0.5rem" }}>Nos meilleures solutions</h2>
          <p style={{ color: "#6b7c6e", fontSize: "1rem" }}>Matériel certifié, livraison et installation dans tout le Niger</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1.5rem", marginBottom: "2rem" }}>
          {featuredProducts.map(p => <ProductCard key={p.id} product={p} onView={(prod) => { setSelectedProduct(prod); setPage("product"); }} />)}
        </div>
        <div style={{ textAlign: "center" }}>
          <button onClick={() => setPage("shop")} style={{ background: "#1a6632", color: "white", border: "none", padding: "14px 36px", borderRadius: 10, fontWeight: 700, fontSize: 15, cursor: "pointer", fontFamily: "Georgia, serif" }}>
            Voir tout le catalogue →
          </button>
        </div>
      </section>

      {/* WHY US */}
      <section style={{ background: "#f5faf6", padding: "5rem 2rem" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <span style={{ background: "#e8f5eb", color: "#1a6632", fontSize: 12, fontWeight: 700, padding: "4px 16px", borderRadius: 20, textTransform: "uppercase", letterSpacing: 1 }}>Pourquoi EATEL ?</span>
            <h2 style={{ fontFamily: "Georgia, serif", fontWeight: 700, fontSize: "2.2rem", color: "#0d2d14", marginTop: "0.75rem" }}>Votre partenaire de confiance</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "2rem" }}>
            {[
              { icon: "🏆", title: "Matériel Certifié", desc: "Tous nos produits sont certifiés IEC, CE et conformes aux standards internationaux." },
              { icon: "🌍", title: "Couverture Nationale", desc: "Interventions dans les 8 régions du Niger, même dans les zones les plus reculées." },
              { icon: "💼", title: "Clé en Main", desc: "De l'étude technique à la mise en service, nous gérons tout pour vous." },
            ].map(w => (
              <div key={w.title} style={{ textAlign: "center", padding: "2rem", background: "white", borderRadius: 16, border: "1px solid #e8ede9" }}>
                <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>{w.icon}</div>
                <h3 style={{ fontFamily: "Georgia, serif", fontWeight: 700, fontSize: "1.1rem", color: "#0d2d14", marginBottom: 10 }}>{w.title}</h3>
                <p style={{ fontSize: 14, color: "#6b7c6e", lineHeight: 1.6 }}>{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: "linear-gradient(135deg,#0d3d1e,#1a6632)", padding: "5rem 2rem", textAlign: "center" }}>
        <h2 style={{ fontFamily: "Georgia, serif", fontWeight: 700, fontSize: "2.2rem", color: "white", marginBottom: "1rem" }}>Prêt à passer à l'énergie solaire ?</h2>
        <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "1.05rem", marginBottom: "2rem" }}>Obtenez une étude gratuite et un devis personnalisé sous 48h</p>
        <button onClick={() => setPage("contact")} style={{ background: "#f5a623", color: "#0d3d1e", border: "none", padding: "16px 40px", borderRadius: 10, fontWeight: 700, fontSize: 16, cursor: "pointer", fontFamily: "Georgia, serif" }}>
          Demander mon devis gratuit →
        </button>
      </section>
    </div>
  );
}

function ShopPage({ setPage, setSelectedProduct }) {
  const [cat, setCat] = useState("all");
  const [search, setSearch] = useState("");
  const cats = Object.keys(CAT_LABELS);
  const filtered = PRODUCTS.filter(p => (cat === "all" || p.category === cat) && p.name.toLowerCase().includes(search.toLowerCase()));
  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "3rem 2rem" }}>
      <div style={{ marginBottom: "2.5rem" }}>
        <h1 style={{ fontFamily: "Georgia, serif", fontWeight: 700, fontSize: "2.2rem", color: "#0d2d14", marginBottom: 8 }}>Notre Catalogue</h1>
        <p style={{ color: "#6b7c6e" }}>Matériel certifié — Installation dans tout le Niger</p>
      </div>
      <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {cats.map(c => (
            <button key={c} onClick={() => setCat(c)} style={{ background: cat === c ? "#1a6632" : "white", color: cat === c ? "white" : "#4b6350", border: "1.5px solid", borderColor: cat === c ? "#1a6632" : "#d4e0d6", padding: "7px 18px", borderRadius: 8, cursor: "pointer", fontWeight: 600, fontSize: 13, transition: "all 0.15s" }}>
              {CAT_LABELS[c]}
            </button>
          ))}
        </div>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher un produit..." style={{ border: "1.5px solid #d4e0d6", borderRadius: 8, padding: "8px 16px", fontSize: 14, outline: "none", width: 240, color: "#0d2d14" }} />
      </div>
      <div style={{ marginBottom: "1rem", fontSize: 14, color: "#9eada1" }}>{filtered.length} produit{filtered.length > 1 ? "s" : ""} trouvé{filtered.length > 1 ? "s" : ""}</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1.5rem" }}>
        {filtered.map(p => <ProductCard key={p.id} product={p} onView={(prod) => { setSelectedProduct(prod); setPage("product"); }} />)}
      </div>
      {filtered.length === 0 && (
        <div style={{ textAlign: "center", padding: "4rem", color: "#9eada1" }}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🔍</div>
          <p>Aucun produit trouvé. Essayez une autre recherche.</p>
        </div>
      )}
    </div>
  );
}

function ProductDetailPage({ product, setPage }) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);
  if (!product) return <div style={{ textAlign: "center", padding: "4rem" }}><p>Produit introuvable.</p></div>;
  const handleAdd = () => { add(product); setAdded(true); setTimeout(() => setAdded(false), 2000); };
  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "3rem 2rem" }}>
      <button onClick={() => setPage("shop")} style={{ background: "none", border: "none", color: "#1a6632", cursor: "pointer", fontWeight: 600, fontSize: 14, marginBottom: "2rem", padding: 0, display: "flex", alignItems: "center", gap: 4 }}>
        ← Retour au catalogue
      </button>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: "3rem", alignItems: "start" }}>
        <div style={{ background: "linear-gradient(135deg,#f0f9f2,#e0f2e5)", borderRadius: 20, padding: "4rem", textAlign: "center", fontSize: "8rem" }}>
          {product.emoji}
        </div>
        <div>
          <span style={{ background: "#e8f5eb", color: "#1a6632", fontSize: 12, fontWeight: 700, padding: "4px 14px", borderRadius: 12, textTransform: "uppercase", letterSpacing: 0.5 }}>{CAT_LABELS[product.category]}</span>
          {product.badge && <span style={{ marginLeft: 8, background: "#f5a623", color: "#0d3d1e", fontSize: 12, fontWeight: 700, padding: "4px 14px", borderRadius: 12 }}>{product.badge}</span>}
          <h1 style={{ fontFamily: "Georgia, serif", fontWeight: 700, fontSize: "1.8rem", color: "#0d2d14", margin: "1rem 0", lineHeight: 1.25 }}>{product.name}</h1>
          <p style={{ fontSize: "1rem", color: "#4b6350", lineHeight: 1.7, marginBottom: "2rem" }}>{product.desc}</p>

          <div style={{ background: "#f5faf6", borderRadius: 12, padding: "1.5rem", marginBottom: "2rem" }}>
            <div style={{ fontWeight: 700, color: "#0d2d14", marginBottom: "0.75rem", fontSize: 14, textTransform: "uppercase", letterSpacing: 0.5 }}>Caractéristiques techniques</div>
            {product.specs.map(s => (
              <div key={s} style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 0", borderBottom: "1px solid #e8ede9", fontSize: 14, color: "#4b6350" }}>
                <span style={{ color: "#1a6632", fontWeight: 700 }}>✓</span> {s}
              </div>
            ))}
          </div>

          <div style={{ marginBottom: "1.5rem" }}>
            <div style={{ fontFamily: "Georgia, serif", fontWeight: 700, fontSize: "1.6rem", color: "#0d2d14" }}>{fmt(product.price)}</div>
            <div style={{ fontSize: 13, color: "#9eada1" }}>Prix indicatif HT · Livraison incluse au Niger</div>
          </div>

          <div style={{ display: "flex", gap: "1rem" }}>
            <button onClick={handleAdd} style={{ background: added ? "#155724" : "#f5a623", color: added ? "white" : "#0d3d1e", border: "none", padding: "14px 28px", borderRadius: 10, fontWeight: 700, fontSize: 15, cursor: "pointer", fontFamily: "Georgia, serif", transition: "all 0.2s", flex: 1 }}>
              {added ? "✓ Ajouté au panier" : "Ajouter au devis"}
            </button>
            <button onClick={() => setPage("contact")} style={{ background: "#1a6632", color: "white", border: "none", padding: "14px 24px", borderRadius: 10, fontWeight: 700, fontSize: 15, cursor: "pointer" }}>
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
  if (items.length === 0) return (
    <div style={{ textAlign: "center", padding: "6rem 2rem" }}>
      <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>🛒</div>
      <h2 style={{ fontFamily: "Georgia, serif", fontWeight: 700, color: "#0d2d14", marginBottom: "1rem" }}>Votre panier est vide</h2>
      <button onClick={() => setPage("shop")} style={{ background: "#1a6632", color: "white", border: "none", padding: "12px 28px", borderRadius: 10, fontWeight: 700, cursor: "pointer", fontSize: 15 }}>Voir le catalogue</button>
    </div>
  );
  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "3rem 2rem" }}>
      <h1 style={{ fontFamily: "Georgia, serif", fontWeight: 700, fontSize: "2rem", color: "#0d2d14", marginBottom: "2rem" }}>Votre sélection — Demande de devis</h1>
      <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: "2rem", alignItems: "start" }}>
        <div>
          {items.map(item => (
            <div key={item.id} style={{ background: "white", borderRadius: 12, padding: "1.25rem", marginBottom: "1rem", border: "1px solid #e8ede9", display: "flex", alignItems: "center", gap: "1rem" }}>
              <div style={{ fontSize: "2.5rem", background: "#f0f9f2", borderRadius: 10, width: 64, height: 64, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{item.emoji}</div>
              <div style={{ flexGrow: 1 }}>
                <div style={{ fontFamily: "Georgia, serif", fontWeight: 700, fontSize: "0.9rem", color: "#0d2d14", marginBottom: 4 }}>{item.name}</div>
                <div style={{ fontSize: 13, color: "#1a6632", fontWeight: 700 }}>{fmt(item.price)}</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <button onClick={() => updateQty(item.id, item.qty - 1)} style={{ width: 28, height: 28, borderRadius: 6, border: "1.5px solid #d4e0d6", background: "white", cursor: "pointer", fontWeight: 700, fontSize: 16 }}>-</button>
                <span style={{ fontWeight: 700, minWidth: 24, textAlign: "center" }}>{item.qty}</span>
                <button onClick={() => updateQty(item.id, item.qty + 1)} style={{ width: 28, height: 28, borderRadius: 6, border: "1.5px solid #d4e0d6", background: "white", cursor: "pointer", fontWeight: 700, fontSize: 16 }}>+</button>
              </div>
              <button onClick={() => remove(item.id)} style={{ background: "none", border: "none", color: "#c0392b", cursor: "pointer", fontSize: 18, padding: "0 4px" }}>✕</button>
            </div>
          ))}
        </div>
        <div style={{ background: "white", borderRadius: 16, padding: "1.5rem", border: "1px solid #e8ede9", position: "sticky", top: 80 }}>
          <h3 style={{ fontFamily: "Georgia, serif", fontWeight: 700, color: "#0d2d14", marginBottom: "1.5rem" }}>Récapitulatif</h3>
          {items.map(i => (
            <div key={i.id} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#6b7c6e", marginBottom: 8 }}>
              <span>{i.name.substring(0, 28)}… ×{i.qty}</span>
              <span style={{ fontWeight: 600 }}>{fmt(i.price * i.qty)}</span>
            </div>
          ))}
          <div style={{ borderTop: "2px solid #e8ede9", marginTop: "1rem", paddingTop: "1rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "Georgia, serif", fontWeight: 700, fontSize: "1.1rem", color: "#0d2d14" }}>
              <span>Total estimé</span><span>{fmt(total)}</span>
            </div>
            <div style={{ fontSize: 12, color: "#9eada1", marginTop: 4 }}>Devis définitif fourni sous 24h</div>
          </div>
          <button onClick={() => setPage("contact")} style={{ width: "100%", background: "#f5a623", color: "#0d3d1e", border: "none", padding: "14px", borderRadius: 10, fontWeight: 700, fontSize: 15, cursor: "pointer", marginTop: "1.5rem", fontFamily: "Georgia, serif" }}>
            Envoyer la demande de devis →
          </button>
          <button onClick={() => setPage("shop")} style={{ width: "100%", background: "none", color: "#1a6632", border: "1.5px solid #1a6632", padding: "12px", borderRadius: 10, fontWeight: 600, fontSize: 14, cursor: "pointer", marginTop: 10 }}>
            Continuer mes achats
          </button>
        </div>
      </div>
    </div>
  );
}

function ServicesPage({ setPage }) {
  return (
    <div>
      <div style={{ background: "linear-gradient(135deg,#071a0d,#1a6632)", padding: "4rem 2rem 3rem", textAlign: "center" }}>
        <span style={{ background: "rgba(245,166,35,0.2)", border: "1px solid rgba(245,166,35,0.4)", color: "#f5a623", fontSize: 12, fontWeight: 700, padding: "4px 16px", borderRadius: 20, textTransform: "uppercase", letterSpacing: 1 }}>Nos services</span>
        <h1 style={{ fontFamily: "Georgia, serif", fontWeight: 700, fontSize: "2.5rem", color: "white", marginTop: "1rem", marginBottom: "0.75rem" }}>Solutions clé en main</h1>
        <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "1.05rem", maxWidth: 520, margin: "0 auto" }}>De l'étude à la maintenance, EATEL vous accompagne à chaque étape de votre projet énergétique.</p>
      </div>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "4rem 2rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1.5rem", marginBottom: "4rem" }}>
          {SERVICES.map(s => <ServiceCard key={s.id} service={s} />)}
        </div>
        <div style={{ background: "linear-gradient(135deg,#f0f9f2,#e0f2e5)", borderRadius: 20, padding: "3rem", textAlign: "center" }}>
          <h2 style={{ fontFamily: "Georgia, serif", fontWeight: 700, fontSize: "1.75rem", color: "#0d2d14", marginBottom: "0.75rem" }}>Besoin d'un devis personnalisé ?</h2>
          <p style={{ color: "#4b6350", marginBottom: "1.5rem" }}>Nos ingénieurs vous répondent sous 24h, partout au Niger.</p>
          <button onClick={() => setPage("contact")} style={{ background: "#1a6632", color: "white", border: "none", padding: "14px 32px", borderRadius: 10, fontWeight: 700, fontSize: 15, cursor: "pointer", fontFamily: "Georgia, serif" }}>
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
  return (
    <div>
      <div style={{ background: "linear-gradient(135deg,#071a0d,#0d2d44)", padding: "4rem 2rem 3rem", textAlign: "center" }}>
        <span style={{ background: "rgba(59,130,246,0.2)", border: "1px solid rgba(59,130,246,0.4)", color: "#60a5fa", fontSize: 12, fontWeight: 700, padding: "4px 16px", borderRadius: 20, textTransform: "uppercase", letterSpacing: 1 }}>Télécom & Connectivité</span>
        <h1 style={{ fontFamily: "Georgia, serif", fontWeight: 700, fontSize: "2.5rem", color: "white", marginTop: "1rem", marginBottom: "0.75rem" }}>Infrastructure Télécom pour l'Afrique</h1>
        <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "1.05rem", maxWidth: 560, margin: "0 auto" }}>VSAT, 5G, stations de base, antennes hertziens — des solutions de connectivité adaptées aux réalités du Niger.</p>
      </div>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "4rem 2rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1.5rem", marginBottom: "3rem" }}>
          {telecomProducts.map(p => (
            <div key={p.id} style={{ background: "white", borderRadius: 16, border: "1.5px solid", borderColor: sel === p.id ? "#2563eb" : "#e8ede9", padding: "2rem", cursor: "pointer", transition: "all 0.2s", boxShadow: sel === p.id ? "0 8px 30px rgba(37,99,235,0.15)" : "0 2px 8px rgba(0,0,0,0.05)" }}
              onClick={() => setSel(sel === p.id ? null : p.id)}>
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>{p.emoji}</div>
              {p.badge && <span style={{ background: "#dbeafe", color: "#1d4ed8", fontSize: 11, fontWeight: 700, padding: "2px 10px", borderRadius: 10 }}>{p.badge}</span>}
              <h3 style={{ fontFamily: "Georgia, serif", fontWeight: 700, fontSize: "1rem", color: "#0d2d14", margin: "0.75rem 0 0.5rem", lineHeight: 1.3 }}>{p.name}</h3>
              <p style={{ fontSize: 13, color: "#6b7c6e", lineHeight: 1.55, marginBottom: "1rem" }}>{p.desc}</p>
              {sel === p.id && (
                <div style={{ borderTop: "1px solid #e8ede9", paddingTop: "1rem", marginTop: "0.5rem" }}>
                  {p.specs.map(s => <div key={s} style={{ fontSize: 13, color: "#4b6350", padding: "4px 0", display: "flex", gap: 8 }}><span style={{ color: "#2563eb" }}>✓</span>{s}</div>)}
                  <div style={{ marginTop: "1rem", fontFamily: "Georgia, serif", fontWeight: 700, fontSize: "1rem", color: "#0d2d14", marginBottom: 8 }}>{fmt(p.price)}</div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={(e) => { e.stopPropagation(); add(p); }} style={{ background: "#2563eb", color: "white", border: "none", padding: "8px 16px", borderRadius: 8, cursor: "pointer", fontWeight: 700, fontSize: 13, flex: 1 }}>+ Devis</button>
                    <button onClick={(e) => { e.stopPropagation(); setPage("contact"); }} style={{ background: "none", border: "1.5px solid #2563eb", color: "#2563eb", padding: "8px 16px", borderRadius: 8, cursor: "pointer", fontWeight: 700, fontSize: 13 }}>Contact</button>
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
  const handleSubmit = () => {
    if (!form.name || !form.email || !form.message) return;
    setSent(true);
  };
  if (sent) return (
    <div style={{ maxWidth: 500, margin: "6rem auto", textAlign: "center", padding: "0 2rem" }}>
      <div style={{ fontSize: "4rem", marginBottom: "1.5rem" }}>✅</div>
      <h2 style={{ fontFamily: "Georgia, serif", fontWeight: 700, fontSize: "1.8rem", color: "#0d2d14", marginBottom: "1rem" }}>Message envoyé !</h2>
      <p style={{ color: "#4b6350", fontSize: "1rem", lineHeight: 1.6 }}>Notre équipe vous répondra sous 24h. Merci de votre confiance.</p>
      <button onClick={() => setSent(false)} style={{ marginTop: "2rem", background: "#1a6632", color: "white", border: "none", padding: "12px 28px", borderRadius: 10, fontWeight: 700, fontSize: 15, cursor: "pointer" }}>Nouveau message</button>
    </div>
  );
  const inp = { border: "1.5px solid #d4e0d6", borderRadius: 8, padding: "10px 14px", fontSize: 15, outline: "none", width: "100%", fontFamily: "inherit", color: "#0d2d14", background: "white", boxSizing: "border-box" };
  return (
    <div>
      <div style={{ background: "linear-gradient(135deg,#071a0d,#1a6632)", padding: "4rem 2rem 3rem", textAlign: "center" }}>
        <h1 style={{ fontFamily: "Georgia, serif", fontWeight: 700, fontSize: "2.5rem", color: "white", marginBottom: "0.75rem" }}>Contactez-nous</h1>
        <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "1.05rem" }}>Devis gratuit · Réponse sous 24h · Intervention nationale</p>
      </div>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "4rem 2rem", display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: "3rem", alignItems: "start" }}>
        <div>
          <h2 style={{ fontFamily: "Georgia, serif", fontWeight: 700, fontSize: "1.5rem", color: "#0d2d14", marginBottom: "1.5rem" }}>Nos coordonnées</h2>
          {[
            { icon: "📞", label: "Téléphone", val: "+227 91 92 12 52" },
            { icon: "✉️", label: "Email", val: "ihamidoumaiga@icloud.com" },
            { icon: "📍", label: "Adresse", val: "Niamey, Niger" },
            { icon: "🕐", label: "Horaires", val: "Lun – Sam, 8h – 18h" },
          ].map(c => (
            <div key={c.label} style={{ display: "flex", gap: "1rem", padding: "1rem 0", borderBottom: "1px solid #e8ede9" }}>
              <div style={{ fontSize: "1.5rem", width: 40, textAlign: "center" }}>{c.icon}</div>
              <div>
                <div style={{ fontSize: 12, color: "#9eada1", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5 }}>{c.label}</div>
                <div style={{ fontWeight: 600, color: "#0d2d14", marginTop: 2 }}>{c.val}</div>
              </div>
            </div>
          ))}
          <div style={{ marginTop: "2rem", background: "#f0f9f2", borderRadius: 12, padding: "1.25rem", border: "1px solid #c8e6cb" }}>
            <div style={{ fontWeight: 700, color: "#1a6632", marginBottom: 6 }}>💬 WhatsApp disponible</div>
            <p style={{ fontSize: 13, color: "#4b6350" }}>Envoyez-nous votre demande directement sur WhatsApp pour une réponse rapide.</p>
          </div>
        </div>
        <div style={{ background: "white", borderRadius: 20, padding: "2.5rem", border: "1px solid #e8ede9", boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}>
          <h2 style={{ fontFamily: "Georgia, serif", fontWeight: 700, fontSize: "1.4rem", color: "#0d2d14", marginBottom: "1.5rem" }}>Envoyer un message</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
            <div><label style={{ fontSize: 13, fontWeight: 600, color: "#4b6350", display: "block", marginBottom: 6 }}>Nom complet *</label><input style={inp} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Votre nom" /></div>
            <div><label style={{ fontSize: 13, fontWeight: 600, color: "#4b6350", display: "block", marginBottom: 6 }}>Email *</label><input style={inp} value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="votre@email.com" /></div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
            <div><label style={{ fontSize: 13, fontWeight: 600, color: "#4b6350", display: "block", marginBottom: 6 }}>Téléphone</label><input style={inp} value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+227 ..." /></div>
            <div><label style={{ fontSize: 13, fontWeight: 600, color: "#4b6350", display: "block", marginBottom: 6 }}>Sujet</label>
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
          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: "#4b6350", display: "block", marginBottom: 6 }}>Message *</label>
            <textarea style={{ ...inp, minHeight: 130, resize: "vertical" }} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} placeholder="Décrivez votre projet ou votre besoin..." />
          </div>
          <button onClick={handleSubmit} style={{ width: "100%", background: "#f5a623", color: "#0d3d1e", border: "none", padding: "15px", borderRadius: 10, fontWeight: 700, fontSize: 16, cursor: "pointer", fontFamily: "Georgia, serif", transition: "all 0.2s" }}
            onMouseEnter={e => e.target.style.background = "#e09510"} onMouseLeave={e => e.target.style.background = "#f5a623"}>
            Envoyer ma demande →
          </button>
          <p style={{ fontSize: 12, color: "#9eada1", textAlign: "center", marginTop: 12 }}>Réponse garantie sous 24h ouvrables</p>
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