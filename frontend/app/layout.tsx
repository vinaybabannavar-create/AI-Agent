"use client";

import "./globals.css";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Link from "next/link";

function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="main-header glass fade-in">
      <Link href="/" className="logo-link">
        <span className="logo-text gradient-text">AI Agent Builder</span>
      </Link>
      <nav className="header-nav">
        {user ? (
          <div className="user-menu">
            <span className="user-welcome">Welcome, <strong>{user.name}</strong></span>
            <button onClick={logout} className="btn-logout">Logout</button>
          </div>
        ) : (
          <div className="auth-links">
            <Link href="/auth/login" className="btn-secondary btn-small">Sign In</Link>
            <Link href="/auth/signup" className="btn-premium btn-small">Sign Up</Link>
          </div>
        )}
      </nav>

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
          border-top: none;
        }
        .logo-text {
          font-family: 'Outfit', sans-serif;
          font-size: 1.5rem;
          font-weight: 800;
        }
        .logo-link {
          text-decoration: none;
        }
        .header-nav {
          display: flex;
          align-items: center;
          gap: 2rem;
        }
        .user-menu {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }
        .user-welcome {
          font-size: 0.9rem;
          color: var(--text-secondary);
        }
        .btn-logout {
          background: rgba(255, 68, 68, 0.1);
          color: #ff4444;
          border: 1px solid rgba(255, 68, 68, 0.2);
          padding: 0.5rem 1rem;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .btn-logout:hover {
          background: #ff4444;
          color: white;
        }
        .nav-link {
          color: var(--text-primary);
          text-decoration: none;
          font-weight: 500;
          transition: color 0.3s ease;
        }
        .nav-link:hover {
          color: var(--accent-secondary);
        }
        .auth-links {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .header-nav :global(.btn-small) {
          padding: 0 1.2rem;
          height: 40px !important;
          min-height: 40px !important;
          font-size: 0.9rem;
        }
        @media (max-width: 768px) {
          .main-header { padding: 0 1.5rem; }
          .user-welcome { display: none; }
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
          <div className="bg-mesh"></div>
          <Header />
          <main style={{ paddingTop: '70px' }}>
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
