import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Tooltip,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import PersonIcon from "@mui/icons-material/Person";
import Logout from "../logout";
import CreatePO from "./createPO";

const Topbar = () => {
  const session = JSON.parse(localStorage.getItem("session"));
  const { user } = session || {};
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
          <PersonIcon color="primary" />
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: "primary.main",
              cursor: "pointer",
            }}
            onClick={() => navigate("/creator")}
          >
            User Dashboard
          </Typography>
        </Box>

        {/* Right Section */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {/* Create Purchase Order */}
          <Tooltip title="Create Purchase Order">
            <Box>
              <CreatePO
                triggerButton={
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<AddCircleOutlineIcon />}
                    sx={{
                      borderRadius: 2,
                      textTransform: "none",
                      fontWeight: 500,
                    }}
                  >
                    New PO
                  </Button>
                }
              />
            </Box>
          </Tooltip>

          {/* Logout */}
          <Tooltip title="Logout">
            <IconButton color="error" size="small">
              <Logout />
            </IconButton>
          </Tooltip>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Topbar;
