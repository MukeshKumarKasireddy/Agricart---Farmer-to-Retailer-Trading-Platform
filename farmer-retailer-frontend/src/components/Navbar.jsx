import { Link, useNavigate, useLocation } from "react-router-dom";
import "./Navbar.css";

const Navbar = ({ showToggle = false, isSidebarOpen, toggleSidebar }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const currentPath = location.pathname;

  return (
    <nav className="navbar">

      <div className="navbar-left">
        {showToggle && (
          <button
            className="sidebar-toggle-btn"
            onClick={toggleSidebar}
          >
            {isSidebarOpen ? "✕" : "☰"}
          </button>
        )}

        <span className="navbar-brand">
          Agricart
        </span>
      </div>

      <div className="navbar-right">
        {!token && (
          <>
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/register" className="nav-link">Register</Link>
          </>
        )}

        {token && (
          <>
            {currentPath !== "/dashboard" && currentPath !== "/admin" && (
              <Link to="/dashboard" className="nav-link">
                Dashboard
              </Link>
            )}

            {role === "ADMIN" && currentPath !== "/admin" && (
              <Link to="/admin" className="nav-link admin-link">
                Admin
              </Link>
            )}

            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
