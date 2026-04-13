import { Search, Bell, Layers, GitCompare, LogOut } from "lucide-react"

export default function Navbar({ dbUrl, onDisconnect, activeTab }) {
  const dbName = dbUrl ? (dbUrl.split("/").pop() || dbUrl.split("@").pop() || "Database") : "prod_v4_core"

  return (
    <header 
      className="flex items-center justify-between h-14 px-6"
      style={{ backgroundColor: 'var(--surface)' }}
    >
      {/* Left: Logo + Search */}
      <div className="flex items-center gap-6">
        <h1 className="font-display text-lg font-bold" style={{ color: 'var(--on-surface)' }}>
          QueryMind
        </h1>
        
        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--on-surface-dim)' }} />
          <input
            type="text"
            placeholder="Search schema or queries..."
            className="w-full h-9 pl-10 pr-4 text-sm rounded-lg transition-all focus:outline-none"
            style={{ 
              backgroundColor: 'var(--surface-container-low)',
              color: 'var(--on-surface)',
              border: '1px solid rgba(64, 72, 93, 0.15)'
            }}
          />
        </div>
      </div>

      {/* Center: Navigation Tabs (for Health Score page) */}
      {activeTab === 'health' && (
        <div className="flex items-center gap-1">
          {['Overview', 'Deep Analysis', 'History'].map((tab, i) => (
            <button
              key={tab}
              className="px-4 py-1.5 text-sm font-medium rounded-lg transition-colors"
              style={{
                color: i === 0 ? 'var(--on-surface)' : 'var(--on-surface-variant)',
                backgroundColor: i === 0 ? 'var(--surface-container)' : 'transparent'
              }}
            >
              {tab}
            </button>
          ))}
        </div>
      )}

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        {/* Icon buttons */}
        <button 
          className="p-2 rounded-lg transition-colors hover:bg-[var(--surface-container)]"
          style={{ color: 'var(--on-surface-variant)' }}
        >
          <Layers className="w-5 h-5" />
        </button>
        
        <button 
          className="p-2 rounded-lg transition-colors hover:bg-[var(--surface-container)]"
          style={{ color: 'var(--on-surface-variant)' }}
        >
          <GitCompare className="w-5 h-5" />
        </button>
        
        <button 
          className="relative p-2 rounded-lg transition-colors hover:bg-[var(--surface-container)]"
          style={{ color: 'var(--on-surface-variant)' }}
        >
          <Bell className="w-5 h-5" />
          <span 
            className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
            style={{ backgroundColor: 'var(--secondary)' }}
          />
        </button>

        {/* Profile */}
        <div className="flex items-center gap-2 ml-2">
          <div 
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
            style={{ 
              background: 'linear-gradient(135deg, var(--secondary) 0%, var(--primary) 100%)',
              color: 'var(--surface)'
            }}
          >
            Q
          </div>
        </div>
      </div>
    </header>
  )
}
