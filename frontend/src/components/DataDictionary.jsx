import { useEffect, useState } from "react"
import { getDictionary } from "../api/client"
import { BookOpen, ChevronDown, ChevronRight } from "lucide-react"

export default function DataDictionary({ schema }) {
  const [dict, setDict] = useState(null)
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState({})

  useEffect(() => {
    getDictionary(schema).then(r => {
      setDict(r.data)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const toggle = (t) => setExpanded(prev => ({ ...prev, [t]: !prev[t] }))

  if (loading) return (
    <div style={{ color: "#00B4D8", textAlign: "center", paddingTop: "80px", fontSize: "18px" }}>
      ⏳ Generating Data Dictionary...
    </div>
  )

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto" }}>
      <h2 style={{ color: "white", fontSize: "22px", fontWeight: "bold", marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px" }}>
        <BookOpen color="#00B4D8" size={22} /> Data Dictionary
      </h2>

      {dict?.database_summary && (
        <div style={{ backgroundColor: "#162236", border: "1px solid #F4A261", borderRadius: "10px", padding: "12px 16px", color: "#F4A261", marginBottom: "16px", fontSize: "14px" }}>
          📋 {dict.database_summary}
        </div>
      )}

      {Object.entries(schema).map(([tableName, tableData]) => (
        <div key={tableName} style={{ backgroundColor: "#1B2D42", border: "1px solid #00B4D8", borderRadius: "10px", marginBottom: "12px", overflow: "hidden" }}>
          <button
            onClick={() => toggle(tableName)}
            style={{ width: "100%", padding: "14px 16px", display: "flex", alignItems: "center", gap: "10px", background: "none", border: "none", cursor: "pointer", color: "white" }}
          >
            {expanded[tableName] ? <ChevronDown size={16} color="#00B4D8" /> : <ChevronRight size={16} color="#00B4D8" />}
            <span style={{ fontFamily: "monospace", fontWeight: "bold", color: "#00B4D8", fontSize: "15px" }}>{tableName}</span>
            <span style={{ color: "#9ca3af", fontSize: "13px", marginLeft: "8px" }}>— {dict?.tables?.[tableName]?.description || "Table"}</span>
            <span style={{ marginLeft: "auto", color: "#6b7280", fontSize: "12px" }}>{tableData.columns.length} cols</span>
          </button>

          {expanded[tableName] && (
            <div style={{ borderTop: "1px solid #00B4D8" }}>
              {dict?.tables?.[tableName]?.business_purpose && (
                <div style={{ padding: "8px 16px", backgroundColor: "#162236", color: "#F4A261", fontSize: "12px", fontStyle: "italic" }}>
                  💼 {dict.tables[tableName].business_purpose}
                </div>
              )}
              {tableData.columns.map(col => (
                <div key={col.name} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "10px 16px", borderBottom: "1px solid #1B2D42" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", width: "180px", flexShrink: 0 }}>
                    {tableData.primary_keys?.includes(col.name) && <span style={{ color: "#fbbf24", fontSize: "11px", fontWeight: "bold" }}>PK</span>}
                    {tableData.foreign_keys?.some(fk => fk.column === col.name) && <span style={{ color: "#4ade80", fontSize: "11px", fontWeight: "bold" }}>FK</span>}
                    <span style={{ fontFamily: "monospace", color: "white", fontSize: "13px" }}>{col.name}</span>
                  </div>
                  <span style={{ color: "#6b7280", fontSize: "12px", width: "120px" }}>{col.type}</span>
                  <span style={{ color: "#d1d5db", fontSize: "13px" }}>{dict?.tables?.[tableName]?.columns?.[col.name] || ""}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}