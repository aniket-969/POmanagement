import { Box } from "@mui/material"
import Topbar from "../../components/admin/topbar"
import PendingList from "../../components/admin/pendingList"

const Admin = () => {
  return (
    <Box sx={{
        p:2,
        display:"flex", 
        flexDirection:"column",
        gap:4,
    }}>
        <Topbar/>
        <PendingList/>
    </Box>
  )
}

export default Admin