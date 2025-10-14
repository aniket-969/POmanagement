import { Button } from '@mui/material'
import useAdmin from '../../hooks/useAdmin'

const RejectUser = ({id}) => {
    const {rejectMutation} = useAdmin()
   const onClick = ()=>{
          console.log(id) 
      rejectMutation.mutateAsync({id})
    }
  return (
    <Button onClick={onClick} color='error' variant='outlined'>Reject</Button>
  )
}

export default RejectUser