import React from "react";
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
  IconButton,
  Tooltip,
  Chip,
  Stack,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import PoHistory from "../poHIstory";

const formatINR = (value) => {
  const num = Number(value ?? 0);
  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(num);
  } catch {
    return `₹${num}`;
  }
};

const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(String(text));
  } catch (err) {
    console.error("Copy failed", err);
  }
};

const humanStatus = (s) => {
  if (!s) return "Unknown";
  return String(s).charAt(0).toUpperCase() + String(s).slice(1);
};

const ApproverReviewedTable = ({ data = [] }) => {
  return (
    <TableContainer component={Paper} sx={{ overflow: "auto" }}>
      <Table aria-label="approver review table" size="medium">
        <TableHead>
          <TableRow>
            <TableCell sx={{ width: 160, fontWeight: 700 }}>PO #</TableCell>
            <TableCell sx={{ width: "55%", fontWeight: 700 }}>Purchase order</TableCell>

            {/* Price near PO / Purchase order */}
            <TableCell sx={{ width: 160, fontWeight: 700, textAlign: "left" }}>Price</TableCell>

            {/* Status / Info at right */}
            <TableCell sx={{ width: 240, fontWeight: 700, textAlign: "right" }}>Status / Info</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {(data || []).map((po) => {
            const title = po.title ?? "Untitled";
            const desc = po.description ?? "";
            const status = (po.status ?? "unknown").toLowerCase();
            const totalAmount = po.totalAmount ?? po.total_amount ?? 0;
            const poHistory = po.poHistory ?? po.po_history ?? [];

            return (
              <TableRow key={po.id} hover>
                {/* PO # */}
                <TableCell
                  component="th"
                  scope="row"
                  sx={{
                    verticalAlign: "middle",
                    py: 2,
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <Typography sx={{ fontFamily: "monospace", fontWeight: 700 }}>
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
                </TableCell>

                {/* Purchase order (title + desc) */}
                <TableCell
                  sx={{
                    verticalAlign: "middle",
                    py: 2,
                    maxWidth: 520,
                  }}
                >
                  <Box>
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: 600,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        maxWidth: "100%",
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
                        maxWidth: "100%",
                        mt: 0.5,
                      }}
                      title={desc || "No description"}
                    >
                      {desc || "No description"}
                    </Typography>
                  </Box>
                </TableCell>

                {/* Price (left aligned) */}
                <TableCell
                  sx={{
                    verticalAlign: "middle",
                    py: 2,
                    textAlign: "left",
                  }}
                >
                  <Typography variant="subtitle2" title={String(totalAmount)}>
                    {formatINR(totalAmount)}
                  </Typography>
                </TableCell>

                {/* Status / Info (right) */}
                <TableCell
                  align="right"
                  sx={{
                    verticalAlign: "middle",
                    py: 2,
                  }}
                >
                  <Stack direction="row" spacing={1} justifyContent="flex-end" alignItems="center">
                    <Chip
                      label={humanStatus(status)}
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

                    {/* PoHistory small button/component */}
                    <PoHistory po={po} history={poHistory} />
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

export default ApproverReviewedTable;
