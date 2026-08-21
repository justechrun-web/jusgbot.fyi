import "./App.css";

function Chat() {
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
      <header className="page-header">
        <h2>JusGBot Chat</h2>
        <p className="subtitle">Ask me anything</p>
      </header>

      <div className="chat-window">
        {messages.map((m, i) => (
          <div key={i} className={`msg ${m.role}`}>
            <span className="msg-label">{m.role === 'bot' ? 'JusGBot' : 'You'}</span>
            <p>{m.text}</p>
            {m.agentsUsed && m.agentsUsed.length > 0 && (
              <div className="agent-tags">
                {m.agentsUsed.map((a, j) => (
                  <span key={j} className="agent-tag">{a}</span>
                ))}
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div className="msg bot">
            <span className="msg-label">JusGBot</span>
            <p>Thinking...</p>
          </div>
        )}
      </div>

      <div className="chat-input">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && send()}
          placeholder="Type your message..."
          disabled={loading}
        />
        <button onClick={send} disabled={loading}>Send</button>
      </div>
    </div>
  )
}
      </nav>

      <main>
        <section className="hero">
          <div className="hero-content">
            <div className="badge">
              <span>✦</span> AI-powered productivity
            </div>

            <h1>
              Your AI assistant.
              <br />
              <span>Just the way you need it.</span>
            </h1>

            <p className="hero-text">
              JusGBot helps you think, create, research, organize, and get
              things done faster with an intelligent AI assistant built for
              everyday work.
            </p>

            <div className="hero-buttons">
              <button className="primary-btn">
                Start Using JusGBot →
              </button>

              <button className="secondary-btn">
                See How It Works
              </button>
            </div>

            <p className="no-card">No credit card required.</p>
          </div>

          <div className="bot-card">
            <div className="bot-header">
              <div className="bot-avatar">J</div>
              <div>
                <strong>JusGBot</strong>
                <span>AI Assistant</span>
              </div>
              <div className="online-dot"></div>
            </div>

            <div className="chat-area">
              <div className="message bot-message">
                Hey! 👋 I'm JusGBot. What can I help you accomplish today?
              </div>

              <div className="message user-message">
                Help me organize my business tasks.
              </div>

              <div className="message bot-message">
                Absolutely. I can help you organize your tasks, prioritize
                them, and create a plan to get everything done.
              </div>
            </div>

            <div className="chat-input">
              <span>Ask JusGBot anything...</span>
              <button>↑</button>
            </div>
          </div>
        </section>

        <section className="features" id="features">
          <div className="section-heading">
            <span>POWERFUL AI</span>
            <h2>One assistant. Endless possibilities.</h2>
            <p>
              JusGBot gives you intelligent tools to help you move from idea
              to execution.
            </p>
          </div>

          <div className="feature-grid">
            <div className="feature-card">
              <div className="feature-icon">✦</div>
              <h3>AI Chat</h3>
              <p>
                Ask questions, brainstorm ideas, solve problems, and get
                intelligent answers instantly.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3>Create Faster</h3>
              <p>
                Generate documents, content, plans, emails, ideas, and more
                in seconds.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">◈</div>
              <h3>Stay Organized</h3>
              <p>
                Turn conversations into tasks, plans, workflows, and
                actionable next steps.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3>Built for You</h3>
              <p>
                A personalized AI experience designed to grow with your
                projects and business.
              </p>
            </div>
          </div>
        </section>

        <section className="how-it-works" id="how-it-works">
          <div className="section-heading">
            <span>SIMPLE WORKFLOW</span>
            <h2>Ask. Create. Accomplish.</h2>
          </div>

          <div className="steps">
            <div className="step">
              <div className="step-number">01</div>
              <h3>Tell JusGBot what you need</h3>
              <p>
                Describe your goal, question, project, or problem in natural
                language.
              </p>
            </div>

            <div className="step">
              <div className="step-number">02</div>
              <h3>JusGBot goes to work</h3>
              <p>
                Your AI assistant analyzes your request and helps create the
                best solution.
              </p>
            </div>

            <div className="step">
              <div className="step-number">03</div>
              <h3>Get things done</h3>
              <p>
                Turn AI-powered ideas into real actions, documents, plans,
                and results.
              </p>
            </div>
          </div>
        </section>

        <section className="cta">
          <h2>Ready to meet your new AI assistant?</h2>
          <p>Start using JusGBot and put AI to work for you.</p>
          <button className="primary-btn">Get Started Free →</button>
        </section>
      </main>

      <footer>
        <div className="logo">
          <span className="logo-mark">J</span>
          <span>JusGBot</span>
        </div>

        <p>© 2026 JusGBot. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
