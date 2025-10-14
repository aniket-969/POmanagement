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
    <TableContainer component={Paper} sx={{ overflow: "auto" }}>
      <Table aria-label="purchase orders table" size="medium">
        <TableHead>
          <TableRow>
            <TableCell sx={{ width: 140, fontWeight: 700 }}>PO #</TableCell>
            <TableCell sx={{ width: "50%", fontWeight: 700 }}>
              Purchase order
            </TableCell>
            {/* NEW PRICE COLUMN */}
            <TableCell sx={{ width: 160, fontWeight: 700 }}>Price</TableCell>
            <TableCell sx={{ width: 120, fontWeight: 700 }}>Status</TableCell>
            <TableCell align="right" sx={{ width: 200, fontWeight: 700 }}>
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
                {/* PO # */}
                <TableCell>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography
                      sx={{ fontFamily: "monospace", fontWeight: 600 }}
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
                  </Stack>
                </TableCell>

                {/* Purchase Order */}
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

                {/* PRICE COLUMN */}
                <TableCell>
                  <Typography variant="subtitle2">
                    {amount !== null ? formatINR(amount) : "—"}
                  </Typography>
                </TableCell>

                {/* STATUS */}
                <TableCell>
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
                    aria-label={`Status: ${status}`}
                  />
                </TableCell>

                {/* ACTIONS */}
                <TableCell align="right">
                  <Stack
                    direction="row"
                    spacing={1}
                    justifyContent="flex-end"
                    alignItems="center"
                  >
                    {canSubmit(po) && status === "draft" ? (
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => submitForReview(po?.id)}
                        disabled={isSubmitting}
                        aria-label={`Submit PO ${po.poNumber} for review`}
                        startIcon={
                          isSubmitting ? (
                            <CircularProgress size={16} color="inherit" />
                          ) : null
                        }
                      >
                        {isSubmitting ? "Submitting..." : "Submit for review"}
                      </Button>
                    ) : (
                      <Chip
                        label={
                          status === "submitted" ? "Submitted" : String(status)
                        }
                        size="small"
                        variant="outlined"
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
