import React from 'react'
import { Box } from '@mui/material';
import Topbar from '../../components/approver/topbar';
import ApproverList from '../../components/approver/approverList';
import SearchInput from '../../components/ui/search';
import { useSearchParams } from 'react-router-dom';
import ApproverReviewedList from '../../components/approver/approverReviewedList';

const Approver = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const onSearch = (q) => {
    const params = new URLSearchParams(searchParams);
    if (q && q.trim() != "") params.set("q", q.trim());
    else params.delete("q");
    params.set("page", "1");
    setSearchParams(params);
  };
  return (
    <Box sx={{
      width:"100%",
      display:'flex',
      flexDirection:'column',
      gap:2,
      justifyItems:'center',
      pt:1,
    }}>
      <Topbar/>
      <SearchInput onSearch={onSearch}/>
      <ApproverList/>
      <ApproverReviewedList/>
    </Box>
  )
}

export default Approver