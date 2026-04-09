import { useEffect, useState } from "react";
import api from "../../../api/axios";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [paymentFilter, setPaymentFilter] = useState("ALL");

  /* ---------------- LOAD ---------------- */
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get("/admin/orders");
        setOrders(res.data);
      } catch (err) {
        console.error(err);
        alert("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  /* ---------------- CANCEL ---------------- */
  const cancelOrder = async (id) => {
    if (!window.confirm("Cancel this order?")) return;

    try {
      await api.put(`/orders/retailer/${id}/cancel`);
      setOrders(prev =>
        prev.map(o =>
          o.id === id ? { ...o, status: "CANCELLED" } : o
        )
      );
    } catch {
      alert("Cancel failed");
    }
  };

  /* ---------------- ADMIN DELIVER ---------------- */
  const markDelivered = async (id) => {
    try {
      await api.put(`/admin/orders/${id}/deliver`);

      setOrders(prev =>
        prev.map(o =>
          o.id === id ? { ...o, status: "DELIVERED" } : o
        )
      );
    } catch {
      alert("Failed to mark delivered");
    }
  };

  /* ---------------- FILTER ---------------- */
  const filtered = orders
    .filter(o =>
      o.product?.name?.toLowerCase().includes(search.toLowerCase()) ||
      o.farmer?.name?.toLowerCase().includes(search.toLowerCase()) ||
      o.retailer?.name?.toLowerCase().includes(search.toLowerCase()) ||
      String(o.id).includes(search)
    )
    .filter(o => {
      if (statusFilter === "ALL") return true;
      return o.status === statusFilter;
    })
    .filter(o => {
      if (paymentFilter === "ALL") return true;
      return o.paymentStatus === paymentFilter;
    });

  if (loading) return <p style={{ padding: 32 }}>Loading orders...</p>;

  return (
    <div style={{ padding: 32 }}>
      <h2 style={title}>All Orders</h2>

      <div style={toolbar}>
        <input
          placeholder="Search order, farmer, retailer..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={searchBox}
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="ALL">All Status</option>
          <option value="PENDING">Pending</option>
          <option value="CONFIRMED">Confirmed</option>
          <option value="SHIPPED">Shipped</option>
          <option value="DELIVERED">Delivered</option>
          <option value="CANCELLED">Cancelled</option>
        </select>

        <select
          value={paymentFilter}
          onChange={(e) => setPaymentFilter(e.target.value)}
        >
          <option value="ALL">All Payments</option>
          <option value="PAID">Paid</option>
          <option value="PENDING">Pending</option>
        </select>
      </div>

      <table style={table}>
        <thead>
          <tr>
            <th style={th}>ID</th>
            <th style={th}>Product</th>
            <th style={th}>Farmer</th>
            <th style={th}>Retailer</th>
            <th style={th}>Qty</th>
            <th style={th}>Total</th>
            <th style={th}>Status</th>
            <th style={th}>Payment</th>
            <th style={th}>Action</th>
          </tr>
        </thead>

        <tbody>
          {filtered.map((o) => (
            <tr key={o.id} style={tr}>
              <td style={td}>{o.id}</td>
              <td style={td}>{o.product?.name}</td>
              <td style={td}>{o.farmer?.name}</td>
              <td style={td}>{o.retailer?.name}</td>
              <td style={td}>{o.quantity}</td>
              <td style={td}>₹{o.totalPrice}</td>

              <td style={td}>
                <span style={statusColor(o.status)}>{o.status}</span>
              </td>

              <td style={td}>
                <span style={paymentColor(o.paymentStatus)}>
                  {o.paymentStatus}
                </span>
              </td>

              <td style={td}>
                {/* ADMIN DELIVER */}
                {o.status === "SHIPPED" && (
                  <button style={payBtn} onClick={() => markDelivered(o.id)}>
                    Mark Delivered
                  </button>
                )}

                {/* CANCEL */}
                {o.status !== "DELIVERED" && o.status !== "CANCELLED" && (
                  <button style={danger} onClick={() => cancelOrder(o.id)}>
                    Cancel
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

/* ---------------- STYLES ---------------- */

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

const tr = { borderBottom: "1px solid #eee" };
const td = { padding: "12px" };

const danger = {
  background: "#d32f2f",
  color: "#fff",
  border: "none",
  padding: "6px 14px",
  borderRadius: 6,
  cursor: "pointer",
  fontWeight: 600,
};

const payBtn = {
  background: "#2A7D3E",
  color: "#fff",
  border: "none",
  padding: "6px 14px",
  borderRadius: 6,
  cursor: "pointer",
  fontWeight: 600,
  marginRight: 6,
};

const statusColor = (status) => {
  if (status === "DELIVERED") return { color: "#2e7d32", fontWeight: 600 };
  if (status === "SHIPPED") return { color: "#ff9800", fontWeight: 600 };
  if (status === "CONFIRMED") return { color: "#1976d2", fontWeight: 600 };
  if (status === "CANCELLED") return { color: "#d32f2f", fontWeight: 600 };
  return {};
};

const paymentColor = (status) => {
  if (status === "PAID") return { color: "#2e7d32", fontWeight: 600 };
  return { color: "#d32f2f", fontWeight: 600 };
};

export default Orders;
