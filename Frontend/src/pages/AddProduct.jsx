// ══════════════════════════════════════════
// AddProduct.jsx
// ══════════════════════════════════════════
import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

export function AddProduct() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "", sku: "", price: "", description: "" });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const e = {};
    if (!formData.name.trim())  e.name  = "Product name is required";
    if (!formData.sku.trim())   e.sku   = "SKU is required";
    if (!formData.price)        e.price = "Price is required";
    else if (isNaN(formData.price) || Number(formData.price) < 0) e.price = "Enter a valid price";
    return e;
  };

  const handleSubmit = e => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    api.post("products/", formData)
      .then(() => { setLoading(false); navigate("/products"); })
      .catch(err => { setLoading(false); console.log(err); alert("Error adding product"); });
  };

  const fields = [
    { name: "name",  label: "Product Name", type: "text",   ph: "e.g. Wireless Keyboard", icon: "🎁", required: true },
    { name: "sku",   label: "SKU Code",     type: "text",   ph: "e.g. WK-001",            icon: "🔖", required: true },
    { name: "price", label: "Price (₹)",    type: "number", ph: "e.g. 1499",              icon: "💰", required: true },
  ];

  const S = { fontFamily: "'Poppins', sans-serif" };
  const cardStyle = { background: "linear-gradient(135deg, rgba(255,255,255,0.88), rgba(253,242,248,0.8), rgba(250,245,255,0.75))", backdropFilter: "blur(20px)", border: "1.5px solid rgba(236,72,153,0.12)", borderRadius: 22, padding: 30, boxShadow: "0 8px 40px rgba(236,72,153,0.09)", position: "relative", overflow: "hidden" };
  const inputStyle = (hasError) => ({ width: "100%", background: hasError ? "rgba(236,72,153,0.04)" : "rgba(253,242,248,0.6)", border: `1.5px solid ${hasError ? "rgba(236,72,153,0.55)" : "rgba(236,72,153,0.18)"}`, borderRadius: 14, padding: "12px 14px 12px 44px", color: "#3b0764", fontFamily: "inherit", fontSize: "0.9rem", fontWeight: 500, outline: "none", boxSizing: "border-box", transition: "all 0.2s" });

  return (
    <div style={S}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');
        @keyframes spin{to{transform:rotate(360deg)}}

        .ap-grid {
          display: grid;
          grid-template-columns: 1fr 340px;
          gap: 22px;
          align-items: start;
        }

        .ap-preview-card {
          position: sticky;
          top: 20px;
        }

        .ap-back-btn:hover {
          background: rgba(0,0,0,0.07) !important;
          color: #555 !important;
          border-color: rgba(0,0,0,0.12) !important;
          box-shadow: 0 2px 10px rgba(0,0,0,0.07) !important;
          transform: translateY(-1px);
        }

        .ap-save-btn:not(:disabled):hover {
          background: rgba(0,0,0,0.08) !important;
          box-shadow: 0 4px 18px rgba(0,0,0,0.12) !important;
          transform: translateY(-2px);
        }

        @media (max-width: 900px) {
          .ap-grid {
            grid-template-columns: 1fr !important;
          }
          .ap-preview-card {
            position: static !important;
          }
        }

        @media (max-width: 600px) {
          .ap-root-padding {
            padding: 0 2px;
          }
          .ap-header {
            margin-bottom: 18px !important;
          }
          .ap-card {
            padding: 18px 14px !important;
            border-radius: 16px !important;
          }
          .ap-title {
            font-size: 1.4rem !important;
          }
          .ap-grid {
            gap: 14px !important;
          }
        }
      `}</style>

      <div className="ap-root-padding">
        {/* Header */}
        <div className="ap-header" style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 28 }}>
          <button
            className="ap-back-btn"
            onClick={() => navigate("/products")}
            style={{ width: 42, height: 42, borderRadius: 14, background: "linear-gradient(135deg, rgba(253,242,248,0.9), rgba(250,245,255,0.9))", border: "1.5px solid rgba(236,72,153,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem", cursor: "pointer", transition: "all 0.22s", color: "#ec4899", flexShrink: 0, boxShadow: "0 2px 10px rgba(236,72,153,0.1)" }}
          >
            ←
          </button>
          <div>
            <h1 className="ap-title" style={{ fontSize: "1.9rem", fontWeight: 800, color: "#6b7280", letterSpacing: "-0.02em", margin: 0 }}>✨ Add Product</h1>
            <p style={{ fontSize: "0.82rem", color: "rgba(168,85,247,0.55)", marginTop: 3, fontWeight: 500 }}>Fill in the details to add a new product</p>
          </div>
        </div>

        {/* Layout */}
        <div className="ap-grid">

          {/* Form Card */}
          <div className="ap-card" style={cardStyle}>
            {/* Blobs */}
            <div style={{ position: "absolute", top: -30, right: -30, width: 120, height: 120, background: "radial-gradient(circle, rgba(236,72,153,0.14), transparent 70%)", borderRadius: "50%", filter: "blur(20px)", pointerEvents: "none" }} />
            <div style={{ position: "absolute", bottom: -20, left: -20, width: 90, height: 90, background: "radial-gradient(circle, rgba(168,85,247,0.1), transparent 70%)", borderRadius: "50%", filter: "blur(16px)", pointerEvents: "none" }} />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, transparent 30%, rgba(255,255,255,0.3) 60%, transparent 100%)", borderRadius: 22, pointerEvents: "none" }} />

            <div style={{ position: "relative", zIndex: 1 }}>
              <div style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(168,85,247,0.5)", marginBottom: 24, display: "flex", alignItems: "center", gap: 10 }}>
                 Product Details
                <div style={{ flex: 1, height: 1.5, background: "linear-gradient(90deg, rgba(236,72,153,0.2), transparent)" }} />
              </div>

              <form onSubmit={handleSubmit} noValidate>
                {fields.map(f => (
                  <div key={f.name} style={{ marginBottom: 20 }}>
                    <label style={{ display: "flex", alignItems: "center", gap: 7, fontSize: "0.8rem", fontWeight: 600, color: "rgba(107,33,168,0.6)", marginBottom: 8 }}>
                      {f.label} {f.required && <span style={{ color: "#ec4899" }}>*</span>}
                    </label>
                    <div style={{ position: "relative" }}>
                      <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontSize: "1rem", pointerEvents: "none" }}>{f.icon}</span>
                      <input type={f.type} name={f.name} placeholder={f.ph}
                        value={formData[f.name]} onChange={handleChange}
                        min={f.type === "number" ? "0" : undefined}
                        style={inputStyle(!!errors[f.name])}
                        onFocus={e => { e.target.style.borderColor = "rgba(236,72,153,0.45)"; e.target.style.boxShadow = "0 0 0 3px rgba(236,72,153,0.09)"; e.target.style.background = "rgba(253,242,248,0.85)"; }}
                        onBlur={e => { e.target.style.borderColor = errors[f.name] ? "rgba(236,72,153,0.55)" : "rgba(236,72,153,0.18)"; e.target.style.boxShadow = "none"; e.target.style.background = errors[f.name] ? "rgba(236,72,153,0.04)" : "rgba(253,242,248,0.6)"; }} />
                    </div>
                    {errors[f.name] && <div style={{ fontSize: "0.73rem", color: "#ec4899", marginTop: 5, display: "flex", alignItems: "center", gap: 4 }}>💕 {errors[f.name]}</div>}
                  </div>
                ))}

                {/* Description */}
                <div style={{ marginBottom: 20 }}>
                  <label style={{ display: "flex", alignItems: "center", gap: 7, fontSize: "0.8rem", fontWeight: 600, color: "rgba(107,33,168,0.6)", marginBottom: 8 }}>Description</label>
                  <div style={{ position: "relative" }}>
                    <span style={{ position: "absolute", left: 14, top: 16, fontSize: "1rem", pointerEvents: "none" }}>📝</span>
                    <textarea name="description" placeholder="Optional product description..."
                      value={formData.description} onChange={handleChange}
                      style={{ width: "100%", background: "rgba(253,242,248,0.6)", border: "1.5px solid rgba(236,72,153,0.18)", borderRadius: 14, padding: "12px 14px 12px 44px", color: "#3b0764", fontFamily: "inherit", fontSize: "0.9rem", fontWeight: 500, outline: "none", boxSizing: "border-box", resize: "vertical", minHeight: 100, transition: "all 0.2s" }}
                      onFocus={e => { e.target.style.borderColor = "rgba(236,72,153,0.45)"; e.target.style.boxShadow = "0 0 0 3px rgba(236,72,153,0.09)"; }}
                      onBlur={e => { e.target.style.borderColor = "rgba(236,72,153,0.18)"; e.target.style.boxShadow = "none"; }} />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="ap-save-btn"
                  style={{ width: "100%", padding: 14, borderRadius: 14, fontFamily: "inherit", fontSize: "0.95rem", fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", border: "none", background: "#6b7280", color: "white", transition: "all 0.25s", boxShadow: "0 4px 22px rgba(0,0,0,0.13)", marginTop: 10, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, opacity: loading ? 0.65 : 1 }}
                >
                  {loading ? (
                    <><div style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.4)", borderTopColor: "white", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} /> Saving...</>
                  ) : "✨ Save Product"}
                </button>
              </form>
            </div>
          </div>

          {/* Preview Card */}
          <div className="ap-card ap-preview-card" style={cardStyle}>
            <div style={{ position: "absolute", top: -20, right: -20, width: 100, height: 100, background: "radial-gradient(circle, rgba(168,85,247,0.12), transparent 70%)", borderRadius: "50%", filter: "blur(16px)", pointerEvents: "none" }} />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, transparent 30%, rgba(255,255,255,0.3) 60%, transparent 100%)", borderRadius: 22, pointerEvents: "none" }} />

            <div style={{ position: "relative", zIndex: 1 }}>
              <div style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(168,85,247,0.5)", marginBottom: 22, display: "flex", alignItems: "center", gap: 10 }}>
                👁 Live Preview
                <div style={{ flex: 1, height: 1.5, background: "linear-gradient(90deg, rgba(236,72,153,0.2), transparent)" }} />
              </div>

              {/* Preview Product Card */}
              <div style={{ background: "linear-gradient(135deg, rgba(253,242,248,0.9), rgba(250,245,255,0.85))", border: "1.5px solid rgba(236,72,153,0.15)", borderRadius: 18, padding: 22, textAlign: "center", marginBottom: 22, position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: -20, right: -20, width: 80, height: 80, background: "radial-gradient(circle, rgba(236,72,153,0.18), transparent 70%)", borderRadius: "50%", filter: "blur(14px)" }} />
                <div style={{ position: "absolute", bottom: -15, left: -15, width: 70, height: 70, background: "radial-gradient(circle, rgba(168,85,247,0.14), transparent 70%)", borderRadius: "50%", filter: "blur(12px)" }} />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, transparent 30%, rgba(255,255,255,0.4) 60%, transparent 100%)", borderRadius: 18, pointerEvents: "none" }} />
                <div style={{ position: "relative", zIndex: 1 }}>
                  <div style={{ fontSize: "2.8rem", marginBottom: 12 }}>🎁</div>
                  <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "#4c0280", marginBottom: 6, minHeight: "1.4em" }}>
                    {formData.name || <span style={{ color: "rgba(168,85,247,0.25)" }}>Product Name</span>}
                  </div>
                  <div style={{ fontSize: "0.74rem", fontFamily: "monospace", background: "rgba(168,85,247,0.08)", border: "1.5px solid rgba(168,85,247,0.18)", color: "#a855f7", borderRadius: 999, padding: "2px 12px", display: "inline-block", marginBottom: 14 }}>
                    {formData.sku || "SKU-000"}
                  </div>
                  <div style={{ fontSize: "1.6rem", fontWeight: 800, background: "linear-gradient(135deg, #059669, #10b981)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                    ₹{formData.price ? Number(formData.price).toLocaleString("en-IN") : "0"}
                  </div>
                </div>
              </div>

              {[
                { key: "Name",        val: formData.name        || "—" },
                { key: "SKU",         val: formData.sku         || "—" },
                { key: "Price",       val: formData.price ? `₹${Number(formData.price).toLocaleString("en-IN")}` : "—" },
                { key: "Description", val: formData.description || "—" },
              ].map(r => (
                <div key={r.key} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "10px 0", borderBottom: "1px solid rgba(236,72,153,0.07)", fontSize: "0.83rem", gap: 10 }}>
                  <span style={{ color: "rgba(168,85,247,0.5)", fontWeight: 500 }}>{r.key}</span>
                  <span style={{ color: "#4c0280", fontWeight: 600, textAlign: "right", wordBreak: "break-word", maxWidth: 180 }}>{r.val}</span>
                </div>
              ))}

              <div style={{ background: "linear-gradient(135deg, rgba(253,242,248,0.8), rgba(250,245,255,0.75))", border: "1.5px solid rgba(236,72,153,0.1)", borderRadius: 14, padding: "14px 16px", marginTop: 18 }}>
                <div style={{ fontSize: "0.68rem", fontWeight: 700, color: "rgba(168,85,247,0.6)", marginBottom: 8, letterSpacing: "0.05em", textTransform: "uppercase" }}>💡 Tips</div>
                {["📌 SKU must be unique across all products", "💰 Enter price in Indian Rupees (₹)", "📝 Description is optional but recommended"].map(t => (
                  <div key={t} style={{ fontSize: "0.77rem", color: "rgba(107,33,168,0.5)", display: "flex", alignItems: "flex-start", gap: 6, marginBottom: 5, fontWeight: 500 }}>{t}</div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default AddProduct;