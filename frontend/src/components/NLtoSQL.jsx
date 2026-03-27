import { useState } from "react"
import { convertNLSQL } from "../api/client"
import { Wand2, Copy, Play } from "lucide-react"
import toast from "react-hot-toast"

const EXAMPLES = [
  "Show all customers who placed orders last month",
  "Find the top 5 products by total revenue",
  "Which users have not placed any orders?",
  "Count orders grouped by status",
]

export default function NLtoSQL({ schema }) {
  const [question, setQuestion] = useState("")
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const convert = async (q = question) => {
    if (!q.trim()) return
    setLoading(true)
    try {
      const { data } = await convertNLSQL(q, schema)
      setResult(data)
    } catch {
      toast.error("Conversion failed")
    }
    setLoading(false)
  }

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto" }}>
      <h2 style={{ color: "white", fontSize: "22px", fontWeight: "bold", marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px" }}>
        <Wand2 color="#00B4D8" size={22} /> Natural Language → SQL
      </h2>

      <div style={{ backgroundColor: "#1B2D42", border: "1px solid #00B4D8", borderRadius: "12px", padding: "20px", marginBottom: "16px" }}>
        <textarea
          style={{ width: "100%", backgroundColor: "#0D1B2A", border: "1px solid #00B4D8", borderRadius: "8px", padding: "12px", color: "white", fontSize: "14px", minHeight: "80px", outline: "none", resize: "vertical", fontFamily: "Courier New" }}
          placeholder="Ask in plain English... e.g. Show me all orders from last month"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />

        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", margin: "12px 0" }}>
          {EXAMPLES.map(ex => (
            <button
              key={ex}
              onClick={() => { setQuestion(ex); convert(ex) }}
              style={{ fontSize: "12px", backgroundColor: "#162236", color: "#00B4D8", border: "1px solid #00B4D8", borderRadius: "20px", padding: "4px 12px", cursor: "pointer" }}
            >
              {ex}
            </button>
          ))}
        </div>

        <button
          onClick={() => convert()}
          disabled={loading}
          style={{ width: "100%", backgroundColor: "#00B4D8", color: "#0D1B2A", fontWeight: "bold", padding: "12px", borderRadius: "8px", border: "none", cursor: "pointer", fontSize: "15px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}
        >
          <Play size={16} />
          {loading ? "Converting..." : "Generate SQL"}
        </button>
      </div>

      {result && (
        <div style={{ backgroundColor: "#1B2D42", border: "1px solid #00B4D8", borderRadius: "12px", padding: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
            <span style={{ color: "#4ade80", fontSize: "14px" }}>✓ Confidence: {Math.round((result.confidence || 0.95) * 100)}%</span>
            <button
              onClick={() => { navigator.clipboard.writeText(result.sql); toast.success("Copied!") }}
              style={{ background: "none", border: "none", color: "#9ca3af", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", fontSize: "13px" }}
            >
              <Copy size={14} /> Copy
            </button>
          </div>

          <pre style={{ backgroundColor: "#0D1B2A", borderRadius: "8px", padding: "16px", color: "#00B4D8", fontSize: "13px", overflowX: "auto", whiteSpace: "pre-wrap" }}>
            {result.sql}
          </pre>

          {result.explanation && (
            <p style={{ color: "#d1d5db", fontSize: "13px", marginTop: "12px" }}>{result.explanation}</p>
          )}

          {result.tables_used?.length > 0 && (
            <div style={{ display: "flex", gap: "8px", marginTop: "10px", flexWrap: "wrap" }}>
              {result.tables_used.map(t => (
                <span key={t} style={{ fontSize: "12px", backgroundColor: "#00B4D8", color: "#0D1B2A", padding: "2px 10px", borderRadius: "20px", fontWeight: "bold" }}>{t}</span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}