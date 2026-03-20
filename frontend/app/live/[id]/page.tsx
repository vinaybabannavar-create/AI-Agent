"use client";

import React, { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAgents, Agent, ChatMessage } from '../../context/AgentContext';

// ─── Helpers ─────────────────────────────────────────────────────────
const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36);

export default function PublicAgentPage() {
  const params = useParams();
  const router = useRouter();
  const { getAgent } = useAgents();
  const [agent, setAgent] = useState<Agent | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  
  // Public Chat State
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copyStatus, setCopyStatus] = useState('Copy Link');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (params.id) {
      const found = getAgent(params.id as string);
      setAgent(found);
      setLoading(false);
    }
  }, [params.id, getAgent]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopyStatus('Copied! ✅');
    setTimeout(() => setCopyStatus('Copy Link'), 2000);
  };

  const handleSend = async () => {
    const text = input.trim();
    if (!text || !agent) return;
    
    const userMsg: ChatMessage = {
      id: uid(),
      agentId: agent.id,
      role: 'user',
      content: text,
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const res = await fetch(`${apiUrl}/chat/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agent: {
            name: agent.name,
            capability: agent.capability,
            description: agent.description,
            speed: agent.speed || 'balanced',
            priority: agent.priority || 'medium',
          },
          message: text,
          history: messages,
        }),
      });

      if (!res.ok) throw new Error('API Error');
      const data = await res.json();
      
      const agentMsg: ChatMessage = {
        id: uid(),
        agentId: agent.id,
        role: 'agent',
        content: data.content,
        timestamp: Date.now(),
      };
      
      setMessages(prev => [...prev, agentMsg]);
    } catch (e) {
      console.error(e);
    } finally {
      setIsTyping(false);
    }
  };

  if (loading) return (
    <div className="public-loading">
      <div className="spinner"></div>
      <p>Initializing Secure Interface...</p>
    </div>
  );

  if (!agent) return (
    <div className="public-error">
      <h1>404</h1>
      <p>Agent not found or has been taken offline.</p>
      <Link href="/" className="btn-premium">Return Home</Link>
    </div>
  );

  return (
    <div className="public-view-container fade-in">
      <div className="bg-mesh"></div>
      
      <header className="public-header">
        <Link href="/dashboard" className="brand">
          <span className="brand-icon">🌐</span>
          <span className="brand-name">AI Agent <span className="gradient-text">Public Portal</span></span>
        </Link>
        <div className="header-actions">
           <div className="share-widget glass">
            <span className="url-preview">{typeof window !== 'undefined' ? window.location.hostname + '...' : ''}</span>
            <button className="btn-copy" onClick={handleCopyLink}>{copyStatus}</button>
          </div>
          <div className="live-pill">
            <span className="live-dot"></span>
            LIVE & SECURE
          </div>
        </div>
      </header>

      <main className="public-main">
        <div className="left-panel">
          <section className="profile-section">
            <div className="public-profile-card glass">
              <div className="profile-hero">
                <div className="agent-avatar-large">🤖</div>
                <div className="hero-text">
                  <h1 className="agent-name">{agent.name}</h1>
                  <p className="agent-role">{agent.capability}</p>
                </div>
              </div>
              
              <div className="profile-stats">
                <div className="p-stat">
                  <span className="p-label">Uptime</span>
                  <span className="p-value">99.9%</span>
                </div>
                <div className="p-stat">
                  <span className="p-label">Tasks Finished</span>
                  <span className="p-value">{agent.tasksCompleted}</span>
                </div>
                <div className="p-stat">
                  <span className="p-label">Success Rate</span>
                  <span className="p-value">{agent.successRate.toFixed(1)}%</span>
                </div>
              </div>

              <div className="profile-description">
                <h3>Objective</h3>
                <p>{agent.description || "Specializing in document processing and strategic data extraction with high-precision neural models."}</p>
              </div>
            </div>
          </section>

          <section className="live-feed-section">
            <div className="section-title-group">
              <h2 className="public-section-title">Verified <span className="gradient-text">Logs</span></h2>
              <p className="subtitle">Real-time achievements</p>
            </div>
            <div className="live-activity-list-small glass">
              {agent.activityLog.slice(0, 5).map((log) => (
                <div key={log.id} className="mini-log">
                  <span className="m-time">{new Date(log.timestamp).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</span>
                  <p className="m-msg">{log.message}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        <section className="chat-section">
          <div className="public-chat-card glass-premium">
            <div className="chat-header-mini">
              <h3>Secure Neural Link</h3>
              <span className="encryption-badge">End-to-End Encrypted</span>
            </div>
            
            <div className="public-messages">
              {messages.length === 0 && (
                <div className="chat-welcome">
                  <span className="w-icon">🤖</span>
                  <h4>Connect with {agent.name}</h4>
                  <p>Ask a question or request a specialized analysis below.</p>
                </div>
              )}
              {messages.map(m => (
                <div key={m.id} className={`p-bubble-row ${m.role}`}>
                  <div className={`p-bubble ${m.role}`}>
                    {m.content}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="p-bubble-row agent">
                  <div className="p-bubble agent typing">
                    <span>.</span><span>.</span><span>.</span>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            <div className="public-input-area">
              <input 
                type="text" 
                placeholder="Type your query..." 
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                className="p-input"
              />
              <button 
                onClick={handleSend} 
                disabled={!input.trim() || isTyping}
                className="p-send-btn"
              >
                Send
              </button>
            </div>
          </div>
        </section>
      </main>

      <footer className="public-footer">
        <p>© 2026 AI Agent Builder Ecosystem. Protected by Neural Firewall v4.0</p>
      </footer>

      <style jsx>{`
        .public-view-container {
          min-height: 100vh;
          color: white;
          padding: 2rem;
          max-width: 1400px;
          margin: 0 auto;
        }
        .public-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 3rem;
        }
        .brand { display: flex; align-items: center; gap: 0.75rem; text-decoration: none; color: white; }
        .brand-icon { font-size: 1.5rem; }
        .brand-name { font-weight: 800; font-size: 1.3rem; }

        .header-actions { display: flex; gap: 1rem; align-items: center; }
        .share-widget {
          display: flex; align-items: center; gap: 0.75rem;
          padding: 0.4rem 0.6rem 0.4rem 1rem;
          border-radius: 12px;
          font-size: 0.8rem;
        }
        .url-preview { color: #94a3b8; opacity: 0.7; }
        .btn-copy {
          background: #6366f1;
          color: white; border: none;
          padding: 0.4rem 0.8rem;
          border-radius: 8px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-copy:hover { background: #4f46e5; transform: scale(1.05); }

        .public-main {
          display: grid;
          grid-template-columns: 450px 1fr;
          gap: 2.5rem;
          align-items: start;
        }

        /* Profile & Logs */
        .public-profile-card { padding: 2rem; border-radius: 24px; margin-bottom: 2rem; }
        .profile-hero { display: flex; align-items: center; gap: 1.25rem; margin-bottom: 2rem; }
        .agent-avatar-large { font-size: 2.5rem; width: 64px; height: 64px; background: rgba(255,255,255,0.05); border-radius: 16px; display: flex; align-items: center; justify-content: center; }
        .agent-name { font-size: 1.6rem; margin: 0; }
        .agent-role { color: #818cf8; font-weight: 600; font-size: 0.9rem; }
        
        .profile-stats { display: flex; justify-content: space-between; padding: 1.25rem; background: rgba(255,255,255,0.02); border-radius: 16px; margin-bottom: 1.5rem; }
        .p-stat { display: flex; flex-direction: column; }
        .p-label { font-size: 0.65rem; color: #94a3b8; text-transform: uppercase; }
        .p-value { font-weight: 800; font-size: 1rem; }

        .profile-description h3 { font-size: 0.9rem; color: #64748b; margin-bottom: 0.5rem; }
        .profile-description p { font-size: 0.9rem; line-height: 1.6; color: #cbd5e1; }

        .live-activity-list-small { padding: 1.25rem; border-radius: 20px; }
        .mini-log { display: flex; flex-direction: column; gap: 0.2rem; padding: 0.75rem 0; border-bottom: 1px solid rgba(255,255,255,0.05); }
        .mini-log:last-child { border: none; }
        .m-time { font-size: 0.7rem; color: #6366f1; font-weight: 700; }
        .m-msg { font-size: 0.85rem; color: #94a3b8; margin: 0; }

        /* Chat Section */
        .chat-section { height: 750px; }
        .public-chat-card {
          height: 100%;
          border-radius: 32px;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          background: rgba(10, 10, 12, 0.4);
        }
        .chat-header-mini {
          padding: 1.5rem 2rem;
          border-bottom: 1px solid rgba(255,255,255,0.08);
          display: flex; justify-content: space-between; align-items: center;
        }
        .chat-header-mini h3 { margin: 0; font-size: 1.1rem; }
        .encryption-badge { font-size: 0.65rem; background: rgba(34, 197, 94, 0.1); color: #4ade80; padding: 0.3rem 0.6rem; border-radius: 6px; border: 1px solid rgba(74, 222, 128, 0.2); }

        .public-messages {
          flex: 1;
          padding: 2rem;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .chat-welcome { text-align: center; margin-top: 4rem; opacity: 0.8; }
        .w-icon { font-size: 3rem; display: block; margin-bottom: 1rem; }
        
        .p-bubble-row { display: flex; width: 100%; }
        .p-bubble-row.user { justify-content: flex-end; }
        .p-bubble {
          max-width: 80%;
          padding: 1rem 1.25rem;
          border-radius: 18px;
          font-size: 0.95rem;
          line-height: 1.5;
        }
        .p-bubble.user { background: #6366f1; border-bottom-right-radius: 4px; }
        .p-bubble.agent { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-bottom-left-radius: 4px; }

        .typing span { animation: blink 1.4s infinite; font-size: 2rem; line-height: 0; position: relative; top: -5px; }
        .typing span:nth-child(2) { animation-delay: 0.2s; }
        .typing span:nth-child(3) { animation-delay: 0.4s; }

        .public-input-area {
          padding: 1.5rem 2rem;
          background: rgba(255,255,255,0.02);
          display: flex; gap: 0.75rem;
        }
        .p-input {
          flex: 1;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 14px;
          color: white;
          padding: 0.8rem 1.25rem;
          outline: none;
        }
        .p-input:focus { border-color: #6366f1; }
        .p-send-btn {
          background: #6366f1; color: white; border: none;
          padding: 0 1.5rem; border-radius: 14px;
          font-weight: 800; cursor: pointer;
        }
        .p-send-btn:disabled { opacity: 0.5; }

        .public-footer { text-align: center; padding: 4rem 0 2rem; color: #475569; font-size: 0.85rem; }

        @media (max-width: 1100px) {
          .public-main { grid-template-columns: 1fr; }
          .chat-section { height: 600px; order: -1; }
        }
        @media (max-width: 600px) {
          .public-view-container { padding: 1rem; }
          .header-actions { flex-direction: column; align-items: stretch; width: 100%; }
          .public-header { flex-direction: column; align-items: flex-start; gap: 1.5rem; }
        }
      `}</style>
    </div>
  );
}
