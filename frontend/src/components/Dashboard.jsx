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
  { id: "er", label: "ER Diagram", icon: Network },
  { id: "chat", label: "AI Chat", icon: MessageSquare },
  { id: "nlsql", label: "NL → SQL", icon: Code2 },
  { id: "health", label: "Health Score", icon: Heart },
  { id: "pii", label: "PII / Compliance", icon: Shield },
]

export default function Dashboard({ schema, dbUrl, onDisconnect }) {
  const [activeTab, setActiveTab] = useState("dictionary")
  const tableCount = Object.keys(schema).length

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", backgroundColor: "#0D1B2A" }}>
      {/* Header */}
      <header style={{ backgroundColor: "#1B2D42", borderBottom: "1px solid #00B4D8", padding: "12px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <Database color="#00B4D8" size={24} />
          <span style={{ fontWeight: "bold", fontSize: "20px", color: "white" }}>QueryMind</span>
          <span style={{ color: "#9ca3af", fontSize: "14px", marginLeft: "8px" }}>
            {dbUrl.includes("csv_uploads") ? "📄 CSV File" : dbUrl.split("@").pop()}
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <span style={{ color: "#00B4D8", fontSize: "14px" }}>{tableCount} table{tableCount > 1 ? "s" : ""}</span>
          <button onClick={onDisconnect} style={{ background: "none", border: "none", color: "#9ca3af", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", fontSize: "14px" }}>
            <LogOut size={16} /> Disconnect
          </button>
        </div>
      </header>

      {/* Tabs */}
      <nav style={{ backgroundColor: "#1B2D42", borderBottom: "1px solid #00B4D8", padding: "0 24px", display: "flex", gap: "4px", overflowX: "auto" }}>
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            style={{
              display: "flex", alignItems: "center", gap: "6px", padding: "12px 16px",
              fontSize: "13px", fontWeight: "500",
              color: activeTab === id ? "#00B4D8" : "#9ca3af",
              background: "none", border: "none",
              borderBottom: `2px solid ${activeTab === id ? "#00B4D8" : "transparent"}`,
              cursor: "pointer", whiteSpace: "nowrap", transition: "all 0.2s"
            }}
          >
            <Icon size={15} /> {label}
          </button>
        ))}
      </nav>

      {/* Content */}
      <main style={{ flex: 1, overflowY: "auto", backgroundColor: "#0D1B2A", padding: "24px" }}>
        {activeTab === "dictionary" && <DataDictionary schema={schema} />}
        {activeTab === "er" && <ERDiagram schema={schema} />}
        {activeTab === "chat" && <ChatBot schema={schema} />}
        {activeTab === "nlsql" && <NLtoSQL schema={schema} dbUrl={dbUrl} />}
        {activeTab === "health" && <HealthScore schema={schema} />}
        {activeTab === "pii" && <PIIReport schema={schema} />}
      </main>
    </div>
  )
}