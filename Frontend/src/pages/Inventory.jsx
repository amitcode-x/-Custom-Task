import { useEffect, useState } from "react";
import api from "../api/axios";

function Inventory() {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [newQty, setNewQty] = useState("");
  const [updating, setUpdating] = useState(false);

  const loadInventory = () => {
    api.get("inventory/")
      .then(res => { setInventory(res.data); setLoading(false); })
      .catch(err => { console.log(err); setLoading(false); });
  };

  useEffect(() => { loadInventory(); }, []);

  const openModal = (item) => {
    setSelectedItem(item);
    setNewQty(item.quantity);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedItem(null);
    setNewQty("");
  };

  const handleUpdate = () => {
    if (newQty === "" || isNaN(newQty) || Number(newQty) < 0) {
      alert("Please enter a valid quantity");
      return;
    }
    setUpdating(true);
    api.put(`inventory/${selectedItem.id}/adjust/`, { quantity: Number(newQty) })
      .then(() => {
        setUpdating(false);
        closeModal();
        loadInventory();
      })
      .catch(() => {
        setUpdating(false);
        alert("Error updating stock");
      });
  };

  const filtered = inventory.filter(item =>
    (item.product_name || item.product)?.toString().toLowerCase().includes(search.toLowerCase())
  );

  const totalStock = inventory.reduce((sum, i) => sum + (i.quantity || 0), 0);
  const lowStock   = inventory.filter(i => i.quantity > 0 && i.quantity <= 10).length;
  const outStock   = inventory.filter(i => i.quantity === 0).length;
  const inStock    = inventory.filter(i => i.quantity > 10).length;

  const getStockStatus = (qty) => {
    if (qty === 0)   return { label: "Out of Stock", cls: "out",  color: "#f87171", bg: "rgba(239,68,68,0.12)",   border: "rgba(239,68,68,0.25)" };
    if (qty <= 10)   return { label: "Low Stock",    cls: "low",  color: "#fbbf24", bg: "rgba(245,158,11,0.12)", border: "rgba(245,158,11,0.25)" };
    return             { label: "In Stock",      cls: "ok",   color: "#34d399", bg: "rgba(16,185,129,0.12)",  border: "rgba(16,185,129,0.25)" };
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap');

        .inv-wrap { font-family: 'Outfit', sans-serif; color: #e2e8f0; }

        /* Header */
        .inv-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 24px;
          flex-wrap: wrap;
          gap: 14px;
        }
        .inv-header h1 {
          font-size: 1.8rem;
          font-weight: 800;
          background: linear-gradient(135deg, #e2e8f0, #a5b4fc);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .inv-header p {
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
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin-bottom: 24px;
        }
        @media (max-width: 900px) { .stats-row { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 500px) { .stats-row { grid-template-columns: 1fr 1fr; } }

        .stat-chip {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 14px;
          padding: 16px 18px;
          backdrop-filter: blur(12px);
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .stat-chip-icon {
          width: 40px; height: 40px;
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
          font-size: 0.7rem;
          color: rgba(148,163,184,0.55);
          text-transform: uppercase;
          letter-spacing: 0.08em;
          font-weight: 600;
          margin-top: 3px;
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

        /* Product Cell */
        .prod-cell {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .prod-avatar {
          width: 38px; height: 38px;
          border-radius: 10px;
          background: rgba(99,102,241,0.15);
          border: 1px solid rgba(99,102,241,0.25);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1rem;
          flex-shrink: 0;
        }
        .prod-name { font-weight: 600; color: #e2e8f0; }

        /* Qty Cell */
        .qty-cell {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .qty-number {
          font-size: 1.2rem;
          font-weight: 800;
          min-width: 36px;
        }
        .qty-bar-wrap {
          flex: 1;
          max-width: 100px;
          height: 5px;
          background: rgba(255,255,255,0.06);
          border-radius: 99px;
          overflow: hidden;
        }
        .qty-bar {
          height: 100%;
          border-radius: 99px;
          transition: width 0.6s ease;
        }

        /* Stock Badge */
        .stock-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 5px 12px;
          border-radius: 999px;
          font-size: 0.78rem;
          font-weight: 600;
        }
        .stock-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
        }

        /* Update Button */
        .update-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 7px 16px;
          border-radius: 9px;
          font-size: 0.82rem;
          font-weight: 600;
          font-family: 'Outfit', sans-serif;
          cursor: pointer;
          border: 1px solid rgba(245,158,11,0.35);
          background: rgba(245,158,11,0.12);
          color: #fcd34d;
          transition: all 0.2s ease;
        }
        .update-btn:hover {
          background: rgba(245,158,11,0.25);
          box-shadow: 0 0 14px rgba(245,158,11,0.25);
        }

        /* Empty / Loader */
        .empty-state {
          text-align: center;
          padding: 60px 20px;
          color: rgba(148,163,184,0.5);
        }
        .empty-icon { font-size: 2.5rem; margin-bottom: 10px; }
        .empty-text  { font-size: 0.9rem; }

        @keyframes spin { to { transform: rotate(360deg); } }
        .loader-ring {
          width: 40px; height: 40px;
          border: 3px solid rgba(99,102,241,0.2);
          border-top-color: #6366f1;
          border-radius: 50%;
          animation: spin 0.9s linear infinite;
          margin: 60px auto;
        }

        /* ── MODAL ── */
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.6);
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
          z-index: 999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          animation: fadeIn 0.2s ease;
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

        .modal-box {
          background: rgba(20, 15, 50, 0.92);
          backdrop-filter: blur(30px);
          -webkit-backdrop-filter: blur(30px);
          border: 1px solid rgba(99,102,241,0.3);
          border-radius: 20px;
          padding: 32px;
          width: 100%;
          max-width: 420px;
          box-shadow: 0 0 60px rgba(99,102,241,0.2), 0 20px 60px rgba(0,0,0,0.5);
          animation: slideUp 0.25s ease;
        }
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }

        .modal-title {
          font-size: 1.2rem;
          font-weight: 700;
          background: linear-gradient(135deg, #e2e8f0, #a5b4fc);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 6px;
        }
        .modal-subtitle {
          font-size: 0.82rem;
          color: rgba(148,163,184,0.6);
          margin-bottom: 24px;
        }

        .modal-label {
          font-size: 0.78rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: rgba(165,180,252,0.6);
          margin-bottom: 8px;
        }
        .modal-input {
          width: 100%;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(99,102,241,0.3);
          border-radius: 10px;
          padding: 12px 16px;
          color: #e2e8f0;
          font-family: 'Outfit', sans-serif;
          font-size: 1rem;
          font-weight: 600;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          box-sizing: border-box;
          margin-bottom: 20px;
        }
        .modal-input:focus {
          border-color: rgba(99,102,241,0.6);
          box-shadow: 0 0 0 3px rgba(99,102,241,0.12);
        }

        .modal-actions {
          display: flex;
          gap: 10px;
        }
        .modal-cancel {
          flex: 1;
          padding: 11px;
          border-radius: 10px;
          font-family: 'Outfit', sans-serif;
          font-size: 0.88rem;
          font-weight: 600;
          cursor: pointer;
          border: 1px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.05);
          color: rgba(148,163,184,0.8);
          transition: all 0.2s;
        }
        .modal-cancel:hover { background: rgba(255,255,255,0.09); }

        .modal-save {
          flex: 2;
          padding: 11px;
          border-radius: 10px;
          font-family: 'Outfit', sans-serif;
          font-size: 0.88rem;
          font-weight: 700;
          cursor: pointer;
          border: 1px solid rgba(99,102,241,0.4);
          background: linear-gradient(135deg, rgba(99,102,241,0.4), rgba(139,92,246,0.4));
          color: #c7d2fe;
          transition: all 0.2s;
          box-shadow: 0 0 20px rgba(99,102,241,0.15);
        }
        .modal-save:hover {
          background: linear-gradient(135deg, rgba(99,102,241,0.6), rgba(139,92,246,0.6));
          box-shadow: 0 0 28px rgba(99,102,241,0.3);
        }
        .modal-save:disabled { opacity: 0.5; cursor: not-allowed; }

        @media (max-width: 640px) {
          .inv-header { flex-direction: column; align-items: flex-start; }
          .search-box { width: 100%; }
          .qty-bar-wrap { display: none; }
          thead th:nth-child(3), tbody td:nth-child(3) { display: none; }
        }
      `}</style>

      <div className="inv-wrap">
        {/* Header */}
        <div className="inv-header">
          <div>
            <h1>Inventory</h1>
            <p>{inventory.length} products tracked · {totalStock.toLocaleString("en-IN")} total units</p>
          </div>
          <div className="search-box">
            <span style={{ fontSize: "1rem", opacity: 0.5 }}>🔍</span>
            <input
              type="text"
              placeholder="Search product..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Stats */}
        <div className="stats-row">
          {[
            { icon: "🏭", label: "Total Items",   val: inventory.length, color: "#a5b4fc", ibg: "rgba(99,102,241,0.15)",  ib: "rgba(99,102,241,0.25)" },
            { icon: "✅", label: "In Stock",       val: inStock,          color: "#34d399", ibg: "rgba(16,185,129,0.15)", ib: "rgba(16,185,129,0.25)" },
            { icon: "⚠️", label: "Low Stock",      val: lowStock,         color: "#fbbf24", ibg: "rgba(245,158,11,0.15)", ib: "rgba(245,158,11,0.25)" },
            { icon: "❌", label: "Out of Stock",   val: outStock,         color: "#f87171", ibg: "rgba(239,68,68,0.15)",  ib: "rgba(239,68,68,0.25)"  },
          ].map(s => (
            <div className="stat-chip" key={s.label}>
              <div className="stat-chip-icon" style={{ background: s.ibg, border: `1px solid ${s.ib}` }}>{s.icon}</div>
              <div>
                <div className="stat-chip-val" style={{ color: s.color }}>{s.val}</div>
                <div className="stat-chip-label">{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="table-card">
          {loading ? (
            <div className="loader-ring" />
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Quantity</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan="4">
                      <div className="empty-state">
                        <div className="empty-icon">🏭</div>
                        <div className="empty-text">No inventory records found</div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filtered.map(item => {
                    const status   = getStockStatus(item.quantity);
                    const maxQty   = Math.max(...inventory.map(i => i.quantity), 1);
                    const barWidth = Math.min((item.quantity / maxQty) * 100, 100);

                    return (
                      <tr key={item.id}>
                        <td>
                          <div className="prod-cell">
                            <div className="prod-avatar">📦</div>
                            <span className="prod-name">{item.product_name || item.product}</span>
                          </div>
                        </td>

                        <td>
                          <div className="qty-cell">
                            <span className="qty-number" style={{ color: status.color }}>
                              {item.quantity}
                            </span>
                            <div className="qty-bar-wrap">
                              <div className="qty-bar" style={{ width: `${barWidth}%`, background: status.color }} />
                            </div>
                          </div>
                        </td>

                        <td>
                          <span
                            className="stock-badge"
                            style={{ background: status.bg, border: `1px solid ${status.border}`, color: status.color }}
                          >
                            <span className="stock-dot" style={{ background: status.color, boxShadow: `0 0 6px ${status.color}` }} />
                            {status.label}
                          </span>
                        </td>

                        <td>
                          <button className="update-btn" onClick={() => openModal(item)}>
                            ✏️ Update
                          </button>
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

      {/* ── Modal ── */}
      {modalOpen && selectedItem && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div className="modal-title">Update Stock</div>
            <div className="modal-subtitle">
              Editing: <strong style={{ color: "#a5b4fc" }}>{selectedItem.product_name || selectedItem.product}</strong>
            </div>

            <div className="modal-label">New Quantity</div>
            <input
              className="modal-input"
              type="number"
              min="0"
              value={newQty}
              onChange={e => setNewQty(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleUpdate()}
              autoFocus
            />

            <div className="modal-actions">
              <button className="modal-cancel" onClick={closeModal}>Cancel</button>
              <button className="modal-save" onClick={handleUpdate} disabled={updating}>
                {updating ? "Saving..." : "💾 Save Stock"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Inventory;