import { useState } from "react"
import { Toaster } from "react-hot-toast"
import ConnectDB from "./components/ConnectDB"
import Dashboard from "./components/Dashboard"

export default function App() {
  const [schema, setSchema] = useState(null)
  const [dbUrl, setDbUrl] = useState("")

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#0D1B2A", color: "white", fontFamily: "Courier New" }}>
      <Toaster position="top-right" />
      {!schema ? (
        <ConnectDB onConnect={(s, url) => { setSchema(s); setDbUrl(url) }} />
      ) : (
        <Dashboard schema={schema} dbUrl={dbUrl} onDisconnect={() => setSchema(null)} />
      )}
    </div>
  )
}