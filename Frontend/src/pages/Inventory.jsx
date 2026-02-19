import { useEffect, useState } from "react";
import api from "../api/axios";

function SkeletonInvRow() {
  return (
    <tr style={{ borderBottom: "1px solid rgba(236,72,153,0.05)", animation: "pulse 1.5s ease-in-out infinite" }}>
      <td style={{ padding: "14px 22px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 38, height: 38, borderRadius: 12, background: "rgba(236,72,153,0.12)" }} />
          <div style={{ width: 120, height: 12, borderRadius: 6, background: "rgba(168,85,247,0.1)" }} />
        </div>
      </td>
      <td style={{ padding: "14px 22px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 18, borderRadius: 6, background: "rgba(236,72,153,0.12)" }} />
          <div style={{ width: 80, height: 5, borderRadius: 99, background: "rgba(168,85,247,0.08)" }} />
        </div>
      </td>
      <td style={{ padding: "14px 22px" }}><div style={{ width: 80, height: 22, borderRadius: 999, background: "rgba(236,72,153,0.1)" }} /></td>
      <td style={{ padding: "14px 22px" }}><div style={{ width: 80, height: 28, borderRadius: 999, background: "rgba(168,85,247,0.1)" }} /></td>
    </tr>
  );
}

function SkeletonStatChip() {
  return (
    <div style={{ flex: 1, minWidth: 120, background: "rgba(255,255,255,0.5)", border: "1.5px solid rgba(236,72,153,0.08)", borderRadius: 18, padding: "16px 18px", display: "flex", alignItems: "center", gap: 12, animation: "pulse 1.5s ease-in-out infinite" }}>
      <div style={{ width: 42, height: 42, borderRadius: 12, background: "rgba(236,72,153,0.12)" }} />
      <div>
        <div style={{ width: 36, height: 22, borderRadius: 8, background: "rgba(236,72,153,0.12)", marginBottom: 6 }} />
        <div style={{ width: 60, height: 8, borderRadius: 4, background: "rgba(168,85,247,0.08)" }} />
      </div>
    </div>
  );
}

const getStockStatus = qty => {
  if (qty === 0) return { label: "Out of Stock", color: "#ec4899", bg: "rgba(236,72,153,0.1)", border: "rgba(236,72,153,0.28)" };
  if (qty <= 10) return { label: "Low Stock",    color: "#d97706", bg: "rgba(245,158,11,0.1)", border: "rgba(245,158,11,0.28)" };
  return           { label: "In Stock",      color: "#059669", bg: "rgba(16,185,129,0.1)",  border: "rgba(16,185,129,0.28)" };
};

export default function Inventory() {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelected] = useState(null);
  const [newQty, setNewQty]       = useState("");
  const [updating, setUpdating]   = useState(false);

  const load = () => {
    api.get("inventory/")
      .then(res => { setInventory(res.data); setLoading(false); })
      .catch(err => { console.log(err); setLoading(false); });
  };
  useEffect(() => { load(); }, []);

  const openModal  = item => { setSelected(item); setNewQty(item.quantity); setModalOpen(true); };
  const closeModal = ()   => { setModalOpen(false); setSelected(null); setNewQty(""); };

  const handleUpdate = () => {
    if (newQty === "" || isNaN(newQty) || Number(newQty) < 0) { alert("Please enter a valid quantity"); return; }
    setUpdating(true);
    api.put(`inventory/${selectedItem.id}/adjust/`, { quantity: Number(newQty) })
      .then(() => { setUpdating(false); closeModal(); load(); })
      .catch(() => { setUpdating(false); alert("Error updating stock"); });
  };

  const filtered   = inventory.filter(item => (item.product_name || item.product)?.toString().toLowerCase().includes(search.toLowerCase()));
  const totalStock = inventory.reduce((s, i) => s + (i.quantity || 0), 0);
  const inStock    = inventory.filter(i => i.quantity > 10).length;
  const lowStock   = inventory.filter(i => i.quantity > 0 && i.quantity <= 10).length;
  const outStock   = inventory.filter(i => i.quantity === 0).length;

  const statChips = [
    { icon: "📦", label: "Total Items",  val: inventory.length, color: "#ec4899", ibg: "rgba(236,72,153,0.1)", ib: "rgba(236,72,153,0.22)" },
    { icon: "✅", label: "In Stock",      val: inStock,          color: "#059669", ibg: "rgba(16,185,129,0.1)", ib: "rgba(16,185,129,0.22)" },
    { icon: "⚠️", label: "Low Stock",     val: lowStock,         color: "#d97706", ibg: "rgba(245,158,11,0.1)", ib: "rgba(245,158,11,0.22)" },
    { icon: "🚫", label: "Out of Stock",  val: outStock,         color: "#ec4899", ibg: "rgba(236,72,153,0.1)", ib: "rgba(236,72,153,0.22)" },
  ];

  return (
    <div style={{ fontFamily: "'Poppins', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap'); @keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}} @keyframes fadeIn{from{opacity:0}to{opacity:1}} @keyframes slideUp{from{transform:translateY(20px);opacity:0}to{transform:translateY(0);opacity:1}}`}</style>

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
    📦 Inventory
  </h1>

  <p
    style={{
      fontSize: "0.82rem",
      color: "#6b7280",   // simple gray
      marginTop: 4,
      fontWeight: 500,
    }}
  >
    {inventory.length} products · {totalStock.toLocaleString("en-IN")} total units
  </p>
</div>

        <div style={{ display: "flex", alignItems: "center", gap: 10, background: "rgba(255,255,255,0.8)", border: "1.5px solid rgba(236,72,153,0.2)", borderRadius: 999, padding: "9px 18px", backdropFilter: "blur(12px)", minWidth: 220, boxShadow: "0 2px 14px rgba(236,72,153,0.08)" }}>
          <span style={{ color: "#ec4899", opacity: 0.65 }}>🔍</span>
          <input type="text" placeholder="Search product..." value={search} onChange={e => setSearch(e.target.value)}
            style={{ background: "transparent", border: "none", outline: "none", color: "#3b0764", fontFamily: "inherit", fontSize: "0.87rem", width: "100%", fontWeight: 500 }} />
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 14, marginBottom: 22 }}>
        {loading
          ? [1,2,3,4].map(i => <SkeletonStatChip key={i} />)
          : statChips.map(s => (
              <div key={s.label}
                style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.88), rgba(253,242,248,0.75))", backdropFilter: "blur(16px)", border: `1.5px solid ${s.ib}`, borderRadius: 18, padding: "16px 18px", display: "flex", alignItems: "center", gap: 12, boxShadow: `0 4px 20px ${s.ibg}`, transition: "transform 0.25s, box-shadow 0.25s", position: "relative", overflow: "hidden", cursor: "default" }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px) scale(1.02)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = ""; }}
              >
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, transparent 30%, rgba(255,255,255,0.3) 60%, transparent 100%)", borderRadius: 18, pointerEvents: "none" }} />
                <div style={{ width: 42, height: 42, borderRadius: 12, background: s.ibg, border: `1.5px solid ${s.ib}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.1rem", flexShrink: 0 }}>{s.icon}</div>
                <div style={{ position: "relative", zIndex: 1 }}>
                  <div style={{ fontSize: "1.7rem", fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.val}</div>
                  <div style={{ fontSize: "0.67rem", color: "rgba(168,85,247,0.45)", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600, marginTop: 3 }}>{s.label}</div>
                </div>
              </div>
            ))
        }
      </div>

      {/* Table */}
      <div style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.85), rgba(253,242,248,0.75), rgba(250,245,255,0.75))", backdropFilter: "blur(20px)", border: "1.5px solid rgba(236,72,153,0.12)", borderRadius: 22, overflow: "hidden", boxShadow: "0 8px 40px rgba(236,72,153,0.1)", position: "relative" }}>
        <div style={{ position: "absolute", top: -30, right: -30, width: 120, height: 120, background: "radial-gradient(circle, rgba(236,72,153,0.12), transparent 70%)", borderRadius: "50%", filter: "blur(20px)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -20, left: -20, width: 100, height: 100, background: "radial-gradient(circle, rgba(168,85,247,0.1), transparent 70%)", borderRadius: "50%", filter: "blur(18px)", pointerEvents: "none" }} />

        <div style={{ overflowX: "auto", position: "relative", zIndex: 1 }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "linear-gradient(135deg, rgba(236,72,153,0.06), rgba(168,85,247,0.04))", borderBottom: "1.5px solid rgba(236,72,153,0.1)" }}>
                {["Product", "Quantity", "Status", "Action"].map(h => (
                  <th key={h} style={{ padding: "14px 22px", textAlign: "left", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(168,85,247,0.6)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading
                ? [1,2,3,4,5].map(i => <SkeletonInvRow key={i} />)
                : filtered.length === 0
                  ? <tr><td colSpan={4} style={{ padding: "60px 20px", textAlign: "center", color: "rgba(168,85,247,0.4)" }}>
                      <div style={{ fontSize: "2.8rem", marginBottom: 10 }}>📦</div>
                      <div style={{ fontSize: "0.9rem", fontWeight: 500 }}>No inventory records found</div>
                    </td></tr>
                  : filtered.map(item => {
                      const status = getStockStatus(item.quantity);
                      const maxQty = Math.max(...inventory.map(i => i.quantity), 1);
                      const barW   = Math.min((item.quantity / maxQty) * 100, 100);
                      return (
                        <tr key={item.id}
                          style={{ borderBottom: "1px solid rgba(236,72,153,0.05)", transition: "background 0.15s" }}
                          onMouseEnter={e => e.currentTarget.style.background = "rgba(236,72,153,0.03)"}
                          onMouseLeave={e => e.currentTarget.style.background = ""}>
                          <td style={{ padding: "14px 22px", verticalAlign: "middle" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                              <div style={{ width: 38, height: 38, borderRadius: 12, background: "linear-gradient(135deg, rgba(236,72,153,0.1), rgba(168,85,247,0.1))", border: "1.5px solid rgba(236,72,153,0.18)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem", flexShrink: 0 }}>🎁</div>
                              <span style={{ fontWeight: 600, color: "#4c0280" }}>{item.product_name || item.product}</span>
                            </div>
                          </td>
                          <td style={{ padding: "14px 22px", verticalAlign: "middle" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                              <span style={{ fontSize: "1.2rem", fontWeight: 800, color: status.color, minWidth: 36 }}>{item.quantity}</span>
                              <div style={{ flex: 1, maxWidth: 100, height: 5, background: "rgba(236,72,153,0.08)", borderRadius: 99, overflow: "hidden" }}>
                                <div style={{ height: "100%", width: `${barW}%`, background: "linear-gradient(90deg, #ec4899, #a855f7)", borderRadius: 99, transition: "width 0.6s ease" }} />
                              </div>
                            </div>
                          </td>
                          <td style={{ padding: "14px 22px", verticalAlign: "middle" }}>
                            <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 14px", borderRadius: 999, fontSize: "0.77rem", fontWeight: 600, background: status.bg, border: `1.5px solid ${status.border}`, color: status.color }}>
                              <span style={{ width: 6, height: 6, borderRadius: "50%", background: status.color, boxShadow: `0 0 5px ${status.color}` }} />
                              {status.label}
                            </span>
                          </td>
                          <td style={{ padding: "14px 22px", verticalAlign: "middle" }}>
                            <button onClick={() => openModal(item)}
                              style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "7px 18px", borderRadius: 999, fontSize: "0.8rem", fontWeight: 600, fontFamily: "inherit", cursor: "pointer", border: "1.5px solid rgba(168,85,247,0.28)", background: "rgba(168,85,247,0.07)", color: "#a855f7", transition: "all 0.22s" }}
                              onMouseEnter={e => { e.currentTarget.style.background = "linear-gradient(135deg, #ec4899, #a855f7)"; e.currentTarget.style.color = "white"; e.currentTarget.style.borderColor = "transparent"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(236,72,153,0.38)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                              onMouseLeave={e => { e.currentTarget.style.background = "rgba(168,85,247,0.07)"; e.currentTarget.style.color = "#a855f7"; e.currentTarget.style.borderColor = "rgba(168,85,247,0.28)"; e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = ""; }}>
                              ✏️ Update
                            </button>
                          </td>
                        </tr>
                      );
                    })
              }
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && selectedItem && (
        <div onClick={closeModal} style={{ position: "fixed", inset: 0, background: "rgba(107,33,168,0.12)", backdropFilter: "blur(10px)", zIndex: 999, display: "flex", alignItems: "center", justifyContent: "center", padding: 20, animation: "fadeIn 0.2s ease" }}>
          <div onClick={e => e.stopPropagation()} style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.97), rgba(253,242,248,0.95))", backdropFilter: "blur(30px)", border: "1.5px solid rgba(236,72,153,0.22)", borderRadius: 24, padding: 36, width: "100%", maxWidth: 420, boxShadow: "0 20px 60px rgba(236,72,153,0.22), 0 4px 20px rgba(168,85,247,0.12)", animation: "slideUp 0.25s ease", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: -30, right: -30, width: 120, height: 120, background: "radial-gradient(circle, rgba(236,72,153,0.15), transparent 70%)", borderRadius: "50%", filter: "blur(20px)", pointerEvents: "none" }} />
            <div style={{ position: "absolute", bottom: -20, left: -20, width: 80, height: 80, background: "radial-gradient(circle, rgba(168,85,247,0.12), transparent 70%)", borderRadius: "50%", filter: "blur(16px)", pointerEvents: "none" }} />

            <div style={{ position: "relative", zIndex: 1 }}>
              <h3 style={{ fontSize: "1.3rem", fontWeight: 800, background: "linear-gradient(135deg, #ec4899, #a855f7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginBottom: 6 }}>Update Stock 📦</h3>
              <p style={{ fontSize: "0.82rem", color: "rgba(168,85,247,0.55)", marginBottom: 24, fontWeight: 500 }}>
                Editing: <strong style={{ color: "#ec4899" }}>{selectedItem.product_name || selectedItem.product}</strong>
              </p>
              <div style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(168,85,247,0.5)", marginBottom: 8 }}>New Quantity</div>
              <input type="number" min="0" value={newQty} onChange={e => setNewQty(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleUpdate()} autoFocus
                style={{ width: "100%", background: "rgba(236,72,153,0.04)", border: "1.5px solid rgba(236,72,153,0.22)", borderRadius: 14, padding: "13px 18px", color: "#3b0764", fontFamily: "inherit", fontSize: "1.1rem", fontWeight: 700, outline: "none", boxSizing: "border-box", marginBottom: 22, transition: "all 0.2s" }}
                onFocus={e => { e.target.style.borderColor = "rgba(236,72,153,0.5)"; e.target.style.boxShadow = "0 0 0 3px rgba(236,72,153,0.1)"; }}
                onBlur={e => { e.target.style.borderColor = "rgba(236,72,153,0.22)"; e.target.style.boxShadow = "none"; }}
              />
              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={closeModal} style={{ flex: 1, padding: 12, borderRadius: 12, fontFamily: "inherit", fontSize: "0.88rem", fontWeight: 600, cursor: "pointer", border: "1.5px solid rgba(236,72,153,0.15)", background: "transparent", color: "rgba(168,85,247,0.55)", transition: "all 0.2s" }}
                  onMouseEnter={e => e.target.style.background = "rgba(236,72,153,0.05)"}
                  onMouseLeave={e => e.target.style.background = "transparent"}>
                  Cancel
                </button>
                <button onClick={handleUpdate} disabled={updating} style={{ flex: 2, padding: 12, borderRadius: 12, fontFamily: "inherit", fontSize: "0.88rem", fontWeight: 700, cursor: updating ? "not-allowed" : "pointer", border: "none", background: "linear-gradient(135deg, #ec4899, #a855f7)", color: "white", transition: "all 0.2s", boxShadow: "0 4px 20px rgba(236,72,153,0.38)", opacity: updating ? 0.6 : 1 }}
                  onMouseEnter={e => { if (!updating) e.target.style.boxShadow = "0 6px 24px rgba(236,72,153,0.55)"; e.target.style.transform = "translateY(-1px)"; }}
                  onMouseLeave={e => { e.target.style.boxShadow = "0 4px 20px rgba(236,72,153,0.38)"; e.target.style.transform = ""; }}>
                  {updating ? "Saving..." : "💾 Save Stock"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}