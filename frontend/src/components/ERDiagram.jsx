import { useEffect, useState } from "react"
import { getERDiagram } from "../api/client"
import { Network } from "lucide-react"

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
      ⏳ Generating ER Diagram...
    </div>
  )

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
      <h2 style={{ color: "white", fontSize: "22px", fontWeight: "bold", marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px" }}>
        <Network color="#00B4D8" size={22} /> ER Diagram
      </h2>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "16px" }}>
        {data?.nodes?.map(node => (
          <div
            key={node.id}
            onClick={() => setSelected(selected === node.id ? null : node.id)}
            style={{ backgroundColor: "#1B2D42", border: `2px solid ${selected === node.id ? "#F4A261" : "#00B4D8"}`, borderRadius: "10px", overflow: "hidden", cursor: "pointer", transition: "all 0.2s" }}
          >
            <div style={{ backgroundColor: "#00B4D8", padding: "8px 12px" }}>
              <span style={{ fontWeight: "bold", color: "#0D1B2A", fontSize: "14px" }}>{node.data.label}</span>
            </div>
            <div style={{ padding: "8px" }}>
              {node.data.columns?.map(col => (
                <div key={col.name} style={{ display: "flex", alignItems: "center", gap: "6px", padding: "3px 4px", fontSize: "12px" }}>
                  {node.data.primary_keys?.includes(col.name) && <span style={{ color: "#fbbf24", fontWeight: "bold", fontSize: "10px" }}>PK</span>}
                  {node.data.foreign_keys?.some(fk => fk.column === col.name) && <span style={{ color: "#4ade80", fontWeight: "bold", fontSize: "10px" }}>FK</span>}
                  {!node.data.primary_keys?.includes(col.name) && !node.data.foreign_keys?.some(fk => fk.column === col.name) && <span style={{ width: "16px" }} />}
                  <span style={{ color: "white", fontFamily: "monospace" }}>{col.name}</span>
                  <span style={{ color: "#6b7280", marginLeft: "auto" }}>{col.type}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {data?.edges?.length > 0 && (
        <div style={{ marginTop: "24px", backgroundColor: "#1B2D42", border: "1px solid #00B4D8", borderRadius: "10px", padding: "16px" }}>
          <h3 style={{ color: "#00B4D8", marginBottom: "12px", fontSize: "15px" }}>🔗 Relationships</h3>
          {data.edges.map(edge => (
            <div key={edge.id} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "6px 0", borderBottom: "1px solid #162236", fontSize: "13px" }}>
              <span style={{ color: "#fbbf24", fontFamily: "monospace" }}>{edge.source}</span>
              <span style={{ color: "#00B4D8" }}>→</span>
              <span style={{ color: "#4ade80", fontFamily: "monospace" }}>{edge.target}</span>
              <span style={{ color: "#6b7280", marginLeft: "auto" }}>{edge.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}