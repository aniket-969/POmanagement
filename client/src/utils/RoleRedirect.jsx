
import { Navigate } from "react-router-dom";

const RoleRedirect = () => {
  
  const session = localStorage.getItem("session");

  const user = JSON.parse(session);

  if (user.role === "admin") {
    return <Navigate to="/orders/admin" replace />;
  } else if (user.role === "approver") {
    return <Navigate to="/orders/approver" replace />;
  } else if (user.role === "creator" ) {
    return <Navigate to="/orders/user" replace />;
  } else {
    return <Navigate to="/login" replace />;
  }
};

export default RoleRedirect;
