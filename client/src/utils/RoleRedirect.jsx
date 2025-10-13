import { Navigate } from "react-router-dom";

const RoleRedirect = () => {
  const session = localStorage.getItem("session");
  const user = session ? JSON.parse(session)?.user : null;
  
  if (!user || !user.role) {
    return <Navigate to="/login" replace />;
  }

  switch (user.role) {
    case "admin":
      return <Navigate to="/orders/admin" replace />;
    case "approver":
      return <Navigate to="/orders/approver" replace />;
    case "creator":
      return <Navigate to="/orders/user" replace />;
    default:
      return <Navigate to="/login" replace />;
  }
};

export default RoleRedirect;
