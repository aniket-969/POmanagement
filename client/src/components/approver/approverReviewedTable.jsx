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
 <TableContainer
  component={Paper}
  sx={(theme) => ({
    maxHeight: 420,
    overflow: "auto",
    "& .MuiTable-root": {
      tableLayout: "fixed",
      width: "100%",
      borderCollapse: "separate",
      borderSpacing: "0 6px",
    },
    "& .MuiTableCell-root": {
      fontSize: "0.95rem",
      py: 1,
      px: 1.25,
      borderBottom: "none",
    },
    "& .MuiTableRow-root": {
      backgroundColor: theme.palette.background.paper,
      boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.06)",
      borderRadius: "6px",
      "&:hover": {
        boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.10)",
      },
    },
    "& .MuiTableCell-head": {
      fontWeight: 700,
      position: "sticky",
      top: 0,
      zIndex: 2,
      backgroundColor: theme.palette.background.paper,
      borderBottom: "1px solid rgba(0,0,0,0.12)",
    },
  })}
>
  <Table aria-label="approver review table" size="small">
    <TableHead>
      <TableRow>
        {/* first three columns get roughly equal space; actions get more */}
        <TableCell sx={{ width: "23%" }}>PO #</TableCell>
        <TableCell sx={{ width: "23%" }}>Purchase order</TableCell>
        <TableCell sx={{ width: "23%", textAlign: "left" }}>Price</TableCell>
        <TableCell
          sx={{
            width: "31%",
            textAlign: "right",
           
          }}
        >
          Status / Info
        </TableCell>
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
                display: "flex",
                alignItems: "center",
                gap: 0.75,
                whiteSpace: "nowrap",
                verticalAlign: "middle",
              }}
            >
              <Typography
                sx={{
                  fontFamily: "monospace",
                  fontWeight: 700,
                  fontSize: "0.95rem",
                  lineHeight: 1.4,
                }}
              >
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
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: 600,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    maxWidth: "100%",
                    lineHeight: 1.4,
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
                    fontSize: "0.85rem",
                    lineHeight: 1.4,
                  }}
                  title={desc || "No description"}
                >
                  {desc || "No description"}
                </Typography>
              </Box>
            </TableCell>

            {/* Price */}
            <TableCell
              sx={{
                verticalAlign: "middle",
                textAlign: "left",
                whiteSpace: "nowrap",
              }}
            >
              <Typography variant="subtitle2" sx={{ fontWeight: 600, lineHeight: 1.4 }} title={String(totalAmount)}>
                {formatINR(totalAmount)}
              </Typography>
            </TableCell>

            {/* Status / Info (actions get more room) */}
            <TableCell
              align="right"
              sx={{
                verticalAlign: "middle",
                pr: 1.25,
              }}
            >
              <Stack direction="row" spacing={0.75} justifyContent="flex-end" alignItems="center">
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

                {/* PoHistory small button/component - room for two buttons + icon */}
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
