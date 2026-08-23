import { useState } from 'react'
import "./App.css";

function Chat({ onBack }) {
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'Hi! I am JusGBot. How can I help?' }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const send = async () => {
    const text = input.trim()
    if (!text || loading) return

    const userMsg = { role: 'user', text }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      })

      const data = await res.json()

      if (res.ok) {
        setMessages((prev) => [...prev, {
          role: 'bot',
          text: data.reply,
          agentsUsed: data.agentsUsed || [],
        }])
      } else {
        setMessages((prev) => [...prev, {
          role: 'bot',
          text: `Sorry, something went wrong: ${data.error || 'unknown error'}`,
        }])
      }
    } catch (err) {
      setMessages((prev) => [...prev, { role: 'bot', text: 'Sorry, I could not reach the server.' }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="chat-page">
      <button className="back" onClick={onBack}>← Back to home</button>

      <header className="page-header">
        <h2>JusGBot Chat</h2>
        <p className="subtitle">Ask me anything</p>
        <span className="mode-badge">Single-model mode — upgrading specialists soon</span>
      </header>

      <div className="chat-window">
        {messages.map((m, i) => (
          <div key={i} className={`msg ${m.role}`}>
            <span className="msg-label">{m.role === 'bot' ? 'JusGBot' : 'You'}</span>
            <p>{m.text}</p>
            {m.agentsUsed && m.agentsUsed.length > 0 && (
              <div className="agent-tags">
                {m.agentsUsed.map((a, j) => (
                  <span key={j}
