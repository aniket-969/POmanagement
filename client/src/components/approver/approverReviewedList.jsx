import React from "react";
import ApproverReviewedTable from "./approverReviewedTable";
import { Box, CircularProgress } from "@mui/material";
import { useApproverPO } from "../../hooks/usePO";

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
  const totalPagesValue = data?.data?.data?.meta?.totalPages || 0;
  const currentPageValue = data?.data?.data?.meta?.page || 1;
//   console.log(payloadData);
  return (
    <Box>
      <ApproverReviewedTable data={payloadData} />
    </Box>
  );
};

export default ApproverReviewedList;
