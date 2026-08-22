import { Navigate } from "react-router-dom";

function AdminRoute({ children }) {
  const userInfo = JSON.parse(
    localStorage.getItem("userInfo")
  );

  // User login nahi hai
  if (!userInfo) {
    return <Navigate to="/login" replace />;
  }

  // User admin nahi hai
  if (!userInfo.isAdmin) {
    return <Navigate to="/" replace />;
  }

  // Admin user
  return children;
}

export default AdminRoute;