import { useState } from "react";
import api from "../../../api/axios";

const FarmerVerification = () => {
  const [aadharNumber, setAadharNumber] = useState("");
  const [panNumber, setPanNumber] = useState("");
  const [aadharFile, setAadharFile] = useState(null);
  const [panFile, setPanFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const submit = async () => {
    if (!aadharNumber || !panNumber) {
      alert("Enter Aadhaar and PAN numbers");
      return;
    }

    if (!aadharFile || !panFile) {
      alert("Upload both documents");
      return;
    }

    const formData = new FormData();
    formData.append("aadharNumber", aadharNumber);
    formData.append("panNumber", panNumber);
    formData.append("aadharFile", aadharFile);
    formData.append("panFile", panFile);

    try {
      setLoading(true);

      await api.post("/farmer/verification/submit", formData);

      setSubmitted(true);

      // redirect after short delay
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 2000);

    } catch (err) {
      console.error(err);
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={page}>
      <div style={card}>
        <h2 style={title}>Farmer Verification</h2>

        <p style={subtitle}>
          Upload your Aadhaar and PAN to activate selling features.
        </p>

        {submitted && (
          <div style={successBox}>
            Documents submitted successfully.  
            Waiting for admin approval…
          </div>
        )}

        <div style={formGroup}>
          <label>Aadhaar Number</label>
          <input
            value={aadharNumber}
            onChange={e => setAadharNumber(e.target.value)}
            placeholder="Enter 12-digit Aadhaar"
            style={input}
          />
        </div>

        <div style={formGroup}>
          <label>PAN Number</label>
          <input
            value={panNumber}
            onChange={e => setPanNumber(e.target.value)}
            placeholder="Enter PAN"
            style={input}
          />
        </div>

        <div style={formGroup}>
          <label>Aadhaar Document</label>
          <input
            type="file"
            onChange={e => setAadharFile(e.target.files[0])}
          />
          {aadharFile && (
            <span style={fileName}>{aadharFile.name}</span>
          )}
        </div>

        <div style={formGroup}>
          <label>PAN Document</label>
          <input
            type="file"
            onChange={e => setPanFile(e.target.files[0])}
          />
          {panFile && (
            <span style={fileName}>{panFile.name}</span>
          )}
        </div>

        <button
          onClick={submit}
          disabled={loading}
          style={button}
        >
          {loading ? "Submitting..." : "Submit for Verification"}
        </button>
      </div>
    </div>
  );
};

/* STYLES */

const page = {
  display: "flex",
  justifyContent: "center",
  marginTop: 40
};

const card = {
  width: 420,
  background: "#fff",
  padding: 30,
  borderRadius: 14,
  boxShadow: "0 6px 18px rgba(0,0,0,0.08)"
};

const title = {
  fontSize: 22,
  fontWeight: 700,
  marginBottom: 6
};

const subtitle = {
  color: "#666",
  marginBottom: 20
};

const formGroup = {
  marginBottom: 16,
  display: "flex",
  flexDirection: "column",
  gap: 6
};

const input = {
  padding: 10,
  borderRadius: 8,
  border: "1px solid #ddd"
};

const button = {
  marginTop: 20,
  width: "100%",
  padding: 12,
  border: "none",
  borderRadius: 10,
  background: "#2A7D3E",
  color: "#fff",
  fontWeight: 600,
  cursor: "pointer"
};

const fileName = {
  fontSize: 12,
  color: "#555"
};

const successBox = {
  background: "#e7f7ed",
  padding: 12,
  borderRadius: 8,
  marginBottom: 15,
  color: "#2A7D3E",
  fontWeight: 500
};

export default FarmerVerification;
