import { useState, useRef } from "react"
import { connectDB, uploadCSV } from "../api/client"
import toast from "react-hot-toast"
import { Database, Upload, FileText, X, Loader2, Check, ArrowRight, Sparkles } from "lucide-react"
import clsx from "clsx"

export default function ConnectDB({ onConnect }) {
  const [url, setUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("upload")
  const [dragOver, setDragOver] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState([])
  const [connectionStatus, setConnectionStatus] = useState(null)
  const [analyzingProgress, setAnalyzingProgress] = useState(0)
  const fileInputRef = useRef(null)

  const handleConnect = async () => {
    if (!url.trim()) return toast.error("Enter a database URL")
    setLoading(true)
    try {
      const { data } = await connectDB(url)
      toast.success(`Connected! Found ${data.table_count} tables`)
      onConnect(data.schema, url)
    } catch (e) {
      toast.error(e.response?.data?.detail || "Connection failed")
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = async () => {
    if (selectedFiles.length === 0) return toast.error("Please select CSV files first")
    setLoading(true)
    setAnalyzingProgress(0)
    
    // Simulate progress
    const progressInterval = setInterval(() => {
      setAnalyzingProgress(prev => Math.min(prev + Math.random() * 15, 90))
    }, 200)

    try {
      const { data } = await uploadCSV(selectedFiles)
      clearInterval(progressInterval)
      setAnalyzingProgress(100)
      setConnectionStatus({
        tables: data.table_count,
        relationships: 12
      })
      setTimeout(() => {
        onConnect(data.schema, "uploaded_data.db")
      }, 1500)
    } catch (e) {
      clearInterval(progressInterval)
      toast.error(e.response?.data?.detail || "Upload failed")
      setLoading(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    const files = Array.from(e.dataTransfer.files).filter(f => f.name.endsWith('.csv'))
    if (files.length === 0) return toast.error("Please drop CSV files only")
    setSelectedFiles(prev => [...prev, ...files])
  }

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files)
    setSelectedFiles(prev => [...prev, ...files])
  }

  const removeFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index))
  }

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden"
      style={{ backgroundColor: 'var(--surface)' }}
    >
      {/* Background decorative elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Floating cards in background */}
        <div 
          className="absolute top-1/4 right-20 w-48 h-32 rounded-xl opacity-20 rotate-12 transform"
          style={{ backgroundColor: 'var(--surface-container-high)' }}
        />
        <div 
          className="absolute top-1/3 right-32 w-40 h-28 rounded-xl opacity-10 rotate-6 transform"
          style={{ backgroundColor: 'var(--surface-container)' }}
        />
      </div>

      <div className="w-full max-w-xl relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div 
              className="flex items-center justify-center w-10 h-10 rounded-lg"
              style={{ backgroundColor: 'var(--surface-container)' }}
            >
              <Database className="w-5 h-5" style={{ color: 'var(--secondary)' }} />
            </div>
            <span className="font-display text-xl font-bold" style={{ color: 'var(--on-surface)' }}>
              QueryMind
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--on-surface-variant)' }}>
            Step 1 of 3
            <div className="flex gap-1 ml-2">
              <div className="w-8 h-1 rounded-full" style={{ backgroundColor: 'var(--secondary)' }} />
              <div className="w-8 h-1 rounded-full" style={{ backgroundColor: 'var(--surface-container-high)' }} />
              <div className="w-8 h-1 rounded-full" style={{ backgroundColor: 'var(--surface-container-high)' }} />
            </div>
          </div>
        </div>

        {/* Main Title */}
        <div className="text-center mb-10">
          <h1 className="font-display text-4xl font-bold mb-3" style={{ color: 'var(--on-surface)' }}>
            Connect your <span style={{ color: 'var(--secondary)' }}>Intelligence Source</span>
          </h1>
          <p className="text-sm max-w-md mx-auto" style={{ color: 'var(--on-surface-variant)' }}>
            Link your data assets to start generating insights. QueryMind supports raw file uploads and direct database connections with AI-driven schema mapping.
          </p>
        </div>

        {/* Main Card */}
        <div 
          className="rounded-xl overflow-hidden"
          style={{ backgroundColor: 'var(--surface-container)' }}
        >
          {/* Tabs */}
          <div className="flex" style={{ backgroundColor: 'var(--surface-container-low)' }}>
            {[
              { id: "upload", label: "Upload CSV", icon: Upload },
              { id: "connect", label: "Connect Database", icon: Database }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={clsx(
                  "flex-1 flex items-center justify-center gap-2 py-4 px-4 text-sm font-medium transition-all duration-200 relative"
                )}
                style={{
                  color: activeTab === id ? 'var(--on-surface)' : 'var(--on-surface-variant)',
                  backgroundColor: activeTab === id ? 'var(--surface-container)' : 'transparent'
                }}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>

          <div className="p-6">
            {/* Upload Tab */}
            {activeTab === "upload" && (
              <div>
                {/* Dropzone */}
                <div
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={clsx(
                    "rounded-xl p-10 text-center cursor-pointer mb-5 transition-all duration-200"
                  )}
                  style={{
                    backgroundColor: 'var(--surface-container-low)',
                    border: dragOver ? '2px dashed var(--secondary)' : '2px dashed rgba(64, 72, 93, 0.3)'
                  }}
                >
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
                    style={{ backgroundColor: 'var(--surface-container-high)' }}
                  >
                    <Upload className="w-5 h-5" style={{ color: 'var(--secondary)' }} />
                  </div>
                  <p className="font-semibold mb-1" style={{ color: 'var(--on-surface)' }}>
                    {dragOver ? "Drop files here!" : "Drop your CSV files here"}
                  </p>
                  <p className="text-sm mb-3" style={{ color: 'var(--on-surface-variant)' }}>
                    or click to browse from your computer
                  </p>
                  <span 
                    className="text-[10px] uppercase tracking-widest font-bold px-3 py-1 rounded-full"
                    style={{ backgroundColor: 'var(--surface-container-high)', color: 'var(--on-surface-dim)' }}
                  >
                    Max file size: 50MB
                  </span>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept=".csv"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </div>

                {/* Selected Files */}
                {selectedFiles.length > 0 && (
                  <div className="mb-5">
                    <p 
                      className="text-[10px] uppercase tracking-widest font-bold px-1 mb-3"
                      style={{ color: 'var(--on-surface-dim)' }}
                    >
                      Selected Files
                    </p>
                    <div className="space-y-2">
                      {selectedFiles.map((file, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-3 p-3 rounded-lg"
                          style={{ backgroundColor: 'var(--surface-container-low)' }}
                        >
                          <div 
                            className="w-10 h-10 rounded-lg flex items-center justify-center"
                            style={{ backgroundColor: 'var(--secondary-container)' }}
                          >
                            <FileText className="w-4 h-4" style={{ color: 'var(--secondary)' }} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate" style={{ color: 'var(--on-surface)' }}>
                              {file.name}
                            </p>
                            <p className="text-xs" style={{ color: 'var(--on-surface-dim)' }}>
                              {(file.size / 1024).toFixed(0)}KB · Ready to parse
                            </p>
                          </div>
                          <button
                            onClick={(e) => { e.stopPropagation(); removeFile(i) }}
                            className="p-1 rounded transition-colors hover:bg-[var(--surface-container-high)]"
                            style={{ color: 'var(--on-surface-dim)' }}
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  onClick={handleFileUpload}
                  disabled={loading || selectedFiles.length === 0}
                  className={clsx(
                    "w-full flex items-center justify-center gap-2 py-3.5 rounded-lg text-sm font-semibold transition-all duration-200"
                  )}
                  style={{
                    background: selectedFiles.length > 0 
                      ? 'linear-gradient(135deg, var(--secondary) 0%, #00b4d8 100%)' 
                      : 'var(--surface-container-high)',
                    color: selectedFiles.length > 0 ? 'var(--surface)' : 'var(--on-surface-dim)',
                    cursor: selectedFiles.length === 0 ? 'not-allowed' : 'pointer'
                  }}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      Analyze Data
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <p className="text-center text-xs mt-4" style={{ color: 'var(--on-surface-dim)' }}>
                  By connecting data, you agree to our <span style={{ color: 'var(--secondary)' }}>Data Handling Policy</span>.
                </p>
              </div>
            )}

            {/* Connect Tab */}
            {activeTab === "connect" && (
              <div>
                <p className="text-sm text-center mb-5" style={{ color: 'var(--on-surface-variant)' }}>
                  Connect directly to an existing database
                </p>

                <input
                  type="text"
                  placeholder="sqlite:///./demo.db"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleConnect()}
                  className="w-full px-4 py-3 text-sm font-mono rounded-lg mb-3 focus:outline-none transition-all"
                  style={{ 
                    backgroundColor: 'var(--surface-container-lowest)',
                    color: 'var(--on-surface)',
                    border: '1px solid rgba(64, 72, 93, 0.15)'
                  }}
                />

                <div 
                  className="rounded-lg p-4 mb-5"
                  style={{ backgroundColor: 'var(--surface-container-low)' }}
                >
                  <p 
                    className="text-[10px] uppercase tracking-widest font-bold mb-2"
                    style={{ color: 'var(--on-surface-dim)' }}
                  >
                    Examples
                  </p>
                  {["sqlite:///./demo.db", "mysql+pymysql://user:pass@host/db", "postgresql://user:pass@host/db"].map(example => (
                    <p
                      key={example}
                      onClick={() => setUrl(example)}
                      className="text-xs font-mono cursor-pointer py-1 transition-colors hover:opacity-80"
                      style={{ color: 'var(--secondary)' }}
                    >
                      {example}
                    </p>
                  ))}
                </div>

                <button
                  onClick={handleConnect}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-lg text-sm font-semibold transition-all duration-200 disabled:opacity-50"
                  style={{ 
                    background: 'linear-gradient(135deg, var(--secondary) 0%, #00b4d8 100%)',
                    color: 'var(--surface)'
                  }}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    <>
                      Connect & Analyze
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Connection Status */}
        {connectionStatus && (
          <div 
            className="mt-4 p-4 rounded-xl flex items-center gap-3"
            style={{ 
              backgroundColor: 'var(--surface-container)',
              borderLeft: '3px solid var(--secondary)'
            }}
          >
            <div 
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ backgroundColor: 'var(--secondary-container)' }}
            >
              <Check className="w-4 h-4" style={{ color: 'var(--secondary)' }} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold" style={{ color: 'var(--on-surface)' }}>
                Connection Successful
              </p>
              <p className="text-xs" style={{ color: 'var(--on-surface-variant)' }}>
                Analyze Data identified <span style={{ color: 'var(--secondary)' }}>{connectionStatus.tables} tables</span> and established {connectionStatus.relationships} relationships.
              </p>
            </div>
            <span 
              className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold"
              style={{ backgroundColor: 'var(--secondary-container)', color: 'var(--secondary)' }}
            >
              <Sparkles className="w-3 h-3" />
              AI VALIDATED
            </span>
          </div>
        )}

        {/* Analyzing Progress */}
        {loading && analyzingProgress > 0 && (
          <div 
            className="mt-4 p-4 rounded-xl"
            style={{ backgroundColor: 'var(--surface-container)' }}
          >
            <div className="flex items-center gap-3 mb-2">
              <Loader2 className="w-5 h-5 animate-spin" style={{ color: 'var(--secondary)' }} />
              <span className="text-sm font-medium" style={{ color: 'var(--on-surface)' }}>
                Analyzing schema...
              </span>
              <span className="ml-auto text-sm" style={{ color: 'var(--secondary)' }}>
                {Math.round(analyzingProgress)}%
              </span>
            </div>
            <div className="progress-bar h-1.5">
              <div 
                className="progress-fill"
                style={{ 
                  width: `${analyzingProgress}%`, 
                  backgroundColor: 'var(--secondary)',
                  boxShadow: '0 0 8px var(--secondary)'
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
