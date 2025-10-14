import { Box } from '@mui/material'
import React from 'react'
import ApproverReviewedList from '../../../components/approver/approverReviewedList'
import SearchInput from '../../../components/ui/search';
import Filter from '../../../components/ui/filter';
import { useSearchParams } from 'react-router-dom';

const ApproverReviewed = () => {
     const [searchParams, setSearchParams] = useSearchParams();

  const onSearch = (q) => {
    const params = new URLSearchParams(searchParams);
    if (q && q.trim() != "") params.set("q", q.trim());
    else params.delete("q");
    params.set("page", "1");
    setSearchParams(params);
  };


  const handleStatusSelect = (value) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "") params.set("status", value);
    else params.delete("status");
    params.set("page", "1");
    setSearchParams(params, { replace: true });
  };

  return (
    <Box>
        <SearchInput onSearch={onSearch}/>
         <Filter
                  paramName="status"
                  label="Status"
                  options={[
                    { label: "Approved", value: "approved" },
                    { label: "Rejected", value: "rejected" },
                  ]}
                  onSelect={handleStatusSelect}
                />
        <ApproverReviewedList/>

    </Box>
  )
}

export default ApproverReviewed