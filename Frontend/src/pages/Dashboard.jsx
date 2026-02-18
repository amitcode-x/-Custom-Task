import { useEffect, useState } from "react";
import api from "../api/axios";

function Dashboard() {
  const [report, setReport] = useState(null);

  useEffect(() => {
    api.get("orders/report/")
      .then(res => setReport(res.data))
      .catch(err => console.log(err));
  }, []);

  if (!report) {
    return (
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap');
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
          .loader-wrap {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 60vh;
            gap: 16px;
            font-family: 'Outfit', sans-serif;
          }
          .loader-ring {
            width: 48px;
            height: 48px;
            border: 3px solid rgba(99,102,241,0.2);
            border-top-color: #6366f1;
            border-radius: 50%;
            animation: spin 0.9s linear infinite;
          }
          .loader-text {
            color: rgba(165,180,252,0.6);
            font-size: 0.9rem;
            font-weight: 500;
            letter-spacing: 0.05em;
          }
        `}</style>
        <div className="loader-wrap">
          <div className="loader-ring" />
          <p className="loader-text">Loading Dashboard...</p>
        </div>
      </>
    );
  }

  const cards = [
    {
      title: "Total Orders",
      value: report.total_orders,
      icon: "🛒",
      color: "#6366f1",
      glow: "rgba(99,102,241,0.25)",
      bg: "rgba(99,102,241,0.1)",
      border: "rgba(99,102,241,0.25)",
    },
    {
      title: "Draft Orders",
      value: report.draft_orders,
      icon: "📝",
      color: "#f59e0b",
      glow: "rgba(245,158,11,0.2)",
      bg: "rgba(245,158,11,0.08)",
      border: "rgba(245,158,11,0.25)",
    },
    {
      title: "Confirmed Orders",
      value: report.confirmed_orders,
      icon: "✅",
      color: "#3b82f6",
      glow: "rgba(59,130,246,0.2)",
      bg: "rgba(59,130,246,0.08)",
      border: "rgba(59,130,246,0.25)",
    },
    {
      title: "Delivered Orders",
      value: report.delivered_orders,
      icon: "🚀",
      color: "#10b981",
      glow: "rgba(16,185,129,0.2)",
      bg: "rgba(16,185,129,0.08)",
      border: "rgba(16,185,129,0.25)",
    },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap');

        .dash-wrap {
          font-family: 'Outfit', sans-serif;
          color: #e2e8f0;
        }

        /* ── Header ── */
        .dash-header {
          margin-bottom: 28px;
        }
        .dash-header h1 {
          font-size: 1.8rem;
          font-weight: 800;
          background: linear-gradient(135deg, #e2e8f0, #a5b4fc);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          letter-spacing: -0.01em;
        }
        .dash-header p {
          font-size: 0.85rem;
          color: rgba(148,163,184,0.7);
          margin-top: 4px;
          font-weight: 400;
        }

        /* ── Cards Grid ── */
        .cards-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 18px;
          margin-bottom: 24px;
        }

        @media (max-width: 1100px) {
          .cards-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 600px) {
          .cards-grid { grid-template-columns: 1fr; }
        }

        /* ── Stat Card ── */
        .stat-card {
          background: rgba(255,255,255,0.04);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-radius: 16px;
          padding: 22px 20px;
          border: 1px solid;
          position: relative;
          overflow: hidden;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          cursor: default;
        }
        .stat-card:hover {
          transform: translateY(-3px);
        }
        .stat-card::before {
          content: '';
          position: absolute;
          top: -30px;
          right: -30px;
          width: 100px;
          height: 100px;
          border-radius: 50%;
          opacity: 0.15;
        }

        .card-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 16px;
        }
        .card-icon-wrap {
          width: 42px;
          height: 42px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2rem;
        }
        .card-title {
          font-size: 0.78rem;
          font-weight: 600;
          letter-spacing: 0.07em;
          text-transform: uppercase;
          color: rgba(148,163,184,0.8);
          text-align: right;
        }
        .card-value {
          font-size: 2.4rem;
          font-weight: 800;
          letter-spacing: -0.02em;
          line-height: 1;
        }
        .card-sub {
          font-size: 0.75rem;
          color: rgba(148,163,184,0.5);
          margin-top: 6px;
          font-weight: 400;
        }

        /* ── Bottom Row ── */
        .bottom-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 18px;
        }
        @media (max-width: 860px) {
          .bottom-row { grid-template-columns: 1fr; }
        }

        /* ── Revenue Card ── */
        .revenue-card {
          background: rgba(255,255,255,0.04);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(16,185,129,0.25);
          border-radius: 16px;
          padding: 24px;
          position: relative;
          overflow: hidden;
          box-shadow: 0 0 30px rgba(16,185,129,0.08);
        }
        .revenue-card::before {
          content: '';
          position: absolute;
          bottom: -40px;
          right: -40px;
          width: 150px;
          height: 150px;
          background: radial-gradient(circle, rgba(16,185,129,0.15), transparent 70%);
          border-radius: 50%;
        }
        .revenue-label {
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(52,211,153,0.7);
          margin-bottom: 10px;
        }
        .revenue-amount {
          font-size: 2.6rem;
          font-weight: 800;
          background: linear-gradient(135deg, #34d399, #6ee7b7);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          letter-spacing: -0.02em;
          line-height: 1.1;
        }
        .revenue-sub {
          font-size: 0.8rem;
          color: rgba(148,163,184,0.5);
          margin-top: 8px;
        }
        .revenue-icon {
          position: absolute;
          top: 20px;
          right: 24px;
          font-size: 2rem;
          opacity: 0.3;
        }

        /* ── Summary Card ── */
        .summary-card {
          background: rgba(255,255,255,0.04);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 16px;
          padding: 24px;
        }
        .summary-title {
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(148,163,184,0.6);
          margin-bottom: 16px;
        }
        .summary-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 0;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .summary-row:last-child {
          border-bottom: none;
        }
        .summary-row-left {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 0.88rem;
          color: rgba(203,213,225,0.8);
        }
        .summary-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          flex-shrink: 0;
        }
        .summary-row-right {
          font-size: 0.9rem;
          font-weight: 700;
        }
        .summary-bar-wrap {
          margin-top: 6px;
          height: 4px;
          background: rgba(255,255,255,0.06);
          border-radius: 4px;
          overflow: hidden;
          margin-bottom: 2px;
        }
        .summary-bar {
          height: 100%;
          border-radius: 4px;
          transition: width 0.8s ease;
        }
      `}</style>

      <div className="dash-wrap">
        {/* Header */}
        <div className="dash-header">
          <h1>Dashboard</h1>
          <p>Welcome back, Admin! Here's what's happening today.</p>
        </div>

        {/* Stat Cards */}
        <div className="cards-grid">
          {cards.map((card) => (
            <div
              key={card.title}
              className="stat-card"
              style={{
                borderColor: card.border,
                boxShadow: `0 0 24px ${card.glow}`,
              }}
            >
              <div
                className="stat-card-bg"
                style={{
                  position: "absolute",
                  top: "-30px",
                  right: "-30px",
                  width: "100px",
                  height: "100px",
                  borderRadius: "50%",
                  background: `radial-gradient(circle, ${card.glow}, transparent 70%)`,
                }}
              />
              <div className="card-top">
                <div
                  className="card-icon-wrap"
                  style={{ background: card.bg, border: `1px solid ${card.border}` }}
                >
                  {card.icon}
                </div>
                <span className="card-title">{card.title}</span>
              </div>
              <div className="card-value" style={{ color: card.color }}>
                {card.value}
              </div>
              <div className="card-sub">Total count</div>
            </div>
          ))}
        </div>

        {/* Bottom Row */}
        <div className="bottom-row">
          {/* Revenue */}
          <div className="revenue-card">
            <span className="revenue-icon">💰</span>
            <div className="revenue-label">Total Revenue</div>
            <div className="revenue-amount">₹ {Number(report.total_revenue).toLocaleString("en-IN")}</div>
            <div className="revenue-sub">Across all confirmed &amp; delivered orders</div>
          </div>

          {/* Order Summary */}
          <div className="summary-card">
            <div className="summary-title">Order Breakdown</div>

            {[
              { label: "Draft", value: report.draft_orders, total: report.total_orders, color: "#f59e0b" },
              { label: "Confirmed", value: report.confirmed_orders, total: report.total_orders, color: "#3b82f6" },
              { label: "Delivered", value: report.delivered_orders, total: report.total_orders, color: "#10b981" },
            ].map((row) => {
              const pct = report.total_orders > 0
                ? Math.round((row.value / report.total_orders) * 100)
                : 0;
              return (
                <div key={row.label}>
                  <div className="summary-row">
                    <div className="summary-row-left">
                      <div className="summary-dot" style={{ background: row.color, boxShadow: `0 0 6px ${row.color}` }} />
                      {row.label}
                    </div>
                    <span className="summary-row-right" style={{ color: row.color }}>
                      {row.value} <span style={{ color: "rgba(148,163,184,0.4)", fontWeight: 400, fontSize: "0.75rem" }}>({pct}%)</span>
                    </span>
                  </div>
                  <div className="summary-bar-wrap">
                    <div className="summary-bar" style={{ width: `${pct}%`, background: row.color }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;