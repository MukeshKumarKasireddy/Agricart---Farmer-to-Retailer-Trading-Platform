import { useEffect, useState } from "react";
import api from "../../../api/axios";

const RetailerTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const res = await api.get("/transactions/retailer");
      setTransactions(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load transactions");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading transactions...</p>;

  return (
    <div>
      <h2>My Transactions</h2>

      {transactions.length === 0 ? (
        <p>No transactions yet.</p>
      ) : (
        transactions.map((tx) => (
          <div
            key={tx.id}
            style={{
              background: "#fff",
              padding: "16px",
              borderRadius: "12px",
              marginBottom: "12px",
            }}
          >
            <p><strong>Order ID:</strong> {tx.order.id}</p>
            <p><strong>Amount:</strong> ₹{tx.amount}</p>
            <p><strong>Payment ID:</strong> {tx.paymentId}</p>
            <p><strong>Status:</strong> {tx.status}</p>
            <p style={{ fontSize: "13px", color: "#777" }}>
              {new Date(tx.createdAt).toLocaleString()}
            </p>
          </div>
        ))
      )}
    </div>
  );
};

export default RetailerTransactions;
