
import { useEffect, useState } from "react"
import { getHealthScore } from "../api/client"
import { Heart } from "lucide-react"
 
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
  error: "#ff6e84",
}
 
export default function HealthScore({ schema }) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
 
  useEffect(() => {
    getHealthScore(schema).then(r => {
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
      <p style={{ color: s.onSurfaceVariant, fontSize: "14px" }}>Analyzing Schema Health...</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
 
  const gradeColor = data?.grade?.startsWith("A") ? "#4ade80" : data?.grade?.startsWith("B") ? s.secondary : "#fbbf24"
  const scoreColor = (score) => score >= 80 ? "#4ade80" : score >= 60 ? s.secondary : "#fbbf24"
 
  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", fontFamily: "Inter, sans-serif" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "24px" }}>
        <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: `${s.primary}20`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Heart color={s.primary} size={18} />
        </div>
        <h2 style={{ fontFamily: "Manrope, sans-serif", color: s.onSurface, fontSize: "20px", fontWeight: 700, margin: 0 }}>Health Score</h2>
      </div>
 
      <div style={{ display: "grid", gridTemplateColumns: "180px 1fr", gap: "16px", marginBottom: "20px" }}>
        {/* Grade Card */}
        <div style={{
          backgroundColor: s.surfaceContainer,
          border: `1px solid rgba(64,72,93,0.2)`,
          borderRadius: "12px", padding: "24px",
          textAlign: "center", display: "flex",
          flexDirection: "column", alignItems: "center", justifyContent: "center",
          boxShadow: `0 0 30px ${gradeColor}15`
        }}>
          <div style={{ fontSize: "56px", fontWeight: 800, color: gradeColor, fontFamily: "Manrope, sans-serif", lineHeight: 1 }}>{data?.grade}</div>
          <div style={{ fontSize: "36px", fontWeight: 700, color: s.onSurface, fontFamily: "Manrope, sans-serif", margin: "8px 0 4px" }}>{data?.overall_score}</div>
          <div style={{ color: s.onSurfaceVariant, fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600 }}>Overall Score</div>
        </div>
 
        {/* Categories */}
        <div style={{ backgroundColor: s.surfaceContainer, border: `1px solid rgba(64,72,93,0.2)`, borderRadius: "12px", padding: "20px" }}>
          <h3 style={{ color: s.onSurfaceVariant, fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "16px", margin: "0 0 16px" }}>Category Breakdown</h3>
          {data?.categories && Object.entries(data.categories).map(([key, val]) => (
            <div key={key} style={{ marginBottom: "12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                <span style={{ color: s.onSurface, fontSize: "13px", textTransform: "capitalize" }}>{key.replace(/_/g, " ")}</span>
                <span style={{ color: scoreColor(val.score), fontSize: "13px", fontWeight: 700 }}>{val.score}</span>
              </div>
              <div style={{ backgroundColor: "#000000", borderRadius: "999px", height: "6px", overflow: "hidden" }}>
                <div style={{ backgroundColor: scoreColor(val.score), width: `${val.score}%`, height: "100%", borderRadius: "999px", transition: "width 0.8s ease-out", boxShadow: `0 0 8px ${scoreColor(val.score)}60` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
 
      {/* Critical Issues */}
      {data?.critical_issues?.length > 0 && (
        <div style={{ backgroundColor: s.surfaceContainer, border: `1px solid rgba(255,110,132,0.3)`, borderRadius: "12px", padding: "16px", marginBottom: "14px", borderLeft: `3px solid ${s.error}` }}>
          <h3 style={{ color: s.error, marginBottom: "12px", fontSize: "14px", fontWeight: 600, display: "flex", alignItems: "center", gap: "8px", margin: "0 0 12px" }}>
            ⚠ Critical Issues
          </h3>
          {data.critical_issues.map((issue, i) => (
            <div key={i} style={{ color: "#fca5a5", fontSize: "13px", padding: "5px 0", display: "flex", gap: "8px", borderBottom: i < data.critical_issues.length - 1 ? `1px solid rgba(255,110,132,0.1)` : "none" }}>
              <span style={{ color: s.error, flexShrink: 0 }}>•</span> {issue}
            </div>
          ))}
        </div>
      )}
 
      {/* Recommendations */}
      {data?.recommendations?.length > 0 && (
        <div style={{ backgroundColor: s.surfaceContainer, border: `1px solid rgba(64,72,93,0.2)`, borderRadius: "12px", padding: "16px", borderLeft: `3px solid ${s.secondary}` }}>
          <h3 style={{ color: s.secondary, marginBottom: "12px", fontSize: "14px", fontWeight: 600, display: "flex", alignItems: "center", gap: "8px", margin: "0 0 12px" }}>
            💡 Recommendations
          </h3>
          {data.recommendations.map((rec, i) => (
            <div key={i} style={{ color: s.onSurfaceVariant, fontSize: "13px", padding: "6px 0", display: "flex", gap: "10px", lineHeight: 1.5, borderBottom: i < data.recommendations.length - 1 ? `1px solid rgba(64,72,93,0.1)` : "none" }}>
              <span style={{ color: s.secondary, flexShrink: 0 }}>›</span> {rec}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}