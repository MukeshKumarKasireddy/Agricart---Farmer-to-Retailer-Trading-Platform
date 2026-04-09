import { useEffect, useState } from "react";
import api from "../../../api/axios";

const FarmerTransactions = () => {

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const res = await api.get("/farmer/transactions");
      setTransactions(res.data);
    } catch (err) {
     console.error("Failed to load transactions", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>

      <div style={{ padding: "32px" }}>
        <h2>My Transactions</h2>
        <p style={{ color: "#666", marginBottom: "24px" }}>
          Payment-confirmed orders received from retailers
        </p>

        {loading && <p>Loading transactions...</p>}

        {!loading && transactions.length === 0 && (
          <p>No transactions available.</p>
        )}

        {/* TRANSACTION CARDS */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "20px",
          }}
        >
          {transactions.map(order => (
            <div
              key={order.id}
              style={{
                background: "#ffffff",
                borderRadius: "16px",
                padding: "20px",
                boxShadow: "0 6px 16px rgba(0,0,0,0.06)",
                borderLeft:
                  order.status === "DELIVERED"
                    ? "6px solid #2A7D3E"
                    : "6px solid #FFB347",
              }}
            >
              <h4 style={{ marginBottom: "8px" }}>
                {order.product?.name}
              </h4>

              <p style={{ margin: "4px 0", color: "#555" }}>
                <strong>Quantity:</strong> {order.quantity} Kg
              </p>

              <p style={{ margin: "4px 0", color: "#555" }}>
                <strong>Total Price:</strong> ₹{order.totalPrice}
              </p>

              <p style={{ margin: "4px 0", color: "#555" }}>
                <strong>Retailer:</strong> {order.retailer?.name}
              </p>

              <p style={{ margin: "4px 0", color: "#555" }}>
                <strong>Payment Status:</strong>{" "}
                <span style={{ color: "#2A7D3E", fontWeight: 600 }}>
                  {order.paymentStatus}
                </span>
              </p>

              <p style={{ margin: "4px 0", color: "#555" }}>
                <strong>Order Status:</strong>{" "}
                {order.status}
              </p>

              <p style={{ marginTop: "8px", fontSize: "13px", color: "#888" }}>
                <strong>Date:</strong>{" "}
                {order.createdAt
                  ? order.createdAt.replace("T", " ").split(".")[0]
                  : "—"}
              </p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default FarmerTransactions;
