import { useEffect, useState } from "react";
import api from "../../../api/axios";

const Transactions = () => {
  const [tx, setTx] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  /* ---------------- LOAD ---------------- */
  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get("/admin/orders");

        const paid = res.data.filter(o => o.paymentStatus === "PAID");

        const mapped = paid.map(o => ({
          id: o.id,
          orderId: o.id,
          retailer: o.retailer?.name || "—",
          farmer: o.farmer?.name || "—",
          amount: o.totalPrice,
          status: o.status,
          paymentId: "RAZORPAY"
        }));

        setTx(mapped);
      } catch (err) {
        console.error(err);
        alert("Failed to load transactions");
      }
    };

    load();
  }, []);

  /* ---------------- FILTERING ---------------- */
  const filtered = tx
    .filter(t =>
      t.retailer.toLowerCase().includes(search.toLowerCase()) ||
      t.farmer.toLowerCase().includes(search.toLowerCase()) ||
      String(t.orderId).includes(search)
    )
    .filter(t => {
      if (statusFilter === "ALL") return true;
      return t.status === statusFilter;
    });

  return (
    <div style={{ padding: 32 }}>
      <h2 style={title}>Transactions</h2>

      {/* SEARCH + FILTER */}
      <div style={toolbar}>
        <input
          placeholder="Search retailer, farmer, order id..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={searchBox}
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="ALL">All</option>
          <option value="DELIVERED">Delivered</option>
          <option value="CONFIRMED">Confirmed</option>
          <option value="PENDING">Pending</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>

      <table style={table}>
        <thead>
          <tr>
            <th style={th}>Txn ID</th>
            <th style={th}>Order</th>
            <th style={th}>Retailer</th>
            <th style={th}>Farmer</th>
            <th style={th}>Amount</th>
            <th style={th}>Status</th>
            <th style={th}>Payment</th>
          </tr>
        </thead>

        <tbody>
          {filtered.map((t) => (
            <tr key={t.id} style={tr}>
              <td style={td}>{t.id}</td>
              <td style={td}>#{t.orderId}</td>
              <td style={td}>{t.retailer}</td>
              <td style={td}>{t.farmer}</td>
              <td style={td}>₹{t.amount}</td>

              <td style={td}>
                <span style={statusColor(t.status)}>
                  {t.status}
                </span>
              </td>

              <td style={td}>
                <span style={paidStyle}>PAID</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

/* ---------------- STYLES (MATCH ORDERS PAGE) ---------------- */

const title = { marginBottom: 20 };

const toolbar = {
  display: "flex",
  gap: 12,
  marginBottom: 20,
};

const searchBox = {
  padding: "8px",
  width: 260,
  borderRadius: 6,
  border: "1px solid #ccc",
};

const table = {
  width: "100%",
  borderCollapse: "collapse",
  background: "#fff",
  borderRadius: 10,
  overflow: "hidden",
  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
};

const th = {
  textAlign: "left",
  padding: "12px",
  background: "#f5f5f5",
  fontWeight: 600,
};

const tr = {
  borderBottom: "1px solid #eee",
};

const td = {
  padding: "12px",
};

const paidStyle = {
  color: "#2e7d32",
  fontWeight: 600,
};

const statusColor = (status) => {
  if (status === "DELIVERED") return { color: "#2e7d32", fontWeight: 600 };
  if (status === "CANCELLED") return { color: "#d32f2f", fontWeight: 600 };
  if (status === "PENDING") return { color: "#ff9800", fontWeight: 600 };
  if (status === "CONFIRMED") return { color: "#1976d2", fontWeight: 600 };
  return {};
};

export default Transactions;
