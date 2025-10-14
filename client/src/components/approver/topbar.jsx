import React from 'react'
import Logout from '../logout'
import { Button, Typography } from '@mui/material';
import { Box } from '@mui/material';
import { Link } from 'react-router-dom';

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
      <Link to={"/orders/approver/reviewed"}>
      <Button variant='outlined'>Your PO</Button>
      </Link>
      
        <Logout/>

    </Box>
  )
}

export default Topbar