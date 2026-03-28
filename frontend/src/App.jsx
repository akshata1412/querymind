
import { useState } from "react"
import { Toaster } from "react-hot-toast"
import ConnectDB from "./components/ConnectDB"
import Dashboard from "./components/Dashboard"
 
export default function App() {
  const [schema, setSchema] = useState(null)
  const [dbUrl, setDbUrl] = useState("")
 
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#060e20", color: "#dee5ff", fontFamily: "Inter, sans-serif" }}>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#0f1930",
            color: "#dee5ff",
            border: "1px solid rgba(64,72,93,0.3)",
            borderRadius: "0.5rem",
            fontFamily: "Inter, sans-serif",
            fontSize: "14px"
          },
          success: { iconTheme: { primary: "#53ddfc", secondary: "#060e20" } },
          error: { iconTheme: { primary: "#ff6e84", secondary: "#060e20" } }
        }}
      />
      {!schema ? (
        <ConnectDB onConnect={(s, url) => { setSchema(s); setDbUrl(url) }} />
      ) : (
        <Dashboard schema={schema} dbUrl={dbUrl} onDisconnect={() => setSchema(null)} />
      )}
    </div>
  )
}