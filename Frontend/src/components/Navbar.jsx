import { useNavigate } from "react-router-dom";

export default function Navbar({ onToggleSidebar, sidebarOpen }) {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');
        @keyframes pulse-green {
  0%, 100% { box-shadow: 0 0 0 0 rgba(34,197,94,0.5); }
  50% { box-shadow: 0 0 0 6px rgba(34,197,94,0); }
}

        .nb-root {
          font-family: 'Poppins', sans-serif;
          width: 100%; height: 66px;
          background: rgba(255,255,255,0.75);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1.5px solid rgba(236,72,153,0.12);
          box-shadow: 0 4px 24px rgba(236,72,153,0.07), 0 2px 8px rgba(168,85,247,0.05);
          padding: 0 24px;
          display: flex; align-items: center; justify-content: space-between;
          gap: 12px; box-sizing: border-box;
          position: relative; z-index: 50; flex-shrink: 0;
        }
        .nb-left { display: flex; align-items: center; gap: 14px; min-width: 0; }

        /* Hamburger */
        .ham-btn {
          width: 42px; height: 42px; border-radius: 14px;
          background: linear-gradient(135deg, rgba(253,242,248,0.9), rgba(250,245,255,0.9));
          border: 1.5px solid rgba(236,72,153,0.2);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: all 0.25s ease;
          flex-shrink: 0; padding: 0; outline: none;
          box-shadow: 0 2px 10px rgba(236,72,153,0.08);
        }
        .ham-btn:hover {
          background: #e5e7eb;  
          border-color: transparent;
          box-shadow: 0 4px 20px rgba(236,72,153,0.4);
          transform: scale(1.06);
        }
        .ham-btn:hover .ham-line { background: gray; }
        .ham-btn:active { transform: scale(0.94); }
        .ham-lines { display: flex; flex-direction: column; gap: 5px; width: 18px; }
        .ham-line {
          height: 2px; border-radius: 2px;
          background: linear-gradient(90deg, #ec4899, #a855f7);
          transition: all 0.3s cubic-bezier(0.4,0,0.2,1);
          transform-origin: center;
        }
        .ham-open .ham-line:nth-child(1) { transform: translateY(7px) rotate(45deg); }
        .ham-open .ham-line:nth-child(2) { opacity: 0; transform: scaleX(0); }
        .ham-open .ham-line:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

        /* Logo */
        .nb-logo-icon {
          width: 42px; height: 42px;
          background: linear-gradient(135deg, #ec4899, #a855f7);
          border-radius: 14px;
          display: flex; align-items: center; justify-content: center;
          font-size: 20px;
          box-shadow: 0 4px 18px rgba(236,72,153,0.38);
          flex-shrink: 0;
        }
        .nb-title {
  color: #6b7280; /* simple gray */
  font-weight: 800;
  font-size: 1.15rem;
  letter-spacing: -0.01em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 0;
  line-height: 1.2;
}

        .nb-tagline { font-size: 0.62rem; color: #a855f7; font-weight: 500; opacity: 0.65; letter-spacing: 0.03em; }
        @media (max-width: 500px) { .nb-title-wrap { display: none; } }

        /* Right */
        .nb-right { display: flex; align-items: center; gap: 10px; flex-shrink: 0; }

        

        .admin-badge {
          background: linear-gradient(135deg, rgba(253,242,248,0.9), rgba(250,245,255,0.9));
          border: 1.5px solid rgba(236,72,153,0.18);
          border-radius: 999px; padding: 7px 16px;
          display: flex; align-items: center; gap: 8px;
          box-shadow: 0 2px 10px rgba(236,72,153,0.07);
        }
        .admin-dot {
          width: 8px; height: 8px; border-radius: 50%;
          background: green; flex-shrink: 0;
          animation: pulse-green 2s infinite;
        }
        .admin-label {
  color: #6b7280;   /* simple gray */
  font-size: 0.82rem;
  font-weight: 600;
}

        @media (max-width: 420px) { .admin-badge { padding: 7px 10px; } .admin-label { display: none; } }

        .logout-btn {
          background: linear-gradient(135deg, rgba(253,242,248,0.9), rgba(250,245,255,0.9));
          border: 1.5px solid rgba(236,72,153,0.2);
          color: #ec4899; padding: 8px 18px;
          border-radius: 999px; font-size: 0.82rem;
          font-family: 'Poppins', sans-serif; font-weight: 600;
          cursor: pointer; transition: all 0.25s ease;
          display: flex; align-items: center; gap: 7px;
          outline: none; white-space: nowrap;
          box-shadow: 0 2px 10px rgba(236,72,153,0.08);
        }
       .logout-btn:hover {
  background: #f3f4f6;   /* light gray */
  color: #374151;       /* dark gray text */
  border-color: #e5e7eb;
  box-shadow: none;
  transform: none;
}

        @media (max-width: 500px) { .logout-text { display: none; } .logout-btn { padding: 8px 12px; border-radius: 14px; } }
      `}</style>

      <div className="nb-root">
        <div className="nb-left">
          <button className="ham-btn" onClick={onToggleSidebar}>
            <div className={`ham-lines ${sidebarOpen ? "ham-open" : ""}`}>
              <div className="ham-line" />
              <div className="ham-line" />
              <div className="ham-line" />
            </div>
          </button>

          <div className="nb-title-wrap">
            <h1 className="nb-title">ERP Dashboard</h1>
            <div className="nb-tagline">Sales & Inventory</div>
          </div>
        </div>
        <div className="nb-right">
          <div className="admin-badge">
            <div className="admin-dot" />
            <span className="admin-label">Admin</span>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            <span>👋</span>
            <span className="logout-text">Logout</span>
          </button>
        </div>
      </div>
    </>
  );
}
