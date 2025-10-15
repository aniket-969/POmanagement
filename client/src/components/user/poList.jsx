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
  Button,
  Chip,
  CircularProgress,
  Stack,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import PoHistory from "../poHIstory";
import usePO from "../../hooks/usePO";

const formatINR = (value) => {
  const amount = Number(value ?? 0);
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(amount);
};

export default function POListTable({
  data = [],
  canSubmit = (po) => po?.status === "draft",
}) {
  console.log(data)
  const { submitMutation } = usePO();
  const [submittingIds, setSubmittingIds] = React.useState(new Set());
  const [localStatus, setLocalStatus] = React.useState({});

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(String(text));
    } catch (err) {
      console.error("copy failed", err);
    }
  };
console.log(data)
  const submitForReview = async (poId) => {
    await submitMutation.mutateAsync(poId);
  };

  if (!Array.isArray(data) || data.length === 0) {
    return (
      <Paper sx={{ p: 4, textAlign: "center" }}>
        <Typography variant="body1">No purchase orders to show.</Typography>
        <Typography variant="body2" color="text.secondary">
          Create a PO to get started.
        </Typography>
      </Paper>
    );
  }

  return (

<TableContainer
  component={Paper}
  sx={{
    overflowX: "auto",
    // overall typography/padding
    "& .MuiTableCell-root": {
      paddingY: "10px",
      paddingX: "12px",
      verticalAlign: "middle",
    },
    "& .MuiTableHead-root .MuiTableCell-root": {
      fontSize: "1rem",
      fontWeight: 700,
      backgroundColor: "#fafafa",
    },
    "& .MuiTableBody-root .MuiTableCell-root": {
      fontSize: "0.95rem",
    },
  }}
>
  {/* tableLayout: 'fixed' prevents columns from growing to content width */}
  <Table
    aria-label="purchase orders table"
    size="medium"
    sx={{ tableLayout: "fixed", width: "100%" }}
  >
    <TableHead>
      <TableRow>
        <TableCell sx={{ width: "20%" }}>PO #</TableCell>
        <TableCell sx={{ width: "20%" }}>Purchase order</TableCell>
        <TableCell sx={{ width: "20%", textAlign: "left" }}>Price</TableCell>
        <TableCell sx={{ width: "20%", textAlign: "left" }}>Status</TableCell>
        <TableCell sx={{ width: "20%" }} align="right">
          Actions/Info
        </TableCell>
      </TableRow>
    </TableHead>

    <TableBody>
      {data.map((po) => {
        const isSubmitting = submittingIds.has(po.id);
        const title = po.title ?? "Untitled";
        const desc = po.description ?? "";
        const amount = po.totalAmount ?? po.total_amount ?? null;
        const status = localStatus[po.id] ?? po.status ?? "unknown";
        const displayStatus =
          status === "submitted" ? "pending approval" : status;

        return (
          <TableRow key={po.id} hover>
            {/* PO # — now uses 20% of table and reserves space for icon */}
            <TableCell
              sx={{
                position: "relative",
                overflow: "hidden",
                // reserve space on the right for icon
                pr: "36px",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <Typography
                  sx={{
                    fontFamily: "monospace",
                    fontWeight: 600,
                    fontSize: "0.95rem",
                    // allow PO to break if it's very long but prefer to keep it on one line
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    lineHeight: 1.2,
                  }}
                  title={po.poNumber}
                >
                  {po.poNumber}
                </Typography>
              </Box>

              <Tooltip title="Copy PO number">
                <IconButton
                  size="small"
                  onClick={() => copyToClipboard(po.poNumber)}
                  sx={{
                    position: "absolute",
                    right: 6,
                    top: "50%",
                    transform: "translateY(-50%)",
                    flexShrink: 0,
                  }}
                  aria-label={`Copy PO number ${po.poNumber}`}
                >
                  <ContentCopyIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </TableCell>

            {/* Purchase Order — equal width; allow title/desc to wrap to two lines */}
            <TableCell
              sx={{
                overflow: "hidden",
                // allow content to wrap instead of truncating immediately
                whiteSpace: "normal",
                wordBreak: "break-word",
              }}
            >
              <Box>
                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: 600,
                    fontSize: "0.98rem",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    lineHeight: 1.15,
                  }}
                  title={title}
                >
                  {title}
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    fontSize: "0.85rem",
                    mt: 0.5,
                    display: "-webkit-box",
                    WebkitLineClamp: 1,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
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
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {amount !== null ? formatINR(amount) : "—"}
              </Typography>
            </TableCell>

            {/* Status */}
            <TableCell
              sx={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              <Chip
                label={
                  String(displayStatus).charAt(0).toUpperCase() +
                  String(displayStatus).slice(1)
                }
                size="small"
                color={
                  status === "draft"
                    ? "default"
                    : status === "submitted"
                    ? "info"
                    : status === "approved"
                    ? "success"
                    : status === "rejected"
                    ? "error"
                    : "default"
                }
                sx={{
                  fontSize: "0.8rem",
                  height: 24,
                  fontWeight: 500,
                }}
                aria-label={`Status: ${status}`}
              />
            </TableCell>

            {/* Actions */}
            <TableCell align="right">
              <Stack direction="row" spacing={1} justifyContent="flex-end">
                {canSubmit(po) && status === "draft" ? (
                  <Button
                    variant="contained"
                    size="small"
                    sx={{
                      fontSize: "0.8rem",
                      padding: "5px 12px",
                      textTransform: "none",
                    }}
                    onClick={() => submitForReview(po?.id)}
                    disabled={isSubmitting}
                    startIcon={
                      isSubmitting ? (
                        <CircularProgress size={15} color="inherit" />
                      ) : null
                    }
                    aria-label={`Submit PO ${po.poNumber} for review`}
                  >
                    {isSubmitting ? "Submitting..." : "Submit"}
                  </Button>
                ) : (
                  <Chip
                    label={status === "submitted" ? "Submitted" : String(status)}
                    size="small"
                    variant="outlined"
                    sx={{ fontSize: "0.8rem", height: 24 }}
                    aria-hidden={false}
                  />
                )}

                <PoHistory
                  po={po}
                  history={po.poHistory ?? po.po_history ?? []}
                />
              </Stack>
            </TableCell>
          </TableRow>
        );
      })}
    </TableBody>
  </Table>
</TableContainer>


  );
}
