import { Box } from '@mui/material'
import React from 'react'
import SearchInput from '../ui/search'
import CreateApprover from './createApprover'
import {useSearchParams,Link} from "react-router-dom"
import Logout from '../logout'
import { Button } from '@mui/material';


const Topbar = () => {
  const [searchParams,setSearchParams] = useSearchParams()

const onSearch = (q)=>{
  const params = new URLSearchParams(searchParams)
  if(q && q.trim()!= "")params.set("q",q.trim())
    else params.delete("q")
  params.set("page","1")
  setSearchParams(params)
}

  return (
    <Box
  sx={{
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    gap: 2,
    width: "100%",
    flexDirection: {
      xs: "column", 
      sm: "row",  
    },
  }}
>
      <SearchInput onSearch = {onSearch}/>
      <Box sx={{
        display:"flex",
        gap:3
      }}>
        <Link to={"/orders/admin/users"}>
        <Button variant='outlined'>
         Manage Users
        </Button>
        </Link>
        <CreateApprover/>
      <Logout/>
      </Box>
      
    </Box>
  )
}

export default Topbar