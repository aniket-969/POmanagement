import { Box, CircularProgress } from '@mui/material'
import React from 'react'
import UserTable from './userTable'
import { useSearchParams } from 'react-router-dom';
import useAdmin from '../../../hooks/useAdmin';
import PaginationControls from '../paginationControls';
import { Typography } from '@mui/material';

const UserList = () => {
  const [searchParams] = useSearchParams();

  const page = Number(searchParams.get("page") ?? 1);

  const { adminUsersQuery} = useAdmin();

  const { data, isLoading, isError, isFetching } = adminUsersQuery;

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
// console.log(data)
  const payloadData = data?.data?.data?.users || [];
  const totalPages = data?.data?.data?.meta?.totalPages || 0;
  const currentPage = data?.data?.data?.meta?.page || 1;
// console.log(payloadData,totalPages,currentPage)
  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: 4
      }}
    >
      
      <UserTable users={payloadData} isUpdating={isFetching} />
      <PaginationControls page={currentPage} totalPages={totalPages} />
    </Box>
  );
}

export default UserList