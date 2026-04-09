import { useState } from "react";
import { useEffect } from "react";    
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import "./Auth.css";
import { Link } from "react-router-dom";
import registerBg from "../assets/register.png";

function Register() {
  const navigate = useNavigate();

  useEffect(() => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (token) {
    if (role === "ADMIN") {
      navigate("/admin", { replace: true });
    } else {
      navigate("/dashboard", { replace: true });
    }
  }
}, [navigate]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "FARMER",
    gender: "Chose...",
    phone: "",
    address: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/auth/register", formData);
      alert("Registration successful");
      navigate("/login");
    } catch (err) {
      console.error(err);
      alert("Registration failed");
    }
  };


  return (
    <div 
     className="auth-page"
      style={{
        backgroundImage: `url(${registerBg})`,
        backgroundSize: "100% 100%",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="auth-form">
        <h2>Create Account</h2>
        <p className="auth-subtitle">
          Join Agricart and start trading
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name:</label>
            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Password:</label>
            <input
              type="password"
              name="password"
              placeholder="Enter password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

<div className="form-row-inline">
  <div className="form-row">
    <label>Phone:</label>
    <input name="phone" value={formData.phone} onChange={handleChange} />
  </div>

  <div className="form-row">
    <label>Gender:</label>
    <select name="gender" value={formData.gender} onChange={handleChange}>
      <option value="MALE">Male</option>
      <option value="FEMALE">Female</option>
      <option value="OTHER">Other</option>
    </select>
  </div>
</div>

<div className="form-row">
  <label>Village:</label>
  <input
    name="village"
    value={formData.village}
    onChange={handleChange}
  />
</div>

<div className="form-row-inline">
  <div className="form-row">
    <label>City:</label>
    <input name="city" value={formData.city} onChange={handleChange} />
  </div>

  <div className="form-row">
    <label>Pincode</label>
    <input name="pincode" value={formData.pincode} onChange={handleChange} />
  </div>
</div>

          <div className="form-group">
            <label>Role:</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="FARMER">Farmer</option>
              <option value="RETAILER">Retailer</option>
            </select>
          </div>

          <button type="submit" className="auth-btn">
            Register
          </button>
        </form>

        <p className="auth-footer">
          Already have an account?{" "}
          <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
