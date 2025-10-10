import { Button } from '@mui/material'

const RejectUser = ({id}) => {
   const onClick = ()=>{
          console.log(id) 
    }
  return (
    <Button onClick={onClick}variant='outlined'>Reject</Button>
  )
}

export default RejectUser