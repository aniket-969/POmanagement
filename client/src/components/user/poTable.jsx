import React from 'react'
import usePO from '../../hooks/usePO'
import { Box } from '@mui/material';
import { CircularProgress } from '@mui/material';
import PaginationControls from '../admin/paginationControls';
import POList from './poList';

const PoTable = () => {
    const {poListQuery} = usePO()
    const {data,isLoading,isError} = poListQuery
     if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }
  if (isError) {
    return <>Something went wrong, refresh</>;
  }
   const apiResp = data?.data?.data;
  const payload = apiResp?.data 
  const currentPage = apiResp?.page ;
  const totalPages = apiResp?.totalPages ?? 1;
  
  return (
    <div>
        <POList data={payload}/>
        <PaginationControls  page={currentPage} totalPages={totalPages}/>
    </div>
  )
}

export default PoTable