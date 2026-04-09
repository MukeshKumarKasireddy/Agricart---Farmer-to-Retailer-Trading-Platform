import { useEffect, useState } from "react";
import api from "../../../api/axios";

const FarmerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await api.get("/orders/farmer");
      setOrders(res.data);
    } catch {
      setError("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- ACTIONS ---------------- */

  const markShipped = async (orderId) => {
    const confirm = window.confirm(
      "Are you sure you want to mark this order as shipped?"
    );
    if (!confirm) return;

    try {
      await api.put(`/farmer/orders/${orderId}/ship`);
      fetchOrders();
    } catch(err) {
      console.error(err);
      alert("Failed to update order status");
    }
  };

  const rejectOrder = async (orderId) => {
    const confirm = window.confirm(
      "Are you sure you want to reject this order?"
    );
    if (!confirm) return;

    try {
      await api.put(`/farmer/orders/${orderId}/reject`);
      fetchOrders();
    } catch (err) {
      alert(
        err.response?.data?.error ||
        "Failed to reject order"
      );
    }
  };

  /* ---------------- GROUPING ---------------- */

  const groupedOrders = {
    PENDING: orders.filter((o) => o.status === "PENDING"),
    CONFIRMED: orders.filter((o) => o.status === "CONFIRMED"),
    SHIPPED: orders.filter((o) => o.status === "SHIPPED"),
    DELIVERED: orders.filter((o) => o.status === "DELIVERED"),
    REJECTED: orders.filter((o) => o.status === "REJECTED"),
    CANCELLED: orders.filter((o) => o.status === "CANCELLED"),
  };

  /* ---------------- UI RENDER ---------------- */

  const renderSection = (title, list) => {
    if (list.length === 0) return null;

    return (
      <>
        <h3 style={{ marginTop: "36px" }}>{title}</h3>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: "20px",
            marginTop: "16px",
          }}
        >
          {list.map((order) => (
            <div
              key={order.id}
              style={{
                background: "#ffffff",
                padding: "16px",
                borderRadius: "12px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
              }}
            >
              <h4>{order.product.name}</h4>

              <p>
                Quantity: <strong>{order.quantity} kg</strong>
              </p>

              <p>
                Ordered by: <strong>{order.retailer.name}</strong>
              </p>

              <p>
  Retailer Address:
  {order.retailer.village}, {order.retailer.city}, {order.retailer.pincode}
</p>


              <p>
                Payment:{" "}
                <strong
                  style={{
                    color:
                      order.paymentStatus === "PAID"
                        ? "#2A7D3E"
                        : "#d32f2f",
                  }}
                >
                  {order.paymentStatus}
                </strong>
              </p>

              <p>
                Status:{" "}
                <strong
                  style={{
                    color:
                      order.status === "DELIVERED"
                        ? "#2A7D3E"
                        : order.status === "CONFIRMED"
                        ? "#1976d2"
                        : order.status === "SHIPPED"
                        ? "#ff7d13"
                        : order.status === "REJECTED" ||
                          order.status === "CANCELLED"
                        ? "#d32f2f"
                        : "#FFB347",
                  }}
                >
                  {order.status}
                </strong>
              </p>

              {/* ACTION BUTTONS */}

              {order.status === "PENDING" && (
                <button
                  onClick={() => rejectOrder(order.id)}
                  style={{
                    marginTop: "12px",
                    background: "#d32f2f",
                    color: "#fff",
                    border: "none",
                    padding: "8px 14px",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontWeight: 600,
                  }}
                >
                  Reject Order
                </button>
              )}

              {order.status === "CONFIRMED" && (
                <button
                  onClick={() => markShipped(order.id)}
                  style={{
                    marginTop: "12px",
                    background: "#2A7D3E",
                    color: "#fff",
                    border: "none",
                    padding: "8px 14px",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontWeight: 600,
                  }}
                >
                  Mark as Shipped
                </button>
              )}
            </div>
          ))}
        </div>
      </>
    );
  };

  /* ---------------- STATES ---------------- */

  if (loading) return <p>Loading orders...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <h2>My Orders</h2>

      {orders.length === 0 && (
        <p style={{ marginTop: "16px", color: "#777" }}>
          No orders received yet.
        </p>
      )}

      {renderSection("Pending Orders", groupedOrders.PENDING)}
      {renderSection("Confirmed Orders", groupedOrders.CONFIRMED)}
      {renderSection("Shipped Orders", groupedOrders.SHIPPED)}
      {renderSection("Delivered Orders", groupedOrders.DELIVERED)}
      {renderSection("Rejected Orders", groupedOrders.REJECTED)}
      {renderSection("Cancelled Orders", groupedOrders.CANCELLED)}
    </div>
  );
};

export default FarmerOrders;
