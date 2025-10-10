import { Box } from "@mui/material"
import Topbar from "../../components/admin/topbar"
import PendingList from "../../components/admin/pendingList"

const Admin = () => {
  return (
    <Box>
        <Topbar/>
        <PendingList/>
    </Box>
  )
}

export default Admin