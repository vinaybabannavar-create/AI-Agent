"use client";

import { useState, useRef, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function UploadPage() {
  const { user } = useAuth();
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const router = useRouter();

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const onButtonClick = () => {
    inputRef.current?.click();
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setStatus("Analyzing document...");

    // Simulate API call and redirect
    setTimeout(() => {
      setUploading(false);
      setStatus("Analysis complete! Redirection to result...");

      // Redirect after a short delay to show the complete message
      setTimeout(() => {
        router.push("/documents/1");
      }, 800);
    }, 1500);
  };

  return (
    <div className="upload-container fade-in">
      <div className="perspective">
        <div className="glass-card upload-card slide-up">
          <Link href="/dashboard" className="back-link">← Back to Dashboard</Link>
          <h2 className="upload-title">Launch <span className="gradient-text">AI Agent</span></h2>
          <p className="upload-subtitle">Upload multi-modal documents for real-time analysis.</p>

          <form id="form-file-upload" onDragEnter={handleDrag} onSubmit={(e) => e.preventDefault()}>
            <input
              ref={inputRef}
              type="file"
              id="input-file-upload"
              multiple={false}
              onChange={handleChange}
              accept=".pdf,.png,.jpg,.jpeg,.txt"
              style={{ display: 'none' }}
            />
            <label
              id="label-file-upload"
              htmlFor="input-file-upload"
              className={dragActive ? "drag-active" : ""}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <div className="upload-prompt">
                <i className="upload-icon">📄</i>
                {file ? (
                  <div className="file-info">
                    <span className="file-name">{file.name}</span>
                    <span className="file-size">{(file.size / 1024).toFixed(1)} KB</span>
                  </div>
                ) : (
                  <>
                    <p>Drag and drop your file here or</p>
                    <button className="upload-button" onClick={onButtonClick}>Upload from system</button>
                    <p className="upload-hint">Supports PDF, PNG, JPG (Max 10MB)</p>
                  </>
                )}
              </div>
            </label>
          </form>

          {file && !status && (
            <button
              onClick={handleUpload}
              className="btn-premium w-full mt-4"
              disabled={uploading}
            >
              {uploading ? "Analyzing..." : "Start Analysis"}
            </button>
          )}

          {status && (
            <div className="status-box glass zoom-in">
              <p>{status}</p>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .upload-container {
          padding: 4rem 2rem;
          max-width: 800px;
          margin: 0 auto;
        }
        .upload-card {
          padding: 3rem;
          text-align: center;
        }
        .back-link {
          display: block;
          text-align: left;
          color: var(--text-secondary);
          text-decoration: none;
          margin-bottom: 2rem;
          font-size: 0.9rem;
          transition: color 0.3s ease;
        }
        .back-link:hover {
          color: var(--accent-primary);
        }
        .upload-title {
          font-size: 2.5rem;
          margin-bottom: 0.5rem;
        }
        .upload-subtitle {
          color: var(--text-secondary);
          margin-bottom: 3rem;
        }
        #form-file-upload {
          height: 16rem;
          width: 100%;
          position: relative;
        }
        #label-file-upload {
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          border-width: 2px;
          border-radius: 20px;
          border-style: dashed;
          border-color: rgba(255, 255, 255, 0.1);
          background-color: rgba(255, 255, 255, 0.02);
          transition: all 0.3s ease;
          cursor: pointer;
        }
        #label-file-upload.drag-active {
          background-color: rgba(99, 102, 241, 0.1);
          border-color: var(--accent-primary);
          transform: scale(1.02);
        }
        .upload-prompt {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }
        .upload-icon {
          font-size: 3rem;
          margin-bottom: 0.5rem;
          filter: drop-shadow(0 0 10px var(--accent-primary));
        }
        .upload-button {
          background: none;
          border: none;
          color: var(--accent-secondary);
          font-weight: 600;
          cursor: pointer;
          font-size: 1.1rem;
        }
        .upload-button:hover {
          text-decoration: underline;
        }
        .upload-hint {
          font-size: 0.8rem;
          color: var(--text-secondary);
        }
        .file-info {
          display: flex;
          flex-direction: column;
        }
        .file-name {
          font-weight: 600;
          color: white;
        }
        .file-size {
          font-size: 0.8rem;
          color: var(--text-secondary);
        }
        .w-full { width: 100%; }
        .mt-4 { margin-top: 2rem; }
        .status-box {
          margin-top: 2rem;
          padding: 1.5rem;
          border-radius: 12px;
          border: 1px solid var(--accent-primary);
          color: var(--accent-primary);
          background: rgba(99, 102, 241, 0.05);
        }
      `}</style>
    </div>
  );
}