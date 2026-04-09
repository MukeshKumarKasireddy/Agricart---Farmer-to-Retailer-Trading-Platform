import { useState, useEffect } from "react";
import { useLocation, Outlet, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "../../../components/Navbar";
import Chatbot from "../../../components/Chatbox";
import api from "../../../api/axios";

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();

  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  /* LOAD USER AFTER LOGIN */
  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await api.get("/users/me");
        setUser(res.data);
      } catch (err) {
        console.error("User load failed", err);
      } finally {
        setLoadingUser(false);
      }
    };

    loadUser();
  }, []);

  /* 🔴 FORCE VERIFICATION REDIRECT */
  useEffect(() => {
    if (!user) return;

    const status = user.verificationStatus;

    // If farmer not verified → ALWAYS go to verification page
    if (
      user.role === "FARMER" &&
      (status === "UNVERIFIED" || status === "REJECTED")
    ) {
      if (location.pathname !== "/dashboard/verification") {
        navigate("/dashboard/verification", { replace: true });
      }
    }

    // If verified → leave verification page
    if (
      user.role === "FARMER" &&
      status === "VERIFIED" &&
      location.pathname === "/dashboard/verification"
    ) {
      navigate("/dashboard", { replace: true });
    }

  }, [user, location.pathname, navigate]);

  if (loadingUser) return null;

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <>
      <Chatbot />

      {!isSidebarOpen && (
        <Navbar
          showToggle
          isSidebarOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
        />
      )}

      <Sidebar
        isOpen={isSidebarOpen}
        closeSidebar={() => setIsSidebarOpen(false)}
        onLogout={handleLogout}
      />

      <div className={`dashboard-container ${isSidebarOpen ? "sidebar-open" : ""}`}>
        <div className="dashboard-content">
          <Outlet context={{ user, setUser }} />
        </div>
      </div>
    </>
  );
};

export default DashboardLayout;
