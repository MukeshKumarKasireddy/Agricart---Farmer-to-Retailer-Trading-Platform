import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../api/axios";

const UpdateProfile = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    api.get("/users/me").then(res => setFormData(res.data));
  }, []);

  if (!formData) return <p>Loading...</p>;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.put("/users/me", formData);
    alert("Profile updated");
    navigate("/dashboard");
  };

  return (
    <div style={{ maxWidth: "500px" }}>
      <h2>Edit Profile</h2>

      <form onSubmit={handleSubmit}>
        <input name="phone" value={formData.phone || ""} onChange={handleChange} placeholder="Phone" />
        <input name="village" value={formData.village || ""} onChange={handleChange} placeholder="Village" />
        <input name="city" value={formData.city || ""} onChange={handleChange} placeholder="City" />
        <input name="pincode" value={formData.pincode || ""} onChange={handleChange} placeholder="Pincode" />

        <select name="gender" value={formData.gender} onChange={handleChange}>
          <option value="MALE">Male</option>
          <option value="FEMALE">Female</option>
          <option value="OTHER">Other</option>
          <option value="PREFER_NOT_TO_SAY">Prefer not to say</option>
        </select>

        <button type="submit">Save</button>
      </form>
    </div>
  );
};

export default UpdateProfile;
