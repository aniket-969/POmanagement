import React from 'react'
import { Box } from '@mui/material';
import Topbar from '../../components/approver/topbar';
import ApproverList from '../../components/approver/approverList';

const Approver = () => {
  return (
    <Box sx={{
      width:"100%",
      p:2
    }}>
      <Topbar/>
      <ApproverList/>
    </Box>
  )
}

export default Approver