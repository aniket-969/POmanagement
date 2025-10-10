
import PendingTable from './pendingTable'
import PaginationControls from './paginationControls'
import { Box, CircularProgress } from '@mui/material'
import useAdmin from '../../hooks/useAdmin'

const PendingList = () => {
    const {pendingCreatorsQuery} = useAdmin()
    
    const {data,isLoading,isError} = pendingCreatorsQuery
    if(isLoading){
        return <CircularProgress/>
    }
    if(isError){
       return <>Something went wrong, refresh</>
    }
    // console.log(data)
  return (
    <Box>
        <PendingTable pendingData ={data?.data?.data?.data}/>
        <PaginationControls/>
    </Box>
  )
}

export default PendingList