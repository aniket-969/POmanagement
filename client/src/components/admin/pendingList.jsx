
import PendingTable from './pendingTable'
import PaginationControls from './paginationControls'
import { Box, CircularProgress } from '@mui/material'
import useAdmin from '../../hooks/useAdmin'
import { useState } from 'react'

import { useSearchParams } from "react-router-dom";
import { Typography } from '@mui/material';

const PendingList = () => {
  const [searchParams] = useSearchParams();

  const page = Number(searchParams.get("page") ?? 1);

  const { pendingCreatorsQuery } = useAdmin();

  const { data, isLoading, isError, isFetching } = pendingCreatorsQuery;

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

  const apiResp = data?.data ?? data; 
  const payload = apiResp?.data ?? apiResp; 
  const list = payload?.data ?? [];
  const currentPage = payload?.page ?? page;
  const totalPages = payload?.totalPages ?? 1;

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: 4,
        pt:2
      }}
    >
      <Typography variant="h6" color="text.primary" sx={{ fontWeight: 600 ,
        textAlign:"center"
      }}>
      Pending User Approvals
    </Typography>
      <PendingTable pendingData={list} isUpdating={isFetching} />
      <PaginationControls page={currentPage} totalPages={totalPages} />
    </Box>
  );
};

export default PendingList;
