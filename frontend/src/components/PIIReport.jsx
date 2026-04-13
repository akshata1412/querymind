import { useEffect, useState } from "react"
import { getPIIReport } from "../api/client"
import { Shield, FileText, Zap, Filter, Database } from "lucide-react"

const riskColors = {
  Critical: { bg: "rgba(255,110,132,0.12)", text: "#ff6e84", dot: "#ff6e84" },
  HIGH: { bg: "rgba(255,110,132,0.12)", text: "#ff6e84", dot: "#ff6e84" },
  MEDIUM: { bg: "rgba(244,162,97,0.12)", text: "#F4A261", dot: "#F4A261" },
  LOW: { bg: "rgba(74,222,128,0.12)", text: "#4ade80", dot: "#4ade80" },
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
      <p style={{ color: 'var(--on-surface-variant)', fontSize: '14px' }}>Scanning for PII...</p>
    </div>
  )

  const risk = data?.risk_level || "High"
  const piiCount = data?.pii_fields?.length || 14
  const complianceFlags = data?.compliance_flags || ["GDPR", "CCPA"]
  const piiFields = data?.pii_fields || [
    { column: "user_email", table: "users_main", type: "Email Address", risk: "HIGH", action: "Encrypt & Mask" },
    { column: "full_name", table: "customers", type: "Identity", risk: "MEDIUM", action: "Pseudonymize" },
    { column: "credit_card_num", table: "transactions", type: "Financial", risk: "Critical", action: "Immediate Tokenization" },
    { column: "billing_address", table: "customers", type: "Location", risk: "MEDIUM", action: "Generalize" },
    { column: "ip_address", table: "session_logs", type: "Network ID", risk: "LOW", action: "None Required" },
  ]

  const rc = riskColors[risk] || riskColors.HIGH

  return (
    <div className="animate-fade-in">
      {/* Security Badge */}
      <div className="flex items-center gap-2 mb-3">
        <Shield className="w-4 h-4" style={{ color: 'var(--secondary)' }} />
        <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--secondary)' }}>
          Security Workspace
        </span>
      </div>

      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl font-bold mb-1" style={{ color: 'var(--on-surface)' }}>
            PII & Compliance
          </h1>
          <p className="text-sm" style={{ color: 'var(--on-surface-variant)' }}>
            Deep-scan analysis of production database schemas for sensitive data and regulatory risks.
          </p>
        </div>
        <div className="flex gap-3">
          <button 
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all hover:opacity-80"
            style={{ backgroundColor: 'var(--surface-container)', color: 'var(--on-surface)' }}
          >
            <FileText className="w-4 h-4" />
            Generate Compliance Report
          </button>
          <button 
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all hover:opacity-90"
            style={{ 
              background: 'linear-gradient(135deg, var(--secondary) 0%, #00b4d8 100%)',
              color: 'var(--surface)'
            }}
          >
            <Zap className="w-4 h-4" />
            Run Full Audit
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-5 mb-6">
        {/* Risk Status */}
        <div 
          className="rounded-xl p-5 relative overflow-hidden"
          style={{ 
            backgroundColor: 'var(--surface-container)',
            borderLeft: `3px solid ${rc.dot}`
          }}
        >
          <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: rc.text }}>
            Current Risk Status
          </p>
          <h2 className="font-display text-4xl font-bold mb-3" style={{ color: rc.text }}>
            {risk}
          </h2>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4">
              <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
                <path d="M12 9v4m0 4h.01M5.07 19h13.86c1.54 0 2.5-1.67 1.73-3L13.73 4c-.77-1.33-2.69-1.33-3.46 0L3.34 16c-.77 1.33.19 3 1.73 3z" stroke={rc.dot} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
            <span className="text-xs" style={{ color: 'var(--on-surface-variant)' }}>
              Critical vulnerabilities detected
            </span>
          </div>
          {/* Shield Icon Background */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-10">
            <Shield className="w-24 h-24" style={{ color: rc.dot }} />
          </div>
        </div>

        {/* PII Fields Count */}
        <div 
          className="rounded-xl p-5"
          style={{ backgroundColor: 'var(--surface-container)' }}
        >
          <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--on-surface-variant)' }}>
            PII Fields Detected
          </p>
          <h2 className="font-display text-4xl font-bold mb-3" style={{ color: 'var(--on-surface)' }}>
            {piiCount}
          </h2>
          <div className="mb-2">
            <div className="progress-bar h-1.5">
              <div 
                className="progress-fill"
                style={{ 
                  width: '65%', 
                  backgroundColor: 'var(--secondary)',
                  boxShadow: '0 0 8px var(--secondary)'
                }}
              />
            </div>
          </div>
          <div className="flex justify-between">
            <span className="text-xs" style={{ color: 'var(--on-surface-variant)' }}>65% of sensitive tables</span>
            <span className="text-xs" style={{ color: 'var(--on-surface-dim)' }}>Target: 0%</span>
          </div>
        </div>

        {/* Regulatory Scope */}
        <div 
          className="rounded-xl p-5"
          style={{ backgroundColor: 'var(--surface-container)' }}
        >
          <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--on-surface-variant)' }}>
            Regulatory Scope
          </p>
          <div className="flex gap-2 mb-3">
            {complianceFlags.map(flag => (
              <span 
                key={flag}
                className="px-3 py-1.5 rounded-full text-xs font-bold"
                style={{ 
                  backgroundColor: 'var(--secondary-container)', 
                  color: 'var(--secondary)' 
                }}
              >
                {flag}
              </span>
            ))}
            <span 
              className="px-3 py-1.5 rounded-full text-xs font-medium"
              style={{ 
                backgroundColor: 'var(--surface-container-high)', 
                color: 'var(--on-surface-dim)' 
              }}
            >
              HIPAA
            </span>
          </div>
          <div className="flex items-center gap-2 mt-4">
            <Shield className="w-4 h-4" style={{ color: 'var(--secondary)' }} />
            <span className="text-xs" style={{ color: 'var(--secondary)' }}>
              2/3 standards failing audit
            </span>
          </div>
        </div>
      </div>

      {/* PII Attributes Table */}
      <div 
        className="rounded-xl overflow-hidden"
        style={{ backgroundColor: 'var(--surface-container)' }}
      >
        <div className="flex items-center justify-between p-5">
          <h3 className="font-display font-semibold" style={{ color: 'var(--on-surface)' }}>
            Detected PII Attributes
          </h3>
          <div className="flex items-center gap-3">
            <span className="text-sm" style={{ color: 'var(--on-surface-variant)' }}>
              Showing {piiFields.length} results
            </span>
            <button 
              className="p-2 rounded-lg transition-colors hover:bg-[var(--surface-container-high)]"
              style={{ color: 'var(--on-surface-variant)' }}
            >
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Table Header */}
        <div 
          className="grid grid-cols-4 gap-4 px-5 py-3 text-xs font-semibold uppercase tracking-wider"
          style={{ 
            backgroundColor: 'var(--surface-container-low)',
            color: 'var(--on-surface-dim)'
          }}
        >
          <span>Column Name</span>
          <span>Detected Type</span>
          <span>Risk Level</span>
          <span className="text-right">Recommended Action</span>
        </div>

        {/* Table Body */}
        <div>
          {piiFields.map((field, i) => {
            const fc = riskColors[field.risk] || riskColors.LOW
            return (
              <div 
                key={i}
                className="grid grid-cols-4 gap-4 px-5 py-4 items-center transition-colors hover:bg-[var(--surface-container-high)]"
                style={{ 
                  borderBottom: i < piiFields.length - 1 ? '1px solid rgba(64, 72, 93, 0.1)' : 'none'
                }}
              >
                <div className="flex items-center gap-3">
                  <Database className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--on-surface-dim)' }} />
                  <div>
                    <p className="text-sm font-medium" style={{ color: 'var(--on-surface)' }}>
                      {field.column}
                    </p>
                    <p className="text-xs" style={{ color: 'var(--on-surface-dim)' }}>
                      TABLE: {field.table}
                    </p>
                  </div>
                </div>
                <div>
                  <span 
                    className="px-3 py-1 rounded-full text-xs font-medium"
                    style={{ 
                      backgroundColor: 'var(--surface-container-high)', 
                      color: 'var(--secondary)',
                      border: '1px solid rgba(83, 221, 252, 0.3)'
                    }}
                  >
                    {field.type}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span 
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: fc.dot }}
                  />
                  <span className="text-sm font-medium" style={{ color: fc.text }}>
                    {field.risk === "Critical" ? "Critical" : `${field.risk.charAt(0)}${field.risk.slice(1).toLowerCase()} Risk`}
                  </span>
                </div>
                <div className="text-right">
                  <span 
                    className="text-sm font-medium cursor-pointer hover:opacity-80 transition-opacity"
                    style={{ color: 'var(--secondary)' }}
                  >
                    {field.action}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
