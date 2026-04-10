import { useEffect, useState } from "react";
import api from "../../../api/axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const RetailerAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.get("/analytics/retailer");
        setAnalytics(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const quantityChartData = analytics
    ? Object.entries(analytics.quantityPurchasedPerProduct || {}).map(
        ([name, value]) => ({ name, value })
      )
    : [];

  const spendingChartData = analytics
    ? Object.entries(analytics.spendingPerProduct || {}).map(
        ([name, value]) => ({ name, value })
      )
    : [];

  if (loading) return <p>Loading analytics...</p>;

  return (
    <div style={{ padding: "24px" }}>
      <h2>Analytics</h2>

      <div style={{ marginTop: "20px" }}>
        <p><strong>Total Orders:</strong> {analytics?.totalOrders}</p>
        <p><strong>Total Spending:</strong> ₹{analytics?.totalSpending}</p>
      </div>

      {/* GREEN - Quantity */}
      {quantityChartData.length > 0 && (
        <div style={chartCard}>
          <h3>Quantity Purchased per Product</h3>
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

      {/* BLUE - Spending */}
      {spendingChartData.length > 0 && (
        <div style={chartCard}>
          <h3>Spending per Product</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={spendingChartData}>
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
  marginTop: "30px",
  background: "#fff",
  padding: "20px",
  borderRadius: "12px",
};

export default RetailerAnalytics;