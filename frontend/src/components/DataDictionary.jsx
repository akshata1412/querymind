
import { useEffect, useState } from "react"
import { getDictionary } from "../api/client"
import { BookOpen, ChevronDown, ChevronRight } from "lucide-react"
 
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
  gold: "#F4A261",
}
 
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
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", paddingTop: "80px", gap: "20px" }}>
      <div style={{ position: "relative", width: "48px", height: "48px" }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: `2px solid rgba(163,166,255,0.2)` }} />
        <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: `2px solid transparent`, borderTopColor: s.primary, animation: "spin 0.8s linear infinite" }} />
      </div>
      <p style={{ color: s.onSurfaceVariant, fontSize: "14px", fontWeight: 500 }}>Generating Data Dictionary...</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
 
  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", fontFamily: "Inter, sans-serif" }}>
      <style>{`
        .dict-row:hover { background: ${s.surfaceContainerHigh} !important; }
        .table-toggle:hover { background: rgba(163,166,255,0.06) !important; }
      `}</style>
 
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "24px" }}>
        <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: `${s.primary}20`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <BookOpen color={s.primary} size={18} />
        </div>
        <h2 style={{ fontFamily: "Manrope, sans-serif", color: s.onSurface, fontSize: "20px", fontWeight: 700, margin: 0 }}>Data Dictionary</h2>
      </div>
 
      {dict?.database_summary && (
        <div style={{ backgroundColor: s.surfaceContainer, borderLeft: `3px solid ${s.secondary}`, borderRadius: "0 8px 8px 0", padding: "12px 16px", color: s.onSurfaceVariant, marginBottom: "20px", fontSize: "14px", display: "flex", gap: "10px", alignItems: "flex-start" }}>
          <span style={{ color: s.secondary, flexShrink: 0 }}>✦</span>
          <span>{dict.database_summary}</span>
        </div>
      )}
 
      {Object.entries(schema).map(([tableName, tableData]) => (
        <div key={tableName} style={{ backgroundColor: s.surfaceContainer, borderRadius: "10px", marginBottom: "10px", overflow: "hidden", border: `1px solid rgba(64,72,93,0.2)`, transition: "border-color 0.2s" }}>
          <button
            className="table-toggle"
            onClick={() => toggle(tableName)}
            style={{ width: "100%", padding: "14px 16px", display: "flex", alignItems: "center", gap: "10px", background: "none", border: "none", cursor: "pointer", color: "white", transition: "background 0.2s" }}
          >
            {expanded[tableName]
              ? <ChevronDown size={16} color={s.primary} />
              : <ChevronRight size={16} color={s.primary} />}
            <span style={{ fontFamily: "monospace", fontWeight: 700, color: s.primary, fontSize: "14px" }}>{tableName}</span>
            {dict?.tables?.[tableName]?.description && (
              <span style={{ color: s.onSurfaceVariant, fontSize: "13px" }}>— {dict.tables[tableName].description}</span>
            )}
            <span style={{ marginLeft: "auto", color: s.onSurfaceVariant, fontSize: "11px", backgroundColor: s.surfaceContainerHigh, padding: "2px 8px", borderRadius: "999px" }}>
              {tableData.columns.length} cols
            </span>
          </button>
 
          {expanded[tableName] && (
            <div style={{ borderTop: `1px solid rgba(64,72,93,0.2)` }}>
              {dict?.tables?.[tableName]?.business_purpose && (
                <div style={{ padding: "8px 16px", backgroundColor: s.surfaceContainerLow, color: s.gold, fontSize: "12px", fontStyle: "italic", display: "flex", gap: "8px" }}>
                  <span>💼</span> {dict.tables[tableName].business_purpose}
                </div>
              )}
              {tableData.columns.map((col, i) => (
                <div
                  key={col.name}
                  className="dict-row"
                  style={{ display: "flex", alignItems: "center", gap: "12px", padding: "10px 16px", borderBottom: i < tableData.columns.length - 1 ? `1px solid rgba(64,72,93,0.1)` : "none", transition: "background 0.15s" }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", width: "200px", flexShrink: 0 }}>
                    {tableData.primary_keys?.includes(col.name) && (
                      <span style={{ color: "#fbbf24", fontSize: "10px", fontWeight: 700, backgroundColor: "rgba(251,191,36,0.1)", padding: "1px 6px", borderRadius: "4px" }}>PK</span>
                    )}
                    {tableData.foreign_keys?.some(fk => fk.column === col.name) && (
                      <span style={{ color: "#4ade80", fontSize: "10px", fontWeight: 700, backgroundColor: "rgba(74,222,128,0.1)", padding: "1px 6px", borderRadius: "4px" }}>FK</span>
                    )}
                    <span style={{ fontFamily: "monospace", color: s.onSurface, fontSize: "13px" }}>{col.name}</span>
                  </div>
                  <span style={{ color: s.onSurfaceVariant, fontSize: "12px", width: "120px", flexShrink: 0, fontFamily: "monospace" }}>{col.type}</span>
                  <span style={{ color: s.onSurfaceVariant, fontSize: "13px", flex: 1 }}>{dict?.tables?.[tableName]?.columns?.[col.name] || ""}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}