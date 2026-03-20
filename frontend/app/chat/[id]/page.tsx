"use client";

import { useAgents } from "../../context/AgentContext";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";

export default function ChatPage() {
  const params = useParams();
  const agentId = params.id as string;
  const { getAgent, getChatMessages, sendChatMessage, agents } = useAgents();
  const [agent, setAgent] = useState(getAgent(agentId));
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const messages = getChatMessages(agentId);

  // Keep agent fresh
  useEffect(() => {
    setAgent(agents.find(a => a.id === agentId));
  }, [agents, agentId]);

  // Auto-scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Detect typing
  useEffect(() => {
    const lastMsg = messages[messages.length - 1];
    if (lastMsg?.role === 'user') {
      setIsTyping(true);
      const t = setTimeout(() => setIsTyping(false), 2500);
      return () => clearTimeout(t);
    }
    setIsTyping(false);
  }, [messages]);

  if (!agent) {
    return (
      <div className="chat-container fade-in">
        <div className="glass-card" style={{ padding: '3rem', textAlign: 'center' }}>
          <h2>Agent Not Found</h2>
          <p style={{ color: 'var(--text-secondary)', margin: '1rem 0' }}>This agent may have been deleted.</p>
          <Link href="/dashboard" className="btn-premium">Back to Dashboard</Link>
        </div>
      </div>
    );
  }

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;
    setInput('');
    sendChatMessage(agentId, text);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const quickActions = [
    '👋 Hello!',
    '📊 Show stats',
    '❓ What can you do?',
    '🔍 Analyze a document',
  ];

  return (
    <div className="chat-container fade-in">
      {/* Header */}
      <div className="chat-header glass slide-up">
        <Link href="/dashboard" className="back-btn">←</Link>
        <div className="chat-agent-info">
          <span className="chat-avatar">🤖</span>
          <div>
            <h3 className="chat-agent-name">{agent.name}</h3>
            <span className="chat-agent-cap">{agent.capability}</span>
          </div>
        </div>
        <div className="chat-agent-status">
          <span className="status-dot" style={{
            background: agent.status === 'active' ? '#4ade80' : '#94a3b8',
          }}></span>
          <span>{agent.status === 'active' ? 'Online' : 'Offline'}</span>
        </div>
      </div>

      {/* Messages */}
      <div className="messages-area">
        {messages.length === 0 && (
          <div className="welcome-msg">
            <span className="welcome-icon">🤖</span>
            <h3>Chat with {agent.name}</h3>
            <p>Ask questions, request analysis, or check agent status.</p>
            <div className="quick-chips">
              {quickActions.map((action, i) => (
                <button key={i} className="chip glass" onClick={() => {
                  setInput(action.replace(/^.{2} /, ''));
                  sendChatMessage(agentId, action.replace(/^.{2} /, ''));
                }}>
                  {action}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map(msg => (
          <div key={msg.id} className={`msg-row msg-${msg.role}`}>
            {msg.role === 'agent' && <span className="msg-avatar">🤖</span>}
            <div className={`msg-bubble msg-bubble-${msg.role}`}>
              <p className="msg-text">{msg.content}</p>
              <span className="msg-time">
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            {msg.role === 'user' && <span className="msg-avatar user-avatar">👤</span>}
          </div>
        ))}

        {isTyping && (
          <div className="msg-row msg-agent">
            <span className="msg-avatar">🤖</span>
            <div className="msg-bubble msg-bubble-agent typing-bubble">
              <div className="typing-dots">
                <span></span><span></span><span></span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="chat-input-area glass">
        <input
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={`Message ${agent.name}...`}
          className="chat-input"
        />
        <button
          onClick={handleSend}
          disabled={!input.trim()}
          className="send-btn btn-premium"
        >
          Send
        </button>
      </div>

      <style jsx>{`
        .chat-container {
          max-width: 900px;
          margin: 0 auto;
          height: calc(100vh - 70px);
          display: flex;
          flex-direction: column;
          padding: 1rem 1rem 0;
        }

        /* Header */
        .chat-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem 1.5rem;
          border-radius: 16px;
          margin-bottom: 0.5rem;
          flex-shrink: 0;
        }
        .back-btn {
          color: var(--text-secondary);
          text-decoration: none;
          font-size: 1.2rem;
          padding: 0.3rem 0.6rem;
          border-radius: 8px;
          transition: all 0.2s;
        }
        .back-btn:hover { background: rgba(255,255,255,0.05); color: white; }
        .chat-agent-info {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex: 1;
        }
        .chat-avatar {
          font-size: 1.8rem;
          filter: drop-shadow(0 0 8px var(--accent-primary));
        }
        .chat-agent-name { margin: 0; font-size: 1rem; }
        .chat-agent-cap { font-size: 0.75rem; color: var(--text-secondary); }
        .chat-agent-status {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.8rem;
          color: var(--text-secondary);
        }
        .status-dot {
          width: 8px; height: 8px;
          border-radius: 50%;
          display: inline-block;
        }

        /* Messages */
        .messages-area {
          flex: 1;
          overflow-y: auto;
          padding: 1rem 0.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .messages-area::-webkit-scrollbar { width: 4px; }
        .messages-area::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }

        /* Welcome */
        .welcome-msg {
          text-align: center;
          padding: 3rem 1rem;
          color: var(--text-secondary);
        }
        .welcome-icon { font-size: 3rem; display: block; margin-bottom: 1rem; filter: drop-shadow(0 0 15px var(--accent-primary)); }
        .welcome-msg h3 { color: var(--text-primary); margin-bottom: 0.5rem; }
        .welcome-msg p { margin-bottom: 1.5rem; }
        .quick-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          justify-content: center;
        }
        .chip {
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-size: 0.8rem;
          color: var(--text-primary);
          cursor: pointer;
          transition: all 0.2s;
          border: 1px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.03);
        }
        .chip:hover {
          border-color: var(--accent-primary);
          background: rgba(99,102,241,0.1);
        }

        /* Message Bubbles */
        .msg-row {
          display: flex;
          align-items: flex-end;
          gap: 0.5rem;
          animation: msg-in 0.3s ease-out;
        }
        .msg-agent { justify-content: flex-start; }
        .msg-user { justify-content: flex-end; }
        @keyframes msg-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .msg-avatar { font-size: 1.2rem; flex-shrink: 0; }
        .msg-bubble {
          max-width: 70%;
          padding: 0.8rem 1.1rem;
          border-radius: 16px;
        }
        .msg-bubble-agent {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          border-bottom-left-radius: 4px;
        }
        .msg-bubble-user {
          background: linear-gradient(135deg, var(--accent-primary), var(--accent-tertiary));
          border-bottom-right-radius: 4px;
        }
        .msg-text {
          margin: 0;
          font-size: 0.9rem;
          line-height: 1.5;
          white-space: pre-wrap;
        }
        .msg-time {
          display: block;
          font-size: 0.65rem;
          color: rgba(255,255,255,0.4);
          margin-top: 0.3rem;
          text-align: right;
        }

        /* Typing */
        .typing-bubble { padding: 0.8rem 1.2rem; }
        .typing-dots {
          display: flex;
          gap: 0.3rem;
          align-items: center;
        }
        .typing-dots span {
          width: 8px; height: 8px;
          border-radius: 50%;
          background: var(--accent-primary);
          animation: typing-bounce 1.4s infinite both;
        }
        .typing-dots span:nth-child(2) { animation-delay: 0.2s; }
        .typing-dots span:nth-child(3) { animation-delay: 0.4s; }
        @keyframes typing-bounce {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
          40% { transform: scale(1); opacity: 1; }
        }

        /* Input */
        .chat-input-area {
          display: flex;
          gap: 0.75rem;
          padding: 1rem;
          border-radius: 16px;
          margin-top: 0.5rem;
          margin-bottom: 1rem;
          flex-shrink: 0;
        }
        .chat-input {
          flex: 1;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px;
          color: white;
          padding: 0.8rem 1rem;
          font-size: 0.9rem;
          margin: 0;
        }
        .chat-input:focus {
          outline: none;
          border-color: var(--accent-primary);
          background: rgba(255,255,255,0.08);
        }
        .send-btn {
          padding: 0 1.5rem;
          height: 46px;
        }
        .send-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
          transform: none !important;
        }
      `}</style>
    </div>
  );
}