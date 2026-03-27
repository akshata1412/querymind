import { useEffect, useState } from "react"
import { getPIIReport } from "../api/client"
import { Shield, AlertTriangle, CheckCircle } from "lucide-react"

export default function PIIReport({ schema }) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getPIIReport(schema).then(r => {
      setData(r.data)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  if (loading) return (
    <div style={{ color: "#00B4D8", textAlign: "center", paddingTop: "80px", fontSize: "18px" }}>
      ⏳ Scanning for PII...
    </div>
  )

  const riskColor = { HIGH: "#ef4444", MEDIUM: "#F4A261", LOW: "#4ade80" }

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto" }}>
      <h2 style={{ color: "white", fontSize: "22px", fontWeight: "bold", marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px" }}>
        <Shield color="#00B4D8" size={22} /> PII / Compliance Report
      </h2>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "20px" }}>
        <div style={{ backgroundColor: "#1B2D42", border: `1px solid ${riskColor[data?.risk_level] || "#00B4D8"}`, borderRadius: "12px", padding: "20px", textAlign: "center" }}>
          <div style={{ fontSize: "32px", fontWeight: "bold", color: riskColor[data?.risk_level] || "#00B4D8" }}>{data?.risk_level}</div>
          <div style={{ color: "#9ca3af", fontSize: "13px" }}>Overall Risk</div>
        </div>
        <div style={{ backgroundColor: "#1B2D42", border: "1px solid #00B4D8", borderRadius: "12px", padding: "20px", textAlign: "center" }}>
          <div style={{ fontSize: "32px", fontWeight: "bold", color: "#00B4D8" }}>{data?.pii_fields?.length || 0}</div>
          <div style={{ color: "#9ca3af", fontSize: "13px" }}>PII Fields Found</div>
        </div>
        <div style={{ backgroundColor: "#1B2D42", border: "1px solid #00B4D8", borderRadius: "12px", padding: "20px", textAlign: "center" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", justifyContent: "center" }}>
            {data?.compliance_flags?.map(f => (
              <span key={f} style={{ fontSize: "12px", backgroundColor: "#ef4444", color: "white", padding: "2px 8px", borderRadius: "20px" }}>{f}</span>
            ))}
          </div>
          <div style={{ color: "#9ca3af", fontSize: "13px", marginTop: "4px" }}>Compliance Flags</div>
        </div>
      </div>

      <div style={{ backgroundColor: "#1B2D42", border: "1px solid #00B4D8", borderRadius: "12px", overflow: "hidden" }}>
        <div style={{ padding: "12px 16px", borderBottom: "1px solid #00B4D8", color: "white", fontWeight: "bold", display: "flex", alignItems: "center", gap: "8px" }}>
          <Shield size={16} color="#00B4D8" /> PII Fields Detected
        </div>
        {data?.pii_fields?.map((field, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 16px", borderBottom: "1px solid #162236", fontSize: "13px" }}>
            <span style={{ backgroundColor: riskColor[field.risk], color: "white", fontSize: "11px", padding: "2px 8px", borderRadius: "4px", fontWeight: "bold", flexShrink: 0 }}>{field.risk}</span>
            <span style={{ fontFamily: "monospace", color: "#00B4D8" }}>{field.table}.{field.column}</span>
            <span style={{ color: "#9ca3af" }}>{field.pii_type}</span>
            <span style={{ color: "#6b7280", marginLeft: "auto", fontSize: "12px" }}>{field.recommendation}</span>
          </div>
        ))}
      </div>

      {data?.summary && (
        <div style={{ marginTop: "16px", backgroundColor: "#1B2D42", border: "1px solid #F4A261", borderRadius: "12px", padding: "16px", color: "#F4A261", fontSize: "14px" }}>
          📋 {data.summary}
        </div>
      )}
    </div>
  )
}