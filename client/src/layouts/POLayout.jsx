import { Box } from '@mui/material';
import { Navigate, Outlet } from 'react-router-dom';

const POLayout = () => {
  const user = JSON.parse(localStorage.getItem("session") || "null");
  if (!user) return <Navigate to="/login" replace />;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", }}>
      <Outlet />
    </Box>
  );
};

export default POLayout