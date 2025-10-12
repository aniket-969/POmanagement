import React from 'react'
import Logout from '../logout'
import { Typography } from '@mui/material';
import { Box } from '@mui/material';

const Topbar = () => {
    const session = JSON.parse(localStorage.getItem("session"))

  return (
    <Box sx={{
        display:"flex",
        justifyContent:"space-around"
    }}>
      <Typography>
        {session?.user?.fullName}
      </Typography>
        <Logout/>
    </Box>
  )
}

export default Topbar