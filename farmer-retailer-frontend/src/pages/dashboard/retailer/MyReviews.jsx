import { useEffect, useState } from "react";
import api from "../../../api/axios";

const MyReviews = () => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    api.get("/reviews/retailer").then(res => setReviews(res.data));
  }, []);

  return (
    <div style={{ padding: 32 }}>
      <h2 style={{ marginBottom: 24 }}>My Reviews</h2>

      {reviews.length === 0 ? (
        <p style={{ color: "#777" }}>No reviews submitted yet.</p>
      ) : (
        <table style={table}>
          <thead>
            <tr>
              <th style={th}>Product</th>
              <th style={th}>Farmer</th>
              <th style={th}>Rating</th>
              <th style={th}>Comment</th>
              <th style={th}>Date</th>
            </tr>
          </thead>

          <tbody>
            {reviews.map(r => (
              <tr key={r.id} style={tr}>
                <td style={td}>{r.product?.name}</td>
                <td style={td}>{r.farmer?.name}</td>

                <td style={td}>
                  <span style={badge}>
                    ⭐ {r.rating}
                  </span>
                </td>

                <td style={td}>{r.comment || "—"}</td>

                <td style={td}>
                  {r.createdAt?.split("T")[0]}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

/* styles */
const table = {
  width: "100%",
  borderCollapse: "collapse",
  background: "#fff",
  borderRadius: 12,
  overflow: "hidden",
  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
};

const th = {
  textAlign: "left",
  padding: 14,
  background: "#f5f5f5",
  fontWeight: 600,
};

const tr = { borderBottom: "1px solid #eee" };

const td = { padding: 14 };

const badge = {
  background: "#fff3cd",
  padding: "4px 10px",
  borderRadius: 8,
  fontWeight: 600,
};

export default MyReviews;
