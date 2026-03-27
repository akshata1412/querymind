import { useState } from "react"
import { convertNLSQL, executeQuery, executeCSVQuery } from "../api/client"
import { Wand2, Copy, Play, Download, Table } from "lucide-react"
import toast from "react-hot-toast"

const EXAMPLES = [
  "Show all rows",
  "Count total records",
  "Show top 10 rows",
  "Find all unique values",
]

export default function NLtoSQL({ schema, dbUrl }) {
  const [question, setQuestion] = useState("")
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [running, setRunning] = useState(false)
  const [queryResult, setQueryResult] = useState(null)

  const isCSV = dbUrl?.includes("csv_uploads")

  const convert = async (q = question) => {
    if (!q.trim()) return
    setLoading(true)
    setQueryResult(null)
    try {
      const { data } = await convertNLSQL(q, schema)
      setResult(data)
    } catch {
      toast.error("Conversion failed")
    }
    setLoading(false)
  }

  const runQuery = async () => {
    if (!result?.sql) return
    setRunning(true)
    try {
      const fn = isCSV ? executeCSVQuery : executeQuery
      const { data } = await fn(result.sql, dbUrl)
      setQueryResult(data)
      toast.success(`${data.count} rows returned`)
    } catch (e) {
      toast.error(e.response?.data?.detail || "Query failed")
    }
    setRunning(false)
  }

  const downloadCSV = () => {
    if (!queryResult?.rows?.length) return
    const headers = Object.keys(queryResult.rows[0])
    const csv = [
      headers.join(","),
      ...queryResult.rows.map(row =>
        headers.map(h => `"${row[h] ?? ""}"`).join(",")
      )
    ].join("\n")
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "query_result.csv"
    a.click()
    URL.revokeObjectURL(url)
    toast.success("Downloaded!")
  }

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto" }}>
      <h2 style={{ color: "white", fontSize: "22px", fontWeight: "bold", marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px" }}>
        <Wand2 color="#00B4D8" size={22} /> Natural Language → SQL
        {isCSV && <span style={{ fontSize: "13px", backgroundColor: "#00687a", color: "#53ddfc", padding: "2px 10px", borderRadius: "20px", fontWeight: "normal" }}>CSV Mode</span>}
      </h2>

      {/* Input */}
      <div style={{ backgroundColor: "#1B2D42", border: "1px solid #00B4D8", borderRadius: "12px", padding: "20px", marginBottom: "16px" }}>
        <textarea
          style={{ width: "100%", backgroundColor: "#0D1B2A", border: "1px solid #00B4D8", borderRadius: "8px", padding: "12px", color: "white", fontSize: "14px", minHeight: "80px", outline: "none", resize: "vertical", fontFamily: "Courier New" }}
          placeholder="Ask in plain English... e.g. Show me all rows"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", margin: "12px 0" }}>
          {EXAMPLES.map(ex => (
            <button key={ex} onClick={() => { setQuestion(ex); convert(ex) }}
              style={{ fontSize: "12px", backgroundColor: "#162236", color: "#00B4D8", border: "1px solid #00B4D8", borderRadius: "20px", padding: "4px 12px", cursor: "pointer" }}>
              {ex}
            </button>
          ))}
        </div>
        <button onClick={() => convert()} disabled={loading}
          style={{ width: "100%", backgroundColor: "#00B4D8", color: "#0D1B2A", fontWeight: "bold", padding: "12px", borderRadius: "8px", border: "none", cursor: "pointer", fontSize: "15px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
          <Play size={16} />
          {loading ? "Converting..." : "Generate SQL"}
        </button>
      </div>

      {/* Generated SQL */}
      {result && (
        <div style={{ backgroundColor: "#1B2D42", border: "1px solid #00B4D8", borderRadius: "12px", padding: "20px", marginBottom: "16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
            <span style={{ color: "#4ade80", fontSize: "14px" }}>✓ Confidence: {Math.round((result.confidence || 0.95) * 100)}%</span>
            <button onClick={() => { navigator.clipboard.writeText(result.sql); toast.success("Copied!") }}
              style={{ background: "none", border: "none", color: "#9ca3af", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", fontSize: "13px" }}>
              <Copy size={14} /> Copy SQL
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
          <button onClick={runQuery} disabled={running}
            style={{ marginTop: "16px", width: "100%", backgroundColor: "#4ade80", color: "#0D1B2A", fontWeight: "bold", padding: "12px", borderRadius: "8px", border: "none", cursor: "pointer", fontSize: "15px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
            <Table size={16} />
            {running ? "Running..." : "▶ Run Query & See Results"}
          </button>
        </div>
      )}

      {/* Results Table */}
      {queryResult && (
        <div style={{ backgroundColor: "#1B2D42", border: "1px solid #4ade80", borderRadius: "12px", overflow: "hidden" }}>
          <div style={{ padding: "12px 16px", borderBottom: "1px solid #4ade80", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ color: "#4ade80", fontWeight: "bold", fontSize: "14px" }}>✓ {queryResult.count} rows returned</span>
            <button onClick={downloadCSV}
              style={{ backgroundColor: "#4ade80", color: "#0D1B2A", border: "none", borderRadius: "8px", padding: "6px 14px", cursor: "pointer", fontWeight: "bold", fontSize: "13px", display: "flex", alignItems: "center", gap: "6px" }}>
              <Download size={14} /> Download CSV
            </button>
          </div>
          {queryResult.rows?.length > 0 ? (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
                <thead>
                  <tr style={{ backgroundColor: "#162236" }}>
                    {Object.keys(queryResult.rows[0]).map(col => (
                      <th key={col} style={{ padding: "10px 14px", textAlign: "left", color: "#00B4D8", fontFamily: "monospace", borderBottom: "1px solid #00B4D8", whiteSpace: "nowrap" }}>{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {queryResult.rows.map((row, i) => (
                    <tr key={i} style={{ borderBottom: "1px solid #1B2D42", backgroundColor: i % 2 === 0 ? "#0D1B2A" : "#162236" }}>
                      {Object.values(row).map((val, j) => (
                        <td key={j} style={{ padding: "9px 14px", color: "#d1d5db", fontFamily: "monospace" }}>
                          {val ?? <span style={{ color: "#6b7280" }}>NULL</span>}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{ padding: "24px", textAlign: "center", color: "#6b7280" }}>No rows returned</div>
          )}
        </div>
      )}
    </div>
  )
}