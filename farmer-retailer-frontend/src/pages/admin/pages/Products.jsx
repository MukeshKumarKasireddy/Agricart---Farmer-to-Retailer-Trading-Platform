import { useEffect, useState } from "react";
import api from "../../../api/axios";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");

  /* ---------------- LOAD ---------------- */
  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get("/admin/orders");

        const productMap = {};

        res.data.forEach(o => {
          const p = o.product;
          if (!p) return;

          productMap[p.id] = {
            id: p.id,
            name: p.name,
            category: p.category,
            farmer: o.farmer?.name,
            qty: p.quantityKg,
            price: p.pricePerKg
          };
        });

        setProducts(Object.values(productMap));
      } catch (err) {
        console.error(err);
        alert("Failed to load products");
      }
    };

    load();
  }, []);

  /* ---------------- DELETE ---------------- */
  const deleteProduct = async (id) => {
    if (!window.confirm("Delete this product?")) return;

    try {
      await api.delete(`/products/${id}`);
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch {
      alert("Delete failed");
    }
  };

  /* ---------------- FILTERING ---------------- */
  const filteredProducts = products
    .filter(p =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.farmer?.toLowerCase().includes(search.toLowerCase())
    )
    .filter(p => {
      if (filter === "ALL") return true;
      if (filter === "AVAILABLE") return p.qty > 0;
      if (filter === "SOLD") return p.qty === 0;
      return true;
    });

  return (
    <div style={{ padding: 32 }}>
      <h2 style={title}>All Products</h2>

      {/* SEARCH + FILTER */}
      <div style={toolbar}>
        <input
          placeholder="Search product or farmer..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={searchBox}
        />

        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="ALL">All</option>
          <option value="AVAILABLE">Available</option>
          <option value="SOLD">Sold</option>
        </select>
      </div>

      <table style={table}>
        <thead>
          <tr>
            <th style={th}>ID</th>
            <th style={th}>Name</th>
            <th style={th}>Category</th>
            <th style={th}>Farmer</th>
            <th style={th}>Qty</th>
            <th style={th}>Price</th>
            <th style={th}>Status</th>
            <th style={{ ...th, color: "#d32f2f" }}>Action</th>
          </tr>
        </thead>

        <tbody>
          {filteredProducts.map((p) => (
            <tr key={p.id} style={tr}>
              <td style={td}>{p.id}</td>
              <td style={td}>{p.name}</td>
              <td style={td}>{p.category}</td>
              <td style={td}>{p.farmer}</td>
              <td style={td}>{p.qty}</td>
              <td style={td}>₹{p.price}</td>

              <td style={td}>
                <span style={p.qty > 0 ? ok : bad}>
                  {p.qty > 0 ? "AVAILABLE" : "SOLD"}
                </span>
              </td>

              <td style={td}>
                <button style={danger} onClick={() => deleteProduct(p.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

/* ---------------- STYLES (MATCH ORDERS PAGE) ---------------- */

const title = { marginBottom: 20 };

const toolbar = {
  display: "flex",
  gap: 12,
  marginBottom: 20,
};

const searchBox = {
  padding: "8px",
  width: 260,
  borderRadius: 6,
  border: "1px solid #ccc",
};

const table = {
  width: "100%",
  borderCollapse: "collapse",
  background: "#fff",
  borderRadius: 10,
  overflow: "hidden",
  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
};

const th = {
  textAlign: "left",
  padding: "12px",
  background: "#f5f5f5",
  fontWeight: 600,
};

const tr = {
  borderBottom: "1px solid #eee",
};

const td = {
  padding: "12px",
};

const danger = {
  background: "#d32f2f",
  color: "#fff",
  border: "none",
  padding: "6px 14px",
  borderRadius: 6,
  cursor: "pointer",
  fontWeight: 600,
};

const ok = { color: "#2e7d32", fontWeight: 600 };
const bad = { color: "#d32f2f", fontWeight: 600 };

export default Products;
