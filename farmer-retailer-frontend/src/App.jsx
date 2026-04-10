import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Cart from "./pages/dashboard/retailer/Cart";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { AuthProvider } from "./context/AuthContext";
import UpdateProfile from "./pages/dashboard/layout/UpdateProfile";
import DashboardHome from "./pages/dashboard/farmer/FarmerDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import RetailerDashboard from "./pages/dashboard/retailer/Retailerdashboard";
import MyReviews from "./pages/dashboard/retailer/MyReviews";
import FarmerReviews from "./pages/dashboard/farmer/FarmerReviews";
import ProtectedRoute from "./routes/ProtectedRoute";
import Farmers from "./pages/admin/pages/Farmers";
import Retailers from "./pages/admin/pages/Retailers";
import Products from "./pages/admin/pages/Products";
import Orders from "./pages/admin/pages/Orders";
import Transactions from "./pages/admin/pages/Transactions";
import ManageUsers from "./pages/admin/pages/ManageUsers";
import Profile from "./pages/admin/pages/Profile";
import Settings from "./pages/admin/pages/Settings";  
import Notifications from "./pages/dashboard/Notifications";
import VerificationModal from "./components/VerificationModal";
import RetailerAnalytics from "./pages/dashboard/retailer/RetailerAnalytics";
import FarmerOrders from "./pages/dashboard/farmer/FarmerOrders";
import FarmerVerification from "./pages/dashboard/farmer/FarmerVerification";
import RetailerOrders from "./pages/dashboard/retailer/RetailerOrders";
import MyProducts from "./pages/dashboard/farmer/MyProducts";
import AddProduct from "./pages/dashboard/farmer/AddProduct";
import FarmerAnalytics from "./pages/dashboard/farmer/FarmerAnalytics";
import UserProfile from "./pages/dashboard/farmer/UserProfile";
import FarmerTransactions from "./pages/dashboard/farmer/FarmerTransactions";
import RetailerTransactions from "./pages/dashboard/retailer/RetailerTransactions";
import BrowseProducts from "./pages/dashboard/retailer/BrowseProducts";
import DashboardLayout from "./pages/dashboard/layout/DashboardLayout";
import HelpSupport from "./pages/dashboard/HelpSupport";
import AdminSupport from "./pages/admin/AdminSupport";
import Footer from "./pages/Footer";
import DashboardRedirect from "./routes/DashboardRedirect";
import RoleRoute from "./routes/RoleRoute";

function AppRoutes() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* MAIN DASHBOARD LAYOUT FOR ALL ROLES */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >

          <Route
            index
            element={
              <DashboardRedirect />
            }
          />
          
          <Route path="notifications" element={<Notifications />} />


        {/* RETAILER */}
        <Route
          path="retailer"
          element={
            <RoleRoute allowedRoles={["RETAILER"]}>
              <RetailerDashboard />
            </RoleRoute>
          }
        />
        <Route
          path="browse-products"
          element={
            <RoleRoute allowedRoles={["RETAILER"]}>
              <BrowseProducts />
            </RoleRoute>
          }
        />
        <Route
          path="cart"
          element={
            <RoleRoute allowedRoles={["RETAILER"]}>
              <Cart />
            </RoleRoute>
          }
        />
        <Route
          path="orders"
          element={
            <RoleRoute allowedRoles={["RETAILER"]}>
              <RetailerOrders />
            </RoleRoute>
          }
        />
        <Route
          path="payments"
          element={
            <RoleRoute allowedRoles={["RETAILER"]}>
              <RetailerTransactions />
            </RoleRoute>
          }
        />
        <Route
          path="profile"
          element={
            <RoleRoute allowedRoles={["RETAILER"]}>
              <UserProfile />
            </RoleRoute>
          }
        /> 

        <Route
  path="analytics"
  element={
    <RoleRoute allowedRoles={["RETAILER"]}>
      <RetailerAnalytics />
    </RoleRoute>
  }
