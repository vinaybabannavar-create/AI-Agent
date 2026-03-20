"use client";

import Link from "next/link";

export default function HistoryPage() {
  const history = [
    { id: 1, name: "Quarterly_Report.pdf", date: "2026-01-19", status: "Completed" },
    { id: 2, name: "Invoices_Batch_A.zip", date: "2026-01-18", status: "Completed" },
    { id: 3, name: "Contract_Draft_v2.docx", date: "2026-01-15", status: "Completed" },
  ];

  return (
    <div className="history-container fade-in">
      <div className="perspective">
        <div className="glass-card history-card slide-up">
          <Link href="/dashboard" className="back-link">← Back to Dashboard</Link>
          <h2 className="history-title">Analysis <span className="gradient-text">History</span></h2>
          <p className="history-subtitle">Track and review your document intelligence activities.</p>

          <div className="history-table-wrapper glass">
            <table className="history-table">
              <thead>
                <tr>
                  <th>Document Name</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {history.map(item => (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td>{item.date}</td>
                    <td><span className="status-badge">{item.status}</span></td>
                    <td>
                      <Link href={`/documents/${item.id}`} className="btn-small-ghost-link">
                        View Result
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <style jsx>{`
        .history-container {
          padding: 4rem 2rem;
          max-width: 1000px;
          margin: 0 auto;
        }
        .history-card {
          padding: 3rem;
        }
        .back-link {
          display: block;
          text-align: left;
          color: var(--text-secondary);
          text-decoration: none;
          margin-bottom: 2rem;
          font-size: 0.9rem;
        }
        .history-title {
          font-size: 2.5rem;
          margin-bottom: 0.5rem;
        }
        .history-subtitle {
          color: var(--text-secondary);
          margin-bottom: 3rem;
        }
        .history-table-wrapper {
          border-radius: 20px;
          overflow: hidden;
        }
        .history-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }
        .history-table th, .history-table td {
          padding: 1.5rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }
        .history-table th {
          background: rgba(255, 255, 255, 0.05);
          font-size: 0.9rem;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        .status-badge {
          background: rgba(16, 185, 129, 0.1);
          color: #10b981;
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
        }
        .btn-small-ghost-link {
          background: none;
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
          text-decoration: none;
          display: inline-block;
          font-size: 0.85rem;
        }
        .btn-small-ghost-link:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: white;
        }
      `}</style>
    </div>
  );
}
