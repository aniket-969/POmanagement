import React from 'react'
import { useAuth } from '../hooks/useAuth'
import { Button } from '@mui/material';

const Logout = () => {
    const {logoutMutation} = useAuth()
    const onClick = ()=>{
        logoutMutation.mutateAsync()
    }
  return (
    <Button onClick={onClick} variant="contained">Logout</Button>
  )
}

export default Logout