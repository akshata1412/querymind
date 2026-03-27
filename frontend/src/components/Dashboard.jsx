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

export default function Dashboard({ schema, dbUrl, onDisconnect }) {
  const [activeTab, setActiveTab] = useState("dictionary")
  const tableCount = Object.keys(schema).length

  return (
    <div className="flex flex-col h-screen bg-navy-900">
      {/* Header */}
      <header className="bg-navy-800 border-b border-cyan-500 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Database className="text-cyan-400" size={24} />
          <span className="font-bold text-xl text-white">QueryMind</span>
          <span className="text-gray-400 text-sm ml-2">{dbUrl.split("@").pop()}</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-cyan-400 text-sm">{tableCount} tables</span>
          <button onClick={onDisconnect} className="text-gray-400 hover:text-white flex items-center gap-1 text-sm">
            <LogOut size={16} /> Disconnect
          </button>
        </div>
      </header>

      {/* Tabs */}
      <nav className="bg-navy-800 border-b border-cyan-500 px-6 flex gap-1 overflow-x-auto">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-all whitespace-nowrap ${
              activeTab === id
                ? "border-cyan-400 text-cyan-400"
                : "border-transparent text-gray-400 hover:text-white"
            }`}
          >
            <Icon size={15} /> {label}
          </button>
        ))}
      </nav>

      {/* Content */}
      <main className="flex-1 overflow-auto bg-navy-900 p-6">
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