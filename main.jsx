import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Bot, MessageSquare, LayoutDashboard, FolderKanban, CheckSquare,
  Settings, Menu, X, Send, Sparkles, ArrowRight, Zap, ShieldCheck
} from "lucide-react";
import "./styles.css";

const features = [
  ["AI Chat", "Ask questions, brainstorm, write, and plan with your AI workspace.", MessageSquare],
  ["Projects", "Keep conversations and work organized in one place.", FolderKanban],
  ["Tasks", "Turn ideas into actionable tasks and track progress.", CheckSquare],
  ["Secure Workspace", "Built with a cloud-ready architecture for future authentication and APIs.", ShieldCheck]
];

function Landing({ onStart }) {
  return (
    <div className="landing">
      <nav className="topbar">
        <div className="brand"><span className="brand-mark"><Bot size={20}/></span>JusGBot</div>
        <button className="nav-button" onClick={onStart}>Open Workspace <ArrowRight size={16}/></button>
      </nav>
      <main className="hero">
        <div className="eyebrow"><Sparkles size={15}/> AI workspace for getting things done</div>
        <h1>Your ideas.<br/><span>Your AI workspace.</span></h1>
        <p className="hero-copy">JusGBot brings chat, projects, tasks, and AI tools together in one simple workspace.</p>
        <div className="hero-actions">
          <button className="primary" onClick={onStart}>Launch JusGBot <ArrowRight size={18}/></button>
          <button className="secondary" onClick={onStart}>View Dashboard</button>
        </div>
        <div className="feature-grid">
          {features.map(([title, text, Icon]) => (
            <div className="feature-card" key={title}>
              <div className="icon-box"><Icon size={20}/></div>
              <h3>{title}</h3><p>{text}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

function Sidebar({ page, setPage, mobileOpen, setMobileOpen }) {
  const items = [
    ["Overview", "overview", LayoutDashboard],
    ["AI Chat", "chat", MessageSquare],
    ["Projects", "projects", FolderKanban],
    ["Tasks", "tasks", CheckSquare],
    ["Settings", "settings", Settings]
  ];
  return (
    <>
      {mobileOpen && <div className="mobile-overlay" onClick={() => setMobileOpen(false)}/>}
      <aside className={`sidebar ${mobileOpen ? "open" : ""}`}>
        <div className="side-brand"><span className="brand-mark"><Bot size={19}/></span>JusGBot</div>
        <div className="side-label">WORKSPACE</div>
        {items.map(([label, id, Icon]) => (
          <button key={id} className={`side-item ${page === id ? "active" : ""}`} onClick={() => {setPage(id);setMobileOpen(false)}}>
            <Icon size={18}/><span>{label}</span>
          </button>
        ))}
        <div className="side-bottom">
          <div className="upgrade-card"><Zap size={18}/><div><strong>AI Power</strong><small>Ready for API integration</small></div></div>
        </div>
      </aside>
    </>
  );
}

function Chat() {
  const [messages, setMessages] = useState([
    {role:"bot", text:"Hi! I'm JusGBot. What would you like to work on today?"}
  ]);
  const [input, setInput] = useState("");
  const send = () => {
    const text = input.trim();
    if (!text) return;
    setMessages(m => [...m, {role:"user", text}, {role:"bot", text:"I’m ready for your AI provider to be connected. This interface is already set up for the API layer."}]);
    setInput("");
  };
  return <div className="chat-shell">
    <div className="chat-header"><div><h2>AI Chat</h2><p>Your JusGBot workspace</p></div><span className="status"><i/> Ready</span></div>
    <div className="messages">{messages.map((m,i)=><div className={`message-row ${m.role}`} key={i}><div className={`avatar ${m.role}`}>{m.role==="bot"?<Bot size={17}/>: "You"}</div><div className="bubble">{m.text}</div></div>)}</div>
    <div className="composer"><input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder="Message JusGBot..." /><button onClick={send}><Send size={18}/></button></div>
  </div>;
}

function Page({ page }) {
  if (page === "chat") return <Chat/>;
  const data = {
    overview:["Welcome to JusGBot","Your AI workspace is ready.","Start a conversation or organize your work below."],
    projects:["Projects","Organize your AI work into focused projects.","Project management is ready for the next backend phase."],
    tasks:["Tasks","Turn conversations into action.","Your task workspace is ready to connect to persistence."],
    settings:["Settings","Workspace settings","Authentication, billing, and AI provider settings can be connected next."]
  }[page];
  return <div className="page-card"><div className="big-icon"><Sparkles size={25}/></div><h1>{data[0]}</h1><p>{data[1]}</p><div className="notice">{data[2]}</div></div>;
}

function Dashboard({ onHome }) {
  const [page,setPage] = useState("overview");
  const [mobileOpen,setMobileOpen] = useState(false);
  return <div className="dashboard">
    <Sidebar {...{page,setPage,mobileOpen,setMobileOpen}}/>
    <section className="main">
      <header className="mobile-header"><button onClick={()=>setMobileOpen(true)}><Menu/></button><div className="brand"><span className="brand-mark"><Bot size={18}/></span>JusGBot</div><button onClick={onHome}><X size={19}/></button></header>
      <div className="content"><Page page={page}/></div>
    </section>
  </div>;
}

function App() {
  const [started,setStarted] = useState(false);
  return started ? <Dashboard onHome={()=>setStarted(false)}/> : <Landing onStart={()=>setStarted(true)}/>;
}
createRoot(document.getElementById("root")).render(<App />);
