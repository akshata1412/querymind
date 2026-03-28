import { Database, BookOpen, GitFork, MessageSquare, Code2, Activity, Shield, Zap } from "lucide-react"
import clsx from "clsx"

const NAV_ITEMS = [
  { id: "dictionary", label: "Data Dictionary", icon: BookOpen },
  { id: "er", label: "ER Diagram", icon: GitFork },
  { id: "chat", label: "AI Chat", icon: MessageSquare },
  { id: "nlsql", label: "NL to SQL", icon: Code2 },
  { id: "health", label: "Health Score", icon: Activity },
  { id: "pii", label: "Compliance", icon: Shield },
]

export default function Sidebar({ activeTab, onTabChange, tableCount }) {
  return (
    <aside 
      className="flex flex-col w-60 h-full"
      style={{ backgroundColor: 'var(--surface-container-low)' }}
    >
      {/* Workspace Header */}
      <div className="px-4 py-5">
        <div className="flex items-center gap-3">
          <div 
            className="flex items-center justify-center w-10 h-10 rounded-lg"
            style={{ backgroundColor: 'var(--secondary-container)' }}
          >
            <Database className="w-5 h-5" style={{ color: 'var(--secondary)' }} />
          </div>
          <div>
            <h2 className="font-display text-sm font-semibold" style={{ color: 'var(--on-surface)' }}>
              Main Workspace
            </h2>
            <p className="text-xs" style={{ color: 'var(--on-surface-variant)' }}>
              PRODUCTION DB
            </p>
          </div>
        </div>
      </div>

      {/* Analyze Schema Button */}
      <div className="px-4 mb-4">
        <button 
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all hover:opacity-90"
          style={{ 
            background: 'linear-gradient(135deg, var(--secondary) 0%, #00b4d8 100%)',
            color: 'var(--surface)'
          }}
        >
          Analyze Schema
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onTabChange(id)}
            className={clsx(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 relative",
              activeTab === id
                ? "text-[var(--secondary)]"
                : "text-[var(--on-surface-variant)] hover:text-[var(--on-surface)] hover:bg-[var(--surface-container)]"
            )}
            style={activeTab === id ? { 
              backgroundColor: 'var(--surface-container)',
            } : {}}
          >
            {activeTab === id && (
              <div 
                className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r"
                style={{ backgroundColor: 'var(--secondary)' }}
              />
            )}
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </nav>

      {/* System Load Indicator */}
      <div className="px-4 py-4 mt-auto">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--on-surface-dim)' }}>
            System Load
          </span>
        </div>
        <div className="progress-bar h-1.5">
          <div 
            className="progress-fill"
            style={{ 
              width: '35%', 
              backgroundColor: 'var(--secondary)',
              boxShadow: '0 0 8px var(--secondary)'
            }}
          />
        </div>
      </div>
    </aside>
  )
}
