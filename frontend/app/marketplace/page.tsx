"use client";

import { useAgents } from "../context/AgentContext";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface MarketplaceAgent {
  id: string;
  name: string;
  capability: string;
  description: string;
  category: 'Analysis' | 'Creative' | 'Technical' | 'Legal';
  icon: string;
  rating: number;
  downloads: string;
}

const MARKETPLACE_AGENTS: MarketplaceAgent[] = [
  {
    id: 'm1',
    name: 'Growth Architect',
    capability: 'Structured Data Extraction',
    description: 'Expert in scaling startups through data-driven marketing and funnel optimization.',
    category: 'Analysis',
    icon: '📈',
    rating: 4.9,
    downloads: '1.2k'
  },
  {
    id: 'm2',
    name: 'Cyber Auditor',
    capability: 'Document Processing',
    description: 'Specialized in identifying security vulnerabilities and compliance risks in technical docs.',
    category: 'Technical',
    icon: '🛡️',
    rating: 4.8,
    downloads: '850'
  },
  {
    id: 'm3',
    name: 'Narrative Weaver',
    capability: 'Document Processing',
    description: 'Master storyteller focused on brand identity and emotionally resonant content.',
    category: 'Creative',
    icon: '🎭',
    rating: 4.7,
    downloads: '2.1k'
  },
  {
    id: 'm4',
    name: 'Patent Scout',
    capability: 'Document Processing',
    description: 'Extracts critical IP details and prior art from complex patent filings.',
    category: 'Legal',
    icon: '📜',
    rating: 5.0,
    downloads: '420'
  },
  {
    id: 'm5',
    name: 'Code Refactorer',
    capability: 'Structured Data Extraction',
    description: 'Analyzes legacy codebases to suggest modern architectural patterns and optimizations.',
    category: 'Technical',
    icon: '💻',
    rating: 4.9,
    downloads: '3.4k'
  },
  {
    id: 'm6',
    name: 'Sentiment Oracle',
    capability: 'Structured Data Extraction',
    description: 'Real-time analysis of public discourse to predict market sentiment shifts.',
    category: 'Analysis',
    icon: '🔮',
    rating: 4.6,
    downloads: '1.5k'
  }
];

