"use client";

import "./globals.css";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { AgentProvider } from "./context/AgentContext";
import Link from "next/link";
import { usePathname } from "next/navigation";

function Header() {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const isActive = (path: string) => pathname?.startsWith(path);

  return (
    <header className="main-header glass-premium fade-in">
      <Link href="/" className="logo-link group">
        <div className="logo-container">
          <div className="logo-icon-wrapper">
            <div className="logo-icon-core"></div>
            <div className="logo-icon-glow"></div>
          </div>
          <span className="logo-text-premium">AI Agent Builder</span>
        </div>
      </Link>
      
      <div className="header-right-group">
        {user ? (
          <>
            <nav className="nav-glass-container">
              <Link href="/dashboard" className={`nav-link-premium ${isActive('/dashboard') ? 'active' : ''}`}>
                <span className="icon">📊</span>
                <span className="text">Dashboard</span>
              </Link>
              <Link href="/chat/new" className={`nav-link-premium ${isActive('/chat') ? 'active' : ''}`}>
                <span className="icon">🛠️</span>
                <span className="text">Builder</span>
              </Link>
              <Link href="/marketplace" className={`nav-link-premium ${isActive('/marketplace') ? 'active' : ''}`}>
                <span className="icon">🛍️</span>
                <span className="text">Marketplace</span>
              </Link>
            </nav>

            <div className="user-profile-compact glass">
              <div className="avatar-mini">
                <div className="avatar-inner">{user.name.charAt(0).toUpperCase()}</div>
                <div className="status-dot-online"></div>
              </div>
              <div className="user-text-single">
                <span className="greet">Welcome,</span>
                <span className="uname">{user.name}</span>
              </div>
              <button onClick={logout} className="logout-icon-btn" title="Logout">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                  <polyline points="16 17 21 12 16 7"></polyline>
                  <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>
              </button>
            </div>
          </>
        ) : (
          <div className="auth-actions">
            <Link href="/auth/login" className="btn-secondary-glass">Sign In</Link>
            <Link href="/auth/signup" className="btn-premium-glow">Get Started</Link>
          </div>
        )}
      </div>

      <style jsx>{`
        .main-header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 70px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 4rem;
          z-index: 1000;
          border-radius: 0 0 24px 24px;
          background: rgba(10, 10, 12, 0.7);
          backdrop-filter: blur(20px) saturate(180%);
          -webkit-backdrop-filter: blur(20px) saturate(180%);
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4);
        }

        .header-right-group {
          display: flex;
          align-items: center;
          gap: 2rem;
        }

        /* Logo Design */
        .logo-container {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .logo-icon-wrapper {
          position: relative;
          width: 28px;
          height: 28px;
        }
        .logo-icon-core {
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #6366f1, #a855f7);
          border-radius: 8px;
          transform: rotate(45deg);
        }
        .logo-icon-glow {
          position: absolute;
          top: 0; left: 0; width: 100%; height: 100%;
          background: #6366f1;
          filter: blur(12px);
          opacity: 0.4;
          animation: pulse 2s infinite ease-in-out;
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.4; }
          50% { transform: scale(1.2); opacity: 0.6; }
        }
        .logo-text-premium {
          font-family: 'Outfit', sans-serif;
          font-size: 1.5rem;
          font-weight: 850;
          background: linear-gradient(to right, #fff, #94a3b8, #6366f1);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          letter-spacing: -0.04em;
        }

        /* Nav Container */
        .nav-glass-container {
          display: flex;
          align-items: center;
          background: rgba(255, 255, 255, 0.03);
          padding: 0.4rem;
          border-radius: 14px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          gap: 0.6rem;
        }
        .nav-link-premium {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          padding: 0.6rem 1.25rem;
          border-radius: 10px;
          color: #94a3b8;
          text-decoration: none;
          font-weight: 600;
          font-size: 0.85rem;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .nav-link-premium:hover {
          color: white;
          background: rgba(255, 255, 255, 0.06);
          transform: translateY(-1px);
        }
        .nav-link-premium.active {
          color: white;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          box-shadow: 0 4px 15px rgba(99, 102, 241, 0.4);
        }

        /* User Profile Compact */
        .user-profile-compact {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.4rem 0.4rem 0.4rem 0.8rem;
          border-radius: 14px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
          transition: all 0.3s ease;
        }
        .user-profile-compact:hover {
          background: rgba(255, 255, 255, 0.06);
          border-color: rgba(255, 255, 255, 0.15);
        }
        .avatar-mini {
          position: relative;
          width: 30px;
          height: 30px;
        }
        .avatar-inner {
          width: 100%; height: 100%;
          border-radius: 50%;
          background: linear-gradient(135deg, #6366f1, #a855f7);
          display: flex; align-items: center; justify-content: center;
          color: white; font-weight: 800; font-size: 0.9rem;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .status-dot-online {
          position: absolute; bottom: -1px; right: -1px;
          width: 10px; height: 10px;
          background: #4ade80;
          border: 2px solid #0a0a0c;
          border-radius: 50%;
          box-shadow: 0 0 8px rgba(74, 222, 128, 0.4);
        }
        .user-text-single {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.85rem;
        }
        .greet { color: #94a3b8; }
        .uname { font-weight: 700; color: white; }
        
        .logout-icon-btn {
          background: transparent; border: none;
          color: #f87171;
          padding: 0.5rem;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex; align-items: center;
        }
        .logout-icon-btn:hover {
          background: rgba(248, 113, 113, 0.1);
          color: #ef4444;
          transform: scale(1.1);
        }

        /* Auth */
        .auth-actions { display: flex; align-items: center; gap: 1.25rem; }
        .btn-premium-glow {
          padding: 0.6rem 1.6rem;
          border-radius: 12px;
          background: linear-gradient(135deg, #6366f1, #a855f7);
          color: white; text-decoration: none; font-weight: 700;
          font-size: 0.85rem;
          box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3);
          transition: all 0.3s ease;
        }
        .btn-premium-glow:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(99, 102, 241, 0.5);
        }

        @media (max-width: 1024px) {
          .main-header { padding: 0 2rem; }
          .greet { display: none; }
        }
        @media (max-width: 850px) {
          .nav-glass-container .text { display: none; }
          .nav-glass-container { gap: 0.2rem; }
        }
        @media (max-width: 600px) {
          .nav-glass-container { display: none; }
          .header-right-group { gap: 1rem; }
          .main-header { padding: 0 1rem; }
          .logo-text-premium { font-size: 1.2rem; }
          .user-profile-compact { padding: 0.3rem 0.3rem 0.3rem 0.6rem; }
        }
        @media (max-width: 480px) {
          .logo-text-premium { display: none; }
          .logo-container { gap: 0; }
          .user-text-single .uname { max-width: 80px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
          .auth-actions { gap: 0.5rem; }
          .btn-premium-glow { padding: 0.5rem 1rem; font-size: 0.8rem; }
          .btn-secondary-glass { padding: 0.5rem 1rem; font-size: 0.8rem; }
        }
      `}</style>
    </header>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <AgentProvider>
            <div className="bg-mesh"></div>
            <Header />
            <main style={{ paddingTop: '70px' }}>
              {children}
            </main>
          </AgentProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
