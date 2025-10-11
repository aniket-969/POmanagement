import React from 'react'
import { Box } from '@mui/material';
import Topbar from '../../components/user/topbar';
import DebugSearchInput from "../../components/admin/search"
import PoTable from '../../components/user/poTable';
import PaginationControls from '../../components/admin/paginationControls';

const User = () => {
  return (
    <Box>
      <Topbar/>
      <DebugSearchInput/>
      <PoTable/>
      <PaginationControls/>
      </Box>
  ) 
}

export default User