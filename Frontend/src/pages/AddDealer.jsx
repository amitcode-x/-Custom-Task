import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

function AddDealer() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const e = {};
    if (!formData.name.trim())  e.name    = "Dealer name is required";
    if (!formData.email.trim()) e.email   = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) e.email = "Enter a valid email";
    if (!formData.phone.trim()) e.phone   = "Phone number is required";
    else if (!/^\d{10}$/.test(formData.phone.replace(/\s/g, ""))) e.phone = "Enter a valid 10-digit phone";
    if (!formData.address.trim()) e.address = "Address is required";
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    api.post("dealers/", formData)
      .then(() => { setLoading(false); navigate("/dealers"); })
      .catch(err => { setLoading(false); console.log(err); alert("Error adding dealer"); });
  };

  const getInitials = (name = "") =>
    name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2) || "?";

  const getAvatarColor = (name = "") => {
    const colors = [
      ["rgba(99,102,241,0.3)", "rgba(99,102,241,0.5)", "#a5b4fc"],
      ["rgba(139,92,246,0.3)", "rgba(139,92,246,0.5)", "#c4b5fd"],
      ["rgba(59,130,246,0.3)", "rgba(59,130,246,0.5)", "#93c5fd"],
      ["rgba(16,185,129,0.3)", "rgba(16,185,129,0.5)", "#6ee7b7"],
      ["rgba(245,158,11,0.3)", "rgba(245,158,11,0.5)", "#fcd34d"],
      ["rgba(239,68,68,0.3)",  "rgba(239,68,68,0.5)",  "#fca5a5"],
    ];
    const idx = name.charCodeAt(0) % colors.length || 0;
    return colors[idx];
  };

  const [avatarBg, avatarBorder, avatarText] = getAvatarColor(formData.name);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap');

        .ad-wrap { font-family: 'Outfit', sans-serif; color: #e2e8f0; }

        /* Page Header */
        .ad-page-header {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 28px;
        }
        .ad-back-btn {
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
        .ad-back-btn:hover {
          background: rgba(99,102,241,0.15);
          border-color: rgba(99,102,241,0.3);
        }
        .ad-page-header h1 {
          font-size: 1.8rem;
          font-weight: 800;
          background: linear-gradient(135deg, #e2e8f0, #a5b4fc);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .ad-page-header p {
          font-size: 0.82rem;
          color: rgba(148,163,184,0.6);
          margin-top: 2px;
        }

        /* Layout */
        .ad-layout {
          display: grid;
          grid-template-columns: 1fr 340px;
          gap: 24px;
          align-items: start;
        }
        @media (max-width: 900px) {
          .ad-layout { grid-template-columns: 1fr; }
          .ad-preview { order: -1; }
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
          min-height: 90px;
        }
        .field-textarea::placeholder { color: rgba(148,163,184,0.4); }
        .field-textarea:focus {
          border-color: rgba(99,102,241,0.5);
          box-shadow: 0 0 0 3px rgba(99,102,241,0.1);
          background: rgba(99,102,241,0.05);
        }
        .field-textarea.has-error {
          border-color: rgba(239,68,68,0.5);
          box-shadow: 0 0 0 3px rgba(239,68,68,0.08);
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

        /* Dealer Preview Card */
        .preview-dealer-card {
          border-radius: 14px;
          padding: 20px;
          text-align: center;
          margin-bottom: 20px;
          border: 1px solid;
          transition: all 0.3s;
        }
        .dealer-big-avatar {
          width: 64px; height: 64px;
          border-radius: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.4rem;
          font-weight: 800;
          margin: 0 auto 14px;
          transition: all 0.3s;
          letter-spacing: 0.02em;
        }
        .preview-dealer-name {
          font-size: 1.1rem;
          font-weight: 700;
          color: #e2e8f0;
          margin-bottom: 16px;
          min-height: 1.4em;
        }

        /* Contact Pills */
        .contact-pills {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .contact-pill {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 10px;
          padding: 8px 12px;
          font-size: 0.82rem;
          color: rgba(203,213,225,0.8);
          text-align: left;
          word-break: break-all;
        }

        .preview-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding: 10px 0;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          font-size: 0.83rem;
          gap: 10px;
        }
        .preview-row:last-child { border-bottom: none; }
        .preview-row-key { color: rgba(148,163,184,0.6); flex-shrink: 0; }
        .preview-row-val { color: #e2e8f0; font-weight: 600; text-align: right; word-break: break-word; }

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

      <div className="ad-wrap">
        {/* Page Header */}
        <div className="ad-page-header">
          <button className="ad-back-btn" onClick={() => navigate("/dealers")}>←</button>
          <div>
            <h1>Add Dealer</h1>
            <p>Register a new dealer to your network</p>
          </div>
        </div>

        <div className="ad-layout">
          {/* Form */}
          <div className="form-card">
            <div className="form-card-title">🤝 Dealer Information</div>

            <form onSubmit={handleSubmit} noValidate>
              {/* Name */}
              <div className="field-group">
                <label className="field-label">Full Name <span className="required-star">*</span></label>
                <div className="field-input-wrap">
                  <span className="field-icon">👤</span>
                  <input
                    type="text"
                    name="name"
                    placeholder="e.g. Ramesh Trading Co."
                    value={formData.name}
                    onChange={handleChange}
                    className={`field-input ${errors.name ? "has-error" : ""}`}
                  />
                </div>
                {errors.name && <div className="field-error">⚠ {errors.name}</div>}
              </div>

              {/* Email */}
              <div className="field-group">
                <label className="field-label">Email Address <span className="required-star">*</span></label>
                <div className="field-input-wrap">
                  <span className="field-icon">✉️</span>
                  <input
                    type="email"
                    name="email"
                    placeholder="e.g. dealer@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className={`field-input ${errors.email ? "has-error" : ""}`}
                  />
                </div>
                {errors.email && <div className="field-error">⚠ {errors.email}</div>}
              </div>

              {/* Phone */}
              <div className="field-group">
                <label className="field-label">Phone Number <span className="required-star">*</span></label>
                <div className="field-input-wrap">
                  <span className="field-icon">📞</span>
                  <input
                    type="text"
                    name="phone"
                    placeholder="e.g. 9876543210"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`field-input ${errors.phone ? "has-error" : ""}`}
                    maxLength={10}
                  />
                </div>
                {errors.phone && <div className="field-error">⚠ {errors.phone}</div>}
              </div>

              {/* Address */}
              <div className="field-group">
                <label className="field-label">Address <span className="required-star">*</span></label>
                <div className="field-input-wrap">
                  <span className="field-icon" style={{ top: "16px", transform: "none" }}>📍</span>
                  <textarea
                    name="address"
                    placeholder="e.g. 12, Main Market, Delhi - 110001"
                    value={formData.address}
                    onChange={handleChange}
                    className={`field-textarea ${errors.address ? "has-error" : ""}`}
                  />
                </div>
                {errors.address && <div className="field-error">⚠ {errors.address}</div>}
              </div>

              <button type="submit" className="submit-btn" disabled={loading}>
                {loading
                  ? <><div className="btn-spinner" /> Saving...</>
                  : <>🤝 Save Dealer</>
                }
              </button>
            </form>
          </div>

          {/* Preview */}
          <div className="preview-card ad-preview">
            <div className="preview-title">👁 Live Preview</div>

            {/* Dealer Card Preview */}
            <div
              className="preview-dealer-card"
              style={{
                background: avatarBg,
                borderColor: avatarBorder,
              }}
            >
              <div
                className="dealer-big-avatar"
                style={{ background: avatarBg, border: `2px solid ${avatarBorder}`, color: avatarText }}
              >
                {getInitials(formData.name)}
              </div>
              <div className="preview-dealer-name">
                {formData.name || <span style={{ color: "rgba(148,163,184,0.3)" }}>Dealer Name</span>}
              </div>

              <div className="contact-pills">
                <div className="contact-pill">
                  <span>✉️</span>
                  <span>{formData.email || <span style={{ color: "rgba(148,163,184,0.3)" }}>email@example.com</span>}</span>
                </div>
                <div className="contact-pill">
                  <span>📞</span>
                  <span>{formData.phone || <span style={{ color: "rgba(148,163,184,0.3)" }}>Phone number</span>}</span>
                </div>
                <div className="contact-pill">
                  <span>📍</span>
                  <span>{formData.address || <span style={{ color: "rgba(148,163,184,0.3)" }}>Address</span>}</span>
                </div>
              </div>
            </div>

            {/* Data Rows */}
            {[
              { key: "Name",    val: formData.name    || "—" },
              { key: "Email",   val: formData.email   || "—" },
              { key: "Phone",   val: formData.phone   || "—" },
              { key: "Address", val: formData.address || "—" },
            ].map(r => (
              <div className="preview-row" key={r.key}>
                <span className="preview-row-key">{r.key}</span>
                <span className="preview-row-val">{r.val}</span>
              </div>
            ))}

            <div className="tips-box">
              <div className="tips-title">💡 Tips</div>
              <div className="tip-item">📧 Use a valid business email address</div>
              <div className="tip-item">📱 Enter 10-digit Indian mobile number</div>
              <div className="tip-item">📍 Include city and PIN code in address</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AddDealer;