import { Button } from '@mui/material'
import React from 'react'
import useAdmin from '../../../hooks/useAdmin'

const ActivateUser = ({id}) => {
    // console.log(id)
    const {updateStatusMutation} = useAdmin()
    const onClick = ()=>{
        updateStatusMutation.mutateAsync({id,status:'active'})
    }
  return (
    <Button onClick={onClick}variant='contained'>Activate</Button>
  )
}

export default ActivateUser