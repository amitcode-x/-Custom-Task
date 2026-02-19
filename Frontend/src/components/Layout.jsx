import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import Navbar from "./Navbar";

const navItems = [
  { to: "/", label: "Dashboard", icon: "🏠" },
  { to: "/products", label: "Products", icon: "🎁" },
  { to: "/orders", label: "Orders", icon: "🛒" },
  { to: "/dealers", label: "Dealers", icon: "🤝" },
  { to: "/inventory", label: "Inventory", icon: "📦" },
  { to: "/add-product", label: "Add Product", icon: "✨" },
  { to: "/add-dealer", label: "Add Dealer", icon: "👤" },
  { to: "/add-inventory", label: "Add Inventory", icon: "📋" },
];

export default function Layout({ children }) {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 768);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    if (window.innerWidth < 768) setSidebarOpen(false);
  }, [location.pathname]);
  useEffect(() => {
    const onResize = () => {
      const mob = window.innerWidth < 768;
      setIsMobile(mob);
      setSidebarOpen(!mob);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const toggle = () => setSidebarOpen((p) => !p);
  const close = () => setSidebarOpen(false);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .erp-root {
          display: flex; height: 100vh; width: 100vw;
          font-family: 'Poppins', sans-serif;
          background: linear-gradient(135deg, #fdf4ff 0%, #f5f3ff 40%, #fce7f3 80%, #fff1f5 100%);
          overflow: hidden; position: relative;
        }

        /* Background blobs — soft pastel for glassmorphism depth */
        .bg-blob-1 {
          position: fixed; width: 700px; height: 700px;
          background: radial-gradient(circle, rgba(236,72,153,0.13) 0%, transparent 65%);
          top: -200px; left: -200px; border-radius: 50%;
          pointer-events: none; z-index: 0;
          filter: blur(40px);
        }
        .bg-blob-2 {
          position: fixed; width: 500px; height: 500px;
          background: radial-gradient(circle, rgba(168,85,247,0.11) 0%, transparent 65%);
          bottom: -100px; right: 80px; border-radius: 50%;
          pointer-events: none; z-index: 0;
          filter: blur(50px);
        }
        .bg-blob-3 {
          position: fixed; width: 400px; height: 400px;
          background: radial-gradient(circle, rgba(251,207,232,0.28) 0%, transparent 65%);
          top: 40%; left: 35%; border-radius: 50%;
          pointer-events: none; z-index: 0;
          filter: blur(35px);
        }
        .bg-blob-4 {
          position: fixed; width: 300px; height: 300px;
          background: radial-gradient(circle, rgba(99,102,241,0.07) 0%, transparent 65%);
          top: 10%; right: 20%; border-radius: 50%;
          pointer-events: none; z-index: 0;
          filter: blur(45px);
        }

        /* Overlay */
        .sb-overlay {
          position: fixed; inset: 0;
          background: rgba(236,72,153,0.06);
          backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px);
          z-index: 90; animation: fadeOv 0.2s ease;
        }
        @keyframes fadeOv { from { opacity: 0; } to { opacity: 1; } }

        /* Sidebar — glass */
        .sidebar {
          width: 262px; min-width: 262px; height: 100vh;
          background: rgba(255,255,255,0.58);
          backdrop-filter: blur(32px) saturate(180%);
          -webkit-backdrop-filter: blur(32px) saturate(180%);
          border-right: 1px solid rgba(255,255,255,0.5);
          display: flex; flex-direction: column;
          padding: 22px 15px; z-index: 100; position: relative;
          box-shadow: 4px 0 32px rgba(236,72,153,0.06),
                      inset 1px 0 0 rgba(255,255,255,0.7);
          transition: transform 0.32s cubic-bezier(0.4,0,0.2,1),
                      width 0.32s cubic-bezier(0.4,0,0.2,1),
                      min-width 0.32s cubic-bezier(0.4,0,0.2,1),
                      padding 0.32s cubic-bezier(0.4,0,0.2,1);
          flex-shrink: 0; overflow: hidden;
        }
        .sidebar::before {
          content: '';
          position: absolute; top: 0; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.9), transparent);
          pointer-events: none;
        }
        @media (min-width: 768px) {
          .sidebar-hidden { width: 0 !important; min-width: 0 !important; padding-left: 0 !important; padding-right: 0 !important; border-right: none !important; }
        }
        @media (max-width: 767px) {
          .sidebar { position: fixed; top: 0; left: 0; transform: translateX(0); }
          .sidebar-hidden { transform: translateX(-280px) !important; }
        }

        /* Sidebar top */
        .sb-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 28px; padding: 0 6px; gap: 8px; }
        .sb-logo { display: flex; align-items: center; gap: 10px; min-width: 0; overflow: hidden; }
        .sb-logo-icon {
          width: 44px; height: 44px;
          background: rgba(229,231,235,0.75);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255,255,255,0.65);
          border-radius: 14px;
          display: flex; align-items: center; justify-content: center;
          font-size: 22px; color: #4b5563;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05), inset 0 1px 0 rgba(255,255,255,0.8);
          flex-shrink: 0; transition: none;
        }
        .sb-logo h2 {
          font-size: 1.08rem; font-weight: 800;
          color: #6b7280;
          white-space: nowrap; overflow: hidden;
          text-overflow: ellipsis; line-height: 1.2;
        }
        .sb-logo-sub { font-size: 0.62rem; color: #a855f7; opacity: 0.6; font-weight: 500; letter-spacing: 0.03em; }

        .sb-close {
          display: none; width: 32px; height: 32px; border-radius: 10px;
          background: rgba(253,242,248,0.65);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(236,72,153,0.18); color: #ec4899;
          font-size: 0.9rem; align-items: center; justify-content: center;
          cursor: pointer; transition: all 0.2s ease; flex-shrink: 0;
          line-height: 1; padding: 0; outline: none;
        }
        .sb-close:hover { background: linear-gradient(135deg, #ec4899, #a855f7); color: white; border-color: transparent; box-shadow: 0 4px 14px rgba(236,72,153,0.3); transform: scale(1.08); }
        @media (max-width: 767px) { .sb-close { display: flex; } }

        /* Section labels */
        .sb-label {
          font-size: 0.6rem; font-weight: 700; letter-spacing: 0.14em;
          color: rgba(168,85,247,0.38); text-transform: uppercase;
          padding: 0 10px; margin: 14px 0 5px; white-space: nowrap;
        }

        /* Nav links */
        .nav-link {
          display: flex; align-items: center; gap: 10px;
          padding: 10px 12px; border-radius: 14px;
          text-decoration: none; color: rgba(107,33,168,0.5);
          font-size: 0.87rem; font-weight: 500;
          transition: all 0.22s ease; margin-bottom: 2px;
          position: relative; border: 1px solid transparent;
          white-space: nowrap;
        }
        .nav-link:hover {
          background: rgba(255,255,255,0.6);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          color: #6b7280;
          border-color: rgba(255,255,255,0.65);
          box-shadow: 0 2px 12px rgba(0,0,0,0.05),
                      inset 0 1px 0 rgba(255,255,255,0.85);
        }
        .nav-link.active {
          background: rgba(255,255,255,0.7);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          color: #4b5563;
          border-color: rgba(255,255,255,0.75);
          box-shadow: 0 4px 16px rgba(0,0,0,0.07),
                      inset 0 1px 0 rgba(255,255,255,0.9);
          font-weight: 600;
        }
        .nav-link.active::before {
          content: ''; position: absolute;
          left: 0; top: 22%; height: 56%; width: 3.5px;
          background: #9ca3af;
          border-radius: 0 4px 4px 0;
        }
        .nav-icon { font-size: 1.02rem; width: 22px; text-align: center; flex-shrink: 0; }

        /* Sidebar footer — glass */
        .sb-footer {
          margin-top: auto;
          padding: 14px 16px;
          background: rgba(255,255,255,0.42);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255,255,255,0.55);
          border-radius: 14px; text-align: center;
          font-size: 0.7rem; color: rgba(168,85,247,0.45);
          white-space: nowrap; font-weight: 500;
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.7);
        }

        /* Main */
        .main-area { flex: 1; display: flex; flex-direction: column; overflow: hidden; position: relative; z-index: 5; min-width: 0; }
        .page-content {
          flex: 1; overflow-y: auto; padding: 28px;
          scrollbar-width: thin; scrollbar-color: rgba(236,72,153,0.2) transparent;
        }
        .page-content::-webkit-scrollbar { width: 5px; }
        .page-content::-webkit-scrollbar-track { background: transparent; }
        .page-content::-webkit-scrollbar-thumb { background: rgba(236,72,153,0.15); border-radius: 10px; }
        @media (max-width: 480px) { .page-content { padding: 14px; } }
      `}</style>

      <div className="erp-root">
        <div className="bg-blob-1" />
        <div className="bg-blob-2" />
        <div className="bg-blob-3" />
        <div className="bg-blob-4" />

        {sidebarOpen && isMobile && (
          <div className="sb-overlay" onClick={close} />
        )}

        <div className={`sidebar ${!sidebarOpen ? "sidebar-hidden" : ""}`}>
          <div className="sb-top">
            <div className="sb-logo">
              <div className="sb-logo-icon">🎁</div>
              <div>
                <h2> Dashboard </h2>
                <div className="sb-logo-sub">ERP Panel</div>
              </div>
            </div>
            <button className="sb-close" onClick={close}>
              ✕
            </button>
          </div>

          <div className="sb-label">Main Menu</div>
          {navItems.slice(0, 5).map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`nav-link ${location.pathname === item.to ? "active" : ""}`}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.label}
            </Link>
          ))}

          <div className="sb-label">Quick Actions</div>
          {navItems.slice(5).map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`nav-link ${location.pathname === item.to ? "active" : ""}`}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.label}
            </Link>
          ))}

          <div className="sb-footer"> ERP v1.0 &nbsp;·&nbsp; 2025</div>
        </div>

        <div className="main-area">
          <Navbar onToggleSidebar={toggle} sidebarOpen={sidebarOpen} />
          <div className="page-content">{children}</div>
        </div>
      </div>
    </>
  );
}