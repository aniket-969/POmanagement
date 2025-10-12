import React from 'react'
import { Box } from '@mui/material';
import Topbar from '../../components/user/topbar';
import DebugSearchInput from "../../components/admin/search"
import PoTable from '../../components/user/poTable';
import Filter from './../../components/ui/filter';

const User = () => {
  return (
    <Box sx={{width:"100%"}}>
      <Topbar/>
    
      <Box sx={{
        display:"flex",
        justifyItems:"",
        alignItems:"center",
        gap:4,
        width:"100%"
      }}>  
        <DebugSearchInput/>
         <Filter/>
   
      </Box>
        <PoTable/>
      
      </Box>
  ) 
}

export default User