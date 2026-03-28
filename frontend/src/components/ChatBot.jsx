import { useState, useRef, useEffect } from "react"
import { sendChat } from "../api/client"
import { Send, Bot, User, Copy } from "lucide-react"
import toast from "react-hot-toast"

function formatMessage(text) {
  if (!text) return null

  const lines = text.split("\n")
  const elements = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]

    // Code block
    if (line.startsWith("```")) {
      const codeLines = []
      i++
      while (i < lines.length && !lines[i].startsWith("```")) {
        codeLines.push(lines[i])
        i++
      }
      elements.push(
        <div key={i} style={{ position: "relative", margin: "10px 0" }}>
          <pre style={{ backgroundColor: "#0D1B2A", borderRadius: "8px", padding: "14px", color: "#00B4D8", fontSize: "12px", overflowX: "auto", whiteSpace: "pre-wrap", margin: 0, border: "1px solid #00B4D8" }}>
            {codeLines.join("\n")}
          </pre>
          <button
            onClick={() => { navigator.clipboard.writeText(codeLines.join("\n")); toast.success("Copied!") }}
            style={{ position: "absolute", top: "8px", right: "8px", background: "rgba(0,180,216,0.2)", border: "1px solid #00B4D8", borderRadius: "4px", color: "#00B4D8", cursor: "pointer", padding: "2px 8px", fontSize: "11px", display: "flex", alignItems: "center", gap: "4px" }}>
            <Copy size={10} /> Copy
          </button>
        </div>
      )
    }
    // Heading
    else if (line.startsWith("### ")) {
      elements.push(<p key={i} style={{ color: "#F4A261", fontWeight: "bold", fontSize: "14px", margin: "12px 0 4px" }}>{line.replace("### ", "")}</p>)
    }
    else if (line.startsWith("## ")) {
      elements.push(<p key={i} style={{ color: "#00B4D8", fontWeight: "bold", fontSize: "15px", margin: "12px 0 4px" }}>{line.replace("## ", "")}</p>)
    }
    // Bold line
    else if (line.startsWith("**") && line.endsWith("**")) {
      elements.push(<p key={i} style={{ color: "white", fontWeight: "bold", margin: "6px 0" }}>{line.replace(/\*\*/g, "")}</p>)
    }
    // Bullet
    else if (line.startsWith("- ") || line.startsWith("• ")) {
      elements.push(
        <div key={i} style={{ display: "flex", gap: "8px", margin: "4px 0" }}>
          <span style={{ color: "#00B4D8", flexShrink: 0 }}>›</span>
          <span style={{ color: "#d1d5db", fontSize: "13px" }}>{line.replace(/^[-•] /, "")}</span>
        </div>
      )
    }
    // Numbered list
    else if (/^\d+\. /.test(line)) {
      const num = line.match(/^(\d+)\. /)[1]
      elements.push(
        <div key={i} style={{ display: "flex", gap: "8px", margin: "4px 0" }}>
          <span style={{ color: "#00B4D8", fontWeight: "bold", flexShrink: 0, minWidth: "20px" }}>{num}.</span>
          <span style={{ color: "#d1d5db", fontSize: "13px" }}>{line.replace(/^\d+\. /, "")}</span>
        </div>
      )
    }
    // Empty line = spacer
    else if (line.trim() === "") {
      elements.push(<div key={i} style={{ height: "6px" }} />)
    }
    // Normal text with inline bold
    else {
      const parts = line.split(/\*\*(.*?)\*\*/g)
      elements.push(
        <p key={i} style={{ color: "#d1d5db", fontSize: "13px", margin: "4px 0", lineHeight: "1.6" }}>
          {parts.map((part, j) =>
            j % 2 === 1
              ? <strong key={j} style={{ color: "white" }}>{part}</strong>
              : part
          )}
        </p>
      )
    }
    i++
  }

  return elements
}

