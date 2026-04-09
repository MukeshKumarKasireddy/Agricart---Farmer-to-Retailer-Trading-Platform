import { useState, useRef, useEffect } from "react";
import axios from "axios";

const Chatbot = () => {
  const [open, setOpen] = useState(false);

  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text:
        "Hi 👋 I'm your Agricart AI assistant. Ask me about farming, orders, payments, or anything."
    }
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const bottomRef = useRef();

  const API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async () => {
    if (!input.trim()) return;

    const userMsg = { role: "user", text: input };
    const updated = [...messages, userMsg];

    setMessages(updated);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post(
        "https://api.openai.com/v1/responses",
        {
          model: "gpt-4o-mini",
          input: [
            {
              role: "system",
              content: `
"You are the AI assistant of an agriculture marketplace app called Agricart."
              `
            },
            ...messages.map(m => ({
              role: m.role,
              content: m.text
            })),
            {
              role: "user",
              content: input    }
          ]
        },
        {
          headers: {
            Authorization: `Bearer ${API_KEY}`,
            "Content-Type": "application/json"
          }
        }
      );

      const reply = res.data.choices[0].content[0].text;

      setMessages(prev => [
        ...prev,
        { role: "assistant", text: reply }
      ]);
    } catch (err) {
        console.error(err);
      setMessages(prev => [
        ...prev,
        { role: "assistant", text: "AI connection error." }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* FLOAT BUTTON + LABEL */}
      <div style={fabWrapper}>
        <button style={fab} onClick={() => setOpen(!open)}>
          🤖
        </button>
        <span style={fabLabel}>Chat with AI</span>
      </div>

      {/* CHAT WINDOW */}
      {open && (
        <div style={box}>
          <div style={header}>
            <b>AI Assistant</b>
            <button style={close} onClick={() => setOpen(false)}>
              ✕
            </button>
          </div>

          <div style={chat}>
            {messages.map((m, i) => (
              <div
                key={i}
                style={
                  m.role === "user"
                    ? userMsgStyle
                    : botMsgStyle
                }
              >
                {m.text}
              </div>
            ))}

            {loading && (
              <div style={botMsgStyle}>Typing...</div>
            )}

            <div ref={bottomRef} />
          </div>

          <div style={inputRow}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask anything..."
              style={inputStyle}
              onKeyDown={e => e.key === "Enter" && send()}
            />
            <button style={btn} onClick={send}>
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
};

/* ================= STYLES ================= */

const fabWrapper = {
  position: "fixed",
  bottom: 24,
  right: 24,
  display: "flex",
  alignItems: "center",
  gap: 10,
  zIndex: 999
};

const fab = {
  background: "#2A7D3E",
  color: "#fff",
  width: 58,
  height: 58,
  borderRadius: "50%",
  border: "none",
  fontSize: 24,
  cursor: "pointer"
};

const fabLabel = {
  background: "#fff",
  padding: "8px 12px",
  borderRadius: 20,
  fontSize: 13,
  boxShadow: "0 2px 6px rgba(0,0,0,0.15)"
};

const box = {
  position: "fixed",
  bottom: 95,
  right: 24,
  width: 420,
  height: 520,
  background: "#fff",
  borderRadius: 18,
  boxShadow: "0 12px 40px rgba(0,0,0,0.25)",
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
  zIndex: 999
};

const header = {
  background: "#2A7D3E",
  color: "#fff",
  padding: 14,
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center"
};

const close = {
  background: "transparent",
  border: "none",
  color: "#fff",
  fontSize: 16,
  cursor: "pointer"
};

const chat = {
  flex: 1,
  padding: 16,
  overflowY: "auto",
  background: "#f6f7f9",
  display: "flex",
  flexDirection: "column"
};

const userMsgStyle = {
  alignSelf: "flex-end",
  background: "#2A7D3E",
  color: "#fff",
  padding: 10,
  borderRadius: 12,
  marginBottom: 10,
  maxWidth: "75%"
};

const botMsgStyle = {
  alignSelf: "flex-start",
  background: "#e4e6eb",
  padding: 10,
  borderRadius: 12,
  marginBottom: 10,
  maxWidth: "75%"
};

const inputRow = {
  display: "flex",
  padding: 12,
  borderTop: "1px solid #eee"
};

const inputStyle = {
  flex: 1,
  padding: 10,
  borderRadius: 8,
  border: "1px solid #ccc"
};

const btn = {
  marginLeft: 8,
  background: "#2A7D3E",
  color: "#fff",
  border: "none",
  padding: "10px 16px",
  borderRadius: 8,
  cursor: "pointer"
};

export default Chatbot;
