import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../api/axios";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({});
  const navigate = useNavigate();

  /* ---------------- LOAD PROFILE ---------------- */
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

  /* ---------------- HANDLE CHANGE ---------------- */
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  /* ---------------- SAVE ---------------- */
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
    <div style={{ padding: 32 }}>
      {/* HEADER */}
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ marginBottom: 4 }}>My Profile</h2>
        <p style={{ color: "#777" }}>
          Manage your personal information
        </p>
      </div>

{/* ================= VERIFICATION SECTION (FARMER ONLY) ================= */}
{user.role === "FARMER" && (
  <div
    style={{
      background: "#f7f7f7",
      padding: "12px 16px",
      borderRadius: 10,
      marginBottom: 20,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    }}
  >
    <div>
      <strong>Verification Status: </strong>

      {(!user.verificationStatus ||
        user.verificationStatus === "UNVERIFIED") && (
        <span style={{ color: "#d32f2f" }}>
          Not Verified
        </span>
      )}

      {user.verificationStatus === "PENDING" && (
        <span style={{ color: "#ff9800" }}>
          Pending Approval
        </span>
      )}

      {user.verificationStatus === "REJECTED" && (
        <span style={{ color: "#d32f2f" }}>
          Rejected
        </span>
      )}

      {user.verificationStatus === "VERIFIED" && (
        <span style={{ color: "#2e7d32" }}>
          Verified
        </span>
      )}
    </div>

    {/* BUTTONS */}
    {(user.verificationStatus === "UNVERIFIED" ||
      !user.verificationStatus ||
      user.verificationStatus === "REJECTED") && (
      <button
        onClick={() => navigate("/dashboard/verification")}
        style={{
          background: "#2A7D3E",
          color: "#fff",
          border: "none",
          padding: "8px 14px",
          borderRadius: 6,
          cursor: "pointer",
          fontWeight: 600,
        }}
      >
        Verify Now
      </button>
    )}
  </div>
)}

      {/* PROFILE CARD */}
      <div style={card}>
        {/* AVATAR */}
        <div style={{ textAlign: "center" }}>
          <img
            src={user.avatarUrl}
            alt="avatar"
            style={avatar}
            onError={(e) => (e.target.src = "/avatars/default.png")}
          />
        </div>

        {/* RIGHT SIDE */}
        <div style={{ flex: 1 }}>
          {!editMode ? (
            <>
              <Row label="Name" value={user.name} />
              <Row label="Email" value={user.email} />
              <Row label="Role" value={user.role} />
              <Row label="Phone" value={user.phone || "—"} />
              <Row label="Village" value={user.village || "—"} />
              <Row label="City" value={user.city || "—"} />
              <Row label="Pincode" value={user.pincode || "—"} />

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

              <Input
                label="Village"
                name="village"
                value={form.village || ""}
                onChange={handleChange}
              />

              <Input
                label="City"
                name="city"
                value={form.city || ""}
                onChange={handleChange}
              />

              <Input
                label="Pincode"
                name="pincode"
                value={form.pincode || ""}
                onChange={handleChange}
              />

              <div style={{ marginTop: 16 }}>
                <button style={saveBtn} onClick={save}>
                  Save
                </button>

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

/* ---------------- COMPONENTS ---------------- */

const Row = ({ label, value }) => (
  <p style={row}>
    <strong>{label}:</strong> {value}
  </p>
);

const Input = ({ label, ...props }) => (
  <div style={{ marginBottom: 12 }}>
    <label style={{ fontWeight: 600 }}>{label}</label>
    <input {...props} style={input} />
  </div>
);

/* ---------------- STYLES ---------------- */

const card = {
  background: "#fff",
  padding: 24,
  borderRadius: 12,
  display: "flex",
  gap: 32,
  alignItems: "flex-start",
  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
};

const avatar = {
  width: 120,
  height: 120,
  borderRadius: "50%",
  objectFit: "cover",
};

const row = {
  marginBottom: 10,
  fontSize: 15,
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
