import { Database, BookOpen, Network, MessageSquare, Code2, Heart, Shield, Settings, HelpCircle } from "lucide-react"
import clsx from "clsx"

const NAV_ITEMS = [
  { id: "dictionary", label: "Data Dictionary", icon: BookOpen },
  { id: "er", label: "ER Diagram", icon: Network },
  { id: "chat", label: "AI Chat", icon: MessageSquare },
  { id: "nlsql", label: "NL to SQL", icon: Code2 },
  { id: "health", label: "Health Score", icon: Heart },
  { id: "pii", label: "PII / Compliance", icon: Shield },
]

const BOTTOM_ITEMS = [
  { id: "settings", label: "Settings", icon: Settings },
  { id: "help", label: "Help", icon: HelpCircle },
]

export default function Sidebar({ activeTab, onTabChange, tableCount }) {
  return (
    <aside className="flex flex-col w-64 h-full bg-card border-r border-border">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-border">
        <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-primary/80">
          <Database className="w-4 h-4 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-base font-semibold text-foreground">QueryMind</h1>
          <p className="text-xs text-muted-foreground">Database Intelligence</p>
        </div>
      </div>

      {/* Stats Badge */}
      <div className="px-4 py-4">
        <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-secondary/10 border border-secondary/20">
          <span className="text-xs font-medium text-muted-foreground">Connected Tables</span>
          <span className="text-sm font-bold text-secondary">{tableCount}</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
        <p className="px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          Navigation
        </p>
        {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onTabChange(id)}
            className={clsx(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
              activeTab === id
                ? "bg-primary/10 text-primary border-l-2 border-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </nav>

      {/* Bottom Items */}
      <div className="px-3 py-4 border-t border-border space-y-1">
        {BOTTOM_ITEMS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-all duration-200"
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>
    </aside>
  )
}
