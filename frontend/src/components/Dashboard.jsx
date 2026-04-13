import { useState } from "react"
import Sidebar from "./Sidebar"
import Navbar from "./Navbar"
import DataDictionary from "./DataDictionary"
import ERDiagram from "./ERDiagram"
import ChatBot from "./ChatBot"
import NLtoSQL from "./NLtoSQL"
import HealthScore from "./HealthScore"
import PIIReport from "./PIIReport"

export default function Dashboard({ schema, dbUrl, onDisconnect }) {
  const [activeTab, setActiveTab] = useState("health")
  const tableCount = Object.keys(schema).length

  const renderContent = () => {
    switch (activeTab) {
      case "dictionary":
        return <DataDictionary schema={schema} />
      case "er":
        return <ERDiagram schema={schema} />
      case "chat":
        return <ChatBot schema={schema} />
      case "nlsql":
        return <NLtoSQL schema={schema} />
      case "health":
        return <HealthScore schema={schema} />
      case "pii":
        return <PIIReport schema={schema} />
      default:
        return <HealthScore schema={schema} />
    }
  }

  return (
    <div className="flex h-screen overflow-hidden" style={{ backgroundColor: 'var(--surface)' }}>
      {/* Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        tableCount={tableCount}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <Navbar dbUrl={dbUrl} onDisconnect={onDisconnect} activeTab={activeTab} />

        {/* Content Area */}
        <main 
          className="flex-1 overflow-y-auto p-6"
          style={{ backgroundColor: 'var(--surface)' }}
        >
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>

      {/* Floating Help Button */}
      <button 
        className="fixed bottom-6 right-6 w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-105"
        style={{ 
          background: 'linear-gradient(135deg, var(--secondary) 0%, #00b4d8 100%)',
          boxShadow: '0 8px 32px rgba(83, 221, 252, 0.3)'
        }}
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="var(--surface)" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      </button>
    </div>
  )
}
