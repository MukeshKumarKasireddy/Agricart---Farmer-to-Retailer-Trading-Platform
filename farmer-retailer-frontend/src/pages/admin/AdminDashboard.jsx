import { useEffect, useState } from "react";
import api from "../../api/axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    farmers: 0,
    retailers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalCommission: 0,
  });

  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  const [monthlyCommission, setMonthlyCommission] = useState([]);
  const [orders, setOrders] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      setLoading(true);

      const usersRes = await api.get("/users");
      const ordersRes = await api.get("/admin/orders");
      const analyticsRes = await api.get("/analytics/admin");

      setOrders(ordersRes.data);

      const users = usersRes.data;

      setStats({
        farmers: users.filter(u => u.role === "FARMER").length,
        retailers: users.filter(u => u.role === "RETAILER").length,
        totalOrders: analyticsRes.data.totalOrders,
        totalRevenue: analyticsRes.data.totalRevenue,
        totalCommission: analyticsRes.data.totalCommission,
      });

      setMonthlyRevenue(
        Object.entries(analyticsRes.data.monthlyRevenue).map(([m, v]) => ({
          month: m,
          value: v,
        }))
      );

      setMonthlyCommission(
        Object.entries(analyticsRes.data.monthlyCommission).map(([m, v]) => ({
          month: m,
          value: v,
        }))
      );

    } catch (err) {
      console.error(err);
      alert("Failed to load admin dashboard");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p style={{ padding: 40 }}>Loading dashboard...</p>;

  return (
    <div style={container}>
      <h1 style={title}>Admin Dashboard</h1>

      {/* KPI CARDS */}
      <div style={kpiGrid}>
        <Kpi title="Total Revenue" value={`₹${stats.totalRevenue.toFixed(2)}`} />
        <Kpi title="Commission Earned" value={`₹${stats.totalCommission.toFixed(2)}`} />
        <Kpi title="Orders" value={stats.totalOrders} />
        <Kpi title="Farmers" value={stats.farmers} />
        <Kpi title="Retailers" value={stats.retailers} />
      </div>

      {/* CHARTS */}
      <div style={chartGrid}>
        <ChartCard title="Monthly Revenue">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyRevenue}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#2A7D3E" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Monthly Commission">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyCommission}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#1976d2" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* STATUS ANALYTICS */}
      <div style={chartGrid}>
        <AnalyticsCard
          title="Order Status"
          data={orders.reduce((acc, o) => {
            acc[o.status] = (acc[o.status] || 0) + 1;
            return acc;
          }, {})}
        />

        <AnalyticsCard
          title="Payment Status"
          data={orders.reduce((acc, o) => {
            acc[o.paymentStatus] = (acc[o.paymentStatus] || 0) + 1;
            return acc;
          }, {})}
        />
      </div>
    </div>
  );
};

/* KPI */
const Kpi = ({ title, value }) => (
  <div style={kpi}>
    <p style={{ color: "#888" }}>{title}</p>
    <h2>{value}</h2>
  </div>
);

/* CHART CARD */
const ChartCard = ({ title, children }) => (
  <div style={chartCard}>
    <h3>{title}</h3>
    {children}
  </div>
);

/* ANALYTICS CARD */
const AnalyticsCard = ({ title, data }) => (
  <div style={chartCard}>
    <h3>{title}</h3>
    {Object.entries(data).map(([k, v]) => (
      <div key={k} style={row}>
        <span>{k}</span>
        <b>{v}</b>
      </div>
    ))}
  </div>
);

/* STYLES */
const container = { padding: 32 };
const title = { marginBottom: 20 };

const kpiGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(5,1fr)",
  gap: 20,
  marginBottom: 30,
};

const kpi = {
  background: "#fff",
  padding: 20,
  borderRadius: 12,
  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
};

const chartGrid = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 20,
  marginBottom: 30,
};

const chartCard = {
  background: "#fff",
  padding: 20,
  borderRadius: 12,
  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
};

const row = {
  display: "flex",
  justifyContent: "space-between",
  padding: "6px 0",
};

export default AdminDashboard;
