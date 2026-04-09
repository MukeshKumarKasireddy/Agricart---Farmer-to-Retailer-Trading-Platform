import { useEffect, useState } from "react";
import api from "../../../api/axios";

const Retailers = () => {
  const [retailers, setRetailers] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const usersRes = await api.get("/users");

        const list = usersRes.data.filter(
          u => u.role === "RETAILER"
        );

        const rows = [];

        for (const r of list) {
          try {
            const sum = await api.get(`/admin/retailers/${r.id}/summary`);

            rows.push({
              id: r.id,
              name: r.name,
              email: r.email,
              orders: sum.data.totalOrders,
              spent: sum.data.totalSpent
            });
          } catch {
            rows.push({
              id: r.id,
              name: r.name,
              email: r.email,
              orders: "—",
              spent: "—"
            });
          }
        }

        setRetailers(rows);
      } catch (err) {
        console.error(err);
        alert("Admin authorization failed");
      }
    };

    load();
  }, []);

  const filtered = retailers.filter(r =>
    r.name.toLowerCase().includes(search.toLowerCase()) ||
    r.email.toLowerCase().includes(search.toLowerCase()) ||
    String(r.id).includes(search)
  );

  return (
    <div style={{ padding: 32 }}>
      <h2 style={title}>Retailers</h2>

      <input
        placeholder="Search retailer..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={searchBox}
      />

      <table style={table}>
        <thead>
          <tr>
            <th style={th}>Name</th>
            <th style={th}>ID</th>
            <th style={th}>Email</th>
            <th style={th}>Orders</th>
            <th style={th}>Spent</th>
          </tr>
        </thead>

        <tbody>
          {filtered.map(r => (
            <tr key={r.id} style={tr}>
              <td style={td}>{r.name}</td>
              <td style={td}>{r.id}</td>
              <td style={td}>{r.email}</td>
              <td style={td}>{r.orders}</td>
              <td style={td}>₹{r.spent}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

/* STYLES */
const title = { marginBottom: 20 };

const searchBox = {
  padding: 8,
  width: 260,
  borderRadius: 6,
  border: "1px solid #ccc",
  marginBottom: 16
};

const table = {
  width: "100%",
  borderCollapse: "collapse",
  background: "#fff",
  borderRadius: 10,
  overflow: "hidden",
  boxShadow: "0 4px 12px rgba(0,0,0,0.05)"
};

const th = {
  textAlign: "left",
  padding: "12px",
  background: "#f5f5f5",
  fontWeight: 600
};

const tr = { borderBottom: "1px solid #eee" };
const td = { padding: "12px" };

export default Retailers;
