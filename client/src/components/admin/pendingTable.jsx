import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import ApproveUser from "./approveUser";
import RejectUser from "./rejectUser";


const PendingTable = ({ pendingData }) => {
  console.log(pendingData);

  if (pendingData.length === 0)
    return <p>No users to show</p>;

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 700 }}>Name</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>Email</TableCell>
            <TableCell sx={{ fontWeight: 700 }}align="right">Actions</TableCell>
            <TableCell align="righ"></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {pendingData.map((row) => (
            <TableRow
              key={row.id}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.fullName}
              </TableCell>
              <TableCell>{row.email}</TableCell>
              <TableCell align="right">
                <ApproveUser id={row.id}/>
              </TableCell>

              <TableCell align="righ">
                <RejectUser id={row.id}/>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default PendingTable;
