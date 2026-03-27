import { useState } from "react"
import { connectDB } from "../api/client"
import toast from "react-hot-toast"
import { Database, Zap } from "lucide-react"

export default function ConnectDB({ onConnect }) {
  const [url, setUrl] = useState("")
  const [loading, setLoading] = useState(false)

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

  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "center",
      minHeight: "100vh", backgroundColor: "#0D1B2A"
    }}>
      <div style={{
        backgroundColor: "#1B2D42", border: "1px solid #00B4D8",
        borderRadius: "16px", padding: "40px", width: "100%", maxWidth: "440px"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "32px" }}>
          <Database color="#00B4D8" size={36} />
          <div>
            <h1 style={{ fontSize: "28px", fontWeight: "bold", color: "white" }}>QueryMind</h1>
            <p style={{ color: "#00B4D8", fontSize: "13px", fontStyle: "italic" }}>AI-Powered Database Intelligence</p>
          </div>
        </div>

        <input
          style={{
            width: "100%", backgroundColor: "#0D1B2A", border: "1px solid #00B4D8",
            borderRadius: "8px", padding: "12px 16px", color: "white",
            marginBottom: "8px", fontSize: "14px", outline: "none"
          }}
          placeholder="sqlite:///./demo.db"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleConnect()}
        />

        <div style={{ fontSize: "12px", color: "#6b7280", marginBottom: "24px", lineHeight: "1.8" }}>
          <p>SQLite: sqlite:///./demo.db</p>
          <p>MySQL: mysql+pymysql://user:pass@host/db</p>
          <p>PostgreSQL: postgresql://user:pass@host/db</p>
        </div>

        <button
          onClick={handleConnect}
          disabled={loading}
          style={{
            width: "100%", backgroundColor: "#00B4D8", color: "#0D1B2A",
            fontWeight: "bold", padding: "12px", borderRadius: "8px",
            border: "none", cursor: "pointer", fontSize: "16px",
            display: "flex", alignItems: "center", justifyContent: "center", gap: "8px"
          }}
        >
          <Zap size={18} />
          {loading ? "Connecting..." : "Connect & Analyze"}
        </button>
      </div>
    </div>
  )
}