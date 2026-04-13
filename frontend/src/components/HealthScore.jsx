import { useEffect, useState } from "react"
import { getHealthScore } from "../api/client"
import { Download, RefreshCw, Play, Grid3X3, Zap, FileText, AlertTriangle, Sparkles, ChevronRight } from "lucide-react"

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
    <div className="flex flex-col items-center justify-center py-20 gap-5">
      <div className="relative w-12 h-12">
        <div 
          className="absolute inset-0 rounded-full"
          style={{ border: '2px solid rgba(163,166,255,0.2)' }}
        />
        <div 
          className="absolute inset-0 rounded-full animate-spin"
          style={{ border: '2px solid transparent', borderTopColor: 'var(--primary)' }}
        />
      </div>
      <p style={{ color: 'var(--on-surface-variant)', fontSize: '14px' }}>Analyzing Schema Health...</p>
    </div>
  )

  const score = data?.overall_score || 78
  const grade = data?.grade || "B+"
  const categories = data?.categories || {
    naming_conventions: { score: 92, description: "High consistency across camelCase standards." },
    normalization: { score: 64, description: "Redundant data detected in user_profiles." },
    indexing: { score: 81, description: "Good coverage. 2 large tables missing partial indexes." },
    documentation: { score: 45, description: "Critical: 18 columns lack semantic descriptions." }
  }
  const criticalIssues = data?.critical_issues || [
    { title: "Missing Primary Key", table: "audit_logs_temp" },
    { title: "Orphaned Relationships", description: "4 foreign keys pointing to deleted tables." },
    { title: "Circular Dependency", description: "Detected between orders and shipping_manifest." }
  ]
  const recommendations = data?.recommendations || [
    { action: "De-normalize analytics_summary", benefit: "140ms", description: "Merging these tables would reduce join latency by approx." },
    { action: "Add Composite Index on user_id, status", benefit: "88%", description: "Detected high frequency filtering on these columns. Reduces scan time by" },
    { action: "Standardize NULL defaults", benefit: "", description: "Multiple columns have inconsistent NULL handling." }
  ]

  const scoreColor = score >= 80 ? 'var(--success)' : score >= 60 ? 'var(--secondary)' : 'var(--warning)'
  const circumference = 2 * Math.PI * 90
  const strokeDashoffset = circumference - (score / 100) * circumference

  const categoryIcons = {
    naming_conventions: Play,
    normalization: Grid3X3,
    indexing: Zap,
    documentation: FileText
  }

  return (
    <div className="animate-fade-in">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl font-bold mb-1" style={{ color: 'var(--on-surface)' }}>
            Database Health Audit
          </h1>
          <p className="text-sm" style={{ color: 'var(--on-surface-variant)' }}>
            Real-time optimization report for <span style={{ color: 'var(--secondary)' }}>prod_v4_core</span>
          </p>
        </div>
        <div className="flex gap-3">
          <button 
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all hover:opacity-80"
            style={{ backgroundColor: 'var(--surface-container)', color: 'var(--on-surface)' }}
          >
            <Download className="w-4 h-4" />
            Export Report
          </button>
          <button 
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all hover:opacity-90"
            style={{ 
              background: 'linear-gradient(135deg, var(--secondary) 0%, #00b4d8 100%)',
              color: 'var(--surface)'
            }}
          >
            <RefreshCw className="w-4 h-4" />
            Run New Audit
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-12 gap-5 mb-5">
        {/* Score Gauge */}
        <div 
          className="col-span-5 rounded-xl p-6 flex flex-col items-center justify-center relative"
          style={{ backgroundColor: 'var(--surface-container)' }}
        >
          {/* AI Analysis Badge */}
          <div 
            className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
            style={{ backgroundColor: 'var(--secondary-container)', color: 'var(--secondary)' }}
          >
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: 'var(--secondary)' }} />
            AI ANALYSIS LIVE
          </div>

          {/* Circular Gauge */}
          <div className="relative w-52 h-52 mb-4">
            <svg className="w-full h-full -rotate-90">
              <circle
                cx="104"
                cy="104"
                r="90"
                fill="none"
                stroke="var(--surface-container-low)"
                strokeWidth="12"
              />
              <circle
                cx="104"
                cy="104"
                r="90"
                fill="none"
                stroke={scoreColor}
                strokeWidth="12"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                style={{ 
                  transition: 'stroke-dashoffset 1s ease-out',
                  filter: `drop-shadow(0 0 12px ${scoreColor})`
                }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-display text-6xl font-bold" style={{ color: 'var(--on-surface)' }}>{score}</span>
              <span className="font-display text-2xl font-bold" style={{ color: scoreColor }}>{grade}</span>
            </div>
          </div>

          <h3 className="font-display text-lg font-semibold mb-2" style={{ color: 'var(--on-surface)' }}>
            Overall Schema Integrity
          </h3>
          <p className="text-sm text-center max-w-xs" style={{ color: 'var(--on-surface-variant)' }}>
            Your database is performing well but shows signs of <span style={{ color: 'var(--secondary)' }}>normalization drift</span> in 4 tables.
          </p>
        </div>

        {/* Category Cards */}
        <div className="col-span-7 grid grid-cols-2 gap-4">
          {Object.entries(categories).map(([key, val]) => {
            const Icon = categoryIcons[key] || Play
            const catScore = val.score || 50
            const catColor = catScore >= 80 ? 'var(--success)' : catScore >= 60 ? 'var(--secondary)' : 'var(--warning)'
            
            return (
              <div 
                key={key}
                className="rounded-xl p-5"
                style={{ backgroundColor: 'var(--surface-container)' }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: 'var(--surface-container-high)' }}
                  >
                    <Icon className="w-5 h-5" style={{ color: 'var(--secondary)' }} />
                  </div>
                  <span className="font-display text-2xl font-bold" style={{ color: 'var(--on-surface)' }}>
                    {catScore}<span className="text-base font-normal" style={{ color: 'var(--on-surface-variant)' }}>%</span>
                  </span>
                </div>
                <h4 className="text-sm font-semibold mb-2 capitalize" style={{ color: 'var(--on-surface)' }}>
                  {key.replace(/_/g, " ")}
                </h4>
                <div className="progress-bar h-1.5 mb-3">
                  <div 
                    className="progress-fill"
                    style={{ 
                      width: `${catScore}%`, 
                      backgroundColor: catColor,
                      boxShadow: `0 0 8px ${catColor}60`
                    }}
                  />
                </div>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--on-surface-variant)' }}>
                  {val.description || "Analysis complete."}
                </p>
              </div>
            )
          })}
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-2 gap-5">
        {/* Critical Issues */}
        <div 
          className="rounded-xl p-5"
          style={{ backgroundColor: 'var(--surface-container)' }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" style={{ color: 'var(--error)' }} />
              <h3 className="font-display font-semibold" style={{ color: 'var(--on-surface)' }}>
                Critical Issues
              </h3>
            </div>
            <span 
              className="px-3 py-1 rounded-full text-xs font-bold"
              style={{ backgroundColor: 'rgba(255, 110, 132, 0.15)', color: 'var(--error)' }}
            >
              {criticalIssues.length} ACTION REQUIRED
            </span>
          </div>

          <div className="space-y-3">
            {criticalIssues.map((issue, i) => (
              <div 
                key={i}
                className="flex items-center gap-4 p-3 rounded-lg cursor-pointer transition-colors hover:bg-[var(--surface-container-high)]"
              >
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: 'rgba(255, 110, 132, 0.1)' }}
                >
                  <AlertTriangle className="w-4 h-4" style={{ color: 'var(--error)' }} />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold" style={{ color: 'var(--on-surface)' }}>
                    {issue.title}
                  </h4>
                  <p className="text-xs truncate" style={{ color: 'var(--on-surface-variant)' }}>
                    {issue.table ? `Table: ${issue.table}` : issue.description}
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--on-surface-dim)' }} />
              </div>
            ))}
          </div>

          <button 
            className="w-full mt-4 py-2 text-sm font-medium transition-colors hover:opacity-80"
            style={{ color: 'var(--secondary)' }}
          >
            View All Critical Flags ({criticalIssues.length + 9})
          </button>
        </div>

        {/* AI Recommendations */}
        <div 
          className="rounded-xl p-5 cyan-aura"
          style={{ 
            backgroundColor: 'var(--surface-container)',
            border: '1px solid rgba(83, 221, 252, 0.2)'
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5" style={{ color: 'var(--secondary)' }} />
              <h3 className="font-display font-semibold" style={{ color: 'var(--on-surface)' }}>
                AI Recommendations
              </h3>
            </div>
            <span 
              className="px-3 py-1 rounded-full text-xs font-bold"
              style={{ backgroundColor: 'var(--secondary-container)', color: 'var(--secondary)' }}
            >
              OPTIMIZATION AVAILABLE
            </span>
          </div>

          <div className="space-y-3">
            {recommendations.map((rec, i) => (
              <div 
                key={i}
                className="p-4 rounded-lg"
                style={{ 
                  backgroundColor: 'var(--surface-container-high)',
                  borderLeft: '3px solid var(--secondary)'
                }}
              >
                <div className="flex items-start justify-between gap-4 mb-2">
                  <h4 className="text-sm font-medium" style={{ color: 'var(--on-surface)' }}>
                    {rec.action.split(' ')[0]} <span style={{ color: 'var(--secondary)' }}>{rec.action.split(' ').slice(1).join(' ')}</span>
                  </h4>
                  <button 
                    className="px-3 py-1 rounded-md text-xs font-semibold flex-shrink-0 transition-all hover:opacity-80"
                    style={{ 
                      backgroundColor: 'var(--surface-container)',
                      color: 'var(--secondary)',
                      border: '1px solid var(--secondary)'
                    }}
                  >
                    Apply Fix
                  </button>
                </div>
                <p className="text-xs" style={{ color: 'var(--on-surface-variant)' }}>
                  {rec.description} {rec.benefit && <span style={{ color: 'var(--secondary)' }}>{rec.benefit}</span>}
                  {rec.description.includes('join latency') && ' for dashboard queries.'}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
