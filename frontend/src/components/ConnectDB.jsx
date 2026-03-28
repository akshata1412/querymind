import { useState, useRef } from "react"
import { connectDB, uploadCSV } from "../api/client"
import toast from "react-hot-toast"
import { Database, Zap, Upload, FileText, X, Loader2 } from "lucide-react"
import clsx from "clsx"

export default function ConnectDB({ onConnect }) {
  const [url, setUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("upload")
  const [dragOver, setDragOver] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState([])
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
    try {
      const { data } = await uploadCSV(selectedFiles)
      toast.success(`Loaded ${data.table_count} tables successfully!`)
      onConnect(data.schema, "uploaded_data.db")
    } catch (e) {
      toast.error(e.response?.data?.detail || "Upload failed")
    } finally {
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
    <div className="min-h-screen bg-background flex items-center justify-center p-6 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-primary/10 blur-3xl animate-pulse" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-secondary/5 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-primary/10 blur-3xl" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/80 mb-5 shadow-lg shadow-primary/30">
            <Database className="w-7 h-7 text-primary-foreground" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-2 tracking-tight">QueryMind</h1>
          <p className="text-secondary text-sm font-medium">AI-Powered Database Intelligence</p>
        </div>

        {/* Main Card */}
        <div className="bg-card/80 backdrop-blur-xl rounded-xl border border-border overflow-hidden shadow-2xl">
          {/* Tabs */}
          <div className="flex bg-muted p-1 gap-1">
            {[
              { id: "upload", label: "Upload CSV", icon: Upload },
              { id: "connect", label: "Connect Database", icon: Database }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={clsx(
                  "flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-sm font-semibold transition-all duration-200",
                  activeTab === id
                    ? "bg-card text-primary border-b-2 border-primary"
                    : "text-muted-foreground hover:bg-card/50"
                )}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>

          <div className="p-7">
            {/* Upload Tab */}
            {activeTab === "upload" && (
              <div>
                <p className="text-muted-foreground text-sm text-center mb-5">
                  Upload one or more CSV files - we&apos;ll analyze them instantly
                </p>

                {/* Dropzone */}
                <div
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={clsx(
                    "border-2 border-dashed rounded-xl p-10 text-center cursor-pointer mb-4 transition-all duration-200",
                    dragOver
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50 hover:bg-muted/30"
                  )}
                >
                  <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                    <Upload className="w-6 h-6 text-primary" />
                  </div>
                  <p className="text-foreground font-semibold mb-1">
                    {dragOver ? "Drop files here!" : "Drop your CSV files here"}
                  </p>
                  <p className="text-muted-foreground text-xs mb-3">or click to browse from your computer</p>
                  <span className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground bg-muted px-3 py-1 rounded-full">
                    Max 50MB
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
                  <div className="mb-4">
                    <p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground px-1 mb-2">
                      Selected Files
                    </p>
                    <div className="space-y-2">
                      {selectedFiles.map((file, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-3 p-3 bg-muted rounded-lg"
                        >
                          <div className="w-9 h-9 rounded-lg bg-secondary/20 flex items-center justify-center">
                            <FileText className="w-4 h-4 text-secondary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">{file.name}</p>
                            <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(0)} KB</p>
                          </div>
                          <button
                            onClick={(e) => { e.stopPropagation(); removeFile(i) }}
                            className="p-1 rounded text-muted-foreground hover:text-destructive transition-colors"
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
                    "w-full flex items-center justify-center gap-2 py-3.5 rounded-lg text-sm font-bold transition-all duration-200",
                    selectedFiles.length > 0
                      ? "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:scale-[1.02] active:scale-[0.98]"
                      : "bg-muted text-muted-foreground cursor-not-allowed"
                  )}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4" />
                      {selectedFiles.length > 0 ? `Analyze ${selectedFiles.length} file(s)` : "Select Files First"}
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Connect Tab */}
            {activeTab === "connect" && (
              <div>
                <p className="text-muted-foreground text-sm text-center mb-5">
                  Connect directly to an existing database
                </p>

                <input
                  type="text"
                  placeholder="sqlite:///./demo.db"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleConnect()}
                  className="w-full bg-background border border-border rounded-lg px-4 py-3 text-foreground text-sm font-mono mb-3 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                />

                <div className="bg-background rounded-lg p-4 border border-border mb-5">
                  <p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground mb-2">
                    Examples
                  </p>
                  {["sqlite:///./demo.db", "mysql+pymysql://user:pass@host/db", "postgresql://user:pass@host/db"].map(example => (
                    <p
                      key={example}
                      onClick={() => setUrl(example)}
                      className="text-secondary text-xs font-mono cursor-pointer hover:text-primary py-1 transition-colors"
                    >
                      {example}
                    </p>
                  ))}
                </div>

                <button
                  onClick={handleConnect}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-lg text-sm font-bold bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4" />
                      Connect & Analyze
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-muted-foreground/50 text-xs mt-6">
          Supports SQLite, MySQL, PostgreSQL & CSV Files
        </p>
      </div>
    </div>
  )
}
