import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

function AddProduct() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    price: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const e = {};
    if (!formData.name.trim())  e.name  = "Product name is required";
    if (!formData.sku.trim())   e.sku   = "SKU is required";
    if (!formData.price)        e.price = "Price is required";
    else if (isNaN(formData.price) || Number(formData.price) < 0)
                                e.price = "Enter a valid price";
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    api.post("products/", formData)
      .then(() => { setLoading(false); navigate("/products"); })
      .catch(err => { setLoading(false); console.log(err); alert("Error adding product"); });
  };

  const fields = [
    { name: "name",        label: "Product Name", type: "text",   placeholder: "e.g. Wireless Keyboard",  icon: "📦", required: true },
    { name: "sku",         label: "SKU Code",     type: "text",   placeholder: "e.g. WK-001",             icon: "🔖", required: true },
    { name: "price",       label: "Price (₹)",    type: "number", placeholder: "e.g. 1499",               icon: "💰", required: true },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap');

        .ap-wrap { font-family: 'Outfit', sans-serif; color: #e2e8f0; }

        /* Page Header */
        .ap-page-header {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 28px;
        }
        .ap-back-btn {
          width: 38px; height: 38px;
          border-radius: 10px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          display: flex; align-items: center; justify-content: center;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.2s;
          color: #e2e8f0;
          text-decoration: none;
          flex-shrink: 0;
        }
        .ap-back-btn:hover {
          background: rgba(99,102,241,0.15);
          border-color: rgba(99,102,241,0.3);
        }
        .ap-page-header h1 {
          font-size: 1.8rem;
          font-weight: 800;
          background: linear-gradient(135deg, #e2e8f0, #a5b4fc);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .ap-page-header p {
          font-size: 0.82rem;
          color: rgba(148,163,184,0.6);
          margin-top: 2px;
        }

        /* Layout */
        .ap-layout {
          display: grid;
          grid-template-columns: 1fr 360px;
          gap: 24px;
          align-items: start;
        }
        @media (max-width: 900px) {
          .ap-layout { grid-template-columns: 1fr; }
          .ap-preview { order: -1; }
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

        /* Field Group */
        .field-group { margin-bottom: 20px; }
        .field-label {
          display: flex;
          align-items: center;
          gap: 7px;
          font-size: 0.8rem;
          font-weight: 600;
          color: rgba(148,163,184,0.8);
          margin-bottom: 8px;
          letter-spacing: 0.02em;
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
        }
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

        /* Textarea */
        .field-textarea {
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
          resize: vertical;
          min-height: 100px;
        }
        .field-textarea::placeholder { color: rgba(148,163,184,0.4); }
        .field-textarea:focus {
          border-color: rgba(99,102,241,0.5);
          box-shadow: 0 0 0 3px rgba(99,102,241,0.1);
          background: rgba(99,102,241,0.05);
        }

        /* Submit Button */
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

        /* Spinner */
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

        .preview-product-card {
          background: rgba(99,102,241,0.08);
          border: 1px solid rgba(99,102,241,0.2);
          border-radius: 14px;
          padding: 20px;
          text-align: center;
          margin-bottom: 20px;
        }
        .preview-emoji {
          font-size: 2.5rem;
          margin-bottom: 12px;
          display: block;
        }
        .preview-name {
          font-size: 1.1rem;
          font-weight: 700;
          color: #e2e8f0;
          margin-bottom: 4px;
          min-height: 1.4em;
        }
        .preview-sku {
          font-size: 0.75rem;
          font-family: 'Courier New', monospace;
          color: rgba(165,180,252,0.6);
          background: rgba(99,102,241,0.12);
          border: 1px solid rgba(99,102,241,0.2);
          border-radius: 999px;
          padding: 2px 10px;
          display: inline-block;
          margin-bottom: 14px;
        }
        .preview-price {
          font-size: 1.5rem;
          font-weight: 800;
          color: #34d399;
        }

        .preview-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 0;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          font-size: 0.85rem;
        }
        .preview-row:last-child { border-bottom: none; }
        .preview-row-key { color: rgba(148,163,184,0.6); }
        .preview-row-val { color: #e2e8f0; font-weight: 600; }

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
      `}</style>

      <div className="ap-wrap">
        {/* Page Header */}
        <div className="ap-page-header">
          <button className="ap-back-btn" onClick={() => navigate("/products")}>←</button>
          <div>
            <h1>Add Product</h1>
            <p>Fill in the details to add a new product to catalog</p>
          </div>
        </div>

        <div className="ap-layout">
          {/* Form */}
          <div className="form-card">
            <div className="form-card-title">📦 Product Details</div>

            <form onSubmit={handleSubmit} noValidate>
              {fields.map(f => (
                <div className="field-group" key={f.name}>
                  <label className="field-label">
                    {f.label}
                    {f.required && <span className="required-star">*</span>}
                  </label>
                  <div className="field-input-wrap">
                    <span className="field-icon">{f.icon}</span>
                    <input
                      type={f.type}
                      name={f.name}
                      placeholder={f.placeholder}
                      value={formData[f.name]}
                      onChange={handleChange}
                      className={`field-input ${errors[f.name] ? "has-error" : ""}`}
                      min={f.type === "number" ? "0" : undefined}
                    />
                  </div>
                  {errors[f.name] && (
                    <div className="field-error">⚠ {errors[f.name]}</div>
                  )}
                </div>
              ))}

              {/* Description */}
              <div className="field-group">
                <label className="field-label">Description</label>
                <div className="field-input-wrap">
                  <span className="field-icon" style={{ top: "16px", transform: "none" }}>📝</span>
                  <textarea
                    name="description"
                    placeholder="Optional product description..."
                    value={formData.description}
                    onChange={handleChange}
                    className="field-textarea"
                  />
                </div>
              </div>

              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? <><div className="btn-spinner" /> Saving...</> : <>✅ Save Product</>}
              </button>
            </form>
          </div>

          {/* Preview */}
          <div className="preview-card ap-preview">
            <div className="preview-title">👁 Live Preview</div>

            <div className="preview-product-card">
              <span className="preview-emoji">📦</span>
              <div className="preview-name">
                {formData.name || <span style={{ color: "rgba(148,163,184,0.3)" }}>Product Name</span>}
              </div>
              <div className="preview-sku">
                {formData.sku || "SKU-000"}
              </div>
              <div className="preview-price">
                ₹{formData.price ? Number(formData.price).toLocaleString("en-IN") : "0"}
              </div>
            </div>

            <div>
              {[
                { key: "Name",        val: formData.name        || "—" },
                { key: "SKU",         val: formData.sku         || "—" },
                { key: "Price",       val: formData.price ? `₹${Number(formData.price).toLocaleString("en-IN")}` : "—" },
                { key: "Description", val: formData.description || "—" },
              ].map(r => (
                <div className="preview-row" key={r.key}>
                  <span className="preview-row-key">{r.key}</span>
                  <span className="preview-row-val" style={{ maxWidth: "180px", textAlign: "right", wordBreak: "break-word" }}>
                    {r.val}
                  </span>
                </div>
              ))}
            </div>

            <div className="tips-box">
              <div className="tips-title">💡 Tips</div>
              <div className="tip-item">📌 SKU must be unique across all products</div>
              <div className="tip-item">💰 Enter price in Indian Rupees (₹)</div>
              <div className="tip-item">📝 Description is optional but recommended</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AddProduct;