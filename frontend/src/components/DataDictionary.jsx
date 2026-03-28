import { useEffect, useState } from "react"
import { getDictionary } from "../api/client"
import { BookOpen, ChevronDown, ChevronRight, Search, Filter, Sparkles } from "lucide-react"

export default function DataDictionary({ schema }) {
  const [dict, setDict] = useState(null)
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState({})
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    getDictionary(schema).then(r => {
      setDict(r.data)
      setLoading(false)
      // Auto-expand first table
      const firstTable = Object.keys(schema)[0]
      if (firstTable) setExpanded({ [firstTable]: true })
    }).catch(() => setLoading(false))
  }, [])

  const toggle = (t) => setExpanded(prev => ({ ...prev, [t]: !prev[t] }))

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
      <p style={{ color: 'var(--on-surface-variant)', fontSize: '14px' }}>Generating Data Dictionary...</p>
    </div>
  )

  const filteredTables = Object.entries(schema).filter(([tableName]) => 
    tableName.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="animate-fade-in">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold mb-1" style={{ color: 'var(--on-surface)' }}>
            Data Dictionary
          </h1>
          <p className="text-sm" style={{ color: 'var(--on-surface-variant)' }}>
            Comprehensive schema documentation with AI-generated descriptions
          </p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--on-surface-dim)' }} />
            <input
              type="text"
              placeholder="Search tables..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 text-sm rounded-lg w-64 focus:outline-none"
              style={{ 
                backgroundColor: 'var(--surface-container)',
                color: 'var(--on-surface)',
                border: '1px solid rgba(64, 72, 93, 0.15)'
              }}
            />
          </div>
          <button 
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-[var(--surface-container-high)]"
            style={{ backgroundColor: 'var(--surface-container)', color: 'var(--on-surface-variant)' }}
          >
            <Filter className="w-4 h-4" />
            Filter
          </button>
        </div>
      </div>

      {/* AI Summary */}
      {dict?.database_summary && (
        <div 
          className="rounded-xl p-4 mb-6 flex items-start gap-3 cyan-aura"
          style={{ 
            backgroundColor: 'var(--surface-container)',
            borderLeft: '3px solid var(--secondary)'
          }}
        >
          <Sparkles className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: 'var(--secondary)' }} />
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--secondary)' }}>
              AI Database Summary
            </p>
            <p className="text-sm" style={{ color: 'var(--on-surface-variant)' }}>
              {dict.database_summary}
            </p>
          </div>
        </div>
      )}

      {/* Stats Row */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Tables", value: Object.keys(schema).length },
          { label: "Total Columns", value: Object.values(schema).reduce((acc, t) => acc + (t.columns?.length || 0), 0) },
          { label: "Primary Keys", value: Object.values(schema).reduce((acc, t) => acc + (t.primary_keys?.length || 0), 0) },
          { label: "Foreign Keys", value: Object.values(schema).reduce((acc, t) => acc + (t.foreign_keys?.length || 0), 0) }
        ].map((stat, i) => (
          <div 
            key={i}
            className="rounded-xl p-4"
            style={{ backgroundColor: 'var(--surface-container)' }}
          >
            <p className="text-2xl font-display font-bold mb-1" style={{ color: 'var(--on-surface)' }}>
              {stat.value}
            </p>
            <p className="text-xs" style={{ color: 'var(--on-surface-variant)' }}>
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* Tables List */}
      <div className="space-y-3">
        {filteredTables.map(([tableName, tableData]) => (
          <div 
            key={tableName} 
            className="rounded-xl overflow-hidden transition-all"
            style={{ backgroundColor: 'var(--surface-container)' }}
          >
            {/* Table Header */}
            <button
              onClick={() => toggle(tableName)}
              className="w-full flex items-center gap-3 px-5 py-4 transition-colors hover:bg-[var(--surface-container-high)]"
            >
              <div 
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: expanded[tableName] ? 'var(--secondary-container)' : 'var(--surface-container-high)' }}
              >
                {expanded[tableName] 
                  ? <ChevronDown className="w-4 h-4" style={{ color: 'var(--secondary)' }} />
                  : <ChevronRight className="w-4 h-4" style={{ color: 'var(--on-surface-dim)' }} />
                }
              </div>
              <span className="font-mono font-semibold text-sm" style={{ color: 'var(--primary)' }}>
                {tableName}
              </span>
              {dict?.tables?.[tableName]?.description && (
                <span className="text-sm" style={{ color: 'var(--on-surface-variant)' }}>
                  — {dict.tables[tableName].description}
                </span>
              )}
              <div className="ml-auto flex items-center gap-2">
                <span 
                  className="px-2 py-0.5 rounded-full text-xs"
                  style={{ backgroundColor: 'var(--surface-container-high)', color: 'var(--on-surface-variant)' }}
                >
                  {tableData.columns?.length || 0} columns
                </span>
                {tableData.primary_keys?.length > 0 && (
                  <span 
                    className="px-2 py-0.5 rounded-full text-xs font-medium"
                    style={{ backgroundColor: 'rgba(251, 191, 36, 0.1)', color: '#fbbf24' }}
                  >
                    {tableData.primary_keys.length} PK
                  </span>
                )}
                {tableData.foreign_keys?.length > 0 && (
                  <span 
                    className="px-2 py-0.5 rounded-full text-xs font-medium"
                    style={{ backgroundColor: 'rgba(74, 222, 128, 0.1)', color: '#4ade80' }}
                  >
                    {tableData.foreign_keys.length} FK
                  </span>
                )}
              </div>
            </button>

            {/* Expanded Content */}
            {expanded[tableName] && (
              <div style={{ borderTop: '1px solid rgba(64, 72, 93, 0.15)' }}>
                {/* Business Purpose */}
                {dict?.tables?.[tableName]?.business_purpose && (
                  <div 
                    className="px-5 py-3 flex items-center gap-2 text-xs"
                    style={{ backgroundColor: 'var(--surface-container-low)', color: 'var(--warning)' }}
                  >
                    <BookOpen className="w-4 h-4" />
                    {dict.tables[tableName].business_purpose}
                  </div>
                )}

                {/* Column Headers */}
                <div 
                  className="grid grid-cols-12 gap-4 px-5 py-2 text-xs font-semibold uppercase tracking-wider"
                  style={{ color: 'var(--on-surface-dim)' }}
                >
                  <span className="col-span-3">Column</span>
                  <span className="col-span-2">Type</span>
                  <span className="col-span-1">Keys</span>
                  <span className="col-span-6">Description</span>
                </div>

                {/* Columns */}
                {tableData.columns?.map((col, i) => (
                  <div
                    key={col.name}
                    className="grid grid-cols-12 gap-4 px-5 py-3 items-center transition-colors hover:bg-[var(--surface-container-high)]"
                    style={{ 
                      borderBottom: i < tableData.columns.length - 1 ? '1px solid rgba(64, 72, 93, 0.1)' : 'none'
                    }}
                  >
                    <span className="col-span-3 font-mono text-sm" style={{ color: 'var(--on-surface)' }}>
                      {col.name}
                    </span>
                    <span className="col-span-2 font-mono text-xs" style={{ color: 'var(--on-surface-variant)' }}>
                      {col.type}
                    </span>
                    <div className="col-span-1 flex gap-1">
                      {tableData.primary_keys?.includes(col.name) && (
                        <span 
                          className="px-1.5 py-0.5 rounded text-[10px] font-bold"
                          style={{ backgroundColor: 'rgba(251, 191, 36, 0.1)', color: '#fbbf24' }}
                        >
                          PK
                        </span>
                      )}
                      {tableData.foreign_keys?.some(fk => fk.column === col.name) && (
                        <span 
                          className="px-1.5 py-0.5 rounded text-[10px] font-bold"
                          style={{ backgroundColor: 'rgba(74, 222, 128, 0.1)', color: '#4ade80' }}
                        >
                          FK
                        </span>
                      )}
                    </div>
                    <span className="col-span-6 text-sm" style={{ color: 'var(--on-surface-variant)' }}>
                      {dict?.tables?.[tableName]?.columns?.[col.name] || "—"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredTables.length === 0 && (
        <div 
          className="rounded-xl p-12 text-center"
          style={{ backgroundColor: 'var(--surface-container)' }}
        >
          <p style={{ color: 'var(--on-surface-dim)' }}>No tables found matching your search.</p>
        </div>
      )}
    </div>
  )
}
