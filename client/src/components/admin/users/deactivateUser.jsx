import { Button } from '@mui/material'
import React from 'react'
import useAdmin from '../../../hooks/useAdmin'

const DeactivateUser = ({id}) => {
    // console.log(id)
    const {updateStatusMutation} = useAdmin()
    const onClick = ()=>{
        updateStatusMutation.mutateAsync({id,status:'suspended'})
    }
  return (
    <Button onClick={onClick} color={'error'} variant='outlined'>Deactivate</Button>
  )
}

export default DeactivateUser