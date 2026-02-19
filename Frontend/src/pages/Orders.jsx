// ══════════════════════════════════════════════════
// Orders.jsx
// ══════════════════════════════════════════════════
import { useEffect, useState } from "react";
import api from "../api/axios";

function SkeletonOrderRow() {
  return (
    <tr style={{ borderBottom: "1px solid rgba(236,72,153,0.05)", animation: "pulse 1.5s ease-in-out infinite" }}>
      <td style={{ padding: "14px 22px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 38, height: 38, borderRadius: 12, background: "rgba(236,72,153,0.12)" }} />
          <div style={{ width: 110, height: 12, borderRadius: 6, background: "rgba(168,85,247,0.1)" }} />
        </div>
      </td>
      <td style={{ padding: "14px 22px" }}><div style={{ width: 80, height: 22, borderRadius: 999, background: "rgba(168,85,247,0.1)" }} /></td>
      <td style={{ padding: "14px 22px" }}><div style={{ width: 70, height: 12, borderRadius: 6, background: "rgba(16,185,129,0.12)" }} /></td>
      <td style={{ padding: "14px 22px" }}><div style={{ width: 80, height: 28, borderRadius: 999, background: "rgba(236,72,153,0.1)" }} /></td>
    </tr>
  );
}

export function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  const loadOrders = () => {
    api.get("orders/")
      .then(res => { setOrders(res.data); setLoading(false); })
      .catch(err => { console.log(err); setLoading(false); });
  };
  useEffect(() => { loadOrders(); }, []);

  const confirmOrder = id => api.post(`orders/${id}/confirm/`).then(loadOrders).catch(() => alert("Error"));
  const deliverOrder = id => api.post(`orders/${id}/deliver/`).then(loadOrders).catch(() => alert("Error"));

  const statusCfg = {
    Draft:     { color: "#d97706", bg: "rgba(245,158,11,0.1)",  border: "rgba(245,158,11,0.3)",  icon: "📝" },
    Confirmed: { color: "#a855f7", bg: "rgba(168,85,247,0.1)",  border: "rgba(168,85,247,0.3)",  icon: "✅" },
    Delivered: { color: "#059669", bg: "rgba(16,185,129,0.1)",  border: "rgba(16,185,129,0.3)",  icon: "🚀" },
  };
  const statuses = ["All", "Draft", "Confirmed", "Delivered"];
  const filtered = orders.filter(o => {
    const ms = o.order_number?.toLowerCase().includes(search.toLowerCase());
    const mf = filterStatus === "All" || o.status === filterStatus;
    return ms && mf;
  });
  const countBy = s => orders.filter(o => o.status === s).length;

  return (
    <div style={{ fontFamily: "'Poppins', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap'); @keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}`}</style>

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
    🛒 Orders
  </h1>

  <p
    style={{
      fontSize: "0.82rem",
      color: "#6b7280",   // simple gray
      marginTop: 4,
      fontWeight: 500,
    }}
  >
    {orders.length} total orders
  </p>
</div>

        <div style={{ display: "flex", alignItems: "center", gap: 10, background: "rgba(255,255,255,0.8)", border: "1.5px solid rgba(236,72,153,0.2)", borderRadius: 999, padding: "9px 18px", backdropFilter: "blur(12px)", minWidth: 220, boxShadow: "0 2px 14px rgba(236,72,153,0.08)" }}>
          <span style={{ color: "#ec4899", opacity: 0.65 }}>🔍</span>
          <input type="text" placeholder="Search order number..." value={search} onChange={e => setSearch(e.target.value)}
            style={{ background: "transparent", border: "none", outline: "none", color: "#3b0764", fontFamily: "inherit", fontSize: "0.87rem", width: "100%", fontWeight: 500 }} />
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {statuses.map(s => (
          <button key={s} onClick={() => setFilterStatus(s)}
            style={{ display: "flex", alignItems: "center", gap: 7, padding: "8px 18px", borderRadius: 999, fontSize: "0.82rem", fontWeight: 600, fontFamily: "inherit", cursor: "pointer", border: filterStatus === s ? "1.5px solid rgba(236,72,153,0.35)" : "1.5px solid rgba(236,72,153,0.15)", background: filterStatus === s ? "linear-gradient(135deg, rgba(253,242,248,0.97), rgba(250,245,255,0.95))" : "rgba(255,255,255,0.7)", color: filterStatus === s ? "#ec4899" : "rgba(168,85,247,0.55)", boxShadow: filterStatus === s ? "0 2px 14px rgba(236,72,153,0.18)" : "none", transition: "all 0.2s" }}>
            {s === "All" ? "🗂️" : statusCfg[s]?.icon} {s}
            <span style={{ background: "rgba(236,72,153,0.1)", borderRadius: 999, padding: "1px 8px", fontSize: "0.7rem", color: "#ec4899" }}>{s === "All" ? orders.length : countBy(s)}</span>
          </button>
        ))}
      </div>

      {/* Table Card */}
      <div style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.85), rgba(253,242,248,0.75), rgba(250,245,255,0.75))", backdropFilter: "blur(20px)", border: "1.5px solid rgba(236,72,153,0.12)", borderRadius: 22, overflow: "hidden", boxShadow: "0 8px 40px rgba(236,72,153,0.1)", position: "relative" }}>
        <div style={{ position: "absolute", top: -30, right: -30, width: 120, height: 120, background: "radial-gradient(circle, rgba(236,72,153,0.12), transparent 70%)", borderRadius: "50%", filter: "blur(20px)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -20, left: -20, width: 100, height: 100, background: "radial-gradient(circle, rgba(168,85,247,0.1), transparent 70%)", borderRadius: "50%", filter: "blur(18px)", pointerEvents: "none" }} />

        <div style={{ overflowX: "auto", position: "relative", zIndex: 1 }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "linear-gradient(135deg, rgba(236,72,153,0.06), rgba(168,85,247,0.04))", borderBottom: "1.5px solid rgba(236,72,153,0.1)" }}>
                {["Order", "Status", "Total Amount", "Actions"].map(h => (
                  <th key={h} style={{ padding: "14px 22px", textAlign: "left", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(168,85,247,0.6)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading
                ? [1,2,3,4,5].map(i => <SkeletonOrderRow key={i} />)
                : filtered.length === 0
                  ? <tr><td colSpan={4} style={{ padding: "60px 20px", textAlign: "center", color: "rgba(168,85,247,0.4)" }}>
                      <div style={{ fontSize: "2.8rem", marginBottom: 10 }}>🛒</div>
                      <div style={{ fontSize: "0.9rem", fontWeight: 500 }}>No orders found</div>
                    </td></tr>
                  : filtered.map(order => {
                      const cfg = statusCfg[order.status] || statusCfg.Draft;
                      return (
                        <tr key={order.id}
                          style={{ borderBottom: "1px solid rgba(236,72,153,0.05)", transition: "background 0.15s" }}
                          onMouseEnter={e => e.currentTarget.style.background = "rgba(236,72,153,0.03)"}
                          onMouseLeave={e => e.currentTarget.style.background = ""}>
                          <td style={{ padding: "14px 22px", verticalAlign: "middle" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                              <div style={{ width: 38, height: 38, borderRadius: 12, background: "linear-gradient(135deg, rgba(236,72,153,0.1), rgba(168,85,247,0.1))", border: "1.5px solid rgba(236,72,153,0.18)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.95rem", flexShrink: 0 }}>{cfg.icon}</div>
                              <span style={{ fontWeight: 700, color: "#4c0280", fontFamily: "monospace", fontSize: "0.85rem", letterSpacing: "0.04em" }}>#{order.order_number}</span>
                            </div>
                          </td>
                          <td style={{ padding: "14px 22px", verticalAlign: "middle" }}>
                            <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 14px", borderRadius: 999, fontSize: "0.77rem", fontWeight: 600, background: cfg.bg, border: `1.5px solid ${cfg.border}`, color: cfg.color }}>
                              <span style={{ width: 6, height: 6, borderRadius: "50%", background: cfg.color, boxShadow: `0 0 5px ${cfg.color}` }} />
                              {order.status}
                            </span>
                          </td>
                          <td style={{ padding: "14px 22px", verticalAlign: "middle", fontWeight: 700, color: "#059669", fontSize: "0.95rem" }}>₹{Number(order.total_amount).toLocaleString("en-IN")}</td>
                          <td style={{ padding: "14px 22px", verticalAlign: "middle" }}>
                            {order.status === "Draft" && (
                              <button onClick={() => confirmOrder(order.id)}
                                style={{ padding: "7px 16px", borderRadius: 999, fontSize: "0.8rem", fontWeight: 600, fontFamily: "inherit", cursor: "pointer", border: "1.5px solid rgba(168,85,247,0.3)", background: "rgba(168,85,247,0.08)", color: "#a855f7", transition: "all 0.2s" }}
                                onMouseEnter={e => { e.target.style.background = "linear-gradient(135deg,#a855f7,#7c3aed)"; e.target.style.color = "white"; e.target.style.borderColor = "transparent"; e.target.style.boxShadow = "0 4px 14px rgba(168,85,247,0.35)"; }}
                                onMouseLeave={e => { e.target.style.background = "rgba(168,85,247,0.08)"; e.target.style.color = "#a855f7"; e.target.style.borderColor = "rgba(168,85,247,0.3)"; e.target.style.boxShadow = "none"; }}>
                                ✅ Confirm
                              </button>
                            )}
                            {order.status === "Confirmed" && (
                              <button onClick={() => deliverOrder(order.id)}
                                style={{ padding: "7px 16px", borderRadius: 999, fontSize: "0.8rem", fontWeight: 600, fontFamily: "inherit", cursor: "pointer", border: "1.5px solid rgba(16,185,129,0.3)", background: "rgba(16,185,129,0.08)", color: "#059669", transition: "all 0.2s" }}
                                onMouseEnter={e => { e.target.style.background = "linear-gradient(135deg,#059669,#10b981)"; e.target.style.color = "white"; e.target.style.borderColor = "transparent"; e.target.style.boxShadow = "0 4px 14px rgba(16,185,129,0.3)"; }}
                                onMouseLeave={e => { e.target.style.background = "rgba(16,185,129,0.08)"; e.target.style.color = "#059669"; e.target.style.borderColor = "rgba(16,185,129,0.3)"; e.target.style.boxShadow = "none"; }}>
                                🚀 Deliver
                              </button>
                            )}
                            {order.status === "Delivered" && (
                              <button disabled style={{ padding: "7px 16px", borderRadius: 999, fontSize: "0.8rem", fontWeight: 600, fontFamily: "inherit", cursor: "default", border: "1.5px solid rgba(236,72,153,0.1)", background: "rgba(236,72,153,0.04)", color: "rgba(236,72,153,0.35)" }}>
                                ✔ Completed
                              </button>
                            )}
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
  );
}

export default Orders;