import { useState } from "react";
import { Link } from "react-router-dom";   
import { useAuth } from "../context/useAuth";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import "./Auth.css";
import loginBg from "../assets/login.png"; 

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const res = await api.post("/auth/login", { email, password });

    const { role, name } = res.data;

    login(res.data);

    alert(`Welcome ${name} (${role})`);

    if (role === "FARMER") navigate("/dashboard/farmer", { replace: true });
    else if (role === "RETAILER") navigate("/dashboard/retailer", { replace: true });
    else if (role === "ADMIN") navigate("/dashboard/admin", { replace: true });

  } catch (err) {
    console.error(err);
    alert("Invalid email or password");
  }
};

  return (
<div className="login-page">
  <div
    className="login-image"
    style={{
      backgroundImage: `url(${loginBg})`,
    }}
  />

      <div className="login-form" >
        <h2>Login</h2>
        <p className="login-subtitle">
          Welcome back to Agricart
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-group" id="login-group">
            <label>Email:</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group" id="login-group">
            <label>Password:</label>
            <input
              type="password"
              name="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-group" id="login-group">
            <label>Phone Number:</label>
            <input
              type="tel"
              name="phone"
              placeholder="Enter phone number"
              required
            />
          </div>

          <button type="submit" className="auth-btn">
            Login
          </button>
        </form>

        <p className="auth-footer">
          Don&apos;t have an account?{" "}
          <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
