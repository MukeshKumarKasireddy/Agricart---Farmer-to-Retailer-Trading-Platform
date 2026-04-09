import { useState } from "react";
import api from "../api/axios";

const VerificationModal = ({ user, onClose, refreshUser }) => {

  const [aadharNumber, setAadharNumber] = useState("");
  const [panNumber, setPanNumber] = useState("");
  const [aadharFile, setAadharFile] = useState(null);
  const [panFile, setPanFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const submit = async () => {

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

      await refreshUser();
      onClose();

      alert("Verification submitted");
    } catch (err) {
        console.error(err);
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={overlay}>
      <div style={card}>
        <h2>Farmer Verification</h2>

        {user.verificationStatus === "REJECTED" && (
          <p style={{ color: "red" }}>
            Rejected: {user.rejectionReason}
          </p>
        )}

        <input
          placeholder="Aadhaar Number"
          value={aadharNumber}
          onChange={e => setAadharNumber(e.target.value)}
        />

        <input
          placeholder="PAN Number"
          value={panNumber}
          onChange={e => setPanNumber(e.target.value)}
        />

        <input type="file" onChange={e => setAadharFile(e.target.files[0])} />
        <input type="file" onChange={e => setPanFile(e.target.files[0])} />

        <button onClick={submit} disabled={loading}>
          {loading ? "Submitting..." : "Submit"}
        </button>
      </div>
    </div>
  );
};

const overlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.6)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 999,
};

const card = {
  background: "#fff",
  padding: 30,
  borderRadius: 10,
  width: 400,
};

export default VerificationModal;