export default function Marketplace() {
  const { createAgent } = useAgents();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("All");
  const [addingId, setAddingId] = useState<string | null>(null);

  const filtered = MARKETPLACE_AGENTS.filter(a => {
    const matchesSearch = a.name.toLowerCase().includes(search.toLowerCase()) || 
                          a.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === "All" || a.category === category;
    return matchesSearch && matchesCategory;
  });

  const handleAddAgent = (template: MarketplaceAgent) => {
    setAddingId(template.id);
    setTimeout(() => {
      createAgent({
        name: template.name,
        capability: template.capability,
        description: template.description,
        speed: 'balanced',
        priority: 'medium',
        autoProcess: true
      });
      router.push('/dashboard');
    }, 800);
  };

  return (
    <div className="market-container fade-in">
      <div className="market-header slide-up">
        <h1 className="market-title">Agent <span className="gradient-text">Marketplace</span></h1>
        <p className="market-subtitle">Discover and deploy elite AI agents pre-tuned for high-performance tasks.</p>
        
        <div className="filter-bar glass-premium">
          <div className="search-wrapper">
            <span className="search-icon">🔍</span>
            <input 
              type="text" 
              placeholder="Search agents..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="market-search"
            />
          </div>
          <div className="category-pills">
            {['All', 'Analysis', 'Technical', 'Creative', 'Legal'].map(c => (
              <button 
                key={c} 
                className={`pill ${category === c ? 'active' : ''}`}
                onClick={() => setCategory(c)}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="market-grid">
        {filtered.map((agent, i) => (
          <div key={agent.id} className="market-card glass-premium slide-up" style={{ animationDelay: `${i * 0.05}s` }}>
            <div className="card-top">
              <span className="market-icon">{agent.icon}</span>
              <div className="rating-tag">⭐ {agent.rating}</div>
            </div>
            <h3 className="card-name">{agent.name}</h3>
            <span className="card-category">{agent.category}</span>
            <p className="card-desc">{agent.description}</p>
            
            <div className="card-footer">
              <div className="stats">
                <span className="stat">📥 {agent.downloads}</span>
              </div>
              <button 
                onClick={() => handleAddAgent(agent)}
                className={`btn-add ${addingId === agent.id ? 'adding' : ''}`}
                disabled={addingId !== null}
              >
                {addingId === agent.id ? (
                  <>
                    <span className="spinner"></span>
                    Initializing...
                  </>
                ) : (
                  <>
                    <span className="plus">+</span> Add to Library
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="empty-market glass-premium fade-in">
          <span className="empty-emoji">🤷‍♂️</span>
          <h3>No agents found</h3>
          <p>Try adjusting your search or filters to find what you're looking for.</p>
        </div>
      )}

      <style jsx>{`
        .market-container {
          padding: 3rem 2rem;
          max-width: 1400px;
          margin: 0 auto;
          min-height: 100vh;
        }

        .market-header {
          text-align: center;
          margin-bottom: 4rem;
        }

        .market-title {
          font-size: 3.5rem;
          font-weight: 900;
          letter-spacing: -2px;
          margin-bottom: 1rem;
        }

        .market-subtitle {
          color: #94a3b8;
          font-size: 1.1rem;
          max-width: 600px;
          margin: 0 auto 3rem;
        }

        /* Filter Bar */
        .filter-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 2rem;
          border-radius: 24px;
          gap: 2rem;
          max-width: 1000px;
          margin: 0 auto;
        }

        .search-wrapper {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          background: rgba(255, 255, 255, 0.05);
          padding: 0.75rem 1.25rem;
          border-radius: 16px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          transition: all 0.3s ease;
        }

        .search-wrapper:focus-within {
          border-color: #6366f1;
          background: rgba(255, 255, 255, 0.08);
          box-shadow: 0 0 20px rgba(99, 102, 241, 0.2);
        }

        .market-search {
          background: transparent;
          border: none;
          color: white;
          width: 100%;
          outline: none;
          font-size: 0.95rem;
        }

        .category-pills {
          display: flex;
          gap: 0.5rem;
        }

        .pill {
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #94a3b8;
          padding: 0.6rem 1.2rem;
          border-radius: 12px;
          cursor: pointer;
          font-weight: 600;
          font-size: 0.85rem;
          transition: all 0.3s ease;
        }

        .pill:hover {
          color: white;
          background: rgba(255, 255, 255, 0.05);
        }

        .pill.active {
          color: white;
          background: #6366f1;
          border-color: #6366f1;
          box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3);
        }

        /* Grid */
        .market-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 2rem;
        }

        .market-card {
          padding: 2rem;
          border-radius: 28px;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          display: flex;
          flex-direction: column;
          position: relative;
          overflow: hidden;
        }

        .market-card:hover {
          transform: translateY(-10px) scale(1.02);
          border-color: rgba(99, 102, 241, 0.4);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
        }

        .card-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1.5rem;
        }

        .market-icon {
          font-size: 3rem;
          filter: drop-shadow(0 0 15px rgba(99, 102, 241, 0.4));
        }

        .rating-tag {
          background: rgba(250, 204, 21, 0.1);
          color: #facc15;
          padding: 0.3rem 0.75rem;
          border-radius: 10px;
          font-size: 0.8rem;
          font-weight: 800;
          border: 1px solid rgba(250, 204, 21, 0.2);
        }

        .card-name {
          font-size: 1.4rem;
          font-weight: 800;
          margin-bottom: 0.25rem;
          color: white;
        }

        .card-category {
          font-size: 0.75rem;
          text-transform: uppercase;
          color: #6366f1;
          font-weight: 800;
          letter-spacing: 1px;
          margin-bottom: 1rem;
          display: block;
        }

        .card-desc {
          color: #94a3b8;
          font-size: 0.95rem;
          line-height: 1.6;
          margin-bottom: 2rem;
          flex: 1;
        }

        .card-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 1.5rem;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
        }

        .stats {
          font-size: 0.85rem;
          color: #64748b;
          font-weight: 600;
        }

        .btn-add {
          background: rgba(99, 102, 241, 0.1);
          color: #818cf8;
          border: 1px solid rgba(99, 102, 241, 0.3);
          padding: 0.75rem 1.5rem;
          border-radius: 14px;
          font-weight: 700;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .btn-add:hover {
          background: #6366f1;
          color: white;
          border-color: #6366f1;
          box-shadow: 0 0 20px rgba(99, 102, 241, 0.4);
        }

        .btn-add:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .plus { font-size: 1.2rem; }

        .spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .empty-market {
          text-align: center;
          padding: 5rem;
          border-radius: 32px;
          max-width: 500px;
          margin: 4rem auto;
        }

        .empty-emoji { font-size: 3rem; margin-bottom: 1rem; display: block; }
        .empty-market h3 { font-size: 1.5rem; margin-bottom: 0.5rem; }
        .empty-market p { color: #64748b; }

        @media (max-width: 1024px) {
          .filter-bar { flex-direction: column; gap: 1rem; padding: 1.5rem; }
          .search-wrapper { width: 100%; }
          .category-pills { width: 100%; overflow-x: auto; padding-bottom: 0.5rem; }
        }

        @media (max-width: 768px) {
          .market-title { font-size: 2.5rem; }
          .market-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
