import { useEffect, useState } from "react";
import api from "../../../api/axios";

const RetailerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [reviewOrder, setReviewOrder] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [reviewable, setReviewable] = useState({}); // orderId → true/false

  useEffect(() => {
    fetchOrders();
  }, []);

  /* ================= FETCH ORDERS ================= */
  const fetchOrders = async () => {
    try {
      const res = await api.get("/orders/retailer");
      setOrders(res.data);

      // check review eligibility
      const map = {};
      for (const o of res.data) {
        try {
          const r = await api.get(`/reviews/can-review/${o.id}`);
          map[o.id] = r.data;
        } catch {
          map[o.id] = false;
        }
      }
      setReviewable(map);

    } catch {
      setError("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  /* ================= PAYMENT ================= */
  const handlePayment = async (order) => {
    try {
      const res = await api.post("/payments/create-order", null, {
        params: { orderId: order.id },
      });

      const razorpayOrder = res.data;

      const options = {
        key: "rzp_test_S1iNDU4u6JLAoj",
        amount: razorpayOrder.amount,
        currency: "INR",
        name: "Agricart",
        order_id: razorpayOrder.id,

        handler: async function (response) {
          await api.post("/payments/verify", null, {
            params: {
              orderId: order.id,
              paymentId: response.razorpay_payment_id,
            },
          });

          fetchOrders();
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch {
      alert("Payment failed");
    }
  };

  /* ================= CANCEL ================= */
  const handleCancel = async (orderId) => {
    if (!window.confirm("Cancel order?")) return;
    await api.put(`/orders/retailer/${orderId}/cancel`);
    fetchOrders();
  };

  /* ================= REVIEW ================= */
  const submitReview = async () => {
    try {
      await api.post(`/reviews/${reviewOrder.id}`, {
        rating,
        comment,
      });

      setReviewOrder(null);
      setRating(5);
      setComment("");
      fetchOrders();
    } catch {
      alert("Review failed");
    }
  };

  /* ================= GROUPING ================= */
  const groupedOrders = {
    PENDING: orders.filter(o => o.status === "PENDING"),
    CONFIRMED: orders.filter(o => o.status === "CONFIRMED"),
    SHIPPED: orders.filter(o => o.status === "SHIPPED"),
    DELIVERED: orders.filter(o => o.status === "DELIVERED"),
  };

  const renderSection = (title, list) => {
    if (list.length === 0) return null;

    return (
      <>
        <h3 style={{ marginTop: 32 }}>{title}</h3>

        <div style={grid}>
          {list.map(order => (
            <div key={order.id} style={card}>
              <h4>{order.product.name}</h4>

              <p>Qty: {order.quantity} kg</p>
              <p>Farmer: {order.farmer.name}</p>

              <p>
                Payment:{" "}
                <strong style={payColor(order.paymentStatus)}>
                  {order.paymentStatus}
                </strong>
              </p>

              <p>
                Status:{" "}
                <strong style={statusColor(order.status)}>
                  {order.status}
                </strong>
              </p>

              {/* TRACKING TIMELINE */}
<div style={{
  marginTop: 12,
  background: "#f7f7f7",
  padding: 10,
  borderRadius: 8
}}>
  <p style={{ margin: 0 }}>
    ✔ Order Confirmed
  </p>

  <p style={{
    margin: 0,
    color:
      order.status === "SHIPPED" ||
      order.status === "DELIVERED"
        ? "#2e7d32"
        : "#999"
  }}>
    {order.status === "SHIPPED" || order.status === "DELIVERED"
      ? "✔"
      : "•"}{" "}
    Shipped
  </p>

  <p style={{
    margin: 0,
    color:
      order.status === "DELIVERED"
        ? "#2e7d32"
        : "#999"
  }}>
    {order.status === "DELIVERED" ? "✔" : "•"} Delivered
  </p>
</div>


              {/* PAYMENT BUTTON */}
              {order.status === "PENDING" &&
               order.paymentStatus === "PENDING" && (
                <div style={btnRow}>
                  <button style={payBtn} onClick={() => handlePayment(order)}>
                    Pay Now
                  </button>

                  <button style={dangerBtn} onClick={() => handleCancel(order.id)}>
                    Cancel
                  </button>
                </div>
              )}

              {/* REVIEW BUTTON */}
              {reviewable[order.id] && (
                <button
                  style={reviewBtn}
                  onClick={() => setReviewOrder(order)}
                >
                  ⭐ Leave Review
                </button>
              )}

              {!reviewable[order.id] &&
                order.status === "DELIVERED" &&
                order.paymentStatus === "PAID" && (
                <p style={{ color: "#777", marginTop: 10 }}>
                  Review submitted
                </p>
              )}
            </div>
          ))}
        </div>
      </>
    );
  };

  if (loading) return <p>Loading orders...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <h2>My Orders</h2>

      {renderSection("Pending", groupedOrders.PENDING)}
      {renderSection("Confirmed", groupedOrders.CONFIRMED)}
      {renderSection("Shipped", groupedOrders.SHIPPED)}
      {renderSection("Delivered", groupedOrders.DELIVERED)}

      {/* REVIEW MODAL */}
      {reviewOrder && (
        <div style={modalOverlay}>
          <div style={modal}>
            <h3>Rate this order</h3>

            <select
              value={rating}
              onChange={e => setRating(Number(e.target.value))}
              style={input}
            >
              {[5,4,3,2,1].map(n => (
                <option key={n} value={n}>{n} Stars</option>
              ))}
            </select>

            <textarea
              placeholder="Write feedback"
              value={comment}
              onChange={e => setComment(e.target.value)}
              style={textarea}
            />

            <div style={btnRow}>
              <button style={payBtn} onClick={submitReview}>
                Submit
              </button>

              <button
                style={dangerBtn}
                onClick={() => setReviewOrder(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* ================= STYLES ================= */
const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))",
  gap: 20,
};

const card = {
  background: "#fff",
  padding: 16,
  borderRadius: 12,
  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
};

const btnRow = { display: "flex", gap: 10, marginTop: 12 };

const payBtn = {
  flex: 1,
  background: "#2A7D3E",
  color: "#fff",
  border: "none",
  padding: 8,
  borderRadius: 6,
  cursor: "pointer",
};

const dangerBtn = {
  flex: 1,
  background: "#d32f2f",
  color: "#fff",
  border: "none",
  padding: 8,
  borderRadius: 6,
  cursor: "pointer",
};

const reviewBtn = {
  marginTop: 12,
  width: "100%",
  background: "#1976d2",
  color: "#fff",
  border: "none",
  padding: 8,
  borderRadius: 6,
  cursor: "pointer",
};

const statusColor = s =>
  s === "DELIVERED"
    ? { color: "#2e7d32" }
    : s === "CONFIRMED"
    ? { color: "#1976d2" }
    : { color: "#ff9800" };

const payColor = s =>
  s === "PAID"
    ? { color: "#2e7d32" }
    : { color: "#d32f2f" };

const modalOverlay = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: "rgba(0,0,0,0.4)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const modal = {
  background: "#fff",
  padding: 24,
  borderRadius: 12,
  width: 350,
};

const input = { width: "100%", padding: 8, marginTop: 10 };
const textarea = { width: "100%", marginTop: 10, padding: 8, height: 80 };

export default RetailerOrders;
