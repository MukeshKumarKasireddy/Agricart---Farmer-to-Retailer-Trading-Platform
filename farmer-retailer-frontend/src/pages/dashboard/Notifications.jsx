import { useEffect, useState } from "react";
import api from "../../api/axios";

const Notifications = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await api.get("/notifications");
      setItems(res.data);

      // mark unread as read
      res.data
        .filter(n => !n.read)
        .forEach(n => api.put(`/notifications/${n.id}/read`));
    } catch {
      alert("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  const unreadCount = items.filter(n => !n.read).length;

  if (loading) {
    return (
      <div style={page}>
        <p>Loading notifications...</p>
      </div>
    );
  }

  return (
    <div style={page}>
      {/* HEADER */}
      <div style={header}>
        <h2 style={{ margin: 0 }}>Notifications</h2>
        <span style={badge}>{items.length}</span>

            {unreadCount > 0 && (
      <span style={unreadBadge}>
        {unreadCount} unread
      </span>
    )}
      </div>

      {items.length === 0 && (
        <div style={emptyCard}>
          <p>No notifications yet.</p>
        </div>
      )}

      {/* LIST */}
      <div style={list}>
        {items.map(n => (
          <div
            key={n.id}
            style={{
              ...card,
              borderLeft: n.read
                ? "4px solid #e0e0e0"
                : "4px solid #2A7D3E",
              background: n.read ? "#fff" : "#f6fbf7",
            }}
          >
            <div style={cardTop}>
              <span style={dot(n.read)} />
              <p style={msg}>{n.message}</p>
            </div>

            <div style={time}>
              {new Date(n.createdAt).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ================= STYLES ================= */

const page = {
  padding: 32,
  maxWidth: 800,
  margin: "0 auto",
};

const header = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  marginBottom: 24,
};

const badge = {
  background: "#2A7D3E",
  color: "#fff",
  padding: "4px 12px",
  borderRadius: 20,
  fontSize: 13,
  fontWeight: 600,
};

const list = {
  display: "flex",
  flexDirection: "column",
  gap: 14,
};

const card = {
  background: "#fff",
  padding: 16,
  borderRadius: 12,
  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
  transition: "0.2s",
};

const cardTop = {
  display: "flex",
  gap: 10,
  alignItems: "flex-start",
};

const msg = {
  margin: 0,
  fontWeight: 500,
};

const time = {
  marginTop: 8,
  fontSize: 12,
  color: "#888",
};

const dot = read => ({
  width: 10,
  height: 10,
  borderRadius: "50%",
  marginTop: 6,
  background: read ? "#ccc" : "#2A7D3E",
});

const emptyCard = {
  background: "#fff",
  padding: 24,
  borderRadius: 12,
  textAlign: "center",
  color: "#777",
  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
};

const unreadBadge = {
  background: "#ff9800",
  color: "#fff",
  padding: "4px 12px",
  borderRadius: 20,
  fontSize: 13,
  fontWeight: 600,
};

export default Notifications;
