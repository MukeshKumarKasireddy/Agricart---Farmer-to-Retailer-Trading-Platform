import { NavLink } from "react-router-dom";
import "./Dashboard.css";

const Sidebar = ({ isOpen, closeSidebar, onLogout }) => {
  const role = localStorage.getItem("role");

  return (
    <aside className={`sidebar ${isOpen ? "open" : ""}`}>
      {/* Header */}
      <div className="sidebar-header">
        <button
          className="sidebar-close-btn"
          onClick={closeSidebar}
          aria-label="Close sidebar"
        >
          ✕
        </button>
        <span className="sidebar-title">Agricart</span>
      </div>

      <div className="sidebar-divider" />

      {/* Navigation */}
      <nav className="sidebar-nav">
        {/* COMMON */}
        {role !== "ADMIN" && (
          <NavLink to="/dashboard" end>
            Dashboard
          </NavLink>
        )}

        {/* ---------- FARMER ---------- */}
        {role === "FARMER" && (
          <>
            <NavLink to="/dashboard/add-product">Add Products</NavLink>
            <NavLink to="/dashboard/products">My Products</NavLink>
            <NavLink to="/dashboard/farmer-orders">Orders</NavLink>
            <NavLink to="/dashboard/transactions">Payments</NavLink>
            <NavLink to="/dashboard/farmer-profile">User Profile</NavLink>
            <NavLink to="/dashboard/reviews">Reviews</NavLink>
            <NavLink to="/dashboard/notifications">Notifications</NavLink>
            <NavLink to="/dashboard/analytics">Analytics</NavLink>
            <NavLink to="/dashboard/help">Help & Support</NavLink>
          </>
        )}

        {/* ---------- RETAILER ---------- */}
        {role === "RETAILER" && (
          <>
            <NavLink to="/dashboard/browse-products">Browse Products</NavLink>
            <NavLink to="/dashboard/cart">My Cart</NavLink>
            <NavLink to="/dashboard/orders">My Orders</NavLink>
            <NavLink to="/dashboard/payments">Payments</NavLink>
            <NavLink to="/dashboard/profile">Profile</NavLink>
            <NavLink to="/dashboard/my-reviews">My Reviews</NavLink>
            <NavLink to="/dashboard/notifications">Notifications</NavLink>
            <NavLink to="/dashboard/analytics">Analytics</NavLink>
            <NavLink to="/dashboard/help">Help & Support</NavLink>
          </>
        )}

        {/* ---------- ADMIN ---------- */}
        {role === "ADMIN" && (
          <>
            <NavLink to="/dashboard/admin">Dashboard</NavLink>
            <NavLink to="/dashboard/farmers">Farmers</NavLink>
            <NavLink to="/dashboard/retailers">Retailers</NavLink>
            <NavLink to="/dashboard/products">Products</NavLink>
            <NavLink to="/dashboard/orders">Orders</NavLink>
            <NavLink to="/dashboard/transactions">Transactions</NavLink>
            <NavLink to="/dashboard/manage-users">Manage Users</NavLink>
            <NavLink to="/dashboard/profile">Profile</NavLink>
            <NavLink to="/dashboard/support">Support</NavLink>
            <NavLink to="/dashboard/settings">Settings</NavLink>
          </>
        )}
      </nav>

      <div className="sidebar-divider" />

      {/* Footer */}
      <div className="sidebar-footer">
        <button className="sidebar-logout-btn" onClick={onLogout}>
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
