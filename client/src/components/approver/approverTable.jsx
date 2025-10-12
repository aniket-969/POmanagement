import React from "react";
import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Stack,
  Typography,
  Tooltip,
  IconButton,
  Chip,
  Button,
  Box,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import PoHistory from './../poHIstory';
import Reject from "./reject";
import Approve from "./approve";

const copyToClipboard = (text) => {
  try {
    navigator.clipboard.writeText(text);
  } catch (e) {
    console.warn("copy failed", e);
  }
};

const ApproverTable = ({ data = [] }) => {
  const [submittingIds, setSubmittingIds] = React.useState(new Set());
  const [localStatus, setLocalStatus] = React.useState({});

  console.log(data);

  const handleApprove = (poId) => {
    console.log(poId)
  };

  const handleReject = (poId) => {
   console.log(poId)
  };


  return (
    <TableContainer component={Paper}>
      <Table aria-label="purchase orders table" size="medium">
        <TableHead>
          <TableRow>
            <TableCell sx={{ width: 140 }}>PO #</TableCell>
            <TableCell>Purchase order</TableCell>
           
            <TableCell align="right" sx={{ width: 240 }}>
              Actions
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {(data || []).map((po) => {
            const isSubmitting = submittingIds.has(po.id);
            const title = po.title ?? "Untitled";
            const desc = po.description ?? "";
            const status = po.status

            const showActionButtons = status === "submitted";
            const showStatusChip = !showActionButtons; 

            return (
              <TableRow key={po.id} hover>
                <TableCell>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography sx={{ fontFamily: "monospace", fontWeight: 600 }}>
                      {po.poNumber}
                    </Typography>

                    <Tooltip title="Copy PO number">
                      <IconButton
                        size="small"
                        onClick={() => copyToClipboard(po.poNumber)}
                        aria-label={`Copy PO number ${po.poNumber}`}
                      >
                        <ContentCopyIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </TableCell>

                <TableCell>
                  <Box>
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: 600,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        maxWidth: 520,
                      }}
                      title={title}
                    >
                      {title}
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        maxWidth: 520,
                      }}
                      title={desc || "No description"}
                    >
                      {desc || "No description"}
                    </Typography>
                  </Box>
                </TableCell>

                <TableCell align="right">
                  <Stack direction="row" spacing={1} justifyContent="flex-end" alignItems="center">
                    {showActionButtons ? (
                     
                      <>
                    <Approve poId = {po.id}/>
                    <Reject poId = {po.id}/>
                      </>
                    ) : (
                     
                      <Chip
                        label={String(status).charAt(0).toUpperCase() + String(status).slice(1)}
                        size="small"
                        variant={status === "submitted" ? "outlined" : "filled"}
                        color={
                          status === "approved"
                            ? "success"
                            : status === "rejected"
                            ? "error"
                            : status === "submitted"
                            ? "info"
                            : "default"
                        }
                        aria-label={`Status: ${status}`}
                      />
                    )}

                    <PoHistory po={po} history={po.poHistory ?? po.po_history ?? []} />
                  </Stack>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ApproverTable;
