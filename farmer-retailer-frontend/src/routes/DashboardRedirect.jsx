import { Navigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

const DashboardRedirect = () => {
  const { user, loading } = useAuth();

  if (loading) return null;

  if (!user) return <Navigate to="/login" replace />;

  if (user.role === "FARMER") return <Navigate to="/dashboard/farmer" replace />;
  if (user.role === "RETAILER") return <Navigate to="/dashboard/retailer" replace />;
  if (user.role === "ADMIN") return <Navigate to="/dashboard/admin" replace />;

  return null;
};

export default DashboardRedirect;
