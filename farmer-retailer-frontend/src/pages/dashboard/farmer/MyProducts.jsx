import { useEffect, useState } from "react";
import api from "../../../api/axios";

const categoryImages = {
  Vegetables: "/placeholders/vegetables.png",
  Fruits: "/placeholders/fruits.png",
  Pulses: "/placeholders/pulses.png",
  Leafy: "/placeholders/leafy.png",
};

const MyProducts = () => {
  const [productsByCategory, setProductsByCategory] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    pricePerKg: "",
    quantityKg: "",
    description: "",
    imageUrl: "",
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await api.get("/products/my");

      const grouped = res.data.reduce((acc, product) => {
        const category = product.category || "Others";
        if (!acc[category]) acc[category] = [];
        acc[category].push(product);
        return acc;
      }, {});

      setProductsByCategory(grouped);
    } catch {
      setError("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );
    if (!confirmDelete) return;

    try {
      await api.delete(`/products/${id}`);
      setProductsByCategory((prev) => {
        const updated = {};
        for (const category in prev) {
          const filtered = prev[category].filter((p) => p.id !== id);
          if (filtered.length > 0) updated[category] = filtered;
        }
        return updated;
      });
    } catch {
      alert("Failed to delete product");
    }
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      pricePerKg: product.pricePerKg,
      quantityKg: product.quantityKg,
      description: product.description || "",
      imageUrl: product.imageUrl || "",
    });
    setIsEditOpen(true);
  };

  const closeEditModal = () => {
    setIsEditOpen(false);
    setEditingProduct(null);
  };

  const handleEditChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const res = await api.put(
        `/products/${editingProduct.id}`,
        {
          ...formData,
          pricePerKg: Number(formData.pricePerKg),
          quantityKg: Number(formData.quantityKg),
        }
      );

      setProductsByCategory((prev) => {
        const updated = {};
        for (const category in prev) {
          updated[category] = prev[category].map((p) =>
            p.id === res.data.id ? res.data : p
          );
        }
        return updated;
      });

      closeEditModal();
    } catch {
      alert("Failed to update product");
    }
  };

  if (loading) return <p>Loading products...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  const label = {
  fontSize: "13px",
  fontWeight: 600,
  marginBottom: "4px",
  display: "block",
  color: "#333",
};

const input = {
  width: "100%",
  padding: "10px",
  borderRadius: "8px",
  border: "1px solid #ccc",
  fontSize: "14px",
};

  return (
    <div>
      <h2 style={{ marginBottom: "12px" }}>My Products</h2>

      <hr style={{ marginBottom: "12px" }} />
      {Object.keys(productsByCategory).length === 0 ? (
        <p>No products added yet.</p>
      ) : (
        Object.entries(productsByCategory).map(([category, items]) => (
          <div key={category} style={{ marginBottom: "32px" }}>
            <h3>{category}</h3>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                gap: "20px",
                marginTop: "16px",
              }}
            >
              {items.map((product) => (
                <div
                  key={product.id}
                  style={{
                    background: "#ffffff",
                    borderRadius: "12px",
                    padding: "16px",
                  }}
                >
                  <img
  src={product.imageUrl}
  onError={(e) => {
    e.target.onerror = null;
    e.target.src = categoryImages[category] || "/placeholders/default.png";
  }}
  alt={product.name}
  style={{
    width: "100%",
    height: "120px",
    objectFit: "cover",
    borderRadius: "8px",
    marginBottom: "12px",
  }}
/>

                  <h4>{product.name}</h4>

                  <p style={{ color: "#FFB347", fontWeight: 600 }}>
                    ₹{product.pricePerKg} / kg
                  </p>

                  <p>Available: {product.quantityKg} kg</p>

                  {product.description && (
  <p
    style={{
      fontSize: "13px",
      color: "#5D4037",
      marginTop: "6px",
      lineHeight: "1.4",
    }}
  >
    {product.description}
  </p>
)}


                  <button
                    onClick={() => openEditModal(product)}
                    style={{
                      width: "100%",
                      backgroundColor: "#2A7D3E",
                      color: "#fff",
                      border: "none",
                      padding: "8px",
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontWeight: 500,
                      marginTop: "8px",
                    }}
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(product.id)}
                    style={{
                      width: "100%",
                      backgroundColor: "#d32f2f",
                      color: "#fff",
                      border: "none",
                      padding: "8px",
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontWeight: 500,
                      marginTop: "8px",
                    }}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))
      )}

{/* ================= EDIT MODAL ================= */}
{isEditOpen && (
  <div
    style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.45)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 2000,
      padding: "20px",
    }}
  >
    <form
      onSubmit={handleUpdate}
      style={{
        background: "#fff",
        padding: "28px",
        borderRadius: "16px",
        width: "480px",
        maxWidth: "100%",
        boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
      }}
    >
      <h2 style={{ marginBottom: "6px" }}>Edit Product</h2>
      <p style={{ color: "#777", marginBottom: "20px", fontSize: "14px" }}>
        Update product details and stock
      </p>

      {/* PRODUCT NAME */}
      <div style={{ marginBottom: "14px" }}>
        <label style={label}>Product Name</label>
        <input
          name="name"
          value={formData.name}
          onChange={handleEditChange}
          required
          style={input}
        />
      </div>

      {/* CATEGORY */}
      <div style={{ marginBottom: "14px" }}>
        <label style={label}>Category</label>
        <select
          name="category"
          value={formData.category}
          onChange={handleEditChange}
          required
          style={input}
        >
          <option value="">Select</option>
          <option value="Vegetables">Vegetables</option>
          <option value="Fruits">Fruits</option>
          <option value="Leafy Greens">Leafy Greens</option>
          <option value="Pulses">Pulses</option>
          <option value="Grains">Grains</option>
          <option value="Others">Others</option>
        </select>
      </div>

      {/* PRICE + QTY */}
      <div style={{ display: "flex", gap: "12px", marginBottom: "14px" }}>
        <div style={{ flex: 1 }}>
          <label style={label}>Price per kg (₹)</label>
          <input
            type="number"
            name="pricePerKg"
            value={formData.pricePerKg}
            onChange={handleEditChange}
            required
            style={input}
          />
        </div>

        <div style={{ flex: 1 }}>
          <label style={label}>Quantity (kg)</label>
          <input
            type="number"
            name="quantityKg"
            value={formData.quantityKg}
            onChange={handleEditChange}
            required
            style={input}
          />
        </div>
      </div>

      {/* IMAGE URL */}
      <div style={{ marginBottom: "14px" }}>
        <label style={label}>Image URL</label>
        <input
          name="imageUrl"
          value={formData.imageUrl}
          onChange={handleEditChange}
          placeholder="https://..."
          style={input}
        />
      </div>

      {/* DESCRIPTION */}
      <div style={{ marginBottom: "20px" }}>
        <label style={label}>Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleEditChange}
          rows={3}
          style={{ ...input, resize: "none" }}
        />
      </div>

      {/* ACTION BUTTONS */}
      <div style={{ display: "flex", gap: "12px" }}>
        <button
          type="submit"
          style={{
            flex: 1,
            background: "#2A7D3E",
            color: "#fff",
            border: "none",
            padding: "10px",
            borderRadius: "8px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Save Changes
        </button>

        <button
          type="button"
          onClick={closeEditModal}
          style={{
            flex: 1,
            background: "#eee",
            border: "none",
            padding: "10px",
            borderRadius: "8px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Cancel
        </button>
      </div>
    </form>
  </div>
)}

    </div>
    
  );
};

export default MyProducts;
