import { useEffect, useState } from "react";
import api from "../api/axios";

function SkeletonDealerRow() {
  return (
    <tr style={{ borderBottom: "1px solid rgba(236,72,153,0.05)", animation: "pulse 1.5s ease-in-out infinite" }}>
      <td style={{ padding: "14px 22px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: "linear-gradient(135deg, rgba(236,72,153,0.15), rgba(168,85,247,0.12))" }} />
          <div style={{ width: 130, height: 12, borderRadius: 6, background: "rgba(236,72,153,0.12)" }} />
        </div>
      </td>
      <td style={{ padding: "14px 22px" }}><div style={{ width: 150, height: 12, borderRadius: 6, background: "rgba(168,85,247,0.1)" }} /></td>
      <td style={{ padding: "14px 22px" }}><div style={{ width: 100, height: 22, borderRadius: 999, background: "rgba(16,185,129,0.1)" }} /></td>
      <td style={{ padding: "14px 22px" }}><div style={{ width: 140, height: 12, borderRadius: 6, background: "rgba(168,85,247,0.08)" }} /></td>
    </tr>
  );
}

function SkeletonStatChip() {
  return (
    <div style={{ flex: 1, minWidth: 140, background: "rgba(255,255,255,0.5)", border: "1.5px solid rgba(236,72,153,0.08)", borderRadius: 18, padding: "16px 22px", display: "flex", alignItems: "center", gap: 12, animation: "pulse 1.5s ease-in-out infinite" }}>
      <div style={{ width: 42, height: 42, borderRadius: 12, background: "rgba(236,72,153,0.12)" }} />
      <div>
        <div style={{ width: 36, height: 22, borderRadius: 8, background: "rgba(236,72,153,0.12)", marginBottom: 6 }} />
        <div style={{ width: 70, height: 8, borderRadius: 4, background: "rgba(168,85,247,0.08)" }} />
      </div>
    </div>
  );
}

const AVATAR_COLORS = [
  ["rgba(236,72,153,0.15)", "rgba(236,72,153,0.38)", "#ec4899"],
  ["rgba(168,85,247,0.15)", "rgba(168,85,247,0.38)", "#a855f7"],
  ["rgba(99,102,241,0.15)", "rgba(99,102,241,0.38)", "#6366f1"],
  ["rgba(16,185,129,0.15)", "rgba(16,185,129,0.38)", "#059669"],
  ["rgba(245,158,11,0.15)", "rgba(245,158,11,0.38)", "#d97706"],
  ["rgba(239,68,68,0.15)",  "rgba(239,68,68,0.38)",  "#ef4444"],
];
const getAvatarColor = (name = "") => AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];
const getInitials    = (name = "") => name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);

export default function Dealers() {
  const [dealers, setDealers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState("");

  useEffect(() => {
    api.get("dealers/")
      .then(res => { setDealers(res.data); setLoading(false); })
      .catch(err => { console.log(err); setLoading(false); });
  }, []);

  const filtered = dealers.filter(d =>
    d.name?.toLowerCase().includes(search.toLowerCase()) ||
    d.email?.toLowerCase().includes(search.toLowerCase()) ||
    d.phone?.toLowerCase().includes(search.toLowerCase())
  );

  const statChips = [
    { icon: "🤝", label: "Total Dealers", val: dealers.length,                          color: "#ec4899", ibg: "rgba(236,72,153,0.1)", ib: "rgba(236,72,153,0.2)" },
    { icon: "📧", label: "With Email",    val: dealers.filter(d => d.email).length,     color: "#a855f7", ibg: "rgba(168,85,247,0.1)", ib: "rgba(168,85,247,0.2)" },
    { icon: "📍", label: "With Address",  val: dealers.filter(d => d.address).length,   color: "#059669", ibg: "rgba(16,185,129,0.1)", ib: "rgba(16,185,129,0.2)" },
  ];

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
    🤝 Dealers
  </h1>

  <p
    style={{
      fontSize: "0.82rem",
      color: "#6b7280",   // simple gray
      marginTop: 4,
      fontWeight: 500,
    }}
  >
    {dealers.length} registered dealers
  </p>
</div>

        <div style={{ display: "flex", alignItems: "center", gap: 10, background: "rgba(255,255,255,0.8)", border: "1.5px solid rgba(236,72,153,0.2)", borderRadius: 999, padding: "9px 18px", backdropFilter: "blur(12px)", minWidth: 220, boxShadow: "0 2px 14px rgba(236,72,153,0.08)" }}>
          <span style={{ color: "#ec4899", opacity: 0.65 }}>🔍</span>
          <input type="text" placeholder="Search by name, email, phone..." value={search} onChange={e => setSearch(e.target.value)}
            style={{ background: "transparent", border: "none", outline: "none", color: "#3b0764", fontFamily: "inherit", fontSize: "0.87rem", width: "100%", fontWeight: 500 }} />
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: "flex", gap: 16, marginBottom: 24, flexWrap: "wrap" }}>
        {loading
          ? [1,2,3].map(i => <SkeletonStatChip key={i} />)
          : statChips.map(s => (
              <div key={s.label} className="group"
                style={{ flex: 1, minWidth: 140, background: "linear-gradient(135deg, rgba(255,255,255,0.88), rgba(253,242,248,0.75))", backdropFilter: "blur(16px)", border: `1.5px solid ${s.ibg.replace("0.1","0.18")}`, borderRadius: 18, padding: "16px 22px", display: "flex", alignItems: "center", gap: 12, boxShadow: `0 4px 20px ${s.ibg}`, transition: "transform 0.25s, box-shadow 0.25s", position: "relative", overflow: "hidden", cursor: "default" }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px) scale(1.02)"; e.currentTarget.style.boxShadow = `0 10px 30px ${s.ibg.replace("0.1","0.25")}`; }}
                onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = `0 4px 20px ${s.ibg}`; }}
              >
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, transparent 30%, rgba(255,255,255,0.35) 60%, transparent 100%)", borderRadius: 18, pointerEvents: "none" }} />
                <div style={{ width: 42, height: 42, borderRadius: 12, background: s.ibg, border: `1.5px solid ${s.ib}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.15rem", flexShrink: 0 }}>{s.icon}</div>
                <div style={{ position: "relative", zIndex: 1 }}>
                  <div style={{ fontSize: "1.7rem", fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.val}</div>
                  <div style={{ fontSize: "0.68rem", color: "rgba(168,85,247,0.45)", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600, marginTop: 3 }}>{s.label}</div>
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
                {["Dealer", "Email", "Phone", "Address"].map(h => (
                  <th key={h} style={{ padding: "14px 22px", textAlign: "left", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(168,85,247,0.6)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading
                ? [1,2,3,4,5].map(i => <SkeletonDealerRow key={i} />)
                : filtered.length === 0
                  ? <tr><td colSpan={4} style={{ padding: "60px 20px", textAlign: "center", color: "rgba(168,85,247,0.4)" }}>
                      <div style={{ fontSize: "2.8rem", marginBottom: 10 }}>🤝</div>
                      <div style={{ fontSize: "0.9rem", fontWeight: 500 }}>No dealers found</div>
                    </td></tr>
                  : filtered.map(dealer => {
                      const [bg, border, textColor] = getAvatarColor(dealer.name);
                      return (
                        <tr key={dealer.id}
                          style={{ borderBottom: "1px solid rgba(236,72,153,0.05)", transition: "background 0.15s" }}
                          onMouseEnter={e => e.currentTarget.style.background = "rgba(236,72,153,0.03)"}
                          onMouseLeave={e => e.currentTarget.style.background = ""}>
                          <td style={{ padding: "14px 22px", verticalAlign: "middle" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                              <div style={{ width: 40, height: 40, borderRadius: 12, background: bg, border: `1.5px solid ${border}`, color: textColor, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.8rem", fontWeight: 800, flexShrink: 0 }}>
                                {getInitials(dealer.name)}
                              </div>
                              <span style={{ fontWeight: 600, color: "#4c0280", fontSize: "0.9rem" }}>{dealer.name}</span>
                            </div>
                          </td>
                          <td style={{ padding: "14px 22px", verticalAlign: "middle", fontSize: "0.85rem", color: "rgba(168,85,247,0.7)", fontWeight: 500 }}>
                            <span style={{ display: "flex", alignItems: "center", gap: 6 }}>✉️ {dealer.email}</span>
                          </td>
                          <td style={{ padding: "14px 22px", verticalAlign: "middle" }}>
                            <span style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(16,185,129,0.08)", border: "1.5px solid rgba(16,185,129,0.2)", color: "#059669", padding: "4px 14px", borderRadius: 999, fontSize: "0.8rem", fontWeight: 500 }}>
                              📞 {dealer.phone}
                            </span>
                          </td>
                          <td style={{ padding: "14px 22px", verticalAlign: "middle", color: "rgba(168,85,247,0.5)", fontSize: "0.82rem", maxWidth: 200, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                            📍 {dealer.address}
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