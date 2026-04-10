import { useEffect, useState } from "react";
import api from "../../../api/axios";
import {
  PieChart,
  Pie,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const COLORS = ["#2A7D3E", "#ffb347"]; // GREEN + BLUE

const RetailerAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.get("/analytics/retailer");
        setAnalytics(res.data);
      } catch (err) {
        console.error("Failed to load analytics", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const pieData = analytics
    ? Object.entries(analytics.orderStatusCount || {}).map(
        ([name, value]) => ({ name, value })
      )
    : [];

  if (loading) return <p>Loading analytics...</p>;

  return (
    <div style={{ padding: "24px" }}>
      <h2>Analytics</h2>

      {/* Summary */}
      <div style={{ marginTop: "20px" }}>
        <p><strong>Total Orders:</strong> {analytics?.totalOrders}</p>
        <p><strong>Total Spending:</strong> ₹{analytics?.totalSpending}</p>
      </div>

      {/* PIE CHART */}
      {pieData.length > 0 ? (
        <div style={chartCard}>
          <h3>Orders by Status</h3>

          <p style={{ fontSize: "13px", color: "#777" }}>
            Distribution of orders (Confirmed vs Pending)
          </p>

          <div style={{ width: "320px", height: "320px", margin: "0 auto" }}>
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
      ) : (
        <p style={{ marginTop: "24px", color: "#777" }}>
          No analytics data available yet.
        </p>
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