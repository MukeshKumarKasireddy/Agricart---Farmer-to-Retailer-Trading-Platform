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

const FarmerAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.get("/analytics/farmer");
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
    ? Object.entries(analytics.quantitySoldPerProduct || {}).map(
        ([name, value]) => ({ name, value })
      )
    : [];

  const revenueChartData = analytics
    ? Object.entries(analytics.revenuePerProduct || {}).map(
        ([name, value]) => ({ name, value })
      )
    : [];

  if (loading) return <p>Loading analytics...</p>;

  return (
    <div style={{ padding: "24px" }}>
      <h2>Analytics</h2>

      <div style={{ marginTop: "20px" }}>
        <p><strong>Total Orders:</strong> {analytics?.totalOrders}</p>
        <p><strong>Total Revenue:</strong> ₹{analytics?.totalRevenue}</p>
      </div>

      {quantityChartData.length > 0 && (
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

      {revenueChartData.length > 0 && (
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
  marginTop: "30px",
  background: "#fff",
  padding: "20px",
  borderRadius: "12px",
};

export default FarmerAnalytics;