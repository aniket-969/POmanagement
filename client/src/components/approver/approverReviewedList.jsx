import React from "react";
import ApproverReviewedTable from "./approverReviewedTable";
import { Box, CircularProgress, Typography } from "@mui/material";
import { useApproverPO } from "../../hooks/usePO";
import PaginationControls from "../admin/paginationControls";

const ApproverReviewedList = () => {
  const { approverReviewListQuery } = useApproverPO();

  const { data, isLoading, isError } = approverReviewListQuery;
  if (isLoading) {
    return <CircularProgress />;
  }
  if (isError) {
    return <p>Something went wrong, refresh</p>;
  }
  console.log(data);
  const payloadData = data?.data?.data?.orders || [];
  const totalPages = data?.data?.data?.meta?.totalPages || 0;
  const currentPage = data?.data?.data?.meta?.page || 1;
//   console.log(payloadData);
  return (
    <Box>
        <Typography
        variant="h6"
        sx={{
          fontWeight: 700,
          mb: 2,
          textAlign:"center"
        }}
      >
        Your PO
      </Typography>
      <ApproverReviewedTable data={payloadData} />
      <PaginationControls  page={currentPage} totalPages={totalPages} />
    </Box>
  );
};

export default ApproverReviewedList;
