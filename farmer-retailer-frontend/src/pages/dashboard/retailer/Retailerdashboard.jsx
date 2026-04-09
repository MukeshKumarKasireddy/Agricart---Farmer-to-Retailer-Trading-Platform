import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../api/axios";
import { useCart } from "../../../context/CartContext";
import {
  PieChart,
  Pie,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const COLORS = ["#2A7D3E", "#FFB347"]; // CONFIRMED, PENDING

const RetailerDashboardHome = () => {
  const navigate = useNavigate();
  const { cartItems } = useCart();

  const [orders, setOrders] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [profile, setProfile] = useState(null);

  const [loadingOrders, setLoadingOrders] = useState(true);
  const [loadingAnalytics, setLoadingAnalytics] = useState(true);

  const userId = localStorage.getItem("id");

  useEffect(() => {
    if (!userId) return;
    fetchOrders();
    fetchAnalytics();
  }, [userId]);

  useEffect(() => {
    api.get("/users/me")
      .then((res) => setProfile(res.data))
      .catch(() => console.error("Failed to load profile"));
  }, []);

  const [ setUnreadCount] = useState(0);

useEffect(() => {
  api.get("/notifications/unread-count")
    .then(res => setUnreadCount(res.data.count))
    .catch(() => {});
}, []);


  const fetchOrders = async () => {
    try {
      const res = await api.get("/orders/retailer", {
        params: { retailerId: userId },
      });
      setOrders(res.data);
    } catch {
      console.error("Failed to load orders");
    } finally {
      setLoadingOrders(false);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const res = await api.get("/analytics/retailer");
      setAnalytics(res.data);
    } catch {
      console.error("Failed to load retailer analytics");
    } finally {
      setLoadingAnalytics(false);
    }
  };

  const pendingOrders = orders.filter(
    (order) => order.status === "PENDING"
  ).length;

  const pieData = analytics
    ? Object.entries(analytics.orderStatusCount || {}).map(
        ([name, value]) => ({ name, value })
      )
    : [];

  return (
    <div className="dashboard-home">
      {/* Welcome Card */}
      <div
        className="welcome-card"
        style={{
          display: "flex",
          gap: "24px",
          alignItems: "center",
          position: "relative",
        }}
      >

  {/* RIGHT ACTIONS */}
  <div
    style={{
      position: "absolute",
      top: "16px",
      right: "16px",
      display: "flex",
      gap: "16px",
      alignItems: "center",
    }}
  >

  </div>
        {/* Avatar */}
        <img
          src={profile?.avatarUrl}
          alt="avatar"
          style={{
            width: "96px",
            height: "96px",
            borderRadius: "50%",
            objectFit: "cover",
          }}
              onError={(e) => {
      e.target.src = "/avatars/default.png";
    }}
        />

        {/* Profile Info */}
        <div>
          <h2>Welcome, {profile?.name}</h2>
          <p>  Manage your purchases, cart, and orders from here.
          </p>

        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <h4>Items in Cart</h4>
          <span>{cartItems.length}</span>
        </div>

        <div className="stat-card">
          <h4>Total Orders</h4>
          <span>{loadingOrders ? "…" : orders.length}</span>
        </div>

        <div className="stat-card">
          <h4>Pending Orders</h4>
          <span>{loadingOrders ? "…" : pendingOrders}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="action-grid">
        <div
          className="action-card"
          onClick={() => navigate("/dashboard/browse-products")}
        >
          🏪 Browse Products
        </div>

        <div
          className="action-card"
          onClick={() => navigate("/dashboard/cart")}
        >
          🛒 View Cart
        </div>

        <div
          className="action-card"
          onClick={() => navigate("/dashboard/orders")}
        >
          📦 Track Orders
        </div>
      </div>

      {/* Analytics */}
      <h2 style={{ marginTop: "48px" }}>Purchase Analytics</h2>

      {!loadingAnalytics && pieData.length > 0 && (
        <div
          style={{
            marginTop: "24px",
            background: "#ffffff",
            padding: "24px",
            borderRadius: "16px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
            width: "fit-content",
          }}
        >
          <h3>Orders by Status</h3>

          <p style={{ fontSize: "13px", color: "#777", marginBottom: "16px" }}>
            Distribution of your orders (CONFIRMED vs PENDING)
          </p>

          {/* Square Pie Container */}
          <div
            style={{
              width: "320px",
              height: "320px",
              margin: "0 auto",
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={100}
                >
                  {pieData.map((_, index) => (
                    <Cell
                      key={index}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {!loadingAnalytics && pieData.length === 0 && (
        <p style={{ marginTop: "24px", color: "#777" }}>
          No analytics data available yet.
        </p>
      )}
    </div>
  );
};

export default RetailerDashboardHome;
