import { useEffect, useState } from "react";
import api from "../../../api/axios";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [role, setRole] = useState("FARMER");
  const [search, setSearch] = useState("");

  useEffect(() => {
    api.get("/users").then(res => setUsers(res.data));
  }, []);

  const filteredUsers = users
    .filter(u => u.role === role)
    .filter(u =>
      u.id.toString().includes(search) ||
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
    );

  return (
    <div style={{ padding: "32px" }}>
      <h2>Manage Users</h2>

      <div style={{ display: "flex", gap: "12px", margin: "12px 0" }}>
        <Tab active={role === "FARMER"} onClick={() => setRole("FARMER")} label="Farmers" />
        <Tab active={role === "RETAILER"} onClick={() => setRole("RETAILER")} label="Retailers" />
      </div>

      <input
        placeholder="Search by ID, name, email"
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{ width: "100%", padding: "10px", marginBottom: "16px" }}
      />

      {filteredUsers.map(u => (
        <div key={u.id} style={{
          background: "#fff",
          padding: "12px",
          borderRadius: "8px",
          marginBottom: "8px"
        }}>
          <strong>{u.name}</strong>
          <p style={{ margin: 0 }}>{u.email}</p>
        </div>
      ))}
    </div>
  );
};

const Tab = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    style={{
      padding: "8px 14px",
      borderRadius: "20px",
      border: "none",
      background: active ? "#2A7D3E" : "#ddd",
      color: active ? "#fff" : "#000"
    }}
  >
    {label}
  </button>
);

export default ManageUsers;
