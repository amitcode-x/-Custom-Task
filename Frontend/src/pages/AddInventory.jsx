import { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function AddInventory() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({ product: "", quantity: "" });
  const [loading, setLoading]         = useState(false);
  const [productsLoading, setProdLoad] = useState(true);
  const [errors, setErrors]           = useState({});

  useEffect(() => {
    api.get("products/")
      .then(res => { setProducts(res.data); setProdLoad(false); })
      .catch(err => { console.log(err); setProdLoad(false); });
  }, []);

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const e = {};
    if (!formData.product)  e.product  = "Please select a product";
    if (!formData.quantity) e.quantity = "Quantity is required";
    else if (isNaN(formData.quantity) || Number(formData.quantity) < 0) e.quantity = "Enter a valid quantity";
    return e;
  };

  const handleSubmit = e => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    api.post("inventory/", formData)
      .then(() => { setLoading(false); navigate("/inventory"); })
      .catch(err => { setLoading(false); console.log(err); alert("Error adding inventory"); });
  };

  const selectedProduct = products.find(p => String(p.id) === String(formData.product));

  const getStockLevel = qty => {
    const q = Number(qty);
    if (!qty || isNaN(q)) return null;
    if (q === 0)  return { label: "Out of Stock", color: "#ec4899", bg: "rgba(236,72,153,0.1)", border: "rgba(236,72,153,0.28)", icon: "🚫" };
    if (q <= 10)  return { label: "Low Stock",    color: "#d97706", bg: "rgba(245,158,11,0.1)", border: "rgba(245,158,11,0.28)", icon: "⚠️" };
    if (q <= 50)  return { label: "Medium Stock", color: "#a855f7", bg: "rgba(168,85,247,0.1)", border: "rgba(168,85,247,0.28)", icon: "📦" };
    return          { label: "High Stock",    color: "#059669", bg: "rgba(16,185,129,0.1)",  border: "rgba(16,185,129,0.28)",  icon: "✅" };
  };
  const stockLevel = getStockLevel(formData.quantity);

  const cardStyle = { background: "linear-gradient(135deg, rgba(255,255,255,0.88), rgba(253,242,248,0.8), rgba(250,245,255,0.75))", backdropFilter: "blur(20px)", border: "1.5px solid rgba(236,72,153,0.12)", borderRadius: 22, padding: 30, boxShadow: "0 8px 40px rgba(236,72,153,0.09)", position: "relative", overflow: "hidden" };

  const sectionTitle = (label) => (
    <div style={{ fontSize:"0.68rem",fontWeight:700,letterSpacing:"0.12em",textTransform:"uppercase",color:"rgba(168,85,247,0.5)",marginBottom:24,display:"flex",alignItems:"center",gap:10 }}>
      {label}
      <div style={{ flex:1,height:1.5,background:"linear-gradient(90deg,rgba(236,72,153,0.2),transparent)" }} />
    </div>
  );

  return (
    <div style={{ fontFamily: "'Poppins', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');
        @keyframes spin { to { transform: rotate(360deg) } }
        @keyframes mini-spin { to { transform: rotate(360deg) } }

        .ai-grid {
          display: grid;
          grid-template-columns: 1fr 340px;
          gap: 22px;
          align-items: start;
        }

        .ai-preview-card {
          position: sticky;
          top: 20px;
        }

        .ai-back-btn {
          width: 42px; height: 42px; border-radius: 14px;
          background: linear-gradient(135deg, rgba(253,242,248,0.9), rgba(250,245,255,0.9));
          border: 1.5px solid rgba(236,72,153,0.2);
          display: flex; align-items: center; justify-content: center;
          font-size: 1rem; cursor: pointer; transition: all 0.22s;
          color: #ec4899; flex-shrink: 0;
          box-shadow: 0 2px 10px rgba(236,72,153,0.1);
        }
        .ai-back-btn:hover {
          background: rgba(0,0,0,0.07) !important;
          color: #555 !important;
          border-color: rgba(0,0,0,0.12) !important;
          box-shadow: 0 2px 10px rgba(0,0,0,0.07) !important;
          transform: translateY(-1px);
        }

        .ai-save-btn {
          width: 100%; padding: 14px; border-radius: 14px;
          font-family: inherit; font-size: 0.95rem; font-weight: 700;
          border: none; background: #6b7280; color: white;
          transition: all 0.25s;
          box-shadow: 0 4px 22px rgba(0,0,0,0.13);
          margin-top: 10px;
          display: flex; align-items: center; justify-content: center; gap: 8px;
        }
        .ai-save-btn:not(:disabled):hover {
          background: rgba(75,85,99,1) !important;
          box-shadow: 0 4px 18px rgba(0,0,0,0.18) !important;
          transform: translateY(-2px);
        }
        .ai-save-btn:disabled { opacity: 0.65; cursor: not-allowed; }

        .ai-quick-chip {
          padding: 4px 14px; border-radius: 999px; font-size: 0.74rem;
          font-weight: 600; cursor: pointer;
          border: 1.5px solid rgba(236,72,153,0.2);
          background: rgba(236,72,153,0.06); color: #ec4899;
          transition: all 0.15s; font-family: inherit;
        }
        .ai-quick-chip:hover {
          background: rgba(0,0,0,0.07) !important;
          color: #555 !important;
          border-color: rgba(0,0,0,0.12) !important;
          box-shadow: none !important;
        }

        @media (max-width: 900px) {
          .ai-grid {
            grid-template-columns: 1fr !important;
          }
          .ai-preview-card {
            position: static !important;
          }
        }

        @media (max-width: 600px) {
          .ai-card {
            padding: 18px 14px !important;
            border-radius: 16px !important;
          }
          .ai-title {
            font-size: 1.4rem !important;
          }
          .ai-grid {
            gap: 14px !important;
          }
          .ai-header {
            margin-bottom: 18px !important;
          }
        }
      `}</style>

      {/* Header */}
      <div className="ai-header" style={{ display:"flex", alignItems:"center", gap:14, marginBottom:28 }}>
        <button className="ai-back-btn" onClick={() => navigate("/inventory")}>←</button>
        <div>
          <h1 className="ai-title" style={{ fontSize:"1.9rem", fontWeight:800, color:"#6b7280", letterSpacing:"-0.02em", margin:0 }}>📋 Add Inventory</h1>
          <p style={{ fontSize:"0.82rem", color:"rgba(168,85,247,0.55)", marginTop:3, fontWeight:500 }}>Assign stock quantity to a product</p>
        </div>
      </div>

      <div className="ai-grid">

        {/* Form Card */}
        <div className="ai-card" style={cardStyle}>
          <div style={{ position:"absolute",top:-30,right:-30,width:120,height:120,background:"radial-gradient(circle,rgba(236,72,153,0.14),transparent 70%)",borderRadius:"50%",filter:"blur(20px)",pointerEvents:"none" }} />
          <div style={{ position:"absolute",bottom:-20,left:-20,width:90,height:90,background:"radial-gradient(circle,rgba(168,85,247,0.1),transparent 70%)",borderRadius:"50%",filter:"blur(16px)",pointerEvents:"none" }} />
          <div style={{ position:"absolute",inset:0,background:"linear-gradient(135deg,transparent 30%,rgba(255,255,255,0.3) 60%,transparent 100%)",borderRadius:22,pointerEvents:"none" }} />

          <div style={{ position:"relative", zIndex:1 }}>
            {sectionTitle("📦 Inventory Details")}
            <form onSubmit={handleSubmit} noValidate>

              {/* Product Select */}
              <div style={{ marginBottom:22 }}>
                <label style={{ display:"flex",alignItems:"center",gap:7,fontSize:"0.8rem",fontWeight:600,color:"rgba(107,33,168,0.6)",marginBottom:8 }}>
                  Select Product <span style={{ color:"#ec4899" }}>*</span>
                </label>
                {productsLoading ? (
                  <div style={{ display:"flex",alignItems:"center",gap:8,color:"rgba(168,85,247,0.5)",fontSize:"0.85rem",padding:"12px 0" }}>
                    <div style={{ width:14,height:14,border:"2px solid rgba(236,72,153,0.2)",borderTopColor:"#ec4899",borderRadius:"50%",animation:"mini-spin 0.8s linear infinite" }} />
                    Loading products...
                  </div>
                ) : (
                  <div style={{ position:"relative" }}>
                    <span style={{ position:"absolute",left:14,top:"50%",transform:"translateY(-50%)",fontSize:"1rem",pointerEvents:"none",zIndex:1 }}>🎁</span>
                    <select name="product" value={formData.product} onChange={handleChange}
                      style={{ width:"100%",background:errors.product?"rgba(236,72,153,0.04)":"rgba(253,242,248,0.6)",border:`1.5px solid ${errors.product?"rgba(236,72,153,0.55)":"rgba(236,72,153,0.18)"}`,borderRadius:14,padding:"12px 36px 12px 44px",color:formData.product?"#3b0764":"rgba(168,85,247,0.35)",fontFamily:"inherit",fontSize:"0.9rem",fontWeight:500,outline:"none",boxSizing:"border-box",cursor:"pointer",appearance:"none",backgroundImage:"url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23ec4899' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E\")",backgroundRepeat:"no-repeat",backgroundPosition:"right 14px center",transition:"all 0.2s" }}
                      onFocus={e=>{e.target.style.borderColor="rgba(236,72,153,0.45)";e.target.style.boxShadow="0 0 0 3px rgba(236,72,153,0.09)";e.target.style.background="rgba(253,242,248,0.85)";}}
                      onBlur={e=>{e.target.style.borderColor=errors.product?"rgba(236,72,153,0.55)":"rgba(236,72,153,0.18)";e.target.style.boxShadow="none";e.target.style.background=errors.product?"rgba(236,72,153,0.04)":"rgba(253,242,248,0.6)";}}>
                      <option value="">— Choose a product —</option>
                      {products.map(p => <option key={p.id} value={p.id}>{p.name}{p.sku?` (${p.sku})`:""}</option>)}
                    </select>
                  </div>
                )}
                {errors.product && <div style={{ fontSize:"0.73rem",color:"#ec4899",marginTop:5 }}> {errors.product}</div>}
              </div>

              {/* Quantity */}
              <div style={{ marginBottom:22 }}>
                <label style={{ display:"flex",alignItems:"center",gap:7,fontSize:"0.8rem",fontWeight:600,color:"rgba(107,33,168,0.6)",marginBottom:8 }}>
                  Initial Quantity <span style={{ color:"#ec4899" }}>*</span>
                </label>
                <div style={{ position:"relative" }}>
                  <span style={{ position:"absolute",left:14,top:"50%",transform:"translateY(-50%)",fontSize:"1rem",pointerEvents:"none" }}>🔢</span>
                  <input type="number" name="quantity" placeholder="e.g. 100" min="0" value={formData.quantity} onChange={handleChange}
                    style={{ width:"100%",background:errors.quantity?"rgba(236,72,153,0.04)":"rgba(253,242,248,0.6)",border:`1.5px solid ${errors.quantity?"rgba(236,72,153,0.55)":"rgba(236,72,153,0.18)"}`,borderRadius:14,padding:"12px 14px 12px 44px",color:"#3b0764",fontFamily:"inherit",fontSize:"0.9rem",fontWeight:500,outline:"none",boxSizing:"border-box",transition:"all 0.2s" }}
                    onFocus={e=>{e.target.style.borderColor="rgba(236,72,153,0.45)";e.target.style.boxShadow="0 0 0 3px rgba(236,72,153,0.09)";e.target.style.background="rgba(253,242,248,0.85)";}}
                    onBlur={e=>{e.target.style.borderColor=errors.quantity?"rgba(236,72,153,0.55)":"rgba(236,72,153,0.18)";e.target.style.boxShadow="none";e.target.style.background=errors.quantity?"rgba(236,72,153,0.04)":"rgba(253,242,248,0.6)";}} />
                </div>
                {errors.quantity && <div style={{ fontSize:"0.73rem",color:"#ec4899",marginTop:5 }}> {errors.quantity}</div>}

                {/* Quick chips */}
                <div style={{ display:"flex",gap:8,marginTop:10,flexWrap:"wrap",alignItems:"center" }}>
                  <span style={{ fontSize:"0.7rem",color:"rgba(168,85,247,0.4)",fontWeight:600 }}>Quick:</span>
                  {[10,25,50,100,250,500].map(q => (
                    <button key={q} type="button" className="ai-quick-chip"
                      onClick={() => { setFormData(f=>({...f,quantity:q})); setErrors(e=>({...e,quantity:""})); }}>
                      {q}
                    </button>
                  ))}
                </div>
              </div>

              <button type="submit" disabled={loading} className="ai-save-btn">
                {loading
                  ? <><div style={{width:16,height:16,border:"2px solid rgba(255,255,255,0.4)",borderTopColor:"white",borderRadius:"50%",animation:"spin 0.8s linear infinite"}}/>Saving...</>
                  : "📋 Save Inventory"}
              </button>
            </form>
          </div>
        </div>

        {/* Preview Card */}
        <div className="ai-card ai-preview-card" style={cardStyle}>
          <div style={{ position:"absolute",top:-20,right:-20,width:100,height:100,background:"radial-gradient(circle,rgba(168,85,247,0.12),transparent 70%)",borderRadius:"50%",filter:"blur(16px)",pointerEvents:"none" }} />
          <div style={{ position:"absolute",inset:0,background:"linear-gradient(135deg,transparent 30%,rgba(255,255,255,0.3) 60%,transparent 100%)",borderRadius:22,pointerEvents:"none" }} />

          <div style={{ position:"relative", zIndex:1 }}>
            {sectionTitle("👁 Live Preview")}

            {/* Inventory Visual */}
            <div style={{ borderRadius:18,padding:24,textAlign:"center",marginBottom:22,border:`1.5px solid ${stockLevel?.border||"rgba(236,72,153,0.15)"}`,background:stockLevel?.bg||"linear-gradient(135deg,rgba(253,242,248,0.85),rgba(250,245,255,0.8))",position:"relative",overflow:"hidden",transition:"all 0.3s" }}>
              <div style={{ position:"absolute",inset:0,background:"linear-gradient(135deg,transparent 30%,rgba(255,255,255,0.3) 60%,transparent 100%)",borderRadius:18,pointerEvents:"none" }} />
              <div style={{ position:"relative", zIndex:1 }}>
                <div style={{ fontSize:"3rem",marginBottom:10 }}>{stockLevel?.icon||"📦"}</div>
                <div style={{ fontSize:"1rem",fontWeight:700,color:"#4c0280",marginBottom:6 }}>
                  {selectedProduct?.name||<span style={{color:"rgba(168,85,247,0.25)"}}>Select a product</span>}
                </div>
                {selectedProduct?.sku && (
                  <div style={{ fontSize:"0.72rem",fontFamily:"monospace",color:"#a855f7",background:"rgba(168,85,247,0.08)",border:"1.5px solid rgba(168,85,247,0.18)",borderRadius:999,padding:"2px 12px",display:"inline-block",marginBottom:16 }}>
                    {selectedProduct.sku}
                  </div>
                )}
                <div style={{ fontSize:"3.2rem",fontWeight:800,lineHeight:1,marginBottom:6,color:stockLevel?.color||"rgba(168,85,247,0.25)",transition:"color 0.3s" }}>
                  {formData.quantity!==""?Number(formData.quantity).toLocaleString("en-IN"):"—"}
                </div>
                <div style={{ fontSize:"0.76rem",color:"rgba(168,85,247,0.4)",marginBottom:12,textTransform:"uppercase",letterSpacing:"0.08em" }}>units</div>
                {stockLevel && (
                  <span style={{ display:"inline-flex",alignItems:"center",gap:6,padding:"5px 16px",borderRadius:999,fontSize:"0.8rem",fontWeight:600,background:stockLevel.bg,border:`1.5px solid ${stockLevel.border}`,color:stockLevel.color }}>
                    <span style={{ width:7,height:7,borderRadius:"50%",background:stockLevel.color,boxShadow:`0 0 6px ${stockLevel.color}` }} />
                    {stockLevel.label}
                  </span>
                )}
              </div>
            </div>

            {[
              {key:"Product",val:selectedProduct?.name||"—"},
              {key:"SKU",    val:selectedProduct?.sku ||"—"},
              {key:"Price",  val:selectedProduct?.price?`₹${Number(selectedProduct.price).toLocaleString("en-IN")}`:"—"},
              {key:"Qty",    val:formData.quantity!==""?`${Number(formData.quantity).toLocaleString("en-IN")} units`:"—"},
            ].map(r=>(
              <div key={r.key} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderBottom:"1px solid rgba(236,72,153,0.07)",fontSize:"0.83rem",gap:10}}>
                <span style={{color:"rgba(168,85,247,0.5)",fontWeight:500}}>{r.key}</span>
                <span style={{color:"#4c0280",fontWeight:600,textAlign:"right"}}>{r.val}</span>
              </div>
            ))}

            <div style={{background:"linear-gradient(135deg,rgba(253,242,248,0.8),rgba(250,245,255,0.75))",border:"1.5px solid rgba(236,72,153,0.1)",borderRadius:14,padding:"14px 16px",marginTop:18}}>
              <div style={{fontSize:"0.68rem",fontWeight:700,color:"rgba(168,85,247,0.6)",marginBottom:8,letterSpacing:"0.05em",textTransform:"uppercase"}}>💡 Tips</div>
              {["⚠️ Each product can have only one inventory record","🔢 Use quick buttons for common quantities","✏️ You can update stock later from Inventory page"].map(t=>(
                <div key={t} style={{fontSize:"0.77rem",color:"rgba(107,33,168,0.5)",display:"flex",alignItems:"flex-start",gap:6,marginBottom:5,fontWeight:500}}>{t}</div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}