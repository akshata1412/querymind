import { useState } from "react"
import { Toaster } from "react-hot-toast"
import ConnectDB from "./components/ConnectDB"
import Dashboard from "./components/Dashboard"
 
export default function App() {
  const [schema, setSchema] = useState(null)
  const [dbUrl, setDbUrl] = useState("")
 
  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "hsl(222, 43%, 8%)",
            color: "hsl(226, 100%, 94%)",
            border: "1px solid hsl(224, 20%, 25%)",
            borderRadius: "0.5rem",
            fontFamily: "Inter, sans-serif",
            fontSize: "14px"
          },
          success: { iconTheme: { primary: "hsl(188, 95%, 66%)", secondary: "hsl(222, 47%, 5%)" } },
          error: { iconTheme: { primary: "hsl(351, 100%, 72%)", secondary: "hsl(222, 47%, 5%)" } }
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
