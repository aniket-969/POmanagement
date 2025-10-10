import { Box } from '@mui/material'
import React from 'react'
import SearchInput from './search'
import CreateApprover from './createApprover'

const Topbar = () => {
  return (
    <Box
  sx={{
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    gap: 2,
    width: "100%",
    flexDirection: {
      xs: "column", 
      sm: "row",  
    },
  }}
>
      <SearchInput/>
      <CreateApprover/>
    </Box>
  )
}

export default Topbar