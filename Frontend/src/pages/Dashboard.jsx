import { useEffect, useState } from "react";
import api from "../api/axios";

// ── Skeleton Components ────────────────────────────────────────
function SkeletonStatCard() {
  return (
    <div className="relative bg-white/50 backdrop-blur-md rounded-2xl p-5 border border-white/40 overflow-hidden animate-pulse">
      <div className="flex justify-between items-start mb-4">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-200/80 to-purple-200/80" />
        <div className="w-20 h-3 rounded-full bg-pink-100/80" />
      </div>
      <div className="w-16 h-10 rounded-lg bg-gradient-to-r from-pink-200/60 to-purple-200/60 mb-2" />
      <div className="w-24 h-2.5 rounded-full bg-pink-100/60" />
    </div>
  );
}

function SkeletonWide() {
  return (
    <div className="relative bg-white/50 backdrop-blur-md rounded-2xl p-7 border border-white/40 animate-pulse overflow-hidden">
      <div className="w-28 h-3 rounded-full bg-pink-200/70 mb-4" />
      <div className="w-44 h-10 rounded-lg bg-gradient-to-r from-pink-200/60 to-purple-200/60 mb-3" />
      <div className="w-52 h-2.5 rounded-full bg-pink-100/60" />
    </div>
  );
}

// ── Dashboard ─────────────────────────────────────────────────
export default function Dashboard() {
  const [report, setReport] = useState(null);

  useEffect(() => {
    api
      .get("orders/report/")
      .then((res) => setReport(res.data))
      .catch((err) => console.log(err));
  }, []);

  const cards = report
    ? [
        {
          title: "Total Orders",
          value: report.total_orders,
          icon: "🛒",
          gradFrom: "#f472b6",
          gradTo: "#ec4899",
          bgFrom: "from-pink-50",
          bgTo: "to-rose-50",
          borderC: "border-pink-200/60",
          glow: "rgba(244,63,94,0.18)",
          iconBg: "rgba(244,114,182,0.12)",
          iconBorder: "rgba(244,114,182,0.25)",
        },
        {
          title: "Draft Orders",
          value: report.draft_orders,
          icon: "📝",
          gradFrom: "#fb923c",
          gradTo: "#f59e0b",
          bgFrom: "from-amber-50",
          bgTo: "to-orange-50",
          borderC: "border-amber-200/60",
          glow: "rgba(245,158,11,0.15)",
          iconBg: "rgba(251,146,60,0.12)",
          iconBorder: "rgba(251,146,60,0.25)",
        },
        {
          title: "Confirmed Orders",
          value: report.confirmed_orders,
          icon: "✅",
          gradFrom: "#c084fc",
          gradTo: "#a855f7",
          bgFrom: "from-violet-50",
          bgTo: "to-purple-50",
          borderC: "border-violet-200/60",
          glow: "rgba(168,85,247,0.15)",
          iconBg: "rgba(192,132,252,0.12)",
          iconBorder: "rgba(192,132,252,0.25)",
        },
        {
          title: "Delivered Orders",
          value: report.delivered_orders,
          icon: "🚀",
          gradFrom: "#34d399",
          gradTo: "#10b981",
          bgFrom: "from-emerald-50",
          bgTo: "to-teal-50",
          borderC: "border-emerald-200/60",
          glow: "rgba(16,185,129,0.15)",
          iconBg: "rgba(52,211,153,0.12)",
          iconBorder: "rgba(52,211,153,0.25)",
        },
      ]
    : [];

  const summaryRows = report
    ? [
        {
          label: "Draft",
          value: report.draft_orders,
          dot: "#f59e0b",
          from: "#fb923c",
          to: "#f59e0b",
        },
        {
          label: "Confirmed",
          value: report.confirmed_orders,
          dot: "#a855f7",
          from: "#c084fc",
          to: "#a855f7",
        },
        {
          label: "Delivered",
          value: report.delivered_orders,
          dot: "#10b981",
          from: "#34d399",
          to: "#10b981",
        },
      ]
    : [];

  return (
    <div style={{ fontFamily: "'Poppins', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');`}</style>

      {/* Page Header */}
      <div style={{ marginBottom: 28 }}>
        <h1
          style={{
            fontSize: "1.9rem",
            fontWeight: 800,
            color: "#6b7280",
            letterSpacing: "-0.02em",
            margin: 0,
          }}
        >
           Dashboard
        </h1>
        <p
          style={{
            fontSize: "0.83rem",
            color: "rgba(168,85,247,0.6)",
            marginTop: 4,
            fontWeight: 500,
          }}
        >
          Welcome back, Admin! Here's today's overview.
        </p>
      </div>

      {/* Stat Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 16,
          marginBottom: 20,
        }}
      >
        {!report
          ? [1, 2, 3, 4].map((i) => <SkeletonStatCard key={i} />)
          : cards.map((card) => (
              <div
                key={card.title}
                className="group"
                style={{
                  position: "relative",
                  background: `linear-gradient(135deg, var(--tw-gradient-from, #fdf2f8), var(--tw-gradient-to, #faf5ff))`,
                  backdropFilter: "blur(16px)",
                  borderRadius: 20,
                  padding: "20px 22px",
                  border: `1.5px solid rgba(236,72,153,0.15)`,
                  overflow: "hidden",
                  transition: "transform 0.35s, box-shadow 0.35s",
                  boxShadow: `0 8px 32px ${card.glow}`,
                  cursor: "default",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px) scale(1.02)";
                  e.currentTarget.style.boxShadow = `0 16px 48px ${card.glow}`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "";
                  e.currentTarget.style.boxShadow = `0 8px 32px ${card.glow}`;
                }}
              >
                {/* Gradient background */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: `linear-gradient(135deg, ${card.gradFrom}12, ${card.gradTo}08)`,
                    borderRadius: 20,
                    zIndex: 0,
                  }}
                />
                {/* Blob top right */}
                <div
                  style={{
                    position: "absolute",
                    top: -24,
                    right: -24,
                    width: 80,
                    height: 80,
                    background: `radial-gradient(circle, ${card.gradFrom}50, transparent 70%)`,
                    borderRadius: "50%",
                    filter: "blur(20px)",
                    zIndex: 0,
                  }}
                />
                {/* Shine overlay */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "linear-gradient(135deg, transparent 30%, rgba(255,255,255,0.35) 60%, transparent 100%)",
                    borderRadius: 20,
                    opacity: 0,
                    transition: "opacity 0.4s",
                    zIndex: 1,
                    pointerEvents: "none",
                  }}
                  className="shine-overlay"
                />

                {/* Content */}
                <div style={{ position: "relative", zIndex: 2 }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      marginBottom: 16,
                    }}
                  >
                    {/* Icon box — faded bg, no solid gradient */}
                    <div
                      style={{
                        width: 46,
                        height: 46,
                        borderRadius: 14,
                        background: card.iconBg,
                        border: `1.5px solid ${card.iconBorder}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "1.3rem",
                      }}
                    >
                      {card.icon}
                    </div>
                    <span
                      style={{
                        fontSize: "0.62rem",
                        fontWeight: 700,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        color: "rgba(168,85,247,0.5)",
                        textAlign: "right",
                        lineHeight: 1.3,
                      }}
                    >
                      {card.title}
                    </span>
                  </div>
                  <div
                    style={{
                      fontSize: "2.8rem",
                      fontWeight: 800,
                      background: `linear-gradient(135deg, ${card.gradFrom}, ${card.gradTo})`,
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      letterSpacing: "-0.03em",
                      lineHeight: 1,
                    }}
                  >
                    {card.value}
                  </div>
                  <div
                    style={{
                      fontSize: "0.68rem",
                      color: "rgba(168,85,247,0.4)",
                      marginTop: 6,
                      fontWeight: 600,
                    }}
                  >
                    Total count
                  </div>
                </div>
                {/* Bottom glow */}
                <div
                  style={{
                    position: "absolute",
                    bottom: -8,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: "60%",
                    height: 16,
                    background: `linear-gradient(90deg, ${card.gradFrom}, ${card.gradTo})`,
                    opacity: 0,
                    filter: "blur(12px)",
                    borderRadius: "50%",
                    transition: "opacity 0.4s",
                    zIndex: 0,
                  }}
                />
              </div>
            ))}
      </div>

      {/* Bottom Row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {!report ? (
          <>
            <SkeletonWide />
            <SkeletonWide />
          </>
        ) : (
          <>
            {/* Revenue Card */}
            <div
              style={{
                position: "relative",
                background: "linear-gradient(135deg, rgba(236,253,245,0.9), rgba(204,251,241,0.85))",
                backdropFilter: "blur(20px)",
                borderRadius: 22,
                padding: "28px 30px",
                border: "1.5px solid rgba(16,185,129,0.2)",
                overflow: "hidden",
                boxShadow: "0 8px 32px rgba(16,185,129,0.15)",
                transition: "transform 0.35s, box-shadow 0.35s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-4px) scale(1.02)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = ""; }}
            >
              <div style={{ position: "absolute", top: -30, right: -30, width: 120, height: 120, background: "radial-gradient(circle, rgba(16,185,129,0.3), transparent 70%)", borderRadius: "50%", filter: "blur(24px)" }} />
              <div style={{ position: "absolute", bottom: -20, left: -20, width: 100, height: 100, background: "radial-gradient(circle, rgba(52,211,153,0.2), transparent 70%)", borderRadius: "50%", filter: "blur(20px)" }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, transparent 30%, rgba(255,255,255,0.3) 60%, transparent 100%)", borderRadius: 22, pointerEvents: "none" }} />
              <div style={{ position: "relative", zIndex: 1 }}>
                <p style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(5,150,105,0.7)", marginBottom: 10 }}>
                  💰 Total Revenue
                </p>
                <p style={{ fontSize: "2.8rem", fontWeight: 800, background: "linear-gradient(135deg, #059669, #10b981)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", letterSpacing: "-0.02em", lineHeight: 1.1 }}>
                  ₹{Number(report.total_revenue).toLocaleString("en-IN")}
                </p>
                <p style={{ fontSize: "0.77rem", color: "rgba(5,150,105,0.5)", marginTop: 10, fontWeight: 500 }}>
                  Across confirmed & delivered orders
                </p>
              </div>
            </div>

            {/* Summary Card */}
            <div
              style={{
                position: "relative",
                background: "linear-gradient(135deg, rgba(255,255,255,0.85), rgba(253,242,248,0.8), rgba(250,245,255,0.8))",
                backdropFilter: "blur(20px)",
                borderRadius: 22,
                padding: "28px 30px",
                border: "1.5px solid rgba(236,72,153,0.12)",
                overflow: "hidden",
                boxShadow: "0 8px 32px rgba(236,72,153,0.1)",
                transition: "transform 0.35s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-4px) scale(1.02)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = ""; }}
            >
              <div style={{ position: "absolute", top: -20, right: -20, width: 100, height: 100, background: "radial-gradient(circle, rgba(236,72,153,0.2), transparent 70%)", borderRadius: "50%", filter: "blur(20px)" }} />
              <div style={{ position: "absolute", bottom: -20, left: -20, width: 80, height: 80, background: "radial-gradient(circle, rgba(168,85,247,0.15), transparent 70%)", borderRadius: "50%", filter: "blur(18px)" }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, transparent 30%, rgba(255,255,255,0.3) 60%, transparent 100%)", borderRadius: 22, pointerEvents: "none" }} />
              <div style={{ position: "relative", zIndex: 1 }}>
                <p style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(168,85,247,0.5)", marginBottom: 18 }}>
                  📊 Order Breakdown
                </p>
                {summaryRows.map((row) => {
                  const pct = report.total_orders > 0 ? Math.round((row.value / report.total_orders) * 100) : 0;
                  return (
                    <div key={row.label} style={{ paddingBottom: 12, marginBottom: 4, borderBottom: "1px solid rgba(236,72,153,0.07)" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.87rem", color: "rgba(107,33,168,0.65)", fontWeight: 500 }}>
                          <div style={{ width: 8, height: 8, borderRadius: "50%", background: row.dot, boxShadow: `0 0 8px ${row.dot}` }} />
                          {row.label}
                        </div>
                        <span style={{ fontSize: "0.88rem", fontWeight: 700, color: row.dot }}>
                          {row.value}{" "}
                          <span style={{ color: "rgba(168,85,247,0.35)", fontWeight: 400, fontSize: "0.72rem" }}>({pct}%)</span>
                        </span>
                      </div>
                      <div style={{ width: "100%", height: 5, background: "rgba(236,72,153,0.07)", borderRadius: 99, overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${pct}%`, background: `linear-gradient(90deg, ${row.from}, ${row.to})`, borderRadius: 99, transition: "width 0.7s ease" }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>

      <style>{`
        @media (max-width: 700px) {
          .dash-bottom-row { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}