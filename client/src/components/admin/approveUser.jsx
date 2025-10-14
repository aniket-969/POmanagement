
import { Button } from '@mui/material'
import useAdmin from '../../hooks/useAdmin'

const ApproveUser = ({id}) => {
 const {approveMutation} = useAdmin()
    const onClick = ()=>{
        //   console.log(id) 
          approveMutation.mutateAsync({id})
    }

  return (
    <Button onClick={onClick} color='success' variant='outlined'>Approve</Button>
  )
}

export default ApproveUser