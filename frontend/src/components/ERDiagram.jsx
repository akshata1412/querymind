import { useEffect, useState } from "react"
import { getERDiagram } from "../api/client"
import { Database, Zap, Link2, ZoomIn, ZoomOut, Maximize2, Download } from "lucide-react"

export default function ERDiagram({ schema }) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    getERDiagram(schema).then(r => {
      setData(r.data)
      setLoading(false)
      // Auto-select first table
      if (r.data?.nodes?.length > 0) {
        setSelected(r.data.nodes[1]?.id || r.data.nodes[0]?.id)
      }
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
      <p style={{ color: 'var(--on-surface-variant)', fontSize: '14px' }}>Generating ER Diagram...</p>
    </div>
  )

  const selectedNode = data?.nodes?.find(n => n.id === selected)
  const relationships = data?.edges?.filter(e => e.source === selected || e.target === selected) || []

  // Mock data for demo
  const mockNodes = data?.nodes || [
    { id: 'users', data: { label: 'Users', columns: [
      { name: 'id', type: 'uuid PK' },
      { name: 'email', type: 'varchar' },
      { name: 'full_name', type: 'varchar' },
      { name: 'created_at', type: 'timestamp' }
    ], primary_keys: ['id'], foreign_keys: [] }},
    { id: 'orders', data: { label: 'Orders', columns: [
      { name: 'id', type: 'uuid PK' },
      { name: 'user_id', type: 'uuid FK' },
      { name: 'total_amount', type: 'decimal' },
      { name: 'status', type: 'enum' }
    ], primary_keys: ['id'], foreign_keys: [{ column: 'user_id', references: 'users.id' }] }},
    { id: 'products', data: { label: 'Products', columns: [
      { name: 'id', type: 'uuid PK' },
      { name: 'sku', type: 'varchar' },
      { name: 'price', type: 'numeric' }
    ], primary_keys: ['id'], foreign_keys: [] }}
  ]

  return (
    <div className="animate-fade-in flex gap-5 h-[calc(100vh-140px)]">
      {/* Main Canvas Area */}
      <div className="flex-1 relative rounded-xl overflow-hidden" style={{ backgroundColor: 'var(--surface-container-low)' }}>
        {/* Zoom Controls */}
        <div className="absolute left-4 bottom-4 flex flex-col gap-2 z-10">
          <button 
            className="w-10 h-10 rounded-lg flex items-center justify-center transition-colors hover:bg-[var(--surface-container-high)]"
            style={{ backgroundColor: 'var(--surface-container)', color: 'var(--on-surface-variant)' }}
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button 
            className="w-10 h-10 rounded-lg flex items-center justify-center transition-colors hover:bg-[var(--surface-container-high)]"
            style={{ backgroundColor: 'var(--surface-container)', color: 'var(--on-surface-variant)' }}
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button 
            className="w-10 h-10 rounded-lg flex items-center justify-center transition-colors hover:bg-[var(--surface-container-high)]"
            style={{ backgroundColor: 'var(--surface-container)', color: 'var(--on-surface-variant)' }}
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>

        {/* ER Diagram Canvas */}
        <div className="absolute inset-0 p-8">
          {/* Connection Lines (SVG) */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
            <defs>
              <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="var(--secondary)" fillOpacity="0.5" />
              </marker>
            </defs>
            {/* Example relationship lines */}
            <path 
              d="M 320 150 Q 400 200 400 280" 
              fill="none" 
              stroke="var(--secondary)" 
              strokeWidth="2" 
              strokeDasharray="8 4"
              opacity="0.5"
              markerEnd="url(#arrowhead)"
            />
            <path 
              d="M 500 400 Q 400 450 320 500" 
              fill="none" 
              stroke="var(--secondary)" 
              strokeWidth="2" 
              strokeDasharray="8 4"
              opacity="0.3"
            />
          </svg>

          {/* Table Cards */}
          <div className="relative" style={{ zIndex: 1 }}>
            {mockNodes.map((node, idx) => {
              const positions = [
                { top: '60px', left: '180px' },
                { top: '220px', left: '320px' },
                { top: '420px', left: '240px' }
              ]
              const pos = positions[idx] || { top: `${100 + idx * 180}px`, left: '200px' }
              const isSelected = selected === node.id

              return (
                <div
                  key={node.id}
                  onClick={() => setSelected(node.id)}
                  className="absolute cursor-pointer transition-all duration-200"
                  style={{
                    ...pos,
                    transform: isSelected ? 'scale(1.02)' : 'scale(1)',
                  }}
                >
                  <div 
                    className="rounded-lg overflow-hidden min-w-[200px]"
                    style={{ 
                      backgroundColor: 'var(--surface-container)',
                      border: isSelected ? '2px solid var(--secondary)' : '1px solid rgba(64, 72, 93, 0.3)',
                      boxShadow: isSelected ? '0 0 24px rgba(83, 221, 252, 0.2)' : 'none'
                    }}
                  >
                    {/* Table Header */}
                    <div 
                      className="flex items-center justify-between px-4 py-3"
                      style={{ 
                        backgroundColor: isSelected ? 'var(--surface-container-high)' : 'var(--surface-container)',
                        borderBottom: '1px solid rgba(64, 72, 93, 0.2)'
                      }}
                    >
                      <span className="font-semibold text-sm" style={{ color: 'var(--on-surface)' }}>
                        {node.data.label}
                      </span>
                      <Database className="w-4 h-4" style={{ color: 'var(--on-surface-dim)' }} />
                    </div>

                    {/* Columns */}
                    <div className="py-2">
                      {node.data.columns?.map(col => (
                        <div 
                          key={col.name}
                          className="flex items-center justify-between px-4 py-1.5 text-xs"
                        >
                          <span 
                            className="font-mono"
                            style={{ 
                              color: node.data.foreign_keys?.some(fk => fk.column === col.name) 
                                ? 'var(--secondary)' 
                                : 'var(--on-surface)'
                            }}
                          >
                            {col.name}
                          </span>
                          <span style={{ color: 'var(--on-surface-dim)' }}>
                            {col.type}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Details Panel */}
      <div 
        className="w-80 rounded-xl p-5 flex flex-col"
        style={{ backgroundColor: 'var(--surface-container)' }}
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-display font-semibold" style={{ color: 'var(--on-surface)' }}>
            Table Details
          </h3>
          {selected && (
            <span 
              className="px-3 py-1 rounded-full text-xs font-semibold"
              style={{ backgroundColor: 'var(--secondary-container)', color: 'var(--secondary)' }}
            >
              ACTIVE SELECTION
            </span>
          )}
        </div>

        {selectedNode ? (
          <>
            {/* Metadata */}
            <div className="mb-6">
              <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--on-surface-dim)' }}>
                Metadata
              </p>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm" style={{ color: 'var(--on-surface-variant)' }}>Name</span>
                  <span className="text-sm font-medium" style={{ color: 'var(--on-surface)' }}>{selectedNode.data.label.toLowerCase()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm" style={{ color: 'var(--on-surface-variant)' }}>Schema</span>
                  <span className="text-sm font-medium" style={{ color: 'var(--on-surface)' }}>public</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm" style={{ color: 'var(--on-surface-variant)' }}>Row Count</span>
                  <span className="text-sm font-medium" style={{ color: 'var(--on-surface)' }}>~14,200</span>
                </div>
              </div>
            </div>

            {/* AI Schema Insight */}
            <div 
              className="p-4 rounded-lg mb-6 cyan-aura"
              style={{ 
                backgroundColor: 'var(--surface-container-high)',
                borderLeft: '3px solid var(--secondary)'
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-4 h-4" style={{ color: 'var(--secondary)' }} />
                <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--secondary)' }}>
                  AI Schema Insight
                </span>
              </div>
              <p className="text-sm mb-3" style={{ color: 'var(--on-surface-variant)' }}>
                Performance bottleneck detected. The <span className="font-mono" style={{ color: 'var(--secondary)' }}>user_id</span> foreign key lacks an index, causing latency in large joins.
              </p>
              <button 
                className="text-xs font-semibold uppercase tracking-wider transition-opacity hover:opacity-80"
                style={{ color: 'var(--secondary)' }}
              >
                Apply Optimization
              </button>
            </div>

            {/* Relationships */}
            <div className="mb-6">
              <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--on-surface-dim)' }}>
                Relationships
              </p>
              <div className="space-y-2">
                <div 
                  className="flex items-center gap-3 p-3 rounded-lg"
                  style={{ backgroundColor: 'var(--surface-container-high)' }}
                >
                  <Link2 className="w-4 h-4" style={{ color: 'var(--on-surface-dim)' }} />
                  <div>
                    <p className="text-sm font-medium" style={{ color: 'var(--on-surface)' }}>Many-to-One</p>
                    <p className="text-xs font-mono" style={{ color: 'var(--on-surface-variant)' }}>
                      orders.user_id → users.id
                    </p>
                  </div>
                </div>
                <div 
                  className="flex items-center gap-3 p-3 rounded-lg"
                  style={{ backgroundColor: 'var(--surface-container-high)' }}
                >
                  <Link2 className="w-4 h-4" style={{ color: 'var(--on-surface-dim)' }} />
                  <div>
                    <p className="text-sm font-medium" style={{ color: 'var(--on-surface)' }}>One-to-Many</p>
                    <p className="text-xs font-mono" style={{ color: 'var(--on-surface-variant)' }}>
                      orders.id → order_items.order_id
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Export Button */}
            <button 
              className="mt-auto w-full flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-medium transition-colors hover:bg-[var(--surface-container-high)]"
              style={{ 
                backgroundColor: 'var(--surface-container-low)', 
                color: 'var(--on-surface)' 
              }}
            >
              <Download className="w-4 h-4" />
              Export SQL DDL
            </button>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-sm text-center" style={{ color: 'var(--on-surface-dim)' }}>
              Select a table to view details
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
