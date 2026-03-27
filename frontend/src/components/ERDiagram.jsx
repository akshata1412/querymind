
import { useEffect, useState } from "react"
import { getERDiagram } from "../api/client"
import { Network } from "lucide-react"
 
const s = {
  surface: "#060e20",
  surfaceContainerLow: "#091328",
  surfaceContainer: "#0f1930",
  surfaceContainerHigh: "#141f38",
  primary: "#a3a6ff",
  primaryContainer: "#9396ff",
  secondary: "#53ddfc",
  onSurface: "#dee5ff",
  onSurfaceVariant: "#a3aac4",
  outlineVariant: "#40485d",
  gold: "#F4A261",
}
 
export default function ERDiagram({ schema }) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)
 
  useEffect(() => {
    getERDiagram(schema).then(r => {
      setData(r.data)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])
 
  if (loading) return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", paddingTop: "80px", gap: "20px" }}>
      <div style={{ position: "relative", width: "48px", height: "48px" }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: `2px solid rgba(163,166,255,0.2)` }} />
        <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: `2px solid transparent`, borderTopColor: s.primary, animation: "spin 0.8s linear infinite" }} />
      </div>
      <p style={{ color: s.onSurfaceVariant, fontSize: "14px" }}>Generating ER Diagram...</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
 
  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", fontFamily: "Inter, sans-serif" }}>
      <style>{`.er-card:hover { border-color: ${s.gold} !important; transform: translateY(-2px); }`}</style>
 
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "24px" }}>
        <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: `${s.primary}20`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Network color={s.primary} size={18} />
        </div>
        <h2 style={{ fontFamily: "Manrope, sans-serif", color: s.onSurface, fontSize: "20px", fontWeight: 700, margin: 0 }}>ER Diagram</h2>
      </div>
 
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "14px", marginBottom: "24px" }}>
        {data?.nodes?.map(node => (
          <div
            key={node.id}
            className="er-card"
            onClick={() => setSelected(selected === node.id ? null : node.id)}
            style={{
              backgroundColor: s.surfaceContainer,
              border: `1px solid ${selected === node.id ? s.gold : "rgba(64,72,93,0.3)"}`,
              borderRadius: "10px", overflow: "hidden", cursor: "pointer",
              transition: "all 0.2s",
              boxShadow: selected === node.id ? `0 0 20px rgba(244,162,97,0.15)` : "none"
            }}
          >
            <div style={{ background: `linear-gradient(135deg, ${s.primary}30, ${s.primaryContainer}20)`, padding: "10px 14px", borderBottom: `1px solid rgba(163,166,255,0.2)` }}>
              <span style={{ fontWeight: 700, color: s.primary, fontSize: "13px", fontFamily: "monospace" }}>{node.data.label}</span>
            </div>
            <div style={{ padding: "8px 6px" }}>
              {node.data.columns?.map(col => (
                <div key={col.name} style={{ display: "flex", alignItems: "center", gap: "6px", padding: "4px 8px", fontSize: "12px", borderRadius: "4px" }}>
                  {node.data.primary_keys?.includes(col.name) && <span style={{ color: "#fbbf24", fontWeight: 700, fontSize: "9px", backgroundColor: "rgba(251,191,36,0.1)", padding: "1px 4px", borderRadius: "3px" }}>PK</span>}
                  {node.data.foreign_keys?.some(fk => fk.column === col.name) && <span style={{ color: "#4ade80", fontWeight: 700, fontSize: "9px", backgroundColor: "rgba(74,222,128,0.1)", padding: "1px 4px", borderRadius: "3px" }}>FK</span>}
                  {!node.data.primary_keys?.includes(col.name) && !node.data.foreign_keys?.some(fk => fk.column === col.name) && <span style={{ width: "20px" }} />}
                  <span style={{ color: s.onSurface, fontFamily: "monospace", flex: 1 }}>{col.name}</span>
                  <span style={{ color: s.onSurfaceVariant }}>{col.type}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
 
      {data?.edges?.length > 0 && (
        <div style={{ backgroundColor: s.surfaceContainer, border: `1px solid rgba(64,72,93,0.2)`, borderRadius: "10px", padding: "16px", borderLeft: `3px solid ${s.secondary}` }}>
          <h3 style={{ color: s.secondary, marginBottom: "14px", fontSize: "14px", fontWeight: 600, display: "flex", alignItems: "center", gap: "8px" }}>
            <span>🔗</span> Relationships
          </h3>
          {data.edges.map(edge => (
            <div key={edge.id} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px 0", borderBottom: `1px solid rgba(64,72,93,0.1)`, fontSize: "13px" }}>
              <span style={{ color: "#fbbf24", fontFamily: "monospace", fontWeight: 600 }}>{edge.source}</span>
              <span style={{ color: s.secondary }}>→</span>
              <span style={{ color: "#4ade80", fontFamily: "monospace", fontWeight: 600 }}>{edge.target}</span>
              <span style={{ color: s.onSurfaceVariant, marginLeft: "auto", fontSize: "12px", fontFamily: "monospace" }}>{edge.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}