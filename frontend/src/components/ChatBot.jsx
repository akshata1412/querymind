import { useState, useRef, useEffect } from "react"
import { sendChat } from "../api/client"
import { Send, Bot } from "lucide-react"
 
const s = {
  surface: "#060e20",
  surfaceContainerLow: "#091328",
  surfaceContainer: "#0f1930",
  surfaceContainerHigh: "#141f38",
  surfaceContainerHighest: "#192540",
  primary: "#a3a6ff",
  primaryContainer: "#9396ff",
  secondary: "#53ddfc",
  secondaryContainer: "#00687a",
  onSurface: "#dee5ff",
  onSurfaceVariant: "#a3aac4",
  outlineVariant: "#40485d",
}
 
export default function ChatBot({ schema }) {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi! I'm QueryMind AI. Ask me anything about your database — tables, relationships, or query suggestions!" }
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
      setMessages(prev => [...prev, { role: "assistant", content: "Sorry, I encountered an error. Please try again." }])
    }
    setLoading(false)
  }
 
  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", fontFamily: "Inter, sans-serif" }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        .chat-input:focus { border-color: ${s.primary} !important; box-shadow: 0 0 0 3px rgba(163,166,255,0.12) !important; outline: none; }
        .send-btn:hover:not(:disabled) { background: ${s.primary} !important; transform: scale(1.05); }
        .send-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .msg-bubble { animation: fadeIn 0.25s ease-out; }
        .chat-scroll::-webkit-scrollbar { width: 4px; }
        .chat-scroll::-webkit-scrollbar-track { background: transparent; }
        .chat-scroll::-webkit-scrollbar-thumb { background: ${s.outlineVariant}; border-radius: 2px; }
      `}</style>
 
      <div style={{
        display: "flex", flexDirection: "column", height: "75vh",
        background: "rgba(25,37,64,0.4)",
        backdropFilter: "blur(12px)",
        borderRadius: "12px",
        border: `1px solid rgba(64,72,93,0.2)`,
        overflow: "hidden"
      }}>
        {/* Header */}
        <div style={{ padding: "14px 18px", borderBottom: `1px solid rgba(64,72,93,0.2)`, display: "flex", alignItems: "center", gap: "10px", backgroundColor: s.surfaceContainerLow }}>
          <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: `linear-gradient(135deg, ${s.primary}, ${s.primaryContainer})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Bot size={16} color="#060e20" />
          </div>
          <div>
            <span style={{ fontWeight: 600, color: s.onSurface, fontSize: "14px" }}>AI Database Assistant</span>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "2px" }}>
              <div style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: s.secondary }} />
              <span style={{ color: s.onSurfaceVariant, fontSize: "11px" }}>Online · {Object.keys(schema).length} tables loaded</span>
            </div>
          </div>
          <div style={{ marginLeft: "auto", backgroundColor: `${s.secondary}15`, padding: "3px 10px", borderRadius: "999px", border: `1px solid ${s.secondary}30` }}>
            <span style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: s.secondary }}>AI</span>
          </div>
        </div>
 
        {/* Messages */}
        <div className="chat-scroll" style={{ flex: 1, overflowY: "auto", padding: "20px 18px", display: "flex", flexDirection: "column", gap: "16px" }}>
          {messages.map((m, i) => (
            <div key={i} className="msg-bubble" style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start", gap: "10px", alignItems: "flex-end" }}>
              {m.role === "assistant" && (
                <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: `linear-gradient(135deg, ${s.primary}, ${s.primaryContainer})`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: "12px" }}>🤖</div>
              )}
              <div style={{
                maxWidth: "72%", padding: "10px 14px", borderRadius: m.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                fontSize: "14px", lineHeight: 1.6,
                background: m.role === "user" ? `linear-gradient(135deg, ${s.primary}, ${s.primaryContainer})` : s.surfaceContainerHigh,
                color: m.role === "user" ? "#060e20" : s.onSurface,
                fontWeight: m.role === "user" ? 500 : 400
              }}>
                {m.content}
              </div>
              {m.role === "user" && (
                <div style={{ width: "28px", height: "28px", borderRadius: "50%", backgroundColor: s.surfaceContainerHighest, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: "12px", border: `1px solid rgba(64,72,93,0.3)` }}>👤</div>
              )}
            </div>
          ))}
 
          {loading && (
            <div style={{ display: "flex", gap: "10px", alignItems: "flex-end" }}>
              <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: `linear-gradient(135deg, ${s.primary}, ${s.primaryContainer})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px" }}>🤖</div>
              <div style={{ padding: "12px 16px", borderRadius: "16px 16px 16px 4px", backgroundColor: s.surfaceContainerHigh, display: "flex", gap: "5px", alignItems: "center" }}>
                {[0, 0.2, 0.4].map((delay, i) => (
                  <div key={i} style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: s.primary, animation: `pulse 1.2s ease-in-out ${delay}s infinite` }} />
                ))}
                <style>{`@keyframes pulse { 0%, 100% { opacity: 0.3; transform: scale(0.8); } 50% { opacity: 1; transform: scale(1.2); } }`}</style>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
 
        {/* Input */}
        <div style={{ padding: "14px 18px", borderTop: `1px solid rgba(64,72,93,0.2)`, display: "flex", gap: "10px", alignItems: "center", backgroundColor: s.surfaceContainerLow }}>
          <input
            className="chat-input"
            style={{
              flex: 1, backgroundColor: "#000000",
              border: `1px solid rgba(64,72,93,0.3)`,
              borderRadius: "999px", padding: "10px 18px",
              color: s.onSurface, fontSize: "14px",
              fontFamily: "Inter, sans-serif", transition: "all 0.2s"
            }}
            placeholder="Ask about your database..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
          />
          <button
            className="send-btn"
            onClick={send}
            disabled={loading || !input.trim()}
            style={{
              background: `linear-gradient(135deg, ${s.primary}, ${s.primaryContainer})`,
              border: "none", borderRadius: "50%", width: "40px", height: "40px",
              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0, transition: "all 0.2s",
              boxShadow: "0 4px 12px rgba(163,166,255,0.25)"
            }}
          >
            <Send size={16} color="#060e20" />
          </button>
        </div>
      </div>
    </div>
  )
}