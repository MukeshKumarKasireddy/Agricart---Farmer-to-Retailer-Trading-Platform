const UserDashboard = () => {
  const name = localStorage.getItem("name");
  const role = localStorage.getItem("role");

  return (
    <div style={{ padding: "20px" }}>
      <h2>User Dashboard</h2>

      <p>
        Welcome <strong>{name}</strong> ({role})
      </p>

      <ul>
        <li>View available products</li>
        <li>Place orders</li>
        <li>View order history</li>
        <li>Update profile</li>
      </ul>
    </div>
  );
};

export default UserDashboard;