/>
        <Route
          path="my-reviews"
          element={
            <RoleRoute allowedRoles={["RETAILER"]}>
              <MyReviews />
            </RoleRoute>
          }
        />   
        <Route
          path="help"
          element={
            <RoleRoute allowedRoles={["RETAILER"]}>
              <HelpSupport />
            </RoleRoute>
          }
        />             

        {/* FARMER */}
        <Route
          path="farmer"
          element={
            <RoleRoute allowedRoles={["FARMER"]}>
              <DashboardHome />
            </RoleRoute>
          }
        />
        <Route
          path="products"
          element={
            <RoleRoute allowedRoles={["FARMER"]}>
              <MyProducts />
            </RoleRoute>
          }
          />
        <Route
          path="add-product"
          element={
            <RoleRoute allowedRoles={["FARMER"]}>
              <AddProduct />
            </RoleRoute>
          }          
        />
        <Route
          path="farmer-orders"
          element={
            <RoleRoute allowedRoles={["FARMER"]}>
              <FarmerOrders />
            </RoleRoute>
          }
        />
        <Route
          path="transactions"
          element={
            <RoleRoute allowedRoles={["FARMER"]}>
              <FarmerTransactions />
            </RoleRoute>
          }
        />

        <Route
  path="analytics"
  element={
    <RoleRoute allowedRoles={["FARMER"]}>
      <FarmerAnalytics />
    </RoleRoute>
  }
/>

        <Route
          path="farmer-profile"
          element={
            <RoleRoute allowedRoles={["FARMER"]}>
              <UserProfile />
            </RoleRoute>
          }
        />        
        <Route
          path="reviews"
          element={
            <RoleRoute allowedRoles={["FARMER"]}>
              <FarmerReviews />
            </RoleRoute>
          }
        />
        <Route
          path="verification"
          element={
            <RoleRoute allowedRoles={["FARMER"]}>
              <FarmerVerification />
            </RoleRoute>
          }
        />
          <Route
          path="farmer-help"
          element={
            <RoleRoute allowedRoles={["FARMER"]}>
              <HelpSupport />
            </RoleRoute>
          }
        />


        {/* ADMIN */}
        <Route
          path="admin"
          element={
            <RoleRoute allowedRoles={["ADMIN"]}>
              <AdminDashboard />
            </RoleRoute>
          }
        />
        <Route
          path="farmers"
          element={
            <RoleRoute allowedRoles={["ADMIN"]}>
              <Farmers />
            </RoleRoute>
          }
        />
        <Route
          path="retailers"
          element={
            <RoleRoute allowedRoles={["ADMIN"]}>
              <Retailers />
            </RoleRoute>
          }
        />
        <Route
          path="admin-products"
          element={
            <RoleRoute allowedRoles={["ADMIN"]}>
              <Products />
            </RoleRoute>
          }
        />
        <Route
          path="admin-orders"
          element={
            <RoleRoute allowedRoles={["ADMIN"]}>
              <Orders />
            </RoleRoute>
          }
        />
        <Route
          path="admin-transactions"
          element={
            <RoleRoute allowedRoles={["ADMIN"]}>
              <Transactions />
            </RoleRoute>
          }
        />
        <Route
          path="manage-users"
          element={
            <RoleRoute allowedRoles={["ADMIN"]}>
              <ManageUsers />
            </RoleRoute>
          }
        />
        <Route
          path="admin-profile"
          element={
            <RoleRoute allowedRoles={["ADMIN"]}>
              <Profile />
            </RoleRoute>
          }
        />        
        <Route
          path="settings"
          element={
            <RoleRoute allowedRoles={["ADMIN"]}>
              <Settings />
            </RoleRoute>
          }
        />
        <Route
          path="support"
          element={
            <RoleRoute allowedRoles={["ADMIN"]}>
              <AdminSupport />
            </RoleRoute>
          }
        />
        </Route>
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
    <AuthProvider>
      <AppRoutes />
      <Footer />
    </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
