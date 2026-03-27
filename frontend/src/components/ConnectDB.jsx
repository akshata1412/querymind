import { useState, useRef } from "react"
import { connectDB, uploadCSV } from "../api/client"
import toast from "react-hot-toast"
import { Database, Zap, Upload, FileText, X, CheckCircle } from "lucide-react"

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
      display: "flex", alignItems: "center", justifyContent: "center",
      minHeight: "100vh", backgroundColor: "#0D1B2A",
      background: "radial-gradient(ellipse at top, #1B2D42 0%, #0D1B2A 70%)"
    }}>
      <div style={{ width: "100%", maxWidth: "500px", padding: "20px" }}>
        
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "64px", height: "64px", backgroundColor: "#00B4D8", borderRadius: "16px", marginBottom: "16px", boxShadow: "0 0 30px #00B4D840" }}>
            <Database color="#0D1B2A" size={32} />
          </div>
          <h1 style={{ fontSize: "32px", fontWeight: "900", color: "white", margin: "0 0 6px 0", letterSpacing: "-1px" }}>QueryMind</h1>
          <p style={{ color: "#00B4D8", fontSize: "14px", margin: 0 }}>AI-Powered Database Intelligence Agent</p>
        </div>

        {/* Card */}
        <div style={{ backgroundColor: "#1B2D42", borderRadius: "20px", border: "1px solid #00B4D830", overflow: "hidden", boxShadow: "0 20px 60px #00000060" }}>
          
          {/* Tabs */}
          <div style={{ display: "flex", borderBottom: "1px solid #00B4D820" }}>
            {[
              { id: "upload", label: "📂 Upload CSV", },
              { id: "connect", label: "🔗 Database URL" }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  flex: 1, padding: "14px", border: "none", cursor: "pointer", fontSize: "14px", fontWeight: "600", fontFamily: "Courier New",
                  backgroundColor: activeTab === tab.id ? "#00B4D815" : "transparent",
                  color: activeTab === tab.id ? "#00B4D8" : "#6b7280",
                  borderBottom: activeTab === tab.id ? "2px solid #00B4D8" : "2px solid transparent",
                  transition: "all 0.2s"
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div style={{ padding: "24px" }}>

            {/* Upload Tab */}
            {activeTab === "upload" && (
              <div>
                <p style={{ color: "#9ca3af", fontSize: "13px", marginBottom: "16px", textAlign: "center" }}>
                  Upload one or multiple CSV files — we'll analyze them instantly
                </p>

                {/* Drop Zone */}
                <div
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    border: `2px dashed ${dragOver ? "#00B4D8" : "#00B4D850"}`,
                    borderRadius: "12px", padding: "32px", textAlign: "center",
                    cursor: "pointer", marginBottom: "16px",
                    backgroundColor: dragOver ? "#00B4D810" : "transparent",
                    transition: "all 0.2s"
                  }}
                >
                  <Upload color="#00B4D8" size={32} style={{ margin: "0 auto 12px" }} />
                  <p style={{ color: "white", fontWeight: "600", margin: "0 0 4px" }}>
                    {dragOver ? "Drop files here!" : "Drag & drop CSV files"}
                  </p>
                  <p style={{ color: "#6b7280", fontSize: "12px", margin: 0 }}>or click to browse</p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept=".csv"
                    onChange={handleFileSelect}
                    style={{ display: "none" }}
                  />
                </div>

                {/* Selected Files */}
                {selectedFiles.length > 0 && (
                  <div style={{ marginBottom: "16px" }}>
                    <p style={{ color: "#00B4D8", fontSize: "12px", marginBottom: "8px", fontWeight: "600" }}>
                      {selectedFiles.length} file(s) selected:
                    </p>
                    {selectedFiles.map((file, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px 12px", backgroundColor: "#0D1B2A", borderRadius: "8px", marginBottom: "6px" }}>
                        <FileText size={14} color="#00B4D8" />
                        <span style={{ flex: 1, color: "white", fontSize: "13px" }}>{file.name}</span>
                        <span style={{ color: "#6b7280", fontSize: "11px" }}>{(file.size / 1024).toFixed(0)} KB</span>
                        <button onClick={() => removeFile(i)} style={{ background: "none", border: "none", cursor: "pointer", color: "#ef4444", padding: "0" }}>
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <button
                  onClick={handleFileUpload}
                  disabled={loading || selectedFiles.length === 0}
                  style={{
                    width: "100%", backgroundColor: selectedFiles.length > 0 ? "#00B4D8" : "#1B2D42",
                    color: selectedFiles.length > 0 ? "#0D1B2A" : "#6b7280",
                    fontWeight: "bold", padding: "14px", borderRadius: "10px",
                    border: "none", cursor: selectedFiles.length > 0 ? "pointer" : "not-allowed",
                    fontSize: "15px", display: "flex", alignItems: "center",
                    justifyContent: "center", gap: "8px", transition: "all 0.2s",
                    fontFamily: "Courier New"
                  }}
                >
                  <Zap size={18} />
                  {loading ? "Analyzing..." : `Analyze ${selectedFiles.length > 0 ? selectedFiles.length + " file(s)" : "Files"}`}
                </button>
              </div>
            )}

            {/* Connect Tab */}
            {activeTab === "connect" && (
              <div>
                <p style={{ color: "#9ca3af", fontSize: "13px", marginBottom: "16px", textAlign: "center" }}>
                  Connect directly to an existing database
                </p>

                <input
                  style={{
                    width: "100%", backgroundColor: "#0D1B2A", border: "1px solid #00B4D850",
                    borderRadius: "10px", padding: "14px 16px", color: "white",
                    marginBottom: "12px", fontSize: "14px", outline: "none",
                    fontFamily: "Courier New", boxSizing: "border-box"
                  }}
                  placeholder="sqlite:///./demo.db"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleConnect()}
                />

                <div style={{ backgroundColor: "#0D1B2A", borderRadius: "8px", padding: "12px", marginBottom: "16px" }}>
                  <p style={{ color: "#6b7280", fontSize: "11px", margin: "0 0 6px", fontWeight: "600" }}>EXAMPLES:</p>
                  {[
                    "sqlite:///./demo.db",
                    "mysql+pymysql://user:pass@host/db",
                    "postgresql://user:pass@host/db"
                  ].map(example => (
                    <p
                      key={example}
                      onClick={() => setUrl(example)}
                      style={{ color: "#00B4D8", fontSize: "12px", margin: "2px 0", cursor: "pointer", fontFamily: "Courier New" }}
                    >
                      {example}
                    </p>
                  ))}
                </div>

                <button
                  onClick={handleConnect}
                  disabled={loading}
                  style={{
                    width: "100%", backgroundColor: "#00B4D8", color: "#0D1B2A",
                    fontWeight: "bold", padding: "14px", borderRadius: "10px",
                    border: "none", cursor: "pointer", fontSize: "15px",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    gap: "8px", fontFamily: "Courier New"
                  }}
                >
                  <Zap size={18} />
                  {loading ? "Connecting..." : "Connect & Analyze"}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <p style={{ textAlign: "center", color: "#374151", fontSize: "12px", marginTop: "20px" }}>
          Supports SQLite • MySQL • PostgreSQL • CSV Files
        </p>
      </div>
    </div>
  )
}