
import { useState } from "react"
import { Database, BookOpen, Network, MessageSquare, Code2, Heart, Shield, LogOut } from "lucide-react"
import DataDictionary from "./DataDictionary"
import ERDiagram from "./ERDiagram"
import ChatBot from "./ChatBot"
import NLtoSQL from "./NLtoSQL"
import HealthScore from "./HealthScore"
import PIIReport from "./PIIReport"
 
const TABS = [
  { id: "dictionary", label: "Data Dictionary", icon: BookOpen },
  { id: "er",         label: "ER Diagram",      icon: Network },
  { id: "chat",       label: "AI Chat",          icon: MessageSquare },
  { id: "nlsql",      label: "NL → SQL",         icon: Code2 },
  { id: "health",     label: "Health Score",     icon: Heart },
  { id: "pii",        label: "PII / Compliance", icon: Shield },
]
 
const s = {
  surface: "#060e20",
  surfaceContainerLow: "#091328",
  surfaceContainer: "#0f1930",
  surfaceContainerHigh: "#141f38",
  surfaceContainerHighest: "#192540",
  primary: "#a3a6ff",
  primaryContainer: "#9396ff",
  secondary: "#53ddfc",
  onSurface: "#dee5ff",
  onSurfaceVariant: "#a3aac4",
  outlineVariant: "#40485d",
}
 
export default function Dashboard({ schema, dbUrl, onDisconnect }) {
  const [activeTab, setActiveTab] = useState("dictionary")
  const tableCount = Object.keys(schema).length
 
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", backgroundColor: s.surface, fontFamily: "Inter, sans-serif", position: "relative", overflow: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;700;800&family=Inter:wght@400;500;600&display=swap');
        .tab-nav-btn:hover { color: ${s.onSurface} !important; background: rgba(163,166,255,0.06) !important; }
        .disconnect-btn:hover { color: ${s.onSurface} !important; }
        .tab-content-area::-webkit-scrollbar { width: 6px; }
        .tab-content-area::-webkit-scrollbar-track { background: ${s.surface}; }
        .tab-content-area::-webkit-scrollbar-thumb { background: ${s.outlineVariant}; border-radius: 3px; }
      `}</style>
 
      {/* Ambient glow */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 0 }}>
        <div style={{ position: "absolute", top: "-96px", left: "-96px", width: "300px", height: "300px", borderRadius: "50%", background: "rgba(163,166,255,0.05)", filter: "blur(100px)" }} />
        <div style={{ position: "absolute", bottom: 0, right: 0, width: "300px", height: "300px", borderRadius: "50%", background: "rgba(83,221,252,0.04)", filter: "blur(100px)" }} />
      </div>
 
      {/* Header */}
      <header style={{
        position: "relative", zIndex: 10,
        backgroundColor: s.surfaceContainerLow,
        borderBottom: `1px solid rgba(64,72,93,0.3)`,
        padding: "0 24px", height: "60px",
        display: "flex", alignItems: "center", justifyContent: "space-between"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "32px", height: "32px", borderRadius: "8px", background: `linear-gradient(135deg, ${s.primary}, ${s.primaryContainer})` }}>
            <Database color="#060e20" size={16} />
          </div>
          <span style={{ fontFamily: "Manrope, sans-serif", fontWeight: 700, fontSize: "18px", color: s.onSurface }}>QueryMind</span>
          <span style={{ color: s.onSurfaceVariant, fontSize: "13px", marginLeft: "4px", fontFamily: "monospace" }}>
            {dbUrl.split("@").pop()}
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", backgroundColor: `${s.secondary}15`, padding: "4px 12px", borderRadius: "999px", border: `1px solid ${s.secondary}30` }}>
            <span style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>
              <span style={{ color: s.secondary }}>{tableCount}</span>
              <span style={{ color: s.onSurfaceVariant }}> tables</span>
            </span>
          </div>
          <button
            className="disconnect-btn"
            onClick={onDisconnect}
            style={{ background: "none", border: "none", cursor: "pointer", color: s.onSurfaceVariant, display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", fontWeight: 500, fontFamily: "Inter, sans-serif", transition: "color 0.2s" }}
          >
            <LogOut size={14} /> Disconnect
          </button>
        </div>
      </header>
 
      {/* Tab Navigation */}
      <nav style={{
        position: "relative", zIndex: 10,
        backgroundColor: s.surfaceContainerLow,
        borderBottom: `1px solid rgba(64,72,93,0.2)`,
        padding: "0 24px",
        display: "flex", gap: "2px", overflowX: "auto"
      }}>
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            className="tab-nav-btn"
            onClick={() => setActiveTab(id)}
            style={{
              display: "flex", alignItems: "center", gap: "7px",
              padding: "12px 16px", fontSize: "13px", fontWeight: 500,
              border: "none", cursor: "pointer", whiteSpace: "nowrap",
              fontFamily: "Inter, sans-serif", transition: "all 0.2s",
              borderRadius: "6px 6px 0 0",
              borderBottom: activeTab === id ? `2px solid ${s.primary}` : "2px solid transparent",
              color: activeTab === id ? s.primary : s.onSurfaceVariant,
              backgroundColor: activeTab === id ? `rgba(163,166,255,0.08)` : "transparent",
            }}
          >
            <Icon size={14} /> {label}
          </button>
        ))}
      </nav>
 
      {/* Content */}
      <main
        className="tab-content-area"
        style={{ flex: 1, overflowY: "auto", backgroundColor: s.surface, padding: "28px 24px", position: "relative", zIndex: 5 }}
      >
        {activeTab === "dictionary" && <DataDictionary schema={schema} />}
        {activeTab === "er"         && <ERDiagram schema={schema} />}
        {activeTab === "chat"       && <ChatBot schema={schema} />}
        {activeTab === "nlsql"      && <NLtoSQL schema={schema} />}
        {activeTab === "health"     && <HealthScore schema={schema} />}
        {activeTab === "pii"        && <PIIReport schema={schema} />}
      </main>
    </div>
  )
}