import { useEffect, useState } from "react"
import { getHealthScore } from "../api/client"
import { Heart } from "lucide-react"

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
    <div style={{ color: "#00B4D8", textAlign: "center", paddingTop: "80px", fontSize: "18px" }}>
      ⏳ Analyzing Schema Health...
    </div>
  )

  const gradeColor = data?.grade?.startsWith("A") ? "#4ade80" : data?.grade?.startsWith("B") ? "#00B4D8" : "#fbbf24"

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto" }}>
      <h2 style={{ color: "white", fontSize: "22px", fontWeight: "bold", marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px" }}>
        <Heart color="#00B4D8" size={22} /> Health Score
      </h2>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "16px", marginBottom: "20px" }}>
        <div style={{ backgroundColor: "#1B2D42", border: "1px solid #00B4D8", borderRadius: "12px", padding: "24px", textAlign: "center" }}>
          <div style={{ fontSize: "64px", fontWeight: "bold", color: gradeColor }}>{data?.grade}</div>
          <div style={{ fontSize: "40px", fontWeight: "bold", color: "white" }}>{data?.overall_score}</div>
          <div style={{ color: "#9ca3af", fontSize: "14px" }}>Overall Score</div>
        </div>

        <div style={{ backgroundColor: "#1B2D42", border: "1px solid #00B4D8", borderRadius: "12px", padding: "20px" }}>
          <h3 style={{ color: "#00B4D8", marginBottom: "12px", fontSize: "15px" }}>Category Breakdown</h3>
          {data?.categories && Object.entries(data.categories).map(([key, val]) => (
            <div key={key} style={{ marginBottom: "10px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                <span style={{ color: "#d1d5db", fontSize: "13px", textTransform: "capitalize" }}>{key.replace(/_/g, " ")}</span>
                <span style={{ color: "#00B4D8", fontSize: "13px", fontWeight: "bold" }}>{val.score}</span>
              </div>
              <div style={{ backgroundColor: "#0D1B2A", borderRadius: "4px", height: "6px" }}>
                <div style={{ backgroundColor: val.score >= 80 ? "#4ade80" : val.score >= 60 ? "#00B4D8" : "#fbbf24", width: `${val.score}%`, height: "100%", borderRadius: "4px" }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {data?.critical_issues?.length > 0 && (
        <div style={{ backgroundColor: "#1B2D42", border: "1px solid #ef4444", borderRadius: "12px", padding: "16px", marginBottom: "16px" }}>
          <h3 style={{ color: "#ef4444", marginBottom: "10px", fontSize: "15px" }}>⚠ Critical Issues</h3>
          {data.critical_issues.map((issue, i) => (
            <div key={i} style={{ color: "#fca5a5", fontSize: "13px", padding: "4px 0" }}>• {issue}</div>
          ))}
        </div>
      )}

      {data?.recommendations?.length > 0 && (
        <div style={{ backgroundColor: "#1B2D42", border: "1px solid #00B4D8", borderRadius: "12px", padding: "16px" }}>
          <h3 style={{ color: "#00B4D8", marginBottom: "10px", fontSize: "15px" }}>💡 Recommendations</h3>
          {data.recommendations.map((rec, i) => (
            <div key={i} style={{ color: "#d1d5db", fontSize: "13px", padding: "4px 0", display: "flex", gap: "8px" }}>
              <span style={{ color: "#00B4D8" }}>›</span> {rec}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}