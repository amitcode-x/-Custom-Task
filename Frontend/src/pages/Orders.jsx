import { useEffect, useState } from "react";
import api from "../api/axios";

function Orders() {
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

  const confirmOrder = (id) => {
    api.post(`orders/${id}/confirm/`)
      .then(() => loadOrders())
      .catch(() => alert("Error confirming order"));
  };

  const deliverOrder = (id) => {
    api.post(`orders/${id}/deliver/`)
      .then(() => loadOrders())
      .catch(() => alert("Error delivering order"));
  };

  const statusConfig = {
    Draft:     { color: "#f59e0b", bg: "rgba(245,158,11,0.12)", border: "rgba(245,158,11,0.25)", dot: "#f59e0b", icon: "📝" },
    Confirmed: { color: "#3b82f6", bg: "rgba(59,130,246,0.12)", border: "rgba(59,130,246,0.25)", dot: "#3b82f6", icon: "✅" },
    Delivered: { color: "#10b981", bg: "rgba(16,185,129,0.12)", border: "rgba(16,185,129,0.25)", dot: "#10b981", icon: "🚀" },
  };

  const statuses = ["All", "Draft", "Confirmed", "Delivered"];

  const filtered = orders.filter(o => {
    const matchSearch = o.order_number?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "All" || o.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const countBy = (s) => orders.filter(o => o.status === s).length;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap');

        .ord-wrap { font-family: 'Outfit', sans-serif; color: #e2e8f0; }

        /* Header */
        .ord-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 24px;
          flex-wrap: wrap;
          gap: 14px;
        }
        .ord-header h1 {
          font-size: 1.8rem;
          font-weight: 800;
          background: linear-gradient(135deg, #e2e8f0, #a5b4fc);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .ord-header p {
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

        /* Filter Tabs */
        .filter-tabs {
          display: flex;
          gap: 8px;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }
        .filter-tab {
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 7px 16px;
          border-radius: 999px;
          font-size: 0.82rem;
          font-weight: 600;
          cursor: pointer;
          border: 1px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.04);
          color: rgba(148,163,184,0.7);
          transition: all 0.2s ease;
          font-family: 'Outfit', sans-serif;
        }
        .filter-tab:hover {
          background: rgba(99,102,241,0.1);
          border-color: rgba(99,102,241,0.3);
          color: #c7d2fe;
        }
        .filter-tab.active-tab {
          background: rgba(99,102,241,0.2);
          border-color: rgba(99,102,241,0.45);
          color: #a5b4fc;
          box-shadow: 0 0 14px rgba(99,102,241,0.2);
        }
        .tab-count {
          background: rgba(255,255,255,0.08);
          border-radius: 999px;
          padding: 1px 7px;
          font-size: 0.72rem;
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

        /* Order Number */
        .order-num {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .order-icon {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: rgba(99,102,241,0.15);
          border: 1px solid rgba(99,102,241,0.25);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.95rem;
          flex-shrink: 0;
        }
        .order-num-text {
          font-weight: 700;
          color: #e2e8f0;
          font-family: 'Courier New', monospace;
          font-size: 0.85rem;
          letter-spacing: 0.04em;
        }

        /* Status Badge */
        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 5px 12px;
          border-radius: 999px;
          font-size: 0.78rem;
          font-weight: 600;
        }
        .status-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
        }

        /* Amount */
        .amount-cell {
          font-weight: 700;
          color: #34d399;
          font-size: 0.95rem;
        }

        /* Action Buttons */
        .action-btn {
          padding: 6px 14px;
          border-radius: 8px;
          font-size: 0.8rem;
          font-weight: 600;
          font-family: 'Outfit', sans-serif;
          cursor: pointer;
          border: 1px solid;
          transition: all 0.2s ease;
        }
        .btn-confirm {
          background: rgba(59,130,246,0.15);
          border-color: rgba(59,130,246,0.35);
          color: #93c5fd;
        }
        .btn-confirm:hover {
          background: rgba(59,130,246,0.3);
          box-shadow: 0 0 14px rgba(59,130,246,0.3);
        }
        .btn-deliver {
          background: rgba(16,185,129,0.15);
          border-color: rgba(16,185,129,0.35);
          color: #6ee7b7;
        }
        .btn-deliver:hover {
          background: rgba(16,185,129,0.3);
          box-shadow: 0 0 14px rgba(16,185,129,0.3);
        }
        .btn-done {
          background: rgba(255,255,255,0.04);
          border-color: rgba(255,255,255,0.08);
          color: rgba(148,163,184,0.4);
          cursor: default;
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

        @media (max-width: 640px) {
          .ord-header { flex-direction: column; align-items: flex-start; }
          .search-box { width: 100%; }
          thead th:nth-child(3), tbody td:nth-child(3) { display: none; }
        }
      `}</style>

      <div className="ord-wrap">
        {/* Header */}
        <div className="ord-header">
          <div>
            <h1>Orders</h1>
            <p>{orders.length} total orders</p>
          </div>
          <div className="search-box">
            <span style={{ fontSize: "1rem", opacity: 0.5 }}>🔍</span>
            <input
              type="text"
              placeholder="Search order number..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="filter-tabs">
          {statuses.map(s => (
            <button
              key={s}
              className={`filter-tab ${filterStatus === s ? "active-tab" : ""}`}
              onClick={() => setFilterStatus(s)}
            >
              {s === "All" ? "🗂️" : statusConfig[s]?.icon} {s}
              <span className="tab-count">
                {s === "All" ? orders.length : countBy(s)}
              </span>
            </button>
          ))}
        </div>

        {/* Table Card */}
        <div className="table-card">
          {loading ? (
            <div className="loader-ring" />
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Status</th>
                  <th>Total Amount</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan="4">
                      <div className="empty-state">
                        <div className="empty-icon">🛒</div>
                        <div className="empty-text">No orders found</div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filtered.map(order => {
                    const cfg = statusConfig[order.status] || statusConfig["Draft"];
                    return (
                      <tr key={order.id}>
                        <td>
                          <div className="order-num">
                            <div className="order-icon">{cfg.icon}</div>
                            <span className="order-num-text">#{order.order_number}</span>
                          </div>
                        </td>

                        <td>
                          <span
                            className="status-badge"
                            style={{
                              background: cfg.bg,
                              border: `1px solid ${cfg.border}`,
                              color: cfg.color,
                            }}
                          >
                            <span
                              className="status-dot"
                              style={{ background: cfg.dot, boxShadow: `0 0 6px ${cfg.dot}` }}
                            />
                            {order.status}
                          </span>
                        </td>

                        <td>
                          <span className="amount-cell">
                            ₹{Number(order.total_amount).toLocaleString("en-IN")}
                          </span>
                        </td>

                        <td>
                          {order.status === "Draft" && (
                            <button className="action-btn btn-confirm" onClick={() => confirmOrder(order.id)}>
                              ✅ Confirm
                            </button>
                          )}
                          {order.status === "Confirmed" && (
                            <button className="action-btn btn-deliver" onClick={() => deliverOrder(order.id)}>
                              🚀 Deliver
                            </button>
                          )}
                          {order.status === "Delivered" && (
                            <button className="action-btn btn-done" disabled>
                              ✔ Completed
                            </button>
                          )}
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

export default Orders;