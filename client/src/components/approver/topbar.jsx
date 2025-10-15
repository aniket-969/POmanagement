import React from "react";
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Tooltip } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import DescriptionIcon from "@mui/icons-material/Description";
import Logout from "../logout";

const Topbar = () => {
  const session = JSON.parse(localStorage.getItem("session"));
  const navigate = useNavigate();

  return (
    <AppBar
      position="static"
      color="default"
      sx={{
        boxShadow: "0px 1px 4px rgba(0,0,0,0.1)",
        backgroundColor: "#fff",
        borderBottom: "1px solid #e0e0e0",
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        {/* Left Section */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <DescriptionIcon color="primary" />
          <Typography
            variant="h6"
            sx={{ fontWeight: 600, color: "primary.main", cursor: "pointer" }}
            onClick={() => navigate("/approver")}
          >
            Approver Dashboard
          </Typography>
        </Box>

        {/* Center Navigation */}
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            component={Link}
            to="/orders/approver/reviewed"
            variant="outlined"
            size="smal"
            sx={{
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 500,
            }}
          >
            Your POs
          </Button>
        </Box>

        {/* Right Section (User & Logout) */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        
          <Tooltip title="Logout">
            <IconButton size="small" color="error">
              <Logout />
            </IconButton>
          </Tooltip>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Topbar;
