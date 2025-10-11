import { Box, Pagination, Stack } from '@mui/material'
import React from 'react'

const PaginationControls = () => {
  return (
   
      <Pagination count={10} variant="outlined" size='large' sx={{
        display:'flex',
        justifyContent:"center"
      }}/>
    
  )
}

export default PaginationControls