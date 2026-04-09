import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../api/axios";
import "./AddProduct.css";

const AddProduct = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [checkingUser, setCheckingUser] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    pricePerKg: "",
    quantityKg: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);

  // 🔹 get logged-in user
  useEffect(() => {
    api.get("/users/me")
      .then(res => setUser(res.data))
      .finally(() => setCheckingUser(false));
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (user?.verificationStatus !== "VERIFIED") {
      alert("You must be verified before adding products");
      return;
    }

    setLoading(true);

    try {
      await api.post("/products", {
        ...formData,
        pricePerKg: Number(formData.pricePerKg),
        quantityKg: Number(formData.quantityKg),
      });

      navigate("/dashboard/products");
    } catch (err) {
      alert(err.response?.data || "Failed to add product");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 while checking user
  if (checkingUser) {
    return <div className="p-6">Checking verification...</div>;
  }

  // 🔴 BLOCK PAGE if not verified
  if (user?.verificationStatus !== "VERIFIED") {
    return (
      <div className="p-6">
        {user?.verificationStatus === "UNVERIFIED" && (
          <>
            <h2>You must verify documents first</h2>
            <button onClick={() => navigate("/farmer/verify")}>
              Verify Now
            </button>
          </>
        )}

        {user?.verificationStatus === "PENDING" && (
          <h2>Verification in progress. Please wait for admin approval.</h2>
        )}

        {user?.verificationStatus === "REJECTED" && (
          <>
            <h2>Verification failed: {user.rejectionReason}</h2>
            <button onClick={() => navigate("/farmer/verify")}>
              Re-verify
            </button>
          </>
        )}
      </div>
    );
  }

  // 🟢 VERIFIED → show form
  return (
    <div className="add-product-page">
      <div className="add-product-card">
        <h2 className="add-product-title">Add New Product</h2>

        <form className="add-product-form" onSubmit={handleSubmit}>
          <div>
            <label>Product Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label>Category:</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">Select category</option>
              <option value="Vegetables">Vegetables</option>
              <option value="Fruits">Fruits</option>
              <option value="Leafy Greens">Leafy Greens</option>
              <option value="Pulses">Pulses</option>
              <option value="Grains">Grains</option>
              <option value="Others">Others</option>
            </select>
          </div>

          <div>
            <label>Price per kg (₹):</label>
            <input
              type="number"
              name="pricePerKg"
              value={formData.pricePerKg}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label>Quantity: (kg)</label>
            <input
              type="number"
              name="quantityKg"
              value={formData.quantityKg}
              onChange={handleChange}
              required
            />
          </div>

          <div className="full-width">
            <label>Description:</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            className="add-product-btn"
            disabled={loading}
          >
            {loading ? "Adding..." : "Add Product"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
