import { useState, useRef, useEffect } from "react"
import { sendChat } from "../api/client"
import { Send, Bot } from "lucide-react"

export default function ChatBot({ schema }) {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi! I'm QueryMind AI. Ask me anything about your database!" }
  ])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const send = async () => {
    if (!input.trim() || loading) return
    const question = input
    setInput("")
    const history = messages.map(m => ({ role: m.role === "assistant" ? "assistant" : "user", content: m.content }))
    setMessages(prev => [...prev, { role: "user", content: question }])
    setLoading(true)
    try {
      const { data } = await sendChat(question, schema, history)
      setMessages(prev => [...prev, { role: "assistant", content: data.response }])
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "Sorry, I encountered an error." }])
    }
    setLoading(false)
  }

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", display: "flex", flexDirection: "column", height: "75vh", backgroundColor: "#1B2D42", borderRadius: "16px", border: "1px solid #00B4D8", overflow: "hidden" }}>
      <div style={{ padding: "14px 16px", borderBottom: "1px solid #00B4D8", display: "flex", alignItems: "center", gap: "10px" }}>
        <Bot size={20} color="#00B4D8" />
        <span style={{ fontWeight: "bold", color: "white" }}>AI Database Assistant</span>
        <span style={{ marginLeft: "auto", color: "#6b7280", fontSize: "12px" }}>{Object.keys(schema).length} tables loaded</span>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: "12px" }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start", gap: "10px" }}>
            {m.role === "assistant" && <div style={{ width: "32px", height: "32px", borderRadius: "50%", backgroundColor: "#00B4D8", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>🤖</div>}
            <div style={{ maxWidth: "75%", padding: "10px 14px", borderRadius: "16px", fontSize: "14px", lineHeight: "1.5", backgroundColor: m.role === "user" ? "#00B4D8" : "#162236", color: m.role === "user" ? "#0D1B2A" : "white" }}>
              {m.content}
            </div>
            {m.role === "user" && <div style={{ width: "32px", height: "32px", borderRadius: "50%", backgroundColor: "#F4A261", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>👤</div>}
          </div>
        ))}
        {loading && (
          <div style={{ display: "flex", gap: "10px" }}>
            <div style={{ width: "32px", height: "32px", borderRadius: "50%", backgroundColor: "#00B4D8", display: "flex", alignItems: "center", justifyContent: "center" }}>🤖</div>
            <div style={{ padding: "10px 14px", borderRadius: "16px", backgroundColor: "#162236", color: "#00B4D8" }}>Thinking...</div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div style={{ padding: "12px 16px", borderTop: "1px solid #00B4D8", display: "flex", gap: "10px" }}>
        <input
          style={{ flex: 1, backgroundColor: "#0D1B2A", border: "1px solid #00B4D8", borderRadius: "20px", padding: "10px 16px", color: "white", outline: "none", fontSize: "14px" }}
          placeholder="Ask about your database..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
        />
        <button onClick={send} style={{ backgroundColor: "#00B4D8", border: "none", borderRadius: "50%", width: "42px", height: "42px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Send size={18} color="#0D1B2A" />
        </button>
      </div>
    </div>
  )
}