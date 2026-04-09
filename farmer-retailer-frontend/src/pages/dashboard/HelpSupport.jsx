import { useState } from "react";
import api from "../../api/axios";

const HelpSupport = () => {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const send = async () => {
    if (!subject.trim() || !message.trim()) {
      alert("Please fill all fields");
      return;
    }

    try {
      setLoading(true);
      await api.post("/support", { subject, message });

      setSent(true);
      setSubject("");
      setMessage("");

      setTimeout(() => setSent(false), 4000);
    } catch {
      alert("Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={page}>
      <div style={card}>
        {/* HEADER */}
        <div style={header}>
          <h2 style={{ margin: 0 }}>Help & Support</h2>
          <p style={sub}>
            Having trouble? Send a message to admin and we’ll help you.
          </p>
        </div>

        {/* SUCCESS */}
        {sent && (
          <div style={successBox}>
            ✅ Your message has been sent successfully.
          </div>
        )}

        {/* SUBJECT */}
        <div style={field}>
          <label style={label}>Subject</label>
          <input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Order issue, payment issue, etc."
            style={input}
          />
        </div>

        {/* MESSAGE */}
        <div style={field}>
          <label style={label}>Message</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Describe your issue clearly..."
            style={textarea}
          />
          <span style={charCount}>
            {message.length}/500
          </span>
        </div>

        {/* BUTTON */}
        <button
          onClick={send}
          style={{
            ...button,
            opacity: loading ? 0.7 : 1,
            cursor: loading ? "not-allowed" : "pointer",
          }}
          disabled={loading}
        >
          {loading ? "Sending..." : "Send Message"}
        </button>
      </div>
    </div>
  );
};

/* ================= STYLES ================= */

const page = {
  padding: 32,
  display: "flex",
  justifyContent: "center",
};

const card = {
  width: "100%",
  maxWidth: 650,
  background: "#fff",
  padding: 32,
  borderRadius: 16,
  boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
};

const header = { marginBottom: 24 };

const sub = {
  color: "#777",
  marginTop: 6,
};

const successBox = {
  background: "#e8f5e9",
  color: "#2A7D3E",
  padding: 12,
  borderRadius: 8,
  marginBottom: 20,
  fontWeight: 600,
};

const field = { marginBottom: 20 };

const label = {
  fontWeight: 600,
  display: "block",
  marginBottom: 6,
};

const input = {
  width: "100%",
  padding: 12,
  borderRadius: 8,
  border: "1px solid #ddd",
  outline: "none",
  fontSize: 14,
};

const textarea = {
  width: "100%",
  height: 140,
  padding: 12,
  borderRadius: 8,
  border: "1px solid #ddd",
  outline: "none",
  resize: "none",
  fontSize: 14,
};

const charCount = {
  fontSize: 12,
  color: "#999",
  float: "right",
  marginTop: 6,
};

const button = {
  width: "100%",
  background: "#2A7D3E",
  color: "#fff",
  border: "none",
  padding: 14,
  borderRadius: 10,
  fontWeight: 600,
  fontSize: 15,
};

export default HelpSupport;
