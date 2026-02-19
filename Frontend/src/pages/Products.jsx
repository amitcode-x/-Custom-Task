import { useEffect, useState } from "react";
import api from "../api/axios";

// ── Skeleton ──────────────────────────────────────────────────
function SkeletonRow() {
  return (
    <tr style={{ borderBottom: "1px solid rgba(236,72,153,0.05)", animation: "pulse 1.5s ease-in-out infinite" }}>
      <td style={{ padding: "14px 22px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 38, height: 38, borderRadius: 12, background: "linear-gradient(135deg, rgba(236,72,153,0.15), rgba(168,85,247,0.12))" }} />
          <div style={{ width: 120, height: 12, borderRadius: 6, background: "rgba(236,72,153,0.12)" }} />
        </div>
      </td>
      <td style={{ padding: "14px 22px" }}><div style={{ width: 70, height: 22, borderRadius: 999, background: "rgba(168,85,247,0.1)" }} /></td>
      <td style={{ padding: "14px 22px" }}><div style={{ width: 60, height: 12, borderRadius: 6, background: "rgba(16,185,129,0.12)" }} /></td>
      <td style={{ padding: "14px 22px" }}><div style={{ width: 80, height: 22, borderRadius: 999, background: "rgba(236,72,153,0.1)" }} /></td>
    </tr>
  );
}

function StatPillSkeleton() {
  return (
    <div style={{ flex: 1, padding: "18px 20px", textAlign: "center", animation: "pulse 1.5s ease-in-out infinite", borderRight: "1px solid rgba(236,72,153,0.06)" }}>
      <div style={{ width: 36, height: 28, borderRadius: 8, background: "rgba(236,72,153,0.12)", margin: "0 auto 6px" }} />
      <div style={{ width: 60, height: 8, borderRadius: 4, background: "rgba(168,85,247,0.08)", margin: "0 auto" }} />
    </div>
  );
}

// ── Products ──────────────────────────────────────────────────
export default function Products() {
  const [products, setProducts] = useState([]);
  const [search, setSearch]     = useState("");
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    api.get("products/")
      .then(res => { setProducts(res.data); setLoading(false); })
      .catch(err => { console.log(err); setLoading(false); });
  }, []);

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.sku.toLowerCase().includes(search.toLowerCase())
  );

  const inStock  = products.filter(p => (p.inventory?.quantity ?? 0) > 10).length;
  const lowStock = products.filter(p => { const q = p.inventory?.quantity ?? 0; return q > 0 && q <= 10; }).length;
  const outStock = products.filter(p => (p.inventory?.quantity ?? 0) === 0).length;

  return (
    <div style={{ fontFamily: "'Poppins', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 14 }}>
        <div>
  <h1
    style={{
      fontSize: "1.9rem",
      fontWeight: 800,
      color: "#6b7280",   // simple gray
      letterSpacing: "-0.02em",
      margin: 0,
    }}
  >
    Products
  </h1>

  <p
    style={{
      fontSize: "0.82rem",
      color: "#6b7280",   // simple gray
      marginTop: 4,
      fontWeight: 500,
    }}
  >
    {products.length} products in catalog
  </p>
</div>

        {/* Search */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, background: "rgba(255,255,255,0.8)", border: "1.5px solid rgba(236,72,153,0.2)", borderRadius: 999, padding: "9px 18px", backdropFilter: "blur(12px)", minWidth: 220, boxShadow: "0 2px 14px rgba(236,72,153,0.08)" }}>
          <span style={{ fontSize: "1rem", color: "#ec4899", opacity: 0.65 }}>🔍</span>
          <input type="text" placeholder="Search by name or SKU..." value={search} onChange={e => setSearch(e.target.value)}
            style={{ background: "transparent", border: "none", outline: "none", color: "#3b0764", fontFamily: "'Poppins', sans-serif", fontSize: "0.87rem", width: "100%", fontWeight: 500 }} />
        </div>
      </div>

      {/* Table Card */}
      <div style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.85), rgba(253,242,248,0.75), rgba(250,245,255,0.75))", backdropFilter: "blur(20px)", border: "1.5px solid rgba(236,72,153,0.12)", borderRadius: 22, overflow: "hidden", boxShadow: "0 8px 40px rgba(236,72,153,0.1)" }}>

        {/* Blobs inside card */}
        <div style={{ position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: -30, right: -30, width: 120, height: 120, background: "radial-gradient(circle, rgba(236,72,153,0.15), transparent 70%)", borderRadius: "50%", filter: "blur(20px)", pointerEvents: "none", zIndex: 0 }} />
          <div style={{ position: "absolute", bottom: -20, left: -20, width: 100, height: 100, background: "radial-gradient(circle, rgba(168,85,247,0.12), transparent 70%)", borderRadius: "50%", filter: "blur(18px)", pointerEvents: "none", zIndex: 0 }} />

          {/* Stats Row */}
          <div style={{ display: "flex", borderBottom: "1.5px solid rgba(236,72,153,0.08)", position: "relative", zIndex: 1 }}>
            {loading
              ? [1,2,3,4].map(i => <StatPillSkeleton key={i} />)
              : [
                  { val: products.length, label: "Total",       color: null },
                  { val: inStock,         label: "In Stock",    color: "#059669" },
                  { val: lowStock,        label: "Low Stock",   color: "#d97706" },
                  { val: outStock,        label: "Out of Stock",color: "#ec4899" },
                ].map((s, i) => (
                  <div key={s.label} style={{ flex: 1, padding: "18px 20px", textAlign: "center", borderRight: i < 3 ? "1px solid rgba(236,72,153,0.07)" : "none" }}>
                    <div style={{ fontSize: "1.7rem", fontWeight: 800, background: s.color ? "none" : "linear-gradient(135deg, #ec4899, #a855f7)", WebkitBackgroundClip: s.color ? "initial" : "text", WebkitTextFillColor: s.color ?? "transparent", color: s.color }}>
                      {s.val}
                    </div>
                    <div style={{ fontSize: "0.67rem", color: "rgba(168,85,247,0.45)", textTransform: "uppercase", letterSpacing: "0.08em", marginTop: 3, fontWeight: 600 }}>{s.label}</div>
                  </div>
                ))
            }
          </div>

          {/* Table */}
          <div style={{ position: "relative", zIndex: 1, overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "linear-gradient(135deg, rgba(236,72,153,0.06), rgba(168,85,247,0.04))", borderBottom: "1.5px solid rgba(236,72,153,0.1)" }}>
                  {["Product", "SKU", "Price", "Stock"].map(h => (
                    <th key={h} style={{ padding: "14px 22px", textAlign: "left", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(168,85,247,0.6)" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading
                  ? [1,2,3,4,5].map(i => <SkeletonRow key={i} />)
                  : filtered.length === 0
                    ? (
                        <tr><td colSpan={4} style={{ padding: "60px 20px", textAlign: "center", color: "rgba(168,85,247,0.4)" }}>
                          <div style={{ fontSize: "2.8rem", marginBottom: 10 }}>🎁</div>
                          <div style={{ fontSize: "0.9rem", fontWeight: 500 }}>No products found</div>
                        </td></tr>
                      )
                    : filtered.map(product => {
                        const qty = product.inventory?.quantity ?? 0;
                        const stockColor = qty === 0 ? "#ec4899" : qty <= 10 ? "#d97706" : "#059669";
                        const stockLabel = qty === 0 ? "Out of Stock" : qty <= 10 ? `Low (${qty})` : qty;
                        return (
                          <tr key={product.id}
                            style={{ borderBottom: "1px solid rgba(236,72,153,0.05)", transition: "background 0.15s" }}
                            onMouseEnter={e => e.currentTarget.style.background = "rgba(236,72,153,0.03)"}
                            onMouseLeave={e => e.currentTarget.style.background = ""}
                          >
                            <td style={{ padding: "14px 22px", verticalAlign: "middle" }}>
                              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                <div style={{ width: 38, height: 38, borderRadius: 12, background: "linear-gradient(135deg, rgba(236,72,153,0.12), rgba(168,85,247,0.12))", border: "1.5px solid rgba(236,72,153,0.18)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem", flexShrink: 0 }}>🎁</div>
                                <span style={{ fontWeight: 600, color: "#4c0280", fontSize: "0.9rem" }}>{product.name}</span>
                              </div>
                            </td>
                            <td style={{ padding: "14px 22px", verticalAlign: "middle" }}>
                              <span style={{ background: "linear-gradient(135deg, rgba(168,85,247,0.08), rgba(236,72,153,0.06))", border: "1.5px solid rgba(168,85,247,0.18)", color: "#a855f7", padding: "3px 12px", borderRadius: 999, fontSize: "0.74rem", fontWeight: 600, fontFamily: "monospace", letterSpacing: "0.04em" }}>{product.sku}</span>
                            </td>
                            <td style={{ padding: "14px 22px", verticalAlign: "middle", fontWeight: 700, color: "#059669", fontSize: "0.95rem" }}>
                              ₹{Number(product.price).toLocaleString("en-IN")}
                            </td>
                            <td style={{ padding: "14px 22px", verticalAlign: "middle" }}>
                              <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 14px", borderRadius: 999, fontSize: "0.76rem", fontWeight: 600, background: `${stockColor}15`, border: `1.5px solid ${stockColor}40`, color: stockColor }}>
                                <span style={{ width: 6, height: 6, borderRadius: "50%", background: stockColor, boxShadow: `0 0 5px ${stockColor}` }} />
                                {stockLabel}
                              </span>
                            </td>
                          </tr>
                        );
                      })
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}