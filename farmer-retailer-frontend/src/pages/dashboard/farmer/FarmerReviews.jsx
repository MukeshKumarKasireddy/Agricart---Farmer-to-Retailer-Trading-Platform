import { useEffect, useState } from "react";
import api from "../../../api/axios";

const FarmerReviews = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get("/reviews/farmer").then(res => setData(res.data));
  }, []);

  if (!data) return <p style={{ padding: 32 }}>Loading reviews...</p>;

  return (
    <div style={{ padding: 32 }}>
      <h2 style={{ marginBottom: 24 }}>Customer Reviews</h2>

      {/* SUMMARY CARD */}
      <div style={summary}>
        <h1 style={{ margin: 0 }}>⭐ {data.average.toFixed(1)}</h1>
        <p style={{ color: "#777", margin: 0 }}>
          {data.total} total reviews
        </p>
      </div>

      {/* REVIEW GRID */}
      <div style={grid}>
        {data.reviews.map(r => (
          <div key={r.id} style={card}>
            <h4>{r.product?.name}</h4>

            <p style={{ color: "#777" }}>
              Retailer: {r.retailer?.name}
            </p>

            <div style={badge}>⭐ {r.rating}</div>

            <p style={{ marginTop: 10 }}>
              {r.comment || "No comment"}
            </p>

            <p style={date}>
              {r.createdAt?.split("T")[0]}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

/* styles */
const summary = {
  background: "#fff",
  padding: 24,
  borderRadius: 16,
  marginBottom: 32,
  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))",
  gap: 20,
};

const card = {
  background: "#fff",
  padding: 18,
  borderRadius: 14,
  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
};

const badge = {
  background: "#fff3cd",
  padding: "4px 10px",
  borderRadius: 8,
  fontWeight: 600,
  display: "inline-block",
};

const date = {
  marginTop: 10,
  fontSize: 12,
  color: "#888",
};

export default FarmerReviews;
