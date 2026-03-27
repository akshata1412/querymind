
import { useState, useRef } from "react"
import { connectDB, uploadCSV } from "../api/client"
import toast from "react-hot-toast"
import { Database, Zap, Upload, FileText, X } from "lucide-react"
 
const styles = {
  surface: "#060e20",
  surfaceContainerLow: "#091328",
  surfaceContainer: "#0f1930",
  surfaceContainerHigh: "#141f38",
  surfaceContainerHighest: "#192540",
  primary: "#a3a6ff",
  primaryContainer: "#9396ff",
  secondary: "#53ddfc",
  secondaryContainer: "#00687a",
  onSurface: "#dee5ff",
  onSurfaceVariant: "#a3aac4",
  outlineVariant: "#40485d",
  error: "#ff6e84",
}
 
export default function ConnectDB({ onConnect }) {
  const [url, setUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("upload")
  const [dragOver, setDragOver] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState([])
  const fileInputRef = useRef(null)
 
  const handleConnect = async () => {
    if (!url.trim()) return toast.error("Enter a database URL")
    setLoading(true)
    try {
      const { data } = await connectDB(url)
      toast.success(`Connected! Found ${data.table_count} tables`)
      onConnect(data.schema, url)
    } catch (e) {
      toast.error(e.response?.data?.detail || "Connection failed")
    } finally {
      setLoading(false)
    }
  }
 
  const handleFileUpload = async () => {
    if (selectedFiles.length === 0) return toast.error("Please select CSV files first")
    setLoading(true)
    try {
      const { data } = await uploadCSV(selectedFiles)
      toast.success(`Loaded ${data.table_count} tables successfully!`)
      onConnect(data.schema, "uploaded_data.db")
    } catch (e) {
      toast.error(e.response?.data?.detail || "Upload failed")
    } finally {
      setLoading(false)
    }
  }
 
  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    const files = Array.from(e.dataTransfer.files).filter(f => f.name.endsWith('.csv'))
    if (files.length === 0) return toast.error("Please drop CSV files only")
    setSelectedFiles(prev => [...prev, ...files])
  }
 
  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files)
    setSelectedFiles(prev => [...prev, ...files])
  }
 
  const removeFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index))
  }
 
  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: styles.surface,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px",
      position: "relative",
      overflow: "hidden",
      fontFamily: "Inter, sans-serif"
    }}>
      {/* Ambient background glows */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "-96px", left: "-96px", width: "384px", height: "384px", borderRadius: "50%", background: "rgba(163,166,255,0.08)", filter: "blur(120px)" }} />
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: "600px", height: "600px", borderRadius: "50%", background: "rgba(83,221,252,0.04)", filter: "blur(160px)", animation: "pulseGlow 3s ease-in-out infinite" }} />
        <div style={{ position: "absolute", bottom: "-96px", right: "-96px", width: "384px", height: "384px", borderRadius: "50%", background: "rgba(96,99,238,0.08)", filter: "blur(120px)" }} />
      </div>
 
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;700;800&family=Inter:wght@400;500;600&display=swap');
        @keyframes pulseGlow {
          0%, 100% { opacity: 0.4; transform: translate(-50%,-50%) scale(1); }
          50% { opacity: 0.8; transform: translate(-50%,-50%) scale(1.1); }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .connect-input:focus { border-color: ${styles.primary} !important; box-shadow: 0 0 0 3px rgba(163,166,255,0.15) !important; outline: none; }
        .tab-btn:hover { background: rgba(163,166,255,0.06) !important; }
        .example-btn:hover { background: rgba(163,166,255,0.1) !important; color: ${styles.primary} !important; }
        .dropzone:hover { border-color: rgba(163,166,255,0.5) !important; background: rgba(163,166,255,0.04) !important; }
        .primary-btn:hover:not(:disabled) { transform: scale(1.01); box-shadow: 0 8px 24px rgba(163,166,255,0.25) !important; }
        .primary-btn:active:not(:disabled) { transform: scale(0.98); }
      `}</style>
 
      <div style={{ width: "100%", maxWidth: "480px", position: "relative", zIndex: 10 }}>
 
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "64px", height: "64px", borderRadius: "16px", background: `linear-gradient(135deg, ${styles.primary}, ${styles.primaryContainer})`, marginBottom: "20px", boxShadow: "0 0 32px rgba(163,166,255,0.3)" }}>
            <Database color="#060e20" size={28} />
          </div>
          <h1 style={{ fontFamily: "Manrope, sans-serif", fontSize: "36px", fontWeight: 800, color: styles.onSurface, margin: "0 0 8px", letterSpacing: "-0.02em" }}>QueryMind</h1>
          <p style={{ color: styles.secondary, fontSize: "14px", margin: 0, fontWeight: 500 }}>AI-Powered Database Intelligence</p>
        </div>
 
        {/* Main Card */}
        <div style={{
          background: "rgba(25,37,64,0.6)",
          backdropFilter: "blur(16px)",
          borderRadius: "0.5rem",
          border: `1px solid rgba(64,72,93,0.15)`,
          overflow: "hidden",
          boxShadow: "0 32px 64px rgba(0,0,0,0.4)"
        }}>
          {/* Tabs */}
          <div style={{ display: "flex", backgroundColor: styles.surfaceContainerLow, padding: "4px", gap: "4px" }}>
            {[
              { id: "upload", label: "Upload CSV", icon: Upload },
              { id: "connect", label: "Connect Database", icon: Database }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                className="tab-btn"
                onClick={() => setActiveTab(id)}
                style={{
                  flex: 1, padding: "12px 16px", border: "none", cursor: "pointer",
                  fontSize: "13px", fontWeight: 600, fontFamily: "Inter, sans-serif",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                  borderRadius: "6px", transition: "all 0.2s",
                  backgroundColor: activeTab === id ? styles.surfaceContainer : "transparent",
                  color: activeTab === id ? styles.primary : styles.onSurfaceVariant,
                  borderBottom: activeTab === id ? `2px solid ${styles.primary}` : "2px solid transparent",
                }}
              >
                <Icon size={15} /> {label}
              </button>
            ))}
          </div>
 
          <div style={{ padding: "28px" }}>
            {/* Upload Tab */}
            {activeTab === "upload" && (
              <div>
                <p style={{ color: styles.onSurfaceVariant, fontSize: "13px", marginBottom: "20px", textAlign: "center" }}>
                  Upload one or more CSV files — we'll analyze them instantly
                </p>
 
                {/* Dropzone */}
                <div
                  className="dropzone"
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    border: `2px dashed ${dragOver ? styles.primary : "rgba(64,72,93,0.4)"}`,
                    borderRadius: "12px", padding: "40px 24px", textAlign: "center",
                    cursor: "pointer", marginBottom: "16px",
                    backgroundColor: dragOver ? "rgba(163,166,255,0.05)" : "transparent",
                    transition: "all 0.2s"
                  }}
                >
                  <div style={{ width: "56px", height: "56px", borderRadius: "50%", backgroundColor: styles.surfaceContainerHigh, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", transition: "transform 0.2s" }}>
                    <Upload color={styles.primaryContainer} size={24} />
                  </div>
                  <p style={{ color: styles.onSurface, fontWeight: 600, margin: "0 0 6px", fontSize: "15px" }}>
                    {dragOver ? "Drop files here!" : "Drop your CSV files here"}
                  </p>
                  <p style={{ color: styles.onSurfaceVariant, fontSize: "12px", margin: "0 0 12px" }}>or click to browse from your computer</p>
                  <span style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.1em", color: styles.onSurfaceVariant, fontWeight: 700, padding: "4px 12px", backgroundColor: styles.surfaceContainer, borderRadius: "999px" }}>Max 50MB</span>
                  <input ref={fileInputRef} type="file" multiple accept=".csv" onChange={handleFileSelect} style={{ display: "none" }} />
                </div>
 
                {/* Selected Files */}
                {selectedFiles.length > 0 && (
                  <div style={{ marginBottom: "16px" }}>
                    <p style={{ color: styles.onSurfaceVariant, fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "8px", padding: "0 4px" }}>
                      Selected Files
                    </p>
                    {selectedFiles.map((file, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 14px", backgroundColor: styles.surfaceContainer, borderRadius: "8px", marginBottom: "6px", transition: "background 0.2s" }}>
                        <div style={{ width: "36px", height: "36px", borderRadius: "6px", backgroundColor: `${styles.secondaryContainer}33`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <FileText size={16} color={styles.secondary} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ color: styles.onSurface, fontSize: "13px", fontWeight: 500, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{file.name}</p>
                          <p style={{ color: styles.onSurfaceVariant, fontSize: "11px", margin: 0 }}>{(file.size / 1024).toFixed(0)} KB · Ready to parse</p>
                        </div>
                        <button onClick={() => removeFile(i)} style={{ background: "none", border: "none", cursor: "pointer", color: styles.onSurfaceVariant, padding: "4px", borderRadius: "4px", display: "flex", transition: "color 0.2s" }}
                          onMouseEnter={e => e.currentTarget.style.color = styles.error}
                          onMouseLeave={e => e.currentTarget.style.color = styles.onSurfaceVariant}>
                          <X size={15} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
 
                <button
                  className="primary-btn"
                  onClick={handleFileUpload}
                  disabled={loading || selectedFiles.length === 0}
                  style={{
                    width: "100%",
                    background: selectedFiles.length > 0 ? `linear-gradient(135deg, ${styles.primary}, ${styles.primaryContainer})` : styles.surfaceContainerHigh,
                    color: selectedFiles.length > 0 ? "#060e20" : styles.onSurfaceVariant,
                    fontWeight: 700, padding: "14px", borderRadius: "8px",
                    border: "none", cursor: selectedFiles.length > 0 ? "pointer" : "not-allowed",
                    fontSize: "14px", display: "flex", alignItems: "center", justifyContent: "center",
                    gap: "8px", transition: "all 0.2s", fontFamily: "Inter, sans-serif",
                    boxShadow: selectedFiles.length > 0 ? "0 4px 16px rgba(163,166,255,0.2)" : "none"
                  }}
                >
                  {loading ? (
                    <>
                      <div style={{ width: "16px", height: "16px", border: "2px solid rgba(6,14,32,0.3)", borderTopColor: "#060e20", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Zap size={16} />
                      {selectedFiles.length > 0 ? `Analyze ${selectedFiles.length} file(s)` : "Select Files First"}
                    </>
                  )}
                </button>
              </div>
            )}
 
            {/* Connect Tab */}
            {activeTab === "connect" && (
              <div>
                <p style={{ color: styles.onSurfaceVariant, fontSize: "13px", marginBottom: "20px", textAlign: "center" }}>
                  Connect directly to an existing database
                </p>
 
                <input
                  className="connect-input"
                  style={{
                    width: "100%", backgroundColor: "#000000",
                    border: `1px solid rgba(64,72,93,0.3)`,
                    borderRadius: "8px", padding: "13px 16px", color: styles.onSurface,
                    marginBottom: "12px", fontSize: "14px",
                    fontFamily: "monospace", boxSizing: "border-box",
                    transition: "all 0.2s"
                  }}
                  placeholder="sqlite:///./demo.db"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleConnect()}
                />
 
                <div style={{ backgroundColor: "#000000", borderRadius: "8px", padding: "12px 16px", marginBottom: "20px", border: `1px solid rgba(64,72,93,0.15)` }}>
                  <p style={{ color: styles.onSurfaceVariant, fontSize: "10px", margin: "0 0 8px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>Examples</p>
                  {["sqlite:///./demo.db", "mysql+pymysql://user:pass@host/db", "postgresql://user:pass@host/db"].map(example => (
                    <p
                      key={example}
                      className="example-btn"
                      onClick={() => setUrl(example)}
                      style={{ color: styles.secondary, fontSize: "12px", margin: "4px 0", cursor: "pointer", fontFamily: "monospace", transition: "color 0.2s", padding: "2px 4px", borderRadius: "4px" }}
                    >
                      {example}
                    </p>
                  ))}
                </div>
 
                <button
                  className="primary-btn"
                  onClick={handleConnect}
                  disabled={loading}
                  style={{
                    width: "100%",
                    background: `linear-gradient(135deg, ${styles.primary}, ${styles.primaryContainer})`,
                    color: "#060e20", fontWeight: 700, padding: "14px",
                    borderRadius: "8px", border: "none", cursor: loading ? "not-allowed" : "pointer",
                    fontSize: "14px", display: "flex", alignItems: "center",
                    justifyContent: "center", gap: "8px", fontFamily: "Inter, sans-serif",
                    transition: "all 0.2s",
                    boxShadow: "0 4px 16px rgba(163,166,255,0.2)"
                  }}
                >
                  {loading ? (
                    <>
                      <div style={{ width: "16px", height: "16px", border: "2px solid rgba(6,14,32,0.3)", borderTopColor: "#060e20", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                      Connecting...
                    </>
                  ) : (
                    <>
                      <Zap size={16} />
                      Connect & Analyze
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
 
        {/* Footer */}
        <p style={{ textAlign: "center", color: "rgba(163,170,196,0.4)", fontSize: "12px", marginTop: "24px" }}>
          Supports SQLite · MySQL · PostgreSQL · CSV Files
        </p>
      </div>
    </div>
  )
}