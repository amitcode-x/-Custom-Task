import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import Navbar from "./Navbar";

const navItems = [
  { to: "/",              label: "Dashboard",     icon: "📊" },
  { to: "/products",      label: "Products",      icon: "📦" },
  { to: "/orders",        label: "Orders",        icon: "🛒" },
  { to: "/dealers",       label: "Dealers",       icon: "🤝" },
  { to: "/inventory",     label: "Inventory",     icon: "🏭" },
  { to: "/add-product",   label: "Add Product",   icon: "➕" },
  { to: "/add-dealer",    label: "Add Dealer",    icon: "👤" },
  { to: "/add-inventory", label: "Add Inventory", icon: "📋" },
];

function Layout({ children }) {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 768);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    if (window.innerWidth < 768) setSidebarOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) setSidebarOpen(true);
      else setSidebarOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => setSidebarOpen(prev => !prev);
  const closeSidebar  = () => setSidebarOpen(false);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .erp-root {
          display: flex;
          height: 100vh;
          width: 100vw;
          font-family: 'Outfit', sans-serif;
          background: linear-gradient(135deg, #0f0c29 0%, #1a1040 40%, #0d1b3e 100%);
          overflow: hidden;
          position: relative;
        }

        .erp-blob-1 {
          position: fixed;
          width: 500px; height: 500px;
          background: radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%);
          top: -120px; left: -120px;
          border-radius: 50%;
          pointer-events: none;
          z-index: 0;
        }
        .erp-blob-2 {
          position: fixed;
          width: 400px; height: 400px;
          background: radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%);
          bottom: -80px; right: 160px;
          border-radius: 50%;
          pointer-events: none;
          z-index: 0;
        }

        /* ── OVERLAY ── */
        .sidebar-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.55);
          backdrop-filter: blur(3px);
          -webkit-backdrop-filter: blur(3px);
          z-index: 90;
          animation: fadeInOverlay 0.2s ease;
        }
        @keyframes fadeInOverlay { from { opacity: 0; } to { opacity: 1; } }

        /* ── SIDEBAR ── */
        .sidebar {
          width: 240px;
          min-width: 240px;
          height: 100vh;
          background: rgba(255,255,255,0.04);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border-right: 1px solid rgba(255,255,255,0.08);
          display: flex;
          flex-direction: column;
          padding: 24px 16px;
          z-index: 100;
          position: relative;
          box-shadow: 4px 0 40px rgba(0,0,0,0.3);
          transition: transform 0.3s cubic-bezier(0.4,0,0.2,1),
                      width 0.3s cubic-bezier(0.4,0,0.2,1),
                      min-width 0.3s cubic-bezier(0.4,0,0.2,1),
                      padding 0.3s cubic-bezier(0.4,0,0.2,1);
          flex-shrink: 0;
          overflow: hidden;
        }

        /* Desktop collapse */
        @media (min-width: 768px) {
          .sidebar-hidden {
            width: 0 !important;
            min-width: 0 !important;
            padding-left: 0 !important;
            padding-right: 0 !important;
            border-right: none !important;
          }
        }

        /* Mobile — fixed drawer */
        @media (max-width: 767px) {
          .sidebar {
            position: fixed;
            top: 0; left: 0;
            transform: translateX(0);
          }
          .sidebar-hidden {
            transform: translateX(-260px) !important;
          }
        }

        /* ── Sidebar Header row (logo + close btn) ── */
        .sidebar-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 32px;
          padding: 0 8px 0 8px;
          gap: 8px;
        }
        .sidebar-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          min-width: 0;
          overflow: hidden;
        }
        .sidebar-logo-icon {
          width: 36px; height: 36px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          font-size: 18px;
          box-shadow: 0 0 20px rgba(99,102,241,0.5);
          flex-shrink: 0;
        }
        .sidebar-logo h2 {
          font-size: 1.05rem;
          font-weight: 700;
          background: linear-gradient(135deg, #e2e8f0, #a5b4fc);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          letter-spacing: 0.02em;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        /* ✕ Close button — only visible on mobile */
        .sidebar-close-btn {
          display: none;
          width: 32px; height: 32px;
          border-radius: 8px;
          background: rgba(239,68,68,0.12);
          border: 1px solid rgba(239,68,68,0.25);
          color: #fca5a5;
          font-size: 1rem;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
          flex-shrink: 0;
          line-height: 1;
          padding: 0;
          outline: none;
        }
        .sidebar-close-btn:hover {
          background: rgba(239,68,68,0.28);
          box-shadow: 0 0 12px rgba(239,68,68,0.25);
          transform: scale(1.08);
        }
        .sidebar-close-btn:active { transform: scale(0.94); }

        @media (max-width: 767px) {
          .sidebar-close-btn { display: flex; }
        }

        /* Nav */
        .sidebar-section-label {
          font-size: 0.65rem;
          font-weight: 600;
          letter-spacing: 0.12em;
          color: rgba(165,180,252,0.4);
          text-transform: uppercase;
          padding: 0 12px;
          margin: 16px 0 8px;
          white-space: nowrap;
        }
        .nav-link {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 12px;
          border-radius: 10px;
          text-decoration: none;
          color: rgba(203,213,225,0.7);
          font-size: 0.88rem;
          font-weight: 500;
          transition: all 0.2s ease;
          margin-bottom: 2px;
          position: relative;
          border: 1px solid transparent;
          white-space: nowrap;
        }
        .nav-link:hover {
          background: rgba(99,102,241,0.12);
          color: #c7d2fe;
          border-color: rgba(99,102,241,0.2);
        }
        .nav-link.active {
          background: rgba(99,102,241,0.2);
          color: #a5b4fc;
          border-color: rgba(99,102,241,0.35);
          box-shadow: 0 0 16px rgba(99,102,241,0.15);
        }
        .nav-link.active::before {
          content: '';
          position: absolute;
          left: 0; top: 25%;
          height: 50%; width: 3px;
          background: linear-gradient(to bottom, #6366f1, #8b5cf6);
          border-radius: 0 4px 4px 0;
        }
        .nav-icon {
          font-size: 1rem;
          width: 22px;
          text-align: center;
          flex-shrink: 0;
        }

        .sidebar-footer {
          margin-top: auto;
          padding: 12px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 10px;
          text-align: center;
          font-size: 0.72rem;
          color: rgba(148,163,184,0.5);
          white-space: nowrap;
        }

        /* ── MAIN ── */
        .main-area {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          position: relative;
          z-index: 5;
          min-width: 0;
        }
        .page-content {
          flex: 1;
          overflow-y: auto;
          padding: 28px;
          scrollbar-width: thin;
          scrollbar-color: rgba(99,102,241,0.3) transparent;
        }
        .page-content::-webkit-scrollbar { width: 5px; }
        .page-content::-webkit-scrollbar-track { background: transparent; }
        .page-content::-webkit-scrollbar-thumb {
          background: rgba(99,102,241,0.3);
          border-radius: 10px;
        }
        @media (max-width: 480px) {
          .page-content { padding: 16px; }
        }
      `}</style>

      <div className="erp-root">
        <div className="erp-blob-1" />
        <div className="erp-blob-2" />

        {/* Mobile backdrop */}
        {sidebarOpen && isMobile && (
          <div className="sidebar-overlay" onClick={closeSidebar} />
        )}

        {/* ── Sidebar ── */}
        <div className={`sidebar ${!sidebarOpen ? "sidebar-hidden" : ""}`}>

          {/* Top row: logo + ✕ close button */}
          <div className="sidebar-top">
            <div className="sidebar-logo">
              <div className="sidebar-logo-icon">⚡</div>
              <h2>ERP Panel</h2>
            </div>

            {/* ✕ only on mobile */}
            <button
              className="sidebar-close-btn"
              onClick={closeSidebar}
              title="Close sidebar"
            >
              ✕
            </button>
          </div>

          <div className="sidebar-section-label">Main Menu</div>
          {navItems.slice(0, 5).map(item => (
            <Link
              key={item.to}
              to={item.to}
              className={`nav-link ${location.pathname === item.to ? "active" : ""}`}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.label}
            </Link>
          ))}

          <div className="sidebar-section-label">Actions</div>
          {navItems.slice(5).map(item => (
            <Link
              key={item.to}
              to={item.to}
              className={`nav-link ${location.pathname === item.to ? "active" : ""}`}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.label}
            </Link>
          ))}

          <div className="sidebar-footer">ERP v1.0 &nbsp;•&nbsp; 2025</div>
        </div>

        {/* ── Main Content ── */}
        <div className="main-area">
          <Navbar onToggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />
          <div className="page-content">{children}</div>
        </div>
      </div>
    </>
  );
}

export default Layout;