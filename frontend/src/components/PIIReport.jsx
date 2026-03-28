
import { useEffect, useState } from "react"
import { getPIIReport } from "../api/client"
import { Shield } from "lucide-react"
 
const s = {
  surface: "#060e20",
  surfaceContainerLow: "#091328",
  surfaceContainer: "#0f1930",
  surfaceContainerHigh: "#141f38",
  primary: "#a3a6ff",
  secondary: "#53ddfc",
  onSurface: "#dee5ff",
  onSurfaceVariant: "#a3aac4",
  outlineVariant: "#40485d",
  gold: "#F4A261",
  error: "#ff6e84",
}
 
const riskColors = {
  HIGH: { bg: "rgba(255,110,132,0.12)", text: "#ff6e84", border: "rgba(255,110,132,0.3)" },
  MEDIUM: { bg: "rgba(244,162,97,0.12)", text: "#F4A261", border: "rgba(244,162,97,0.3)" },
  LOW: { bg: "rgba(74,222,128,0.12)", text: "#4ade80", border: "rgba(74,222,128,0.3)" },
}
 
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
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", paddingTop: "80px", gap: "20px" }}>
      <div style={{ position: "relative", width: "48px", height: "48px" }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: `2px solid rgba(163,166,255,0.2)` }} />
        <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: `2px solid transparent`, borderTopColor: s.primary, animation: "spin 0.8s linear infinite" }} />
      </div>
      <p style={{ color: s.onSurfaceVariant, fontSize: "14px" }}>Scanning for PII...</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
 
  const risk = data?.risk_level || "LOW"
  const rc = riskColors[risk] || riskColors.LOW
 
  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", fontFamily: "Inter, sans-serif" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "24px" }}>
        <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: `${s.primary}20`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Shield color={s.primary} size={18} />
        </div>
        <h2 style={{ fontFamily: "Manrope, sans-serif", color: s.onSurface, fontSize: "20px", fontWeight: 700, margin: 0 }}>PII / Compliance Report</h2>
      </div>
 
      {/* Stats Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "14px", marginBottom: "20px" }}>
        {/* Risk Level */}
        <div style={{ backgroundColor: s.surfaceContainer, border: `1px solid ${rc.border}`, borderRadius: "12px", padding: "20px", textAlign: "center", boxShadow: `0 0 20px ${rc.bg}` }}>
          <div style={{ fontSize: "28px", fontWeight: 800, color: rc.text, fontFamily: "Manrope, sans-serif" }}>{risk}</div>
          <div style={{ color: s.onSurfaceVariant, fontSize: "12px", marginTop: "4px", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600 }}>Overall Risk</div>
        </div>
 
        {/* PII Count */}
        <div style={{ backgroundColor: s.surfaceContainer, border: `1px solid rgba(64,72,93,0.2)`, borderRadius: "12px", padding: "20px", textAlign: "center" }}>
          <div style={{ fontSize: "28px", fontWeight: 800, color: s.secondary, fontFamily: "Manrope, sans-serif" }}>{data?.pii_fields?.length || 0}</div>
          <div style={{ color: s.onSurfaceVariant, fontSize: "12px", marginTop: "4px", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600 }}>PII Fields</div>
        </div>
 
        {/* Compliance Flags */}
        <div style={{ backgroundColor: s.surfaceContainer, border: `1px solid rgba(64,72,93,0.2)`, borderRadius: "12px", padding: "20px", textAlign: "center" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", justifyContent: "center", marginBottom: "6px" }}>
            {data?.compliance_flags?.map(f => (
              <span key={f} style={{ fontSize: "11px", backgroundColor: "rgba(255,110,132,0.15)", color: s.error, padding: "3px 8px", borderRadius: "999px", fontWeight: 700, border: "1px solid rgba(255,110,132,0.25)" }}>{f}</span>
            ))}
          </div>
          <div style={{ color: s.onSurfaceVariant, fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600 }}>Compliance</div>
        </div>
      </div>
 
      {/* PII Fields Table */}
      <div style={{ backgroundColor: s.surfaceContainer, border: `1px solid rgba(64,72,93,0.2)`, borderRadius: "12px", overflow: "hidden", marginBottom: "16px" }}>
        <div style={{ padding: "12px 16px", borderBottom: `1px solid rgba(64,72,93,0.2)`, color: s.onSurface, fontWeight: 600, fontSize: "14px", display: "flex", alignItems: "center", gap: "8px", backgroundColor: s.surfaceContainerLow }}>
          <Shield size={15} color={s.primary} /> PII Fields Detected
          <span style={{ marginLeft: "auto", color: s.onSurfaceVariant, fontSize: "12px", fontWeight: 400 }}>{data?.pii_fields?.length || 0} found</span>
        </div>
        {data?.pii_fields?.length === 0 && (
          <div style={{ padding: "32px", textAlign: "center", color: s.onSurfaceVariant, fontSize: "14px" }}>
            <div style={{ fontSize: "32px", marginBottom: "8px" }}>✅</div>
            No PII fields detected
          </div>
        )}
        {data?.pii_fields?.map((field, i) => {
          const fc = riskColors[field.risk] || riskColors.LOW
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: "14px", padding: "12px 16px", borderBottom: i < data.pii_fields.length - 1 ? `1px solid rgba(64,72,93,0.1)` : "none", fontSize: "13px", transition: "background 0.15s" }}>
              <span style={{ backgroundColor: fc.bg, color: fc.text, fontSize: "10px", padding: "3px 8px", borderRadius: "4px", fontWeight: 700, flexShrink: 0, border: `1px solid ${fc.border}`, textTransform: "uppercase" }}>{field.risk}</span>
              <span style={{ fontFamily: "monospace", color: s.secondary, fontWeight: 600 }}>{field.table}<span style={{ color: s.onSurfaceVariant }}>.</span>{field.column}</span>
              <span style={{ color: s.onSurfaceVariant, backgroundColor: s.surfaceContainerHigh, padding: "2px 8px", borderRadius: "999px", fontSize: "11px" }}>{field.pii_type}</span>
              <span style={{ color: s.onSurfaceVariant, marginLeft: "auto", fontSize: "12px", textAlign: "right", maxWidth: "200px" }}>{field.recommendation}</span>
            </div>
          )
        })}
      </div>
 
      {/* Summary */}
      {data?.summary && (
        <div style={{ backgroundColor: s.surfaceContainer, border: `1px solid rgba(64,72,93,0.2)`, borderRadius: "12px", padding: "16px", borderLeft: `3px solid ${s.gold}`, display: "flex", gap: "10px", alignItems: "flex-start" }}>
          <span style={{ color: s.gold, flexShrink: 0 }}>📋</span>
          <p style={{ color: s.onSurfaceVariant, fontSize: "14px", margin: 0, lineHeight: 1.6 }}>{data.summary}</p>
        </div>
      )}
    </div>
  )
}