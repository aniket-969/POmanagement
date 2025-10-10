import { Box } from '@mui/material'
import React from 'react'
import SearchInput from './search'
import CreateApprover from './createApprover'

const Topbar = () => {
  return (
    <Box>
      <SearchInput/>
      <CreateApprover/>
    </Box>
  )
}

export default Topbar