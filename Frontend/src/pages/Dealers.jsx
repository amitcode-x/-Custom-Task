import { useEffect, useState } from "react";
import api from "../api/axios";

function Dealers() {
  const [dealers, setDealers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const loadDealers = () => {
    api.get("dealers/")
      .then(res => { setDealers(res.data); setLoading(false); })
      .catch(err => { console.log(err); setLoading(false); });
  };

  useEffect(() => { loadDealers(); }, []);

  const filtered = dealers.filter(d =>
    d.name?.toLowerCase().includes(search.toLowerCase()) ||
    d.email?.toLowerCase().includes(search.toLowerCase()) ||
    d.phone?.toLowerCase().includes(search.toLowerCase())
  );

  // Generate initials avatar color from name
  const getAvatarColor = (name = "") => {
    const colors = [
      ["rgba(99,102,241,0.3)", "rgba(99,102,241,0.5)", "#a5b4fc"],
      ["rgba(139,92,246,0.3)", "rgba(139,92,246,0.5)", "#c4b5fd"],
      ["rgba(59,130,246,0.3)", "rgba(59,130,246,0.5)", "#93c5fd"],
      ["rgba(16,185,129,0.3)", "rgba(16,185,129,0.5)", "#6ee7b7"],
      ["rgba(245,158,11,0.3)", "rgba(245,158,11,0.5)", "#fcd34d"],
      ["rgba(239,68,68,0.3)",  "rgba(239,68,68,0.5)",  "#fca5a5"],
    ];
    const idx = name.charCodeAt(0) % colors.length;
    return colors[idx];
  };

  const getInitials = (name = "") =>
    name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap');

        .deal-wrap { font-family: 'Outfit', sans-serif; color: #e2e8f0; }

        /* Header */
        .deal-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 24px;
          flex-wrap: wrap;
          gap: 14px;
        }
        .deal-header h1 {
          font-size: 1.8rem;
          font-weight: 800;
          background: linear-gradient(135deg, #e2e8f0, #a5b4fc);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .deal-header p {
          font-size: 0.82rem;
          color: rgba(148,163,184,0.6);
          margin-top: 3px;
        }

        /* Search */
        .search-box {
          display: flex;
          align-items: center;
          gap: 10px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px;
          padding: 9px 16px;
          backdrop-filter: blur(12px);
          transition: border-color 0.2s;
          min-width: 220px;
        }
        .search-box:focus-within {
          border-color: rgba(99,102,241,0.5);
          box-shadow: 0 0 0 3px rgba(99,102,241,0.1);
        }
        .search-box input {
          background: transparent;
          border: none;
          outline: none;
          color: #e2e8f0;
          font-family: 'Outfit', sans-serif;
          font-size: 0.88rem;
          width: 100%;
        }
        .search-box input::placeholder { color: rgba(148,163,184,0.5); }

        /* Stats Row */
        .stats-row {
          display: flex;
          gap: 16px;
          margin-bottom: 24px;
          flex-wrap: wrap;
        }
        .stat-chip {
          display: flex;
          align-items: center;
          gap: 10px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 14px;
          padding: 14px 20px;
          backdrop-filter: blur(12px);
          flex: 1;
          min-width: 140px;
        }
        .stat-chip-icon {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.1rem;
          flex-shrink: 0;
        }
        .stat-chip-val {
          font-size: 1.6rem;
          font-weight: 800;
          line-height: 1;
        }
        .stat-chip-label {
          font-size: 0.72rem;
          color: rgba(148,163,184,0.55);
          text-transform: uppercase;
          letter-spacing: 0.08em;
          font-weight: 600;
          margin-top: 2px;
        }

        /* Table Card */
        .table-card {
          background: rgba(255,255,255,0.04);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 18px;
          overflow: hidden;
          box-shadow: 0 8px 40px rgba(0,0,0,0.3);
        }

        table { width: 100%; border-collapse: collapse; }
        thead tr {
          background: rgba(99,102,241,0.08);
          border-bottom: 1px solid rgba(99,102,241,0.15);
        }
        thead th {
          padding: 14px 20px;
          text-align: left;
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(165,180,252,0.7);
        }
        tbody tr {
          border-bottom: 1px solid rgba(255,255,255,0.04);
          transition: background 0.15s ease;
        }
        tbody tr:last-child { border-bottom: none; }
        tbody tr:hover { background: rgba(99,102,241,0.07); }
        tbody td {
          padding: 14px 20px;
          font-size: 0.88rem;
          color: rgba(203,213,225,0.9);
          vertical-align: middle;
        }

        /* Dealer Name Cell */
        .dealer-cell {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .dealer-avatar {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.8rem;
          font-weight: 800;
          flex-shrink: 0;
          letter-spacing: 0.02em;
        }
        .dealer-name {
          font-weight: 600;
          color: #e2e8f0;
          font-size: 0.92rem;
        }

        /* Email */
        .email-cell {
          display: flex;
          align-items: center;
          gap: 7px;
          color: rgba(165,180,252,0.8);
          font-size: 0.85rem;
        }

        /* Phone Badge */
        .phone-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(16,185,129,0.1);
          border: 1px solid rgba(16,185,129,0.2);
          color: #6ee7b7;
          padding: 4px 12px;
          border-radius: 999px;
          font-size: 0.8rem;
          font-weight: 500;
        }

        /* Address */
        .address-cell {
          color: rgba(148,163,184,0.7);
          font-size: 0.83rem;
          max-width: 200px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        /* Empty */
        .empty-state {
          text-align: center;
          padding: 60px 20px;
          color: rgba(148,163,184,0.5);
        }
        .empty-icon { font-size: 2.5rem; margin-bottom: 10px; }
        .empty-text { font-size: 0.9rem; }

        /* Loader */
        @keyframes spin { to { transform: rotate(360deg); } }
        .loader-ring {
          width: 40px; height: 40px;
          border: 3px solid rgba(99,102,241,0.2);
          border-top-color: #6366f1;
          border-radius: 50%;
          animation: spin 0.9s linear infinite;
          margin: 60px auto;
        }

        @media (max-width: 768px) {
          .deal-header { flex-direction: column; align-items: flex-start; }
          .search-box { width: 100%; }
          thead th:nth-child(4), tbody td:nth-child(4) { display: none; }
        }
        @media (max-width: 520px) {
          thead th:nth-child(3), tbody td:nth-child(3) { display: none; }
        }
      `}</style>

      <div className="deal-wrap">
        {/* Header */}
        <div className="deal-header">
          <div>
            <h1>Dealers</h1>
            <p>{dealers.length} registered dealers</p>
          </div>
          <div className="search-box">
            <span style={{ fontSize: "1rem", opacity: 0.5 }}>🔍</span>
            <input
              type="text"
              placeholder="Search by name, email, phone..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Stats */}
        <div className="stats-row">
          <div className="stat-chip">
            <div className="stat-chip-icon" style={{ background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.25)" }}>🤝</div>
            <div>
              <div className="stat-chip-val" style={{ color: "#a5b4fc" }}>{dealers.length}</div>
              <div className="stat-chip-label">Total Dealers</div>
            </div>
          </div>
          <div className="stat-chip">
            <div className="stat-chip-icon" style={{ background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.25)" }}>📧</div>
            <div>
              <div className="stat-chip-val" style={{ color: "#34d399" }}>
                {dealers.filter(d => d.email).length}
              </div>
              <div className="stat-chip-label">With Email</div>
            </div>
          </div>
          <div className="stat-chip">
            <div className="stat-chip-icon" style={{ background: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.25)" }}>📍</div>
            <div>
              <div className="stat-chip-val" style={{ color: "#fbbf24" }}>
                {dealers.filter(d => d.address).length}
              </div>
              <div className="stat-chip-label">With Address</div>
            </div>
          </div>
        </div>

        {/* Table Card */}
        <div className="table-card">
          {loading ? (
            <div className="loader-ring" />
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Dealer</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Address</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan="4">
                      <div className="empty-state">
                        <div className="empty-icon">🤝</div>
                        <div className="empty-text">No dealers found</div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filtered.map(dealer => {
                    const [bg, border, textColor] = getAvatarColor(dealer.name);
                    return (
                      <tr key={dealer.id}>
                        <td>
                          <div className="dealer-cell">
                            <div
                              className="dealer-avatar"
                              style={{ background: bg, border: `1px solid ${border}`, color: textColor }}
                            >
                              {getInitials(dealer.name)}
                            </div>
                            <span className="dealer-name">{dealer.name}</span>
                          </div>
                        </td>
                        <td>
                          <div className="email-cell">
                            <span style={{ opacity: 0.5 }}>✉️</span>
                            {dealer.email}
                          </div>
                        </td>
                        <td>
                          <span className="phone-badge">
                            📞 {dealer.phone}
                          </span>
                        </td>
                        <td>
                          <span className="address-cell" title={dealer.address}>
                            📍 {dealer.address}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
}

export default Dealers;