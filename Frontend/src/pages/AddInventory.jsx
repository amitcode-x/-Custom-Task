import { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

function AddInventory() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({ product: "", quantity: "" });
  const [loading, setLoading] = useState(false);
  const [productsLoading, setProductsLoading] = useState(true);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    api.get("products/")
      .then(res => { setProducts(res.data); setProductsLoading(false); })
      .catch(err => { console.log(err); setProductsLoading(false); });
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const e = {};
    if (!formData.product)  e.product  = "Please select a product";
    if (!formData.quantity) e.quantity = "Quantity is required";
    else if (isNaN(formData.quantity) || Number(formData.quantity) < 0)
                            e.quantity = "Enter a valid quantity";
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    api.post("inventory/", formData)
      .then(() => { setLoading(false); navigate("/inventory"); })
      .catch(err => {
        setLoading(false);
        console.log(err);
        alert("Error adding inventory (inventory may already exist for this product)");
      });
  };

  const selectedProduct = products.find(p => String(p.id) === String(formData.product));

  const getStockLevel = (qty) => {
    const q = Number(qty);
    if (!qty || isNaN(q)) return null;
    if (q === 0)   return { label: "Out of Stock", color: "#f87171", bg: "rgba(239,68,68,0.12)",   border: "rgba(239,68,68,0.25)",   icon: "❌" };
    if (q <= 10)   return { label: "Low Stock",    color: "#fbbf24", bg: "rgba(245,158,11,0.12)",  border: "rgba(245,158,11,0.25)",  icon: "⚠️" };
    if (q <= 50)   return { label: "Medium Stock", color: "#60a5fa", bg: "rgba(59,130,246,0.12)",  border: "rgba(59,130,246,0.25)",  icon: "📦" };
    return           { label: "High Stock",    color: "#34d399", bg: "rgba(16,185,129,0.12)",  border: "rgba(16,185,129,0.25)", icon: "✅" };
  };

  const stockLevel = getStockLevel(formData.quantity);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap');

        .ai-wrap { font-family: 'Outfit', sans-serif; color: #e2e8f0; }

        /* Page Header */
        .ai-page-header {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 28px;
        }
        .ai-back-btn {
          width: 38px; height: 38px;
          border-radius: 10px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          display: flex; align-items: center; justify-content: center;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.2s;
          color: #e2e8f0;
          flex-shrink: 0;
        }
        .ai-back-btn:hover {
          background: rgba(99,102,241,0.15);
          border-color: rgba(99,102,241,0.3);
        }
        .ai-page-header h1 {
          font-size: 1.8rem;
          font-weight: 800;
          background: linear-gradient(135deg, #e2e8f0, #a5b4fc);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .ai-page-header p {
          font-size: 0.82rem;
          color: rgba(148,163,184,0.6);
          margin-top: 2px;
        }

        /* Layout */
        .ai-layout {
          display: grid;
          grid-template-columns: 1fr 340px;
          gap: 24px;
          align-items: start;
        }
        @media (max-width: 900px) {
          .ai-layout { grid-template-columns: 1fr; }
          .ai-preview { order: -1; }
        }

        /* Form Card */
        .form-card {
          background: rgba(255,255,255,0.04);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px;
          padding: 28px;
          box-shadow: 0 8px 40px rgba(0,0,0,0.3);
        }
        .form-card-title {
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(165,180,252,0.6);
          margin-bottom: 24px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .form-card-title::after {
          content: '';
          flex: 1;
          height: 1px;
          background: rgba(99,102,241,0.2);
        }

        /* Field */
        .field-group { margin-bottom: 20px; }
        .field-label {
          display: flex;
          align-items: center;
          gap: 7px;
          font-size: 0.8rem;
          font-weight: 600;
          color: rgba(148,163,184,0.8);
          margin-bottom: 8px;
        }
        .required-star { color: #f87171; }

        .field-input-wrap { position: relative; }
        .field-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 1rem;
          pointer-events: none;
          z-index: 1;
        }

        /* Select */
        .field-select {
          width: 100%;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px;
          padding: 12px 14px 12px 42px;
          color: #e2e8f0;
          font-family: 'Outfit', sans-serif;
          font-size: 0.9rem;
          font-weight: 500;
          outline: none;
          transition: all 0.2s;
          box-sizing: border-box;
          cursor: pointer;
          appearance: none;
          -webkit-appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23a5b4fc' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 14px center;
          padding-right: 36px;
        }
        .field-select:focus {
          border-color: rgba(99,102,241,0.5);
          box-shadow: 0 0 0 3px rgba(99,102,241,0.1);
          background-color: rgba(99,102,241,0.05);
        }
        .field-select.has-error {
          border-color: rgba(239,68,68,0.5);
          box-shadow: 0 0 0 3px rgba(239,68,68,0.08);
        }
        .field-select option {
          background: #1a1040;
          color: #e2e8f0;
        }

        /* Input */
        .field-input {
          width: 100%;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px;
          padding: 12px 14px 12px 42px;
          color: #e2e8f0;
          font-family: 'Outfit', sans-serif;
          font-size: 0.9rem;
          font-weight: 500;
          outline: none;
          transition: all 0.2s;
          box-sizing: border-box;
        }
        .field-input::placeholder { color: rgba(148,163,184,0.4); }
        .field-input:focus {
          border-color: rgba(99,102,241,0.5);
          box-shadow: 0 0 0 3px rgba(99,102,241,0.1);
          background: rgba(99,102,241,0.05);
        }
        .field-input.has-error {
          border-color: rgba(239,68,68,0.5);
          box-shadow: 0 0 0 3px rgba(239,68,68,0.08);
        }

        .field-error {
          font-size: 0.75rem;
          color: #f87171;
          margin-top: 5px;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        /* Qty Shortcuts */
        .qty-shortcuts {
          display: flex;
          gap: 8px;
          margin-top: 10px;
          flex-wrap: wrap;
        }
        .qty-chip {
          padding: 4px 12px;
          border-radius: 999px;
          font-size: 0.75rem;
          font-weight: 600;
          font-family: 'Outfit', sans-serif;
          cursor: pointer;
          border: 1px solid rgba(99,102,241,0.25);
          background: rgba(99,102,241,0.1);
          color: #a5b4fc;
          transition: all 0.15s;
        }
        .qty-chip:hover {
          background: rgba(99,102,241,0.25);
          box-shadow: 0 0 10px rgba(99,102,241,0.2);
        }

        /* Submit */
        .submit-btn {
          width: 100%;
          padding: 13px;
          border-radius: 12px;
          font-family: 'Outfit', sans-serif;
          font-size: 0.95rem;
          font-weight: 700;
          cursor: pointer;
          border: 1px solid rgba(99,102,241,0.4);
          background: linear-gradient(135deg, rgba(99,102,241,0.5), rgba(139,92,246,0.5));
          color: #e0e7ff;
          transition: all 0.2s;
          box-shadow: 0 0 24px rgba(99,102,241,0.2);
          margin-top: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        .submit-btn:hover:not(:disabled) {
          background: linear-gradient(135deg, rgba(99,102,241,0.7), rgba(139,92,246,0.7));
          box-shadow: 0 0 36px rgba(99,102,241,0.35);
          transform: translateY(-1px);
        }
        .submit-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

        @keyframes spin { to { transform: rotate(360deg); } }
        .btn-spinner {
          width: 16px; height: 16px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        /* Preview Card */
        .preview-card {
          background: rgba(255,255,255,0.04);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px;
          padding: 28px;
          box-shadow: 0 8px 40px rgba(0,0,0,0.3);
          position: sticky;
          top: 20px;
        }
        .preview-title {
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(165,180,252,0.6);
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .preview-title::after {
          content: '';
          flex: 1;
          height: 1px;
          background: rgba(99,102,241,0.2);
        }

        /* Inventory Preview */
        .preview-inv-card {
          border-radius: 14px;
          padding: 22px;
          text-align: center;
          margin-bottom: 20px;
          border: 1px solid rgba(99,102,241,0.2);
          background: rgba(99,102,241,0.07);
          transition: all 0.3s;
        }
        .preview-inv-icon {
          font-size: 2.8rem;
          margin-bottom: 10px;
          display: block;
          transition: all 0.3s;
        }
        .preview-inv-name {
          font-size: 1rem;
          font-weight: 700;
          color: #e2e8f0;
          margin-bottom: 6px;
        }
        .preview-inv-sku {
          font-size: 0.72rem;
          font-family: 'Courier New', monospace;
          color: rgba(165,180,252,0.6);
          background: rgba(99,102,241,0.12);
          border: 1px solid rgba(99,102,241,0.2);
          border-radius: 999px;
          padding: 2px 10px;
          display: inline-block;
          margin-bottom: 16px;
        }

        /* Big Qty Display */
        .qty-display {
          font-size: 3rem;
          font-weight: 800;
          line-height: 1;
          margin-bottom: 6px;
          transition: color 0.3s;
        }
        .qty-unit {
          font-size: 0.78rem;
          color: rgba(148,163,184,0.5);
          margin-bottom: 12px;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        /* Stock Level Badge */
        .stock-level-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 5px 14px;
          border-radius: 999px;
          font-size: 0.8rem;
          font-weight: 600;
          transition: all 0.3s;
        }
        .stock-dot {
          width: 7px; height: 7px;
          border-radius: 50%;
          animation: pulse-dot 2s infinite;
        }
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.5; transform: scale(0.8); }
        }

        /* Preview Rows */
        .preview-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 0;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          font-size: 0.83rem;
          gap: 10px;
        }
        .preview-row:last-child { border-bottom: none; }
        .preview-row-key { color: rgba(148,163,184,0.6); flex-shrink: 0; }
        .preview-row-val { color: #e2e8f0; font-weight: 600; text-align: right; }

        /* Tips */
        .tips-box {
          background: rgba(99,102,241,0.07);
          border: 1px solid rgba(99,102,241,0.15);
          border-radius: 12px;
          padding: 14px 16px;
          margin-top: 16px;
        }
        .tips-title {
          font-size: 0.75rem;
          font-weight: 700;
          color: rgba(165,180,252,0.7);
          margin-bottom: 8px;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }
        .tip-item {
          font-size: 0.78rem;
          color: rgba(148,163,184,0.6);
          display: flex;
          align-items: flex-start;
          gap: 6px;
          margin-bottom: 5px;
        }
        .tip-item:last-child { margin-bottom: 0; }

        /* Products loading */
        .select-loading {
          display: flex;
          align-items: center;
          gap: 8px;
          color: rgba(148,163,184,0.5);
          font-size: 0.85rem;
          padding: 12px 0;
        }
        .mini-spin {
          width: 14px; height: 14px;
          border: 2px solid rgba(99,102,241,0.2);
          border-top-color: #6366f1;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
      `}</style>

      <div className="ai-wrap">
        {/* Page Header */}
        <div className="ai-page-header">
          <button className="ai-back-btn" onClick={() => navigate("/inventory")}>←</button>
          <div>
            <h1>Add Inventory</h1>
            <p>Assign stock quantity to a product</p>
          </div>
        </div>

        <div className="ai-layout">
          {/* Form */}
          <div className="form-card">
            <div className="form-card-title">📋 Inventory Details</div>

            <form onSubmit={handleSubmit} noValidate>
              {/* Product Select */}
              <div className="field-group">
                <label className="field-label">
                  Select Product <span className="required-star">*</span>
                </label>

                {productsLoading ? (
                  <div className="select-loading">
                    <div className="mini-spin" /> Loading products...
                  </div>
                ) : (
                  <div className="field-input-wrap">
                    <span className="field-icon">📦</span>
                    <select
                      name="product"
                      value={formData.product}
                      onChange={handleChange}
                      className={`field-select ${errors.product ? "has-error" : ""}`}
                    >
                      <option value="">— Choose a product —</option>
                      {products.map(p => (
                        <option key={p.id} value={p.id}>
                          {p.name} {p.sku ? `(${p.sku})` : ""}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                {errors.product && <div className="field-error">⚠ {errors.product}</div>}
              </div>

              {/* Quantity */}
              <div className="field-group">
                <label className="field-label">
                  Initial Quantity <span className="required-star">*</span>
                </label>
                <div className="field-input-wrap">
                  <span className="field-icon">🔢</span>
                  <input
                    type="number"
                    name="quantity"
                    placeholder="e.g. 100"
                    value={formData.quantity}
                    onChange={handleChange}
                    min="0"
                    className={`field-input ${errors.quantity ? "has-error" : ""}`}
                  />
                </div>
                {errors.quantity && <div className="field-error">⚠ {errors.quantity}</div>}

                {/* Quick shortcuts */}
                <div className="qty-shortcuts">
                  <span style={{ fontSize: "0.72rem", color: "rgba(148,163,184,0.5)", alignSelf: "center" }}>Quick:</span>
                  {[10, 25, 50, 100, 250, 500].map(q => (
                    <button
                      key={q}
                      type="button"
                      className="qty-chip"
                      onClick={() => {
                        setFormData(f => ({ ...f, quantity: q }));
                        setErrors(e => ({ ...e, quantity: "" }));
                      }}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>

              <button type="submit" className="submit-btn" disabled={loading}>
                {loading
                  ? <><div className="btn-spinner" /> Saving...</>
                  : <>📋 Save Inventory</>
                }
              </button>
            </form>
          </div>

          {/* Preview */}
          <div className="preview-card ai-preview">
            <div className="preview-title">👁 Live Preview</div>

            {/* Inventory Visual Card */}
            <div
              className="preview-inv-card"
              style={stockLevel ? {
                borderColor: stockLevel.border,
                background: stockLevel.bg,
              } : {}}
            >
              <span className="preview-inv-icon">
                {stockLevel ? stockLevel.icon : "📦"}
              </span>

              <div className="preview-inv-name">
                {selectedProduct?.name ||
                  <span style={{ color: "rgba(148,163,184,0.3)" }}>Select a product</span>}
              </div>

              {selectedProduct?.sku && (
                <div className="preview-inv-sku">{selectedProduct.sku}</div>
              )}

              <div
                className="qty-display"
                style={{ color: stockLevel?.color || "rgba(148,163,184,0.3)" }}
              >
                {formData.quantity !== "" ? Number(formData.quantity).toLocaleString("en-IN") : "—"}
              </div>
              <div className="qty-unit">units</div>

              {stockLevel && (
                <span
                  className="stock-level-badge"
                  style={{
                    background: stockLevel.bg,
                    border: `1px solid ${stockLevel.border}`,
                    color: stockLevel.color,
                  }}
                >
                  <span
                    className="stock-dot"
                    style={{ background: stockLevel.color, boxShadow: `0 0 6px ${stockLevel.color}` }}
                  />
                  {stockLevel.label}
                </span>
              )}
            </div>

            {/* Data Rows */}
            {[
              { key: "Product", val: selectedProduct?.name || "—" },
              { key: "SKU",     val: selectedProduct?.sku  || "—" },
              { key: "Price",   val: selectedProduct?.price ? `₹${Number(selectedProduct.price).toLocaleString("en-IN")}` : "—" },
              { key: "Qty",     val: formData.quantity !== "" ? `${Number(formData.quantity).toLocaleString("en-IN")} units` : "—" },
            ].map(r => (
              <div className="preview-row" key={r.key}>
                <span className="preview-row-key">{r.key}</span>
                <span className="preview-row-val">{r.val}</span>
              </div>
            ))}

            <div className="tips-box">
              <div className="tips-title">💡 Tips</div>
              <div className="tip-item">⚠️ Each product can have only one inventory record</div>
              <div className="tip-item">🔢 Use quick buttons for common quantities</div>
              <div className="tip-item">✏️ You can update stock later from Inventory page</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AddInventory;