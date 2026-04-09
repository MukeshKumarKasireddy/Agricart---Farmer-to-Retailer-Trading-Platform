import { useEffect, useState } from "react";
import api from "../../../api/axios";

const Farmers = () => {
  const [farmers, setFarmers] = useState([]);
  const [pending, setPending] = useState([]);
  const [search, setSearch] = useState("");

  /* ---------------- LOAD ALL FARMERS ---------------- */
  const loadAllFarmers = async () => {
    try {
      const usersRes = await api.get("/users");

      const farmerList = usersRes.data.filter(u => u.role === "FARMER");

      const rows = await Promise.all(
        farmerList.map(async (f) => {
          try {
            const sum = await api.get(`/admin/farmers/${f.id}/summary`);

            return {
              id: f.id,
              name: f.name,
              email: f.email,
              productCount: sum.data.productCount,
              totalOrders: sum.data.totalOrders,
              revenue: sum.data.totalRevenue
            };
          } catch {
            return {
              id: f.id,
              name: f.name,
              email: f.email,
              productCount: "—",
              totalOrders: "—",
              revenue: "—"
            };
          }
        })
      );

      setFarmers(rows);
    } catch (err) {
      console.error(err);
    }
  };

  /* ---------------- LOAD PENDING ---------------- */
  const loadPending = async () => {
    try {
      const res = await api.get("/admin/farmers/pending");
      setPending(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  /* ---------------- INIT ---------------- */
  useEffect(() => {
    const init = async () => {
      await loadAllFarmers();
      await loadPending();
    };
    init();
  }, []);

  /* ---------------- VERIFY ---------------- */
  const verify = async (id) => {
    if (!window.confirm("Approve this farmer?")) return;

    await api.put(`/admin/farmers/${id}/verify`);
    loadPending();
    loadAllFarmers();
  };

  /* ---------------- REJECT ---------------- */
  const reject = async (id) => {
    const reason = window.prompt("Enter rejection reason:");

    if (!reason) return;

    await api.put(`/admin/farmers/${id}/reject?reason=${reason}`);
    loadPending();
    loadAllFarmers();
  };

  /* ---------------- SEARCH ---------------- */
  const filtered = farmers.filter(f =>
    f.name.toLowerCase().includes(search.toLowerCase()) ||
    f.email.toLowerCase().includes(search.toLowerCase()) ||
    String(f.id).includes(search)
  );

  return (
    <div style={{ padding: 32 }}>
      <h2 style={title}>Farmers</h2>

      {/* 🔴 PENDING VERIFICATIONS */}
      {pending.length > 0 && (
        <>
          <h3 style={{ marginBottom: 12 }}>Pending Verifications</h3>

          {pending.map(f => (
            <div key={f.id} style={card}>
              <h3>{f.name}</h3>
              <p>{f.email}</p>

              <p><strong>Aadhaar:</strong> {f.aadharNumber}</p>
              <p><strong>PAN:</strong> {f.panNumber}</p>

              <div style={{ marginTop: 12 }}>
                <button style={verifyBtn} onClick={() => verify(f.id)}>
                  ACCEPT
                </button>

                <button style={rejectBtn} onClick={() => reject(f.id)}>
                  REJECT
                </button>
              </div>
            </div>
          ))}
        </>
      )}

      {/* SEARCH */}
      <input
        placeholder="Search farmer..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={searchBox}
      />

      {/* TABLE */}
      <table style={table}>
        <thead>
          <tr>
            <th style={th}>Name</th>
            <th style={th}>ID</th>
            <th style={th}>Email</th>
            <th style={th}>Products</th>
            <th style={th}>Orders</th>
            <th style={th}>Revenue</th>
          </tr>
        </thead>

        <tbody>
          {filtered.map(f => (
            <tr key={f.id} style={tr}>
              <td style={td}>{f.name}</td>
              <td style={td}>{f.id}</td>
              <td style={td}>{f.email}</td>
              <td style={td}>{f.productCount}</td>
              <td style={td}>{f.totalOrders}</td>
              <td style={td}>₹{f.revenue}</td>
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

const card = {
  background: "#fff",
  padding: 20,
  marginBottom: 20,
  borderRadius: 10,
  boxShadow: "0 0 6px rgba(0,0,0,0.08)"
};

const verifyBtn = {
  background: "#2A7D3E",
  color: "#fff",
  padding: "8px 16px",
  border: "none",
  borderRadius: 6,
  marginRight: 10
};

const rejectBtn = {
  background: "#d32f2f",
  color: "#fff",
  padding: "8px 16px",
  border: "none",
  borderRadius: 6
};

export default Farmers;
