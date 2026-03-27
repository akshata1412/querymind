import { useEffect, useState } from "react"
import { getERDiagram } from "../api/client"
import { Network, RefreshCw } from "lucide-react"

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
    <div style={{ color: "#00B4D8", textAlign: "center", paddingTop: "80px", fontSize: "18px" }}>
      Generating ER Diagram...
    </div>
  )

  const tables = data?.nodes || []
  const edges = data?.edges || []

  // Build a map of which tables are connected
  const connections = {}
  edges.forEach(edge => {
    if (!connections[edge.source]) connections[edge.source] = []
    if (!connections[edge.target]) connections[edge.target] = []
    connections[edge.source].push({ table: edge.target, via: edge.label, direction: "out" })
    connections[edge.target].push({ table: edge.source, via: edge.label, direction: "in" })
  })

  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
      <h2 style={{ color: "white", fontSize: "22px", fontWeight: "bold", marginBottom: "8px", display: "flex", alignItems: "center", gap: "8px" }}>
        <Network color="#00B4D8" size={22} /> ER Diagram
      </h2>
      <p style={{ color: "#9ca3af", fontSize: "13px", marginBottom: "20px" }}>
        Click any table to highlight its relationships
      </p>

      {/* Table Cards Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "16px", marginBottom: "24px" }}>
        {tables.map(node => {
          const isSelected = selected === node.id
          const isConnected = selected && connections[selected]?.some(c => c.table === node.id)
          const isDimmed = selected && !isSelected && !isConnected

          return (
            <div
              key={node.id}
              onClick={() => setSelected(isSelected ? null : node.id)}
              style={{
                backgroundColor: "#1B2D42",
                border: `2px solid ${isSelected ? "#F4A261" : isConnected ? "#4ade80" : "#00B4D8"}`,
                borderRadius: "12px", overflow: "hidden", cursor: "pointer",
                opacity: isDimmed ? 0.35 : 1,
                transform: isSelected ? "scale(1.02)" : "scale(1)",
                transition: "all 0.2s",
                boxShadow: isSelected ? "0 0 20px rgba(244,162,97,0.3)" : isConnected ? "0 0 16px rgba(74,222,128,0.2)" : "none"
              }}
            >
              {/* Table Header */}
              <div style={{
                backgroundColor: isSelected ? "#F4A261" : isConnected ? "#4ade80" : "#00B4D8",
                padding: "10px 14px", display: "flex", justifyContent: "space-between", alignItems: "center"
              }}>
                <span style={{ fontWeight: "bold", color: "#0D1B2A", fontSize: "14px" }}>{node.data.label}</span>
                <span style={{ fontSize: "11px", color: "#0D1B2A", opacity: 0.7 }}>
                  {node.data.columns?.length} cols
                </span>
              </div>

              {/* Columns */}
              <div style={{ padding: "8px 0" }}>
                {node.data.columns?.map(col => {
                  const isPK = node.data.primary_keys?.includes(col.name)
                  const isFK = node.data.foreign_keys?.some(fk => fk.column === col.name)
                  return (
                    <div key={col.name} style={{
                      display: "flex", alignItems: "center", gap: "6px",
                      padding: "5px 14px",
                      backgroundColor: isPK ? "rgba(251,191,36,0.08)" : isFK ? "rgba(74,222,128,0.08)" : "transparent",
                      borderLeft: isPK ? "3px solid #fbbf24" : isFK ? "3px solid #4ade80" : "3px solid transparent"
                    }}>
                      <div style={{ display: "flex", gap: "4px", width: "36px", flexShrink: 0 }}>
                        {isPK && <span style={{ color: "#fbbf24", fontSize: "10px", fontWeight: "bold", backgroundColor: "rgba(251,191,36,0.15)", padding: "1px 4px", borderRadius: "3px" }}>PK</span>}
                        {isFK && <span style={{ color: "#4ade80", fontSize: "10px", fontWeight: "bold", backgroundColor: "rgba(74,222,128,0.15)", padding: "1px 4px", borderRadius: "3px" }}>FK</span>}
                      </div>
                      <span style={{ color: "white", fontFamily: "monospace", fontSize: "12px", flex: 1 }}>{col.name}</span>
                      <span style={{ color: "#6b7280", fontSize: "11px" }}>{col.type}</span>
                    </div>
                  )
                })}
              </div>

              {/* Connection hint */}
              {isConnected && connections[selected]?.filter(c => c.table === node.id).map((c, i) => (
                <div key={i} style={{ padding: "6px 14px", backgroundColor: "rgba(74,222,128,0.1)", borderTop: "1px solid rgba(74,222,128,0.2)", fontSize: "11px", color: "#4ade80" }}>
                  {c.direction === "out" ? "→" : "←"} {c.via}
                </div>
              ))}
            </div>
          )
        })}
      </div>

      {/* Relationships Panel */}
      {edges.length > 0 && (
        <div style={{ backgroundColor: "#1B2D42", border: "1px solid #00B4D8", borderRadius: "12px", overflow: "hidden" }}>
          <div style={{ padding: "12px 16px", borderBottom: "1px solid #00B4D8", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3 style={{ color: "#00B4D8", margin: 0, fontSize: "15px", fontWeight: "bold" }}>
              🔗 All Relationships ({edges.length})
            </h3>
            {selected && (
              <button onClick={() => setSelected(null)}
                style={{ background: "none", border: "1px solid #6b7280", color: "#9ca3af", borderRadius: "6px", padding: "4px 10px", cursor: "pointer", fontSize: "12px", display: "flex", alignItems: "center", gap: "4px" }}>
                <RefreshCw size={12} /> Clear Selection
              </button>
            )}
          </div>
          {edges
            .filter(edge => !selected || edge.source === selected || edge.target === selected)
            .map(edge => (
              <div key={edge.id} style={{
                display: "flex", alignItems: "center", gap: "12px",
                padding: "12px 16px", borderBottom: "1px solid #162236", fontSize: "13px",
                backgroundColor: (edge.source === selected || edge.target === selected) ? "rgba(74,222,128,0.05)" : "transparent"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", flex: 1 }}>
                  <span style={{
                    color: "#fbbf24", fontFamily: "monospace", fontWeight: "bold",
                    backgroundColor: "rgba(251,191,36,0.1)", padding: "3px 8px", borderRadius: "6px"
                  }}>{edge.source}</span>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2px" }}>
                    <span style={{ color: "#00B4D8", fontSize: "18px" }}>→</span>
                    <span style={{ color: "#6b7280", fontSize: "10px", whiteSpace: "nowrap" }}>{edge.label}</span>
                  </div>
                  <span style={{
                    color: "#4ade80", fontFamily: "monospace", fontWeight: "bold",
                    backgroundColor: "rgba(74,222,128,0.1)", padding: "3px 8px", borderRadius: "6px"
                  }}>{edge.target}</span>
                </div>
                <span style={{
                  fontSize: "11px", color: "#9ca3af",
                  backgroundColor: "#162236", padding: "2px 8px", borderRadius: "20px"
                }}>FK</span>
              </div>
            ))}
          {selected && edges.filter(e => e.source === selected || e.target === selected).length === 0 && (
            <div style={{ padding: "16px", textAlign: "center", color: "#6b7280", fontSize: "13px" }}>
              No relationships for this table
            </div>
          )}
        </div>
      )}

      {edges.length === 0 && (
        <div style={{ backgroundColor: "#1B2D42", border: "1px solid #F4A261", borderRadius: "12px", padding: "20px", textAlign: "center", color: "#F4A261" }}>
          ⚠ No foreign key relationships found. Add foreign keys to your schema to see connections.
        </div>
      )}
    </div>
  )
}