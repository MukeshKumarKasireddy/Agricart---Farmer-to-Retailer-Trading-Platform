import { useEffect, useState } from "react";
import api from "../../../api/axios";
import "./BrowseProducts.css";
import { useCart } from "../../../context/CartContext";

const categoryImages = {
  Vegetables: "/placeholders/vegetables.png",
  Fruits: "/placeholders/fruits.png",
  Pulses: "/placeholders/pulses.png",
  Leafy: "/placeholders/leafy.png",
};

const BrowseProducts = () => {
  const { addToCart } = useCart();

  const [productsByCategory, setProductsByCategory] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [filters, setFilters] = useState({
    name: "",
    category: "",
    minPrice: "",
    maxPrice: "",
    inStock: false,
    sort: "newest",
  });

  /* =========================
     FETCH PRODUCTS (SERVER)
     ========================= */
  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line
  }, [filters]);

  const fetchProducts = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await api.get("/products/search", {
        params: {
          name: filters.name || undefined,
          category: filters.category || undefined,
          minPrice: filters.minPrice || undefined,
          maxPrice: filters.maxPrice || undefined,
          inStock: filters.inStock || undefined,
          sort: filters.sort,
        },
      });

      const grouped = res.data.reduce((acc, product) => {
        const category = product.category || "Others";
        if (!acc[category]) acc[category] = [];
        acc[category].push(product);
        return acc;
      }, {});

      setProductsByCategory(grouped);
    } catch (err) {
      console.error(err);
      setError("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     CART
     ========================= */
  const handleAddToCart = (product) => {
    const qty = prompt("Enter quantity (kg):");

    if (!qty || isNaN(qty) || qty <= 0) {
      alert("Invalid quantity");
      return;
    }

    if (qty > product.quantityKg) {
      alert(`Only ${product.quantityKg} kg available`);
      return;
    }

    addToCart({
      productId: product.id,
      name: product.name,
      pricePerKg: product.pricePerKg,
      quantity: Number(qty),
      farmerId: product.farmer.id,
      availableStock: product.quantityKg,
    });

    alert("Product added to cart");
  };

  /* =========================
     UI STATES
     ========================= */
  if (loading) return <p>Loading products...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <h2 style={{ marginBottom: "12px" }}>Browse Products</h2>

      {/* ================= FILTER PANEL ================= */}
<div className="filters-card">
  <div className="filters-title">Filter Products</div>

  <div className="filters-grid">
    <input
      placeholder="Search product"
      value={filters.name}
      onChange={(e) =>
        setFilters({ ...filters, name: e.target.value })
      }
    />

    <select
      value={filters.category}
      onChange={(e) =>
        setFilters({ ...filters, category: e.target.value })
      }
    >
      <option value="">All Categories</option>
      <option value="Vegetables">Vegetables</option>
      <option value="Fruits">Fruits</option>
      <option value="Pulses">Pulses</option>
      <option value="Leafy">Leafy</option>
    </select>

    <input
      type="number"
      placeholder="Min Price (₹)"
      value={filters.minPrice}
      onChange={(e) =>
        setFilters({ ...filters, minPrice: e.target.value })
      }
    />

    <input
      type="number"
      placeholder="Max Price (₹)"
      value={filters.maxPrice}
      onChange={(e) =>
        setFilters({ ...filters, maxPrice: e.target.value })
      }
    />

    <select
      value={filters.sort}
      onChange={(e) =>
        setFilters({ ...filters, sort: e.target.value })
      }
    >
      <option value="newest">Newest</option>
      <option value="price_asc">Price: Low → High</option>
      <option value="price_desc">Price: High → Low</option>
    </select>

    <div className="filter-checkbox">
      <input
        type="checkbox"
        checked={filters.inStock}
        onChange={(e) =>
          setFilters({ ...filters, inStock: e.target.checked })
        }
      />
      <span>In Stock Only</span>
    </div>
  </div>

  <button
    className="clear-filters-btn"
    onClick={() =>
      setFilters({
        name: "",
        category: "",
        minPrice: "",
        maxPrice: "",
        inStock: false,
        sort: "newest",
      })
    }
  >
    Clear all filters
  </button>
</div>

{!loading && Object.keys(productsByCategory).length === 0 && (
  <div className="no-results">
    No products match your filters.
  </div>
)}

      {/* ================= PRODUCT LIST ================= */}
      {Object.keys(productsByCategory).length === 0 ? (
        <p style={{ color: "#777" }}>
          No products match your filters.
        </p>
      ) : (
        Object.entries(productsByCategory).map(([category, items]) => (
          <div key={category} style={{ marginBottom: "32px" }}>
            <h3>{category}</h3>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fill, minmax(220px, 1fr))",
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
                    src={
                      product.imageUrl ||
                      categoryImages[category] ||
                      "/placeholders/default.png"
                    }
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
                    <p style={{ fontSize: "14px", marginTop: "8px" }}>
                      {product.description}
                    </p>
                  )}

                  <button
                    onClick={() => handleAddToCart(product)}
                    style={{
                      marginTop: "12px",
                      width: "100%",
                      padding: "10px",
                      backgroundColor: "#2A7D3E",
                      color: "#ffffff",
                      border: "none",
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontWeight: 600,
                    }}
                  >
                    Add to Cart
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default BrowseProducts;
