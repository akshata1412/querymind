import { useState } from "react"
import Sidebar from "./Sidebar"
import Navbar from "./Navbar"
import MetricCards from "./MetricCards"
import ActivityTable from "./ActivityTable"
import DataDictionary from "./DataDictionary"
import ERDiagram from "./ERDiagram"
import ChatBot from "./ChatBot"
import NLtoSQL from "./NLtoSQL"
import HealthScore from "./HealthScore"
import PIIReport from "./PIIReport"

export default function Dashboard({ schema, dbUrl, onDisconnect }) {
  const [activeTab, setActiveTab] = useState("dictionary")
  const tableCount = Object.keys(schema).length

  const renderContent = () => {
    switch (activeTab) {
      case "dictionary":
        return (
          <div className="space-y-6">
            {/* Metrics Overview */}
            <MetricCards schema={schema} />
            
            {/* Activity Table */}
            <ActivityTable />
            
            {/* Data Dictionary */}
            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="text-base font-semibold text-foreground mb-4">Data Dictionary</h3>
              <DataDictionary schema={schema} />
            </div>
          </div>
        )
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
        return <DataDictionary schema={schema} />
    }
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Ambient Glow Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-secondary/5 blur-3xl" />
      </div>

      {/* Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        tableCount={tableCount}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 relative z-10">
        {/* Top Navbar */}
        <Navbar dbUrl={dbUrl} onDisconnect={onDisconnect} />

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            {/* Page Header */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-foreground mb-1">
                {activeTab === "dictionary" && "Dashboard Overview"}
                {activeTab === "er" && "ER Diagram"}
                {activeTab === "chat" && "AI Chat Assistant"}
                {activeTab === "nlsql" && "Natural Language to SQL"}
                {activeTab === "health" && "Health Score Analysis"}
                {activeTab === "pii" && "PII & Compliance Report"}
              </h1>
              <p className="text-sm text-muted-foreground">
                {activeTab === "dictionary" && "Monitor your database metrics and recent activity"}
                {activeTab === "er" && "Visualize table relationships and schema structure"}
                {activeTab === "chat" && "Ask questions about your database in natural language"}
                {activeTab === "nlsql" && "Convert natural language queries to SQL"}
                {activeTab === "health" && "Analyze database health and optimization opportunities"}
                {activeTab === "pii" && "Identify and manage personally identifiable information"}
              </p>
            </div>

            {/* Dynamic Content */}
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  )
}
