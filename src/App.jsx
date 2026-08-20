import { useState } from 'react'

function Landing({ onStart }) {
  return (
    <div className="landing">
      <header className="topnav">
        <div className="logo">JusGBot</div>
        <nav className="nav-links">
          <button onClick={() => onStart('chat')}>Chat</button>
          <button onClick={() => onStart('dashboard')}>Dashboard</button>
        </nav>
      </header>

      <section className="hero">
        <h1>Meet JusGBot</h1>
        <p className="tagline">Your AI assistant for projects, tasks, and fast answers.</p>
        <button className="cta" onClick={() => onStart('chat')}>Start chatting</button>
      </section>

      <section className="features">
        <div className="feature">
          <h3>AI Chat</h3>
          <p>Conversations that feel human, ready for a real AI backend.</p>
        </div>
        <div className="feature">
          <h3>Dashboard</h3>
          <p>Projects, tasks, and tools in one clean view.</p>
        </div>
        <div className="feature">
          <h3>Mobile ready</h3>
          <p>Responsive layout that works on any screen size.</p>
        </div>
      </section>
    </div>
  )
}

function Chat() {
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'Hi! I am JusGBot. How can I help?' }
  ])
  const [input, setInput] = useState('')

  const send = () => {
    const text = input.trim()
    if (!text) return

    const userMsg = { role: 'user', text }
    const botMsg = {
      role: 'bot',
      text: `You said: "${text}". I'm still learning, but soon I'll connect to a real AI model.`
    }

    setMessages([...messages, userMsg, botMsg])
    setInput('')
  }

  return (
    <div className="chat-page">
      <header className="page-header">
        <h2>JusGBot Chat</h2>
        <p className="subtitle">Ask me anything</p>
      </header>

      <div className="chat-window">
        {messages.map((m, i) => (
          <div key={i} className={`msg ${m.role}`}>
            <span className="msg-label">{m.role === 'bot' ? 'JusGBot' : 'You'}</span>
            <p>{m.text}</p>
          </div>
        ))}
      </div>

      <div className="chat-input">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && send()}
          placeholder="Type your message..."
        />
        <button onClick={send}>Send</button>
      </div>
    </div>
  )
}

function Dashboard() {
  const stats = [
    { title: 'Projects', value: '3 active' },
    { title: 'Tasks', value: '12 today' },
    { title: 'AI Tools', value: '5 available' },
    { title: 'Account', value: 'Free plan' },
  ]

  return (
    <div className="dashboard-page">
      <header className="page-header">
        <h2>Dashboard</h2>
        <p className="subtitle">Your workspace at a glance</p>
      </header>

      <div className="cards">
        {stats.map((s) => (
          <div className="card" key={s.title}>
            <h3>{s.title}</h3>
            <p>{s.value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function App() {
  const [page, setPage] = useState('landing')

  return (
    <div className="app">
      {page === 'landing' && <Landing onStart={setPage} />}

      {page !== 'landing' && (
        <>
          <button className="back" onClick={() => setPage('landing')}>
            ← Back to home
          </button>
          {page === 'chat' && <Chat />}
          {page === 'dashboard' && <Dashboard />}
        </>
      )}
    </div>
  )
}
