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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Stack,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import PoHistory from "../poHistory";

const formatCurrency = (value) => {
  if (value == null || value === "") return "—";
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 2,
    }).format(Number(value));
  } catch {
    return String(value);
  }
};

export default function POListTable({
  data = [],
  canSubmit = (po) => po?.status === "draft",
}) {
 
  const [submittingIds, setSubmittingIds] = React.useState(new Set());
  
  const [localStatus, setLocalStatus] = React.useState({});

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(String(text));
    } catch (err) {
      console.error("copy failed", err);
    }
  };

  const submitForReview = async (po) => {
    if (!po || !po.id) return;
    setSubmittingIds((s) => new Set(s).add(po.id));

    if (typeof onSubmitForReview === "function") {
      // call parent handler if provided (parent handles API + refetch)
      try {
        await onSubmitForReview(po.id);
      } catch (err) {
        console.error("submit failed", err);
      } finally {
        setSubmittingIds((s) => {
          const next = new Set(s);
          next.delete(po.id);
          return next;
        });
      }
      return;
    }

   
   
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
    <TableContainer component={Paper}>
      <Table aria-label="purchase orders table" size="medium">
        <TableHead>
          <TableRow>
            <TableCell sx={{ width: 140 }}>PO #</TableCell>
            <TableCell>Purchase order</TableCell>
            <TableCell sx={{ width: 120 }}>Status</TableCell>
            <TableCell align="right" sx={{ width: 200 }}>
              Actions
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {data.map((po) => {
            const isSubmitting = submittingIds.has(po.id);
            const title = po.title ?? "Untitled";
            const desc = po.description ?? "";
            const amount = po.totalAmount ?? po.total_amount ?? null;
            const status = localStatus[po.id] ?? (po.status ?? "unknown");

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

                  <Typography
                    variant="subtitle2"
                    sx={{ float: "right", fontWeight: 700, mt: 0.5 }}
                    title={formatCurrency(amount)}
                  >
                    {formatCurrency(amount)}
                  </Typography>
                </TableCell>

                <TableCell>
                  <Chip
                    label={String(status).charAt(0).toUpperCase() + String(status).slice(1)}
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
                    aria-label={`Status: ${status}`}
                  />
                </TableCell>

                <TableCell align="right">
                  <Stack direction="row" spacing={1} justifyContent="flex-end" alignItems="center">
                    {canSubmit(po) && (status === "draft") ? (
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => submitForReview(po)}
                        disabled={isSubmitting}
                        aria-label={`Submit PO ${po.poNumber} for review`}
                        startIcon={isSubmitting ? <CircularProgress size={16} color="inherit" /> : null}
                      >
                        {isSubmitting ? "Submitting..." : "Submit for review"}
                      </Button>
                    ) : (
                      <Chip
                        label={status === "submitted" ? "Submitted" : String(status)}
                        size="small"
                        variant="outlined"
                        aria-hidden={false}
                      />
                    )}

                    {/* PoHistory component displays icon + modal; pass po and po.poHistory */}
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
}