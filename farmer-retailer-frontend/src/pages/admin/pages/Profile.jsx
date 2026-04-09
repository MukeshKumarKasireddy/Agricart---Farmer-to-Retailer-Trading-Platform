import { useEffect, useState } from "react";
import api from "../../../api/axios";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({});

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get("/users/me");
        setUser(res.data);
        setForm(res.data);
      } catch {
        alert("Failed to load profile");
      }
    };
    load();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const save = async () => {
    try {
      const res = await api.put("/users/me", form);
      setUser(res.data);
      setEditMode(false);
      alert("Profile updated");
    } catch {
      alert("Update failed");
    }
  };

  if (!user) return <p style={{ padding: 32 }}>Loading profile...</p>;

  return (
    <div style={{ padding: 32, maxWidth: 800 }}>
      <h2 style={{ marginBottom: 6 }}>Admin Profile</h2>
      <p style={{ color: "#777", marginBottom: 24 }}>
        Administrator account details
      </p>

      <div style={card}>
        {/* LEFT */}
        <div style={{ textAlign: "center" }}>
          <img
            src={user.avatarUrl || "/avatars/default.png"}
            alt="avatar"
            style={avatar}
          />

          <div style={roleBadge}>
            {user.role}
          </div>
        </div>

        {/* RIGHT */}
        <div style={{ flex: 1 }}>
          {!editMode ? (
            <>
              <Row label="Name" value={user.name} />
              <Row label="Email" value={user.email} />
              <Row label="Phone" value={user.phone || "—"} />

              <button style={editBtn} onClick={() => setEditMode(true)}>
                Edit Profile
              </button>
            </>
          ) : (
            <>
              <Input
                label="Name"
                name="name"
                value={form.name || ""}
                onChange={handleChange}
              />

              <Input
                label="Phone"
                name="phone"
                value={form.phone || ""}
                onChange={handleChange}
              />

              <div style={{ marginTop: 16 }}>
                <button style={saveBtn} onClick={save}>Save</button>

                <button
                  style={cancelBtn}
                  onClick={() => {
                    setEditMode(false);
                    setForm(user);
                  }}
                >
                  Cancel
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

/* ---------- components ---------- */

const Row = ({ label, value }) => (
  <p style={{ marginBottom: 10 }}>
    <strong>{label}:</strong> {value}
  </p>
);

const Input = ({ label, ...props }) => (
  <div style={{ marginBottom: 12 }}>
    <label style={{ fontWeight: 600 }}>{label}</label>
    <input {...props} style={input} />
  </div>
);

/* ---------- styles ---------- */

const card = {
  background: "#fff",
  padding: 24,
  borderRadius: 12,
  display: "flex",
  gap: 32,
  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
};

const avatar = {
  width: 120,
  height: 120,
  borderRadius: "50%",
  objectFit: "cover",
};

const roleBadge = {
  marginTop: 12,
  background: "#1976d2",
  color: "#fff",
  padding: "6px 12px",
  borderRadius: 6,
  fontWeight: 600,
};

const input = {
  width: "100%",
  padding: "8px",
  borderRadius: 6,
  border: "1px solid #ccc",
  marginTop: 4,
};

const editBtn = {
  marginTop: 16,
  background: "#2A7D3E",
  color: "#fff",
  border: "none",
  padding: "8px 16px",
  borderRadius: 6,
  cursor: "pointer",
  fontWeight: 600,
};

const saveBtn = {
  background: "#2A7D3E",
  color: "#fff",
  border: "none",
  padding: "8px 16px",
  borderRadius: 6,
  marginRight: 10,
  cursor: "pointer",
  fontWeight: 600,
};

const cancelBtn = {
  background: "#d32f2f",
  color: "#fff",
  border: "none",
  padding: "8px 16px",
  borderRadius: 6,
  cursor: "pointer",
  fontWeight: 600,
};

export default Profile;
