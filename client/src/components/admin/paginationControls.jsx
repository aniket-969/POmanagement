import React, { useCallback } from "react";
import { Box, Pagination } from "@mui/material";
import { useSearchParams } from "react-router-dom";

const PaginationControls = ({ page = 1, totalPages = 1 }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const handlePageChange = useCallback(
    (event, newPage) => {
      const params = new URLSearchParams(searchParams);

      params.set("page", String(newPage));
      setSearchParams(params); // 
    },
    [searchParams, setSearchParams]
  );

  if (!totalPages || totalPages <= 1) {
    return null; 
  }

  const safePage = Math.min(Math.max(1, Number(page || 1)), Number(totalPages || 1));

  return (
    <Box display="flex" justifyContent="center" mt={2}>
      <Pagination
        count={Number(totalPages)}
        page={safePage}
        onChange={handlePageChange}
        color="primary"
        siblingCount={1}
        boundaryCount={1}
        size="large"
        variant="outlined"
      />
    </Box>
  );
};

export default PaginationControls;
