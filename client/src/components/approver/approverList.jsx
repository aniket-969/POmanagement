import React from "react";
import { useApproverPO } from "../../hooks/usePO";
import { Box, Typography } from "@mui/material";
import { CircularProgress } from "@mui/material";
import PaginationControls from "../admin/paginationControls";
import ApproverTable from "./approverTable";

const ApproverList = () => {

  const { approverListQuery } = useApproverPO();
  const { data, isLoading, isError } = approverListQuery;
//   console.log(approverListQuery);

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
//   console.log(data);
  const apiResp = data?.data?.data;
  const payload = apiResp?.data;
  const currentPage = apiResp?.page;
  const totalPages = apiResp?.totalPages ?? 1;
  return (
    <div>
     <Typography
        variant="h6"
        sx={{
          fontWeight: 700,
          mb: 2,
          textAlign:"center"
        }}
      >
        Pending PO
      </Typography>
      <ApproverTable data={payload} />
      <PaginationControls page={currentPage} totalPages={totalPages} />
    </div>
  );
};

export default ApproverList;
