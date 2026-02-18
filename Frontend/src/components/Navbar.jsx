import { useNavigate } from "react-router-dom";

function Navbar({ onToggleSidebar, sidebarOpen }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap');

        @keyframes pulse-green {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }

        .navbar-root {
          width: 100%;
          background: rgba(255,255,255,0.05);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255,255,255,0.1);
          box-shadow: 0 4px 30px rgba(0,0,0,0.3);
          padding: 0 20px;
          height: 64px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          box-sizing: border-box;
          position: relative;
          z-index: 50;
          flex-shrink: 0;
        }

        .navbar-left {
          display: flex;
          align-items: center;
          gap: 12px;
          min-width: 0;
        }

        /* ── Hamburger Button ── */
        .hamburger-btn {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
          flex-shrink: 0;
          padding: 0;
          outline: none;
        }
        .hamburger-btn:hover {
          background: rgba(99,102,241,0.18);
          border-color: rgba(99,102,241,0.4);
          box-shadow: 0 0 14px rgba(99,102,241,0.25);
        }
        .hamburger-btn:active { transform: scale(0.92); }

        .ham-lines {
          display: flex;
          flex-direction: column;
          gap: 5px;
          width: 18px;
        }
        .ham-line {
          height: 2px;
          border-radius: 2px;
          background: #a5b4fc;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          transform-origin: center;
        }
        /* X state when sidebar open */
        .ham-open .ham-line:nth-child(1) {
          transform: translateY(7px) rotate(45deg);
        }
        .ham-open .ham-line:nth-child(2) {
          opacity: 0;
          transform: scaleX(0);
        }
        .ham-open .ham-line:nth-child(3) {
          transform: translateY(-7px) rotate(-45deg);
        }

        /* Logo */
        .navbar-logo-icon {
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          border-radius: 10px;
          padding: 6px 10px;
          box-shadow: 0 0 16px rgba(99,102,241,0.5);
          font-size: 16px;
          flex-shrink: 0;
          line-height: 1;
        }
        .navbar-title {
          background: linear-gradient(135deg, #e2e8f0, #a5b4fc);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          font-family: 'Outfit', sans-serif;
          font-weight: 700;
          font-size: 1.05rem;
          letter-spacing: 0.02em;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          margin: 0;
        }
        @media (max-width: 500px) { .navbar-title { display: none; } }

        /* Right */
        .navbar-right {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-shrink: 0;
        }

        .admin-badge {
          background: rgba(99,102,241,0.15);
          border: 1px solid rgba(99,102,241,0.3);
          border-radius: 999px;
          padding: 5px 14px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .admin-dot {
          width: 8px; height: 8px;
          border-radius: 50%;
          background: #4ade80;
          box-shadow: 0 0 8px #4ade80;
          animation: pulse-green 2s infinite;
          flex-shrink: 0;
        }
        .admin-label {
          color: #c7d2fe;
          font-size: 0.85rem;
          font-family: 'Outfit', sans-serif;
          font-weight: 500;
        }
        @media (max-width: 420px) {
          .admin-badge { padding: 6px 8px; }
          .admin-label { display: none; }
        }

        .logout-btn {
          background: rgba(239,68,68,0.15);
          border: 1px solid rgba(239,68,68,0.35);
          color: #fca5a5;
          padding: 7px 16px;
          border-radius: 8px;
          font-size: 0.85rem;
          font-family: 'Outfit', sans-serif;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 6px;
          outline: none;
          white-space: nowrap;
        }
        .logout-btn:hover {
          background: rgba(239,68,68,0.3);
          box-shadow: 0 0 16px rgba(239,68,68,0.3);
        }
        @media (max-width: 500px) {
          .logout-text { display: none; }
          .logout-btn { padding: 7px 10px; }
        }
      `}</style>

      <div className="navbar-root">
        {/* Left */}
        <div className="navbar-left">
          {/* ☰ Hamburger Toggle */}
          <button
            className="hamburger-btn"
            onClick={onToggleSidebar}
            title={sidebarOpen ? "Hide sidebar" : "Show sidebar"}
          >
            <div className={`ham-lines ${sidebarOpen ? "ham-open" : ""}`}>
              <div className="ham-line" />
              <div className="ham-line" />
              <div className="ham-line" />
            </div>
          </button>

         
          <h1 className="navbar-title">Sales &amp; Inventory System</h1>
        </div>

        {/* Right */}
        <div className="navbar-right">
          <div className="admin-badge">
            <div className="admin-dot" />
            <span className="admin-label">Admin</span>
          </div>

          <button className="logout-btn" onClick={handleLogout}>
            <span>🔴</span>
            <span className="logout-text">Logout</span>
          </button>
        </div>
      </div>
    </>
  );
}

export default Navbar;