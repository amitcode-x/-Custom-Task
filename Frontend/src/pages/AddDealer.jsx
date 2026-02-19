// ══════════════════════════════════════════
// AddDealer.jsx
// ══════════════════════════════════════════
import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

export function AddDealer() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", address: "" });
  const [loading, setLoading]   = useState(false);
  const [errors, setErrors]     = useState({});

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const e = {};
    if (!formData.name.trim())    e.name    = "Dealer name is required";
    if (!formData.email.trim())   e.email   = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) e.email = "Enter a valid email";
    if (!formData.phone.trim())   e.phone   = "Phone number is required";
    else if (!/^\d{10}$/.test(formData.phone.replace(/\s/g,""))) e.phone = "Enter valid 10-digit phone";
    if (!formData.address.trim()) e.address = "Address is required";
    return e;
  };

  const handleSubmit = e => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    api.post("dealers/", formData)
      .then(() => { setLoading(false); navigate("/dealers"); })
      .catch(err => { setLoading(false); console.log(err); alert("Error adding dealer"); });
  };

  const COLORS = [
    ["rgba(236,72,153,0.15)","rgba(236,72,153,0.38)","#ec4899"],
    ["rgba(168,85,247,0.15)","rgba(168,85,247,0.38)","#a855f7"],
    ["rgba(99,102,241,0.15)","rgba(99,102,241,0.38)","#6366f1"],
    ["rgba(16,185,129,0.15)","rgba(16,185,129,0.38)","#059669"],
    ["rgba(245,158,11,0.15)","rgba(245,158,11,0.38)","#d97706"],
    ["rgba(239,68,68,0.15)", "rgba(239,68,68,0.38)", "#ef4444"],
  ];
  const [avatarBg, avatarBorder, avatarText] = COLORS[(formData.name.charCodeAt(0) || 0) % COLORS.length];
  const initials = formData.name.split(" ").map(w=>w[0]).join("").toUpperCase().slice(0,2) || "?";

  const cardStyle = { background: "linear-gradient(135deg, rgba(255,255,255,0.88), rgba(253,242,248,0.8), rgba(250,245,255,0.75))", backdropFilter: "blur(20px)", border: "1.5px solid rgba(236,72,153,0.12)", borderRadius: 22, padding: 30, boxShadow: "0 8px 40px rgba(236,72,153,0.09)", position: "relative", overflow: "hidden" };
  const inputStyle = (hasError) => ({ width: "100%", background: hasError ? "rgba(236,72,153,0.04)" : "rgba(253,242,248,0.6)", border: `1.5px solid ${hasError ? "rgba(236,72,153,0.55)" : "rgba(236,72,153,0.18)"}`, borderRadius: 14, padding: "12px 14px 12px 44px", color: "#3b0764", fontFamily: "inherit", fontSize: "0.9rem", fontWeight: 500, outline: "none", boxSizing: "border-box", transition: "all 0.2s" });

  const fields = [
    { name: "name",  label: "Full Name",     icon: "👤", type: "text",  ph: "e.g. Ramesh Trading Co." },
    { name: "email", label: "Email Address", icon: "✉️", type: "email", ph: "e.g. dealer@example.com" },
    { name: "phone", label: "Phone Number",  icon: "📞", type: "text",  ph: "e.g. 9876543210", maxLength: 10 },
  ];

  return (
    <div style={{ fontFamily: "'Poppins', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');
        @keyframes spin { to { transform: rotate(360deg) } }

        .ad-grid {
          display: grid;
          grid-template-columns: 1fr 340px;
          gap: 22px;
          align-items: start;
        }

        .ad-preview-card {
          position: sticky;
          top: 20px;
        }

        .ad-back-btn {
          width: 42px; height: 42px; border-radius: 14px;
          background: linear-gradient(135deg, rgba(253,242,248,0.9), rgba(250,245,255,0.9));
          border: 1.5px solid rgba(236,72,153,0.2);
          display: flex; align-items: center; justify-content: center;
          font-size: 1rem; cursor: pointer; transition: all 0.22s;
          color: #ec4899; flex-shrink: 0;
          box-shadow: 0 2px 10px rgba(236,72,153,0.1);
        }
        .ad-back-btn:hover {
          background: rgba(0,0,0,0.07) !important;
          color: #555 !important;
          border-color: rgba(0,0,0,0.12) !important;
          box-shadow: 0 2px 10px rgba(0,0,0,0.07) !important;
          transform: translateY(-1px);
        }

        .ad-save-btn {
          width: 100%; padding: 14px; border-radius: 14px;
          font-family: inherit; font-size: 0.95rem; font-weight: 700;
          border: none; background: #6b7280; color: white;
          transition: all 0.25s;
          box-shadow: 0 4px 22px rgba(0,0,0,0.13);
          margin-top: 10px;
          display: flex; align-items: center; justify-content: center; gap: 8px;
        }
        .ad-save-btn:not(:disabled):hover {
          background: rgb(75,85,99) !important;
          box-shadow: 0 4px 18px rgba(0,0,0,0.18) !important;
          transform: translateY(-2px);
        }
        .ad-save-btn:disabled { opacity: 0.65; cursor: not-allowed; }

        @media (max-width: 900px) {
          .ad-grid {
            grid-template-columns: 1fr !important;
          }
          .ad-preview-card {
            position: static !important;
          }
        }

        @media (max-width: 600px) {
          .ad-card {
            padding: 18px 14px !important;
            border-radius: 16px !important;
          }
          .ad-title {
            font-size: 1.4rem !important;
          }
          .ad-grid {
            gap: 14px !important;
          }
          .ad-header {
            margin-bottom: 18px !important;
          }
        }
      `}</style>

      {/* Header */}
      <div className="ad-header" style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 28 }}>
        <button className="ad-back-btn" onClick={() => navigate("/dealers")}>←</button>
        <div>
          <h1 className="ad-title" style={{ fontSize: "1.9rem", fontWeight: 800, color: "#6b7280", letterSpacing: "-0.02em", margin: 0 }}>👤 Add Dealer</h1>
          <p style={{ fontSize: "0.82rem", color: "rgba(168,85,247,0.55)", marginTop: 3, fontWeight: 500 }}>Register a new dealer to your network</p>
        </div>
      </div>

      <div className="ad-grid">

        {/* Form */}
        <div className="ad-card" style={cardStyle}>
          <div style={{ position:"absolute",top:-30,right:-30,width:120,height:120,background:"radial-gradient(circle,rgba(236,72,153,0.14),transparent 70%)",borderRadius:"50%",filter:"blur(20px)",pointerEvents:"none" }} />
          <div style={{ position:"absolute",bottom:-20,left:-20,width:90,height:90,background:"radial-gradient(circle,rgba(168,85,247,0.1),transparent 70%)",borderRadius:"50%",filter:"blur(16px)",pointerEvents:"none" }} />
          <div style={{ position:"absolute",inset:0,background:"linear-gradient(135deg,transparent 30%,rgba(255,255,255,0.3) 60%,transparent 100%)",borderRadius:22,pointerEvents:"none" }} />

          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ fontSize:"0.68rem",fontWeight:700,letterSpacing:"0.12em",textTransform:"uppercase",color:"rgba(168,85,247,0.5)",marginBottom:24,display:"flex",alignItems:"center",gap:10 }}>
              🤝 Dealer Information
              <div style={{ flex:1,height:1.5,background:"linear-gradient(90deg,rgba(236,72,153,0.2),transparent)" }} />
            </div>

            <form onSubmit={handleSubmit} noValidate>
              {fields.map(f => (
                <div key={f.name} style={{ marginBottom: 20 }}>
                  <label style={{ display:"flex",alignItems:"center",gap:7,fontSize:"0.8rem",fontWeight:600,color:"rgba(107,33,168,0.6)",marginBottom:8 }}>
                    {f.label} <span style={{ color:"#ec4899" }}>*</span>
                  </label>
                  <div style={{ position:"relative" }}>
                    <span style={{ position:"absolute",left:14,top:"50%",transform:"translateY(-50%)",fontSize:"1rem",pointerEvents:"none" }}>{f.icon}</span>
                    <input type={f.type} name={f.name} placeholder={f.ph} value={formData[f.name]} onChange={handleChange} maxLength={f.maxLength}
                      style={inputStyle(!!errors[f.name])}
                      onFocus={e => { e.target.style.borderColor="rgba(236,72,153,0.45)"; e.target.style.boxShadow="0 0 0 3px rgba(236,72,153,0.09)"; e.target.style.background="rgba(253,242,248,0.85)"; }}
                      onBlur={e => { e.target.style.borderColor=errors[f.name]?"rgba(236,72,153,0.55)":"rgba(236,72,153,0.18)"; e.target.style.boxShadow="none"; e.target.style.background=errors[f.name]?"rgba(236,72,153,0.04)":"rgba(253,242,248,0.6)"; }} />
                  </div>
                  {errors[f.name] && <div style={{ fontSize:"0.73rem",color:"#ec4899",marginTop:5 }}>💕 {errors[f.name]}</div>}
                </div>
              ))}

              {/* Address */}
              <div style={{ marginBottom: 20 }}>
                <label style={{ display:"flex",alignItems:"center",gap:7,fontSize:"0.8rem",fontWeight:600,color:"rgba(107,33,168,0.6)",marginBottom:8 }}>
                  Address <span style={{ color:"#ec4899" }}>*</span>
                </label>
                <div style={{ position:"relative" }}>
                  <span style={{ position:"absolute",left:14,top:16,fontSize:"1rem",pointerEvents:"none" }}>📍</span>
                  <textarea name="address" placeholder="e.g. 12, Main Market, Delhi - 110001" value={formData.address} onChange={handleChange}
                    style={{ width:"100%",background:errors.address?"rgba(236,72,153,0.04)":"rgba(253,242,248,0.6)",border:`1.5px solid ${errors.address?"rgba(236,72,153,0.55)":"rgba(236,72,153,0.18)"}`,borderRadius:14,padding:"12px 14px 12px 44px",color:"#3b0764",fontFamily:"inherit",fontSize:"0.9rem",fontWeight:500,outline:"none",boxSizing:"border-box",resize:"vertical",minHeight:90,transition:"all 0.2s" }}
                    onFocus={e => { e.target.style.borderColor="rgba(236,72,153,0.45)"; e.target.style.boxShadow="0 0 0 3px rgba(236,72,153,0.09)"; }}
                    onBlur={e => { e.target.style.borderColor=errors.address?"rgba(236,72,153,0.55)":"rgba(236,72,153,0.18)"; e.target.style.boxShadow="none"; }} />
                </div>
                {errors.address && <div style={{ fontSize:"0.73rem",color:"#ec4899",marginTop:5 }}>💕 {errors.address}</div>}
              </div>

              <button type="submit" disabled={loading} className="ad-save-btn">
                {loading
                  ? <><div style={{width:16,height:16,border:"2px solid rgba(255,255,255,0.4)",borderTopColor:"white",borderRadius:"50%",animation:"spin 0.8s linear infinite"}} />Saving...</>
                  : "🤝 Save Dealer"}
              </button>
            </form>
          </div>
        </div>

        {/* Preview */}
        <div className="ad-card ad-preview-card" style={cardStyle}>
          <div style={{ position:"absolute",top:-20,right:-20,width:100,height:100,background:"radial-gradient(circle,rgba(168,85,247,0.12),transparent 70%)",borderRadius:"50%",filter:"blur(16px)",pointerEvents:"none" }} />
          <div style={{ position:"absolute",inset:0,background:"linear-gradient(135deg,transparent 30%,rgba(255,255,255,0.3) 60%,transparent 100%)",borderRadius:22,pointerEvents:"none" }} />

          <div style={{ position:"relative", zIndex:1 }}>
            <div style={{ fontSize:"0.68rem",fontWeight:700,letterSpacing:"0.12em",textTransform:"uppercase",color:"rgba(168,85,247,0.5)",marginBottom:22,display:"flex",alignItems:"center",gap:10 }}>
              👁 Live Preview
              <div style={{ flex:1,height:1.5,background:"linear-gradient(90deg,rgba(236,72,153,0.2),transparent)" }} />
            </div>

            {/* Dealer Card */}
            <div style={{ background:`linear-gradient(135deg, ${avatarBg}, rgba(250,245,255,0.85))`,border:`1.5px solid ${avatarBorder}`,borderRadius:18,padding:22,textAlign:"center",marginBottom:20,position:"relative",overflow:"hidden" }}>
              <div style={{ position:"absolute",inset:0,background:"linear-gradient(135deg,transparent 30%,rgba(255,255,255,0.35) 60%,transparent 100%)",borderRadius:18,pointerEvents:"none" }} />
              <div style={{ position:"relative", zIndex:1 }}>
                <div style={{ width:64,height:64,borderRadius:18,background:avatarBg,border:`2px solid ${avatarBorder}`,color:avatarText,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.4rem",fontWeight:800,margin:"0 auto 14px",letterSpacing:"0.02em" }}>{initials}</div>
                <div style={{ fontSize:"1.1rem",fontWeight:700,color:"#4c0280",marginBottom:16,minHeight:"1.4em" }}>
                  {formData.name||<span style={{color:"rgba(168,85,247,0.25)"}}>Dealer Name</span>}
                </div>
                {[
                  { icon:"✉️", val:formData.email,   ph:"email@example.com" },
                  { icon:"📞", val:formData.phone,   ph:"Phone number" },
                  { icon:"📍", val:formData.address, ph:"Address" },
                ].map(p => (
                  <div key={p.ph} style={{ display:"flex",alignItems:"center",gap:8,background:"rgba(255,255,255,0.55)",border:"1.5px solid rgba(236,72,153,0.1)",borderRadius:12,padding:"8px 14px",fontSize:"0.82rem",color:"rgba(107,33,168,0.65)",textAlign:"left",wordBreak:"break-all",fontWeight:500,marginBottom:6 }}>
                    <span>{p.icon}</span><span>{p.val||<span style={{color:"rgba(168,85,247,0.25)"}}>{p.ph}</span>}</span>
                  </div>
                ))}
              </div>
            </div>

            {[{key:"Name",val:formData.name||"—"},{key:"Email",val:formData.email||"—"},{key:"Phone",val:formData.phone||"—"},{key:"Address",val:formData.address||"—"}].map(r=>(
              <div key={r.key} style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",padding:"10px 0",borderBottom:"1px solid rgba(236,72,153,0.07)",fontSize:"0.83rem",gap:10}}>
                <span style={{color:"rgba(168,85,247,0.5)",fontWeight:500}}>{r.key}</span>
                <span style={{color:"#4c0280",fontWeight:600,textAlign:"right",wordBreak:"break-word"}}>{r.val}</span>
              </div>
            ))}

            <div style={{background:"linear-gradient(135deg,rgba(253,242,248,0.8),rgba(250,245,255,0.75))",border:"1.5px solid rgba(236,72,153,0.1)",borderRadius:14,padding:"14px 16px",marginTop:18}}>
              <div style={{fontSize:"0.68rem",fontWeight:700,color:"rgba(168,85,247,0.6)",marginBottom:8,letterSpacing:"0.05em",textTransform:"uppercase"}}>💡 Tips</div>
              {["📧 Use a valid business email address","📱 Enter 10-digit Indian mobile number","📍 Include city and PIN code in address"].map(t=>(
                <div key={t} style={{fontSize:"0.77rem",color:"rgba(107,33,168,0.5)",display:"flex",alignItems:"flex-start",gap:6,marginBottom:5,fontWeight:500}}>{t}</div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default AddDealer;