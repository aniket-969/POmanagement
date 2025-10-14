import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Chip,
  Stack,
  Button
} from "@mui/material";

const UserTable = ({users}) => {


    if (!users.length) {
    return (
      <Typography sx={{ textAlign: "center", py: 4 }}>
        No users to show
      </Typography>
    );
  }
   return (
    <TableContainer component={Paper} sx={{ overflow: "auto" }}>
      <Table aria-label="users table" size="medium">
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 700 }}>User</TableCell>
            <TableCell sx={{ width: 160, fontWeight: 700 }}>Role</TableCell>
            <TableCell sx={{ width: 160, fontWeight: 700 }}>Status</TableCell>
            <TableCell sx={{ width: 200, fontWeight: 700, textAlign: "right" }}>
              Action
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {users.map((user) => {
            const isActive = String(user.status).toLowerCase() === "active";

            return (
              <TableRow key={user.id} hover>
                {/* Full Name + Email */}
                <TableCell sx={{ verticalAlign: "middle", py: 2 }}>
                  <Stack direction="column" spacing={0.5}>
                    <Typography
                      variant="body1"
                      sx={{ fontWeight: 600 }}
                    >
                      {user.fullName || "Unnamed"}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      {user.email}
                    </Typography>
                  </Stack>
                </TableCell>

                {/* Role */}
                <TableCell sx={{ verticalAlign: "middle", py: 2 }}>
                  <Typography variant="body2">
                    {String(user.role).charAt(0).toUpperCase() +
                      String(user.role).slice(1)}
                  </Typography>
                </TableCell>

                {/* Status */}
                <TableCell sx={{ verticalAlign: "middle", py: 2 }}>
                  <Chip
                    label={
                      String(user.status).charAt(0).toUpperCase() +
                      String(user.status).slice(1)
                    }
                    size="small"
                    color={
                      isActive
                        ? "success"
                        : user.status === "suspended"
                        ? "warning"
                        : "default"
                    }
                    variant="filled"
                  />
                </TableCell>

                {/* Action button */}
                <TableCell align="right" sx={{ verticalAlign: "middle", py: 2 }}>
                  <Button
                    size="small"
                    variant={isActive ? "outlined" : "contained"}
                    color={isActive ? "error" : "primary"}
                    onClick={() =>
                      console.log(
                        `${isActive ? "Deactivating" : "Activating"} user`,
                        user.id
                      )
                    }
                  >
                    {isActive ? "Deactivate" : "Activate"}
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default UserTable