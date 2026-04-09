import { useEffect, useState } from "react";
import { Navigate, Link } from "react-router-dom";
import VerificationModal from "../../../components/VerificationModal";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import api from "../../../api/axios";

const DashboardHome = () => {
  const role = localStorage.getItem("role");
  const name = localStorage.getItem("name");

  const [productCount, setProductCount] = useState(0);
  const [analytics, setAnalytics] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [redirectTo, setRedirectTo] = useState(null);
  const [rating, setRating] = useState(null);

  // 🔴 modal state
  const [showVerificationModal, setShowVerificationModal] = useState(false);

  /* AUTH CHECK */
  useEffect(() => {
    if (!role) setRedirectTo("/login");
  }, [role]);

  /* LOAD DATA */
  const loadProfile = async () => {
    const profileRes = await api.get("/users/me");
    setProfile(profileRes.data);

    if (
      profileRes.data.role === "FARMER" &&
      (profileRes.data.verificationStatus === "UNVERIFIED" ||
        profileRes.data.verificationStatus === "REJECTED")
    ) {
      setShowVerificationModal(true);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/products/my");
        setProductCount(res.data.length);

        const analyticsRes = await api.get("/analytics/farmer");
        setAnalytics(analyticsRes.data);

        await loadProfile();
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    api.get("/reviews/farmer").then(res => setRating(res.data));
  }, []);

  if (redirectTo) return <Navigate to={redirectTo} replace />;

  const quantityChartData = analytics
    ? Object.entries(analytics.quantitySoldPerProduct || {}).map(
        ([name, value]) => ({ name, value })
      )
    : [];

  const revenueChartData = analytics
    ? Object.entries(analytics.revenuePerProduct || {}).map(
        ([name, value]) => ({ name, value })
      )
    : [];

  return (
    <div className="dashboard-home">

      {/* 🔴 VERIFICATION MODAL */}
      {showVerificationModal && profile && (
        <VerificationModal
          user={profile}
          onClose={() => setShowVerificationModal(false)}
          refreshUser={loadProfile}
        />
      )}

      {/* WELCOME */}
      <div
        className="welcome-card"
        style={{ display: "flex", alignItems: "center", gap: "24px" }}
      >
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

        <div>
          <h2>Welcome, {name}</h2>
          <p>Manage your products and track sales.</p>
        </div>
      </div>

      {/* 🔴 VERIFICATION BANNER */}
      {profile?.verificationStatus === "PENDING" && (
        <div
          style={{
            background: "#e7f0ff",
            border: "1px solid #ddd",
            padding: "16px",
            borderRadius: "12px",
            marginTop: "20px",
          }}
        >
          <strong>Verification in progress.</strong>  
          Admin is reviewing your documents.
        </div>
      )}

      {/* STATS */}
      <div className="stats-grid">
        <div className="stat-card">
          <h4>Products</h4>
          <span>{loading ? "…" : productCount}</span>
        </div>

        <div className="stat-card">
          <h4>Orders</h4>
          <span>{loading ? "…" : analytics?.totalOrders ?? 0}</span>
        </div>

        <div className="stat-card">
          <h4>Total Revenue</h4>
          <span>₹{loading ? "…" : analytics?.totalRevenue ?? 0}</span>
        </div>

        <div className="stat-card">
          <h4>Rating</h4>
          <span>
            {rating ? `${rating.average.toFixed(1)} ⭐ (${rating.total})` : "—"}
          </span>
        </div>
      </div>

      {/* ACTIONS */}
      <div className="action-grid">
        {profile?.verificationStatus === "VERIFIED" ? (
          <Link to="/dashboard/add-product" className="action-card">
            Add Product
          </Link>
        ) : (
          <div className="action-card" style={{ opacity: 0.5 }}>
            Add Product (Verify account first)
          </div>
        )}

        <Link to="/dashboard/products" className="action-card">
          My Products
        </Link>
      </div>

      {/* ANALYTICS */}
      <h2 style={{ marginTop: "48px" }}>Sales Analytics</h2>

      {!loading && quantityChartData.length > 0 && (
        <div style={chartCard}>
          <h3>Quantity Sold per Product</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={quantityChartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#2A7D3E" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {!loading && revenueChartData.length > 0 && (
        <div style={chartCard}>
          <h3>Revenue per Product</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueChartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#1976d2" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

const chartCard = {
  marginTop: "40px",
  background: "#ffffff",
  padding: "24px",
  borderRadius: "16px",
};

export default DashboardHome;
