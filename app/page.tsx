"use client";

import { useEffect, useMemo, useState } from "react";
import { v4 as uuid } from "uuid";

type Message = { role: "user" | "assistant"; content: string; ts: number };

export default function HomePage() {
  const [thread, setThread] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [leadEmail, setLeadEmail] = useState("");
  const [leadPhone, setLeadPhone] = useState("");
  const [leadName, setLeadName] = useState("");
  const [saving, setSaving] = useState(false);
  const sessionId = useMemo(() => uuid(), []);

  useEffect(() => {
    setThread([
      { role: "assistant", content: "Hi! I can send a cold email to your lead and, if they don’t reply within a day, I’ll automatically place a follow-up voice call.", ts: Date.now() }
    ]);
  }, []);

  const send = async () => {
    if (!input.trim()) return;
    const userMsg: Message = { role: "user", content: input.trim(), ts: Date.now() };
    setThread((t) => [...t, userMsg]);
    setInput("");

    const res = await fetch("/api/agent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId, message: userMsg.content })
    });
    const data = await res.json();
    const assistantMsg: Message = { role: "assistant", content: data.reply ?? "", ts: Date.now() };
    setThread((t) => [...t, assistantMsg]);
  };

  const saveLead = async () => {
    if (!leadEmail && !leadPhone) return;
    setSaving(true);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: leadName || undefined, email: leadEmail || undefined, phone: leadPhone || undefined })
      });
      const data = await res.json();
      if (data.ok) {
        setThread((t) => [
          ...t,
          { role: "assistant", content: `Saved lead. I will email ${leadEmail || leadPhone}. If no reply in 24h, I will auto-call.`, ts: Date.now() }
        ]);
        setLeadEmail("");
        setLeadPhone("");
        setLeadName("");
      } else {
        setThread((t) => [...t, { role: "assistant", content: `Error: ${data.error || "unknown"}`, ts: Date.now() }]);
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <main style={{ maxWidth: 860, margin: "40px auto", padding: 24 }}>
      <h1 style={{ fontSize: 28, marginBottom: 8 }}>Agentic Outreach</h1>
      <p style={{ marginBottom: 24, color: "#334155" }}>
        Collect a lead below and I’ll send a cold email. If there’s no response within 24 hours, I’ll automatically place a follow-up voice call.
      </p>

      <section style={{ display: "grid", gap: 12, gridTemplateColumns: "1fr 1fr 1fr auto" }}>
        <input placeholder="Lead Name (optional)" value={leadName} onChange={(e) => setLeadName(e.target.value)} style={inputStyle} />
        <input placeholder="Lead Email" value={leadEmail} onChange={(e) => setLeadEmail(e.target.value)} style={inputStyle} />
        <input placeholder="Lead Phone (+1...)" value={leadPhone} onChange={(e) => setLeadPhone(e.target.value)} style={inputStyle} />
        <button onClick={saveLead} disabled={saving} style={buttonStyle}>{saving ? "Saving..." : "Save"}</button>
      </section>

      <div style={{ height: 24 }} />

      <section style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: 8, padding: 16 }}>
        <div style={{ height: 360, overflow: "auto", display: "flex", flexDirection: "column", gap: 8 }}>
          {thread.map((m, i) => (
            <div key={i} style={{ alignSelf: m.role === "user" ? "flex-end" : "flex-start", maxWidth: "80%" }}>
              <div style={{
                background: m.role === "user" ? "#0ea5e9" : "#f1f5f9",
                color: m.role === "user" ? "white" : "#0f172a",
                padding: "8px 12px",
                borderRadius: 12
              }}>
                {m.content}
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
          <input
            placeholder="Ask the agent to draft email, status, etc."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            style={{ ...inputStyle, flex: 1 }}
            onKeyDown={(e) => { if (e.key === 'Enter') send(); }}
          />
          <button onClick={send} style={buttonStyle}>Send</button>
        </div>
      </section>
    </main>
  );
}

const inputStyle: React.CSSProperties = {
  border: "1px solid #cbd5e1",
  borderRadius: 8,
  padding: "10px 12px",
  background: "white"
};

const buttonStyle: React.CSSProperties = {
  border: "1px solid #0ea5e9",
  background: "#0ea5e9",
  color: "white",
  borderRadius: 8,
  padding: "10px 16px",
  cursor: "pointer"
};
