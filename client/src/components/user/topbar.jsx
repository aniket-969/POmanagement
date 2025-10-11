import React from "react";
import { Box } from "@mui/material";
import Logout from "../logout";
import CreatePO from "./createPO";

const Topbar = () => {
  const { user } = JSON.parse(localStorage.getItem("session"));
  return (
    <Box sx={{
        display:"flex",
        justifyContent:"space-around",
        alignItems:"center"
    }}>
      <p>{user?.fullName}</p>
      <Box sx={{
        display:"flex",
        alignItems:"center",
        gap:3
      }}>
        <CreatePO />
      <Logout />
      </Box>
      
    </Box>
  );
};

export default Topbar;
