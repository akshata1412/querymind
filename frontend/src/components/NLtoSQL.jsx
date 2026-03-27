

import { useState } from "react"
import { convertNLSQL } from "../api/client"
import { Wand2, Copy, Play } from "lucide-react"
import toast from "react-hot-toast"
 
const s = {
  surface: "#060e20",
  surfaceContainerLow: "#091328",
  surfaceContainer: "#0f1930",
  surfaceContainerHigh: "#141f38",
  primary: "#a3a6ff",
  primaryContainer: "#9396ff",
  secondary: "#53ddfc",
  secondaryContainer: "#00687a",
  onSurface: "#dee5ff",
  onSurfaceVariant: "#a3aac4",
  outlineVariant: "#40485d",
}
 
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
    <div style={{ maxWidth: "800px", margin: "0 auto", fontFamily: "Inter, sans-serif" }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .nl-textarea:focus { border-color: ${s.primary} !important; box-shadow: 0 0 0 3px rgba(163,166,255,0.12) !important; outline: none; }
        .example-chip:hover { background: rgba(163,166,255,0.12) !important; color: ${s.primary} !important; border-color: rgba(163,166,255,0.4) !important; }
        .convert-btn:hover:not(:disabled) { transform: scale(1.01); box-shadow: 0 8px 24px rgba(163,166,255,0.25) !important; }
        .copy-btn:hover { color: ${s.onSurface} !important; }
      `}</style>
 
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "24px" }}>
        <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: `${s.primary}20`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Wand2 color={s.primary} size={18} />
        </div>
        <h2 style={{ fontFamily: "Manrope, sans-serif", color: s.onSurface, fontSize: "20px", fontWeight: 700, margin: 0 }}>Natural Language → SQL</h2>
      </div>
 
      {/* Input Card */}
      <div style={{ backgroundColor: s.surfaceContainer, border: `1px solid rgba(64,72,93,0.2)`, borderRadius: "12px", padding: "20px", marginBottom: "16px" }}>
        <textarea
          className="nl-textarea"
          style={{
            width: "100%", backgroundColor: "#000000",
            border: `1px solid rgba(64,72,93,0.3)`,
            borderRadius: "8px", padding: "14px 16px", color: s.onSurface,
            fontSize: "14px", minHeight: "90px", resize: "vertical",
            fontFamily: "Inter, sans-serif", transition: "all 0.2s", boxSizing: "border-box",
            lineHeight: 1.6
          }}
          placeholder="Ask in plain English... e.g. Show me all orders from last month"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
 
        {/* Example chips */}
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", margin: "14px 0" }}>
          {EXAMPLES.map(ex => (
            <button
              key={ex}
              className="example-chip"
              onClick={() => { setQuestion(ex); convert(ex) }}
              style={{
                fontSize: "12px", backgroundColor: `${s.primary}10`,
                color: s.onSurfaceVariant,
                border: `1px solid rgba(163,166,255,0.2)`,
                borderRadius: "999px", padding: "5px 14px",
                cursor: "pointer", fontFamily: "Inter, sans-serif",
                transition: "all 0.2s"
              }}
            >
              {ex}
            </button>
          ))}
        </div>
 
        <button
          className="convert-btn"
          onClick={() => convert()}
          disabled={loading || !question.trim()}
          style={{
            width: "100%",
            background: `linear-gradient(135deg, ${s.primary}, ${s.primaryContainer})`,
            color: "#060e20", fontWeight: 700, padding: "13px",
            borderRadius: "8px", border: "none",
            cursor: loading || !question.trim() ? "not-allowed" : "pointer",
            fontSize: "14px", display: "flex", alignItems: "center",
            justifyContent: "center", gap: "8px",
            fontFamily: "Inter, sans-serif", transition: "all 0.2s",
            opacity: !question.trim() && !loading ? 0.6 : 1,
            boxShadow: "0 4px 16px rgba(163,166,255,0.2)"
          }}
        >
          {loading ? (
            <>
              <div style={{ width: "16px", height: "16px", border: "2px solid rgba(6,14,32,0.3)", borderTopColor: "#060e20", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
              Converting...
            </>
          ) : (
            <>
              <Play size={15} /> Generate SQL
            </>
          )}
        </button>
      </div>
 
      {/* Result */}
      {result && (
        <div style={{ backgroundColor: s.surfaceContainer, border: `1px solid rgba(64,72,93,0.2)`, borderRadius: "12px", padding: "20px", borderLeft: `3px solid ${s.secondary}` }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ color: "#4ade80", fontSize: "13px", fontWeight: 600 }}>✓ Confidence: {Math.round((result.confidence || 0.95) * 100)}%</span>
            </div>
            <button
              className="copy-btn"
              onClick={() => { navigator.clipboard.writeText(result.sql); toast.success("SQL copied!") }}
              style={{ background: "none", border: "none", color: s.onSurfaceVariant, cursor: "pointer", display: "flex", alignItems: "center", gap: "5px", fontSize: "12px", fontFamily: "Inter, sans-serif", transition: "color 0.2s", padding: "4px 8px", borderRadius: "6px" }}
            >
              <Copy size={13} /> Copy
            </button>
          </div>
 
          <pre style={{ backgroundColor: "#000000", borderRadius: "8px", padding: "16px", color: s.secondary, fontSize: "13px", overflowX: "auto", whiteSpace: "pre-wrap", margin: 0, fontFamily: "monospace", lineHeight: 1.6, border: `1px solid rgba(64,72,93,0.2)` }}>
            {result.sql}
          </pre>
 
          {result.explanation && (
            <p style={{ color: s.onSurfaceVariant, fontSize: "13px", marginTop: "14px", lineHeight: 1.6, margin: "14px 0 0" }}>{result.explanation}</p>
          )}
 
          {result.tables_used?.length > 0 && (
            <div style={{ display: "flex", gap: "8px", marginTop: "12px", flexWrap: "wrap" }}>
              <span style={{ color: s.onSurfaceVariant, fontSize: "12px", alignSelf: "center" }}>Tables:</span>
              {result.tables_used.map(t => (
                <span key={t} style={{ fontSize: "12px", backgroundColor: `${s.secondary}20`, color: s.secondary, padding: "3px 10px", borderRadius: "999px", fontWeight: 600, fontFamily: "monospace", border: `1px solid ${s.secondary}30` }}>{t}</span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}