export default function ChatBot({ schema }) {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi! I'm QueryMind AI. Ask me anything about your database schema, table relationships, or let me help you write queries!" }
  ])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)

  const SUGGESTIONS = [
    "What tables do I have?",
    "Explain the relationships",
    "What does the orders table store?",
    "How are customers and orders connected?",
  ]

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const send = async (q = input) => {
    if (!q.trim() || loading) return
    setInput("")
    const history = messages.map(m => ({ role: m.role, content: m.content }))
    setMessages(prev => [...prev, { role: "user", content: q }])
    setLoading(true)
    try {
      const { data } = await sendChat(q, schema, history)
      setMessages(prev => [...prev, { role: "assistant", content: data.response }])
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "Sorry, I encountered an error. Please try again." }])
    }
    setLoading(false)
  }

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", display: "flex", flexDirection: "column", height: "78vh", backgroundColor: "#1B2D42", borderRadius: "16px", border: "1px solid #00B4D8", overflow: "hidden" }}>

      {/* Header */}
      <div style={{ padding: "14px 16px", borderBottom: "1px solid #00B4D8", display: "flex", alignItems: "center", gap: "10px", backgroundColor: "#162236" }}>
        <div style={{ width: "36px", height: "36px", borderRadius: "50%", backgroundColor: "#00B4D8", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Bot size={20} color="#0D1B2A" />
        </div>
        <div>
          <span style={{ fontWeight: "bold", color: "white", fontSize: "15px" }}>AI Database Assistant</span>
          <div style={{ color: "#4ade80", fontSize: "11px" }}>● Online · {Object.keys(schema).length} tables loaded</div>
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: "16px" }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: "flex", gap: "10px", flexDirection: m.role === "user" ? "row-reverse" : "row" }}>
            {/* Avatar */}
            <div style={{ width: "32px", height: "32px", borderRadius: "50%", backgroundColor: m.role === "user" ? "#F4A261" : "#00B4D8", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              {m.role === "user" ? <User size={16} color="#0D1B2A" /> : <Bot size={16} color="#0D1B2A" />}
            </div>

            {/* Bubble */}
            <div style={{
              maxWidth: "80%", padding: "12px 16px", borderRadius: m.role === "user" ? "16px 4px 16px 16px" : "4px 16px 16px 16px",
              backgroundColor: m.role === "user" ? "#00B4D8" : "#162236",
              border: m.role === "assistant" ? "1px solid rgba(0,180,216,0.2)" : "none"
            }}>
              {m.role === "user"
                ? <p style={{ color: "#0D1B2A", margin: 0, fontSize: "14px", fontWeight: "500" }}>{m.content}</p>
                : <div>{formatMessage(m.content)}</div>
              }
            </div>
          </div>
        ))}

        {loading && (
          <div style={{ display: "flex", gap: "10px" }}>
            <div style={{ width: "32px", height: "32px", borderRadius: "50%", backgroundColor: "#00B4D8", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Bot size={16} color="#0D1B2A" />
            </div>
            <div style={{ padding: "12px 16px", borderRadius: "4px 16px 16px 16px", backgroundColor: "#162236", border: "1px solid rgba(0,180,216,0.2)" }}>
              <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
                {[0, 1, 2].map(j => (
                  <div key={j} style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#00B4D8", animation: `bounce 1s ${j * 0.2}s infinite` }} />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Suggestions */}
      {messages.length <= 1 && (
        <div style={{ padding: "0 16px 12px", display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {SUGGESTIONS.map(s => (
            <button key={s} onClick={() => send(s)}
              style={{ fontSize: "12px", backgroundColor: "#162236", color: "#00B4D8", border: "1px solid rgba(0,180,216,0.3)", borderRadius: "20px", padding: "6px 12px", cursor: "pointer" }}>
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div style={{ padding: "12px 16px", borderTop: "1px solid #00B4D8", display: "flex", gap: "10px", backgroundColor: "#162236" }}>
        <input
          style={{ flex: 1, backgroundColor: "#0D1B2A", border: "1px solid #00B4D8", borderRadius: "24px", padding: "10px 18px", color: "white", outline: "none", fontSize: "14px" }}
          placeholder="Ask about your database..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
        />
        <button onClick={() => send()}
          style={{ backgroundColor: "#00B4D8", border: "none", borderRadius: "50%", width: "44px", height: "44px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Send size={18} color="#0D1B2A" />
        </button>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); opacity: 0.4; }
          50% { transform: translateY(-4px); opacity: 1; }
        }
      `}</style>
    </div>
  )
}