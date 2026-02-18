import { useEffect, useState } from "react";
import api from "../api/axios";

function Products() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("products/")
      .then(res => { setProducts(res.data); setLoading(false); })
      .catch(err => { console.log(err); setLoading(false); });
  }, []);

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.sku.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap');

        .prod-wrap { font-family: 'Outfit', sans-serif; color: #e2e8f0; }

        /* Header */
        .prod-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 24px;
          flex-wrap: wrap;
          gap: 14px;
        }
        .prod-header h1 {
          font-size: 1.8rem;
          font-weight: 800;
          background: linear-gradient(135deg, #e2e8f0, #a5b4fc);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          letter-spacing: -0.01em;
        }
        .prod-header p {
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

        /* Stats Row */
        .stats-row {
          display: flex;
          gap: 0;
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .stat-pill {
          flex: 1;
          padding: 16px 20px;
          border-right: 1px solid rgba(255,255,255,0.06);
          text-align: center;
        }
        .stat-pill:last-child { border-right: none; }
        .stat-pill-val {
          font-size: 1.5rem;
          font-weight: 800;
          color: #a5b4fc;
        }
        .stat-pill-label {
          font-size: 0.7rem;
          color: rgba(148,163,184,0.5);
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-top: 2px;
          font-weight: 600;
        }

        /* Table */
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

        /* Product Name Cell */
        .prod-name-cell {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .prod-avatar {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: linear-gradient(135deg, rgba(99,102,241,0.3), rgba(139,92,246,0.3));
          border: 1px solid rgba(99,102,241,0.25);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1rem;
          flex-shrink: 0;
        }
        .prod-name-text {
          font-weight: 600;
          color: #e2e8f0;
        }

        /* SKU Badge */
        .sku-badge {
          background: rgba(99,102,241,0.12);
          border: 1px solid rgba(99,102,241,0.2);
          color: #a5b4fc;
          padding: 3px 10px;
          border-radius: 999px;
          font-size: 0.75rem;
          font-weight: 600;
          font-family: 'Courier New', monospace;
          letter-spacing: 0.04em;
        }

        /* Price */
        .price-cell {
          font-weight: 700;
          color: #34d399;
          font-size: 0.95rem;
        }

        /* Stock Badge */
        .stock-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 12px;
          border-radius: 999px;
          font-size: 0.78rem;
          font-weight: 600;
        }
        .stock-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
        }
        .stock-ok {
          background: rgba(16,185,129,0.12);
          border: 1px solid rgba(16,185,129,0.25);
          color: #34d399;
        }
        .stock-low {
          background: rgba(245,158,11,0.12);
          border: 1px solid rgba(245,158,11,0.25);
          color: #fbbf24;
        }
        .stock-out {
          background: rgba(239,68,68,0.12);
          border: 1px solid rgba(239,68,68,0.25);
          color: #f87171;
        }

        /* Empty / Loading */
        .empty-state {
          text-align: center;
          padding: 60px 20px;
          color: rgba(148,163,184,0.5);
        }
        .empty-icon { font-size: 2.5rem; margin-bottom: 10px; }
        .empty-text { font-size: 0.9rem; }

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
          .prod-header { flex-direction: column; align-items: flex-start; }
          .search-box { width: 100%; }
          .stats-row { display: none; }
          thead th:nth-child(2), tbody td:nth-child(2) { display: none; }
        }
      `}</style>

      <div className="prod-wrap">
        {/* Header */}
        <div className="prod-header">
          <div>
            <h1>Products</h1>
            <p>{products.length} products in catalog</p>
          </div>
          <div className="search-box">
            <span style={{ fontSize: "1rem", opacity: 0.5 }}>🔍</span>
            <input
              type="text"
              placeholder="Search by name or SKU..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Table Card */}
        <div className="table-card">

          {/* Quick Stats */}
          <div className="stats-row">
            <div className="stat-pill">
              <div className="stat-pill-val">{products.length}</div>
              <div className="stat-pill-label">Total Products</div>
            </div>
            <div className="stat-pill">
              <div className="stat-pill-val" style={{ color: "#34d399" }}>
                {products.filter(p => (p.inventory?.quantity ?? 0) > 10).length}
              </div>
              <div className="stat-pill-label">In Stock</div>
            </div>
            <div className="stat-pill">
              <div className="stat-pill-val" style={{ color: "#fbbf24" }}>
                {products.filter(p => (p.inventory?.quantity ?? 0) > 0 && (p.inventory?.quantity ?? 0) <= 10).length}
              </div>
              <div className="stat-pill-label">Low Stock</div>
            </div>
            <div className="stat-pill">
              <div className="stat-pill-val" style={{ color: "#f87171" }}>
                {products.filter(p => (p.inventory?.quantity ?? 0) === 0).length}
              </div>
              <div className="stat-pill-label">Out of Stock</div>
            </div>
          </div>

          {loading ? (
            <div className="loader-ring" />
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>SKU</th>
                  <th>Price</th>
                  <th>Stock</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan="4">
                      <div className="empty-state">
                        <div className="empty-icon">📦</div>
                        <div className="empty-text">No products found</div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filtered.map(product => {
                    const qty = product.inventory?.quantity ?? 0;
                    const stockClass = qty === 0 ? "stock-out" : qty <= 10 ? "stock-low" : "stock-ok";
                    const stockDotColor = qty === 0 ? "#f87171" : qty <= 10 ? "#fbbf24" : "#34d399";
                    const stockLabel = qty === 0 ? "Out of Stock" : qty <= 10 ? `Low (${qty})` : qty;

                    return (
                      <tr key={product.id}>
                        <td>
                          <div className="prod-name-cell">
                            <div className="prod-avatar">📦</div>
                            <span className="prod-name-text">{product.name}</span>
                          </div>
                        </td>
                        <td>
                          <span className="sku-badge">{product.sku}</span>
                        </td>
                        <td>
                          <span className="price-cell">₹{Number(product.price).toLocaleString("en-IN")}</span>
                        </td>
                        <td>
                          <span className={`stock-badge ${stockClass}`}>
                            <span className="stock-dot" style={{ background: stockDotColor, boxShadow: `0 0 6px ${stockDotColor}` }} />
                            {stockLabel}
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

export default Products;