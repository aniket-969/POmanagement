
import PendingTable from './pendingTable'
import PaginationControls from './paginationControls'
import { Box, CircularProgress } from '@mui/material'
import useAdmin from '../../hooks/useAdmin'
import { useState } from 'react'
 
const PendingList = () => {
    const {pendingCreatorsQuery} = useAdmin()
    const [page,setPage] = useState(1)
    const {data,isLoading,isError} = pendingCreatorsQuery
    if(isLoading){
        return <CircularProgress/>
    }
    if(isError){
       return <>Something went wrong, refresh</>
    }
    // console.log(data)
  return (
    <Box sx={{
      width:"100%",
      display:"flex",
      flexDirection:"column",
      gap:4
    }}>
        <PendingTable pendingData ={data?.data?.data?.data}/>
        <PaginationControls/>
    </Box>
  )
}

export default PendingList