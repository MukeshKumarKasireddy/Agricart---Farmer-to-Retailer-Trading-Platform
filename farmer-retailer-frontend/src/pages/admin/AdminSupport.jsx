import { useEffect, useState } from "react";
import api from "../../api/axios";

const AdminSupport = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  const [replyingId, setReplyingId] = useState(null);
  const [replyText, setReplyText] = useState("");

  /* ================= LOAD ================= */
  async function load() {
    try {
      setLoading(true);
      const res = await api.get("/support/admin");
      setTickets(res.data);
    } catch {
      alert("Failed to load support messages");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  /* ================= REPLY ================= */
  const sendReply = async (id) => {
    if (!replyText.trim()) return alert("Reply cannot be empty");

    try {
      await api.post(`/support/${id}/reply`, {
        reply: replyText,
      });

      setReplyingId(null);
      setReplyText("");
      load();
    } catch {
      alert("Reply failed");
    }
  };

  /* ================= RESOLVE ================= */
  const resolve = async (id) => {
    if (!window.confirm("Mark this ticket resolved?")) return;

    await api.put(`/support/${id}/resolve`);
    load();
  };

  /* ================= UI ================= */
  if (loading) return <p style={{ padding: 40 }}>Loading support tickets...</p>;

  return (
    <div style={container}>
      <h1 style={title}>Support Inbox</h1>

      {tickets.length === 0 && (
        <p style={{ color: "#777" }}>No support messages yet.</p>
      )}

      <div style={grid}>
        {tickets.map((t) => (
          <div key={t.id} style={card}>
            <div style={header}>
              <div>
                <h3 style={{ margin: 0 }}>{t.subject}</h3>
                <p style={{ margin: 0, color: "#666" }}>
                  {t.user?.name} • {t.user?.email}
                </p>
              </div>

              <span
                style={{
                  ...badge,
                  background: t.status === "OPEN" ? "#ff9800" : "#2A7D3E",
                }}
              >
                {t.status}
              </span>
            </div>

            <p style={message}>{t.message}</p>

            {/* ADMIN REPLY */}
            {t.adminReply && (
              <div style={replyBox}>
                <b>Admin Reply:</b>
                <p>{t.adminReply}</p>
              </div>
            )}

            {/* ACTIONS */}
            {t.status === "OPEN" && (
              <>
                {replyingId === t.id ? (
                  <div style={{ marginTop: 10 }}>
                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Write reply..."
                      style={textarea}
                    />

                    <div style={btnRow}>
                      <button
                        style={greenBtn}
                        onClick={() => sendReply(t.id)}
                      >
                        Send Reply
                      </button>

                      <button
                        style={grayBtn}
                        onClick={() => {
                          setReplyingId(null);
                          setReplyText("");
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div style={btnRow}>
                    <button
                      style={blueBtn}
                      onClick={() => setReplyingId(t.id)}
                    >
                      Reply
                    </button>

                    <button
                      style={redBtn}
                      onClick={() => resolve(t.id)}
                    >
                      Resolve
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

/* ================= STYLES ================= */

const container = { padding: 32 };
const title = { marginBottom: 24 };

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill,minmax(400px,1fr))",
  gap: 20,
};

const card = {
  background: "#fff",
  padding: 20,
  borderRadius: 12,
  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
};

const header = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 10,
};

const badge = {
  color: "#fff",
  padding: "4px 10px",
  borderRadius: 20,
  fontSize: 12,
};

const message = {
  background: "#f9f9f9",
  padding: 12,
  borderRadius: 8,
};

const replyBox = {
  background: "#eef6ff",
  padding: 12,
  borderRadius: 8,
  marginTop: 10,
};

const textarea = {
  width: "100%",
  padding: 10,
  borderRadius: 8,
  border: "1px solid #ddd",
  minHeight: 80,
};

const btnRow = {
  display: "flex",
  gap: 10,
  marginTop: 10,
};

const blueBtn = {
  flex: 1,
  background: "#1976d2",
  color: "#fff",
  border: "none",
  padding: 8,
  borderRadius: 6,
  cursor: "pointer",
};

const greenBtn = {
  flex: 1,
  background: "#2A7D3E",
  color: "#fff",
  border: "none",
  padding: 8,
  borderRadius: 6,
};

const redBtn = {
  flex: 1,
  background: "#d32f2f",
  color: "#fff",
  border: "none",
  padding: 8,
  borderRadius: 6,
};

const grayBtn = {
  flex: 1,
  background: "#999",
  color: "#fff",
  border: "none",
  padding: 8,
  borderRadius: 6,
};

export default AdminSupport;
