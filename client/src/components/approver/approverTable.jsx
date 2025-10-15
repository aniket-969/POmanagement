import React, { useState, useMemo } from "react";
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
  Box,
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import PoHistory from "./../poHIstory";
import Reject from "./reject";
import Approve from "./approve";
import { Link } from "react-router-dom";
import {useApproverPO} from "../../hooks/usePO"


const copyToClipboard = (text) => {
  try {
    navigator.clipboard.writeText(text);
  } catch (e) {
    console.warn("copy failed", e);
  }
};

const formatINR = (value) => {
  const amount = Number(value ?? 0);
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(amount);
};


const ApproverTable = ({ data = [] }) => {
  // Multi-select state
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState(() => new Set());

  // Bulk modal state
  const [bulkModalOpen, setBulkModalOpen] = useState(false);
  const [bulkAction, setBulkAction] = useState(null); // "approve" | "reject"
  const [comment, setComment] = useState("");
  const [commentError, setCommentError] = useState("");

  // Derived values
  const selectedArray = useMemo(() => Array.from(selectedIds), [selectedIds]);
  const allDisplayedIds = useMemo(() => (data || []).map((p) => p.id), [data]);
  const allSelected = allDisplayedIds.length > 0 && selectedIds.size === allDisplayedIds.length;

const {updateBulkStatusMutation} = useApproverPO()


  if (data.length == 0) {
    return (
      <Typography
        sx={{
          textAlign: "center",
        }}
      >
        No orders to show
      </Typography>
    );
  }

  const toggleSelectionMode = () => {
    if (selectionMode) {
      setSelectedIds(new Set()); 
    }
    setSelectionMode((s) => !s);
  };

  const handleRowToggle = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSelectAll = () => {
    if (allSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(allDisplayedIds));
    }
  };

  const openBulkModal = (action) => {
    if (selectedIds.size === 0) {
   
      return;
    }
    setBulkAction(action);
    setComment("");
    setCommentError("");
    setBulkModalOpen(true);
  };

  const closeBulkModal = () => {
    setBulkModalOpen(false);
    setBulkAction(null);
    setComment("");
    setCommentError("");
  };

  const handleConfirmBulk = async() => {
    if (!comment || !comment.trim()) {
      setCommentError("Comment is required");
      return;
    }

    const payload = {
      ids: selectedArray,
      status: bulkAction === "approve" ? "approved" : "rejected",
      comment: comment.trim(),
    };
   await updateBulkStatusMutation.mutateAsync(payload)

    closeBulkModal();
    setSelectionMode(false);
    setSelectedIds(new Set());
  };

  return (
    <>
      {/* Top controls */}
      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
        <Button
          variant={selectionMode ? "contained" : "outlined"}
          onClick={toggleSelectionMode}
          size="small"
          aria-pressed={selectionMode}
        >
          {selectionMode ? "Cancel multi-select" : "Multi-select"}
        </Button>

        {selectionMode && (
          <>
            <Button
              variant="contained"
              color="success"
              size="small"
              disabled={selectedIds.size === 0}
              onClick={() => openBulkModal("approve")}
            >
              Approve all
            </Button>

            <Button
              variant="contained"
              color="error"
              size="small"
              disabled={selectedIds.size === 0}
              onClick={() => openBulkModal("reject")}
            >
              Reject all
            </Button>

            <Typography variant="body2" color="text.secondary" sx={{ ml: "auto" }}>
              {selectedIds.size} selected
            </Typography>
          </>
        )}
      </Stack>

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
            boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.08)",
            borderRadius: "6px",
            "&:hover": {
              boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.12)",
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
        <Table aria-label="purchase orders table" size="small">
          <TableHead>
            <TableRow>
              {/* Conditional checkbox header */}
              {selectionMode && (
                <TableCell sx={{ width: 40 }}>
                  <Checkbox
                    checked={allSelected}
                    indeterminate={selectedIds.size > 0 && !allSelected}
                    onChange={handleSelectAll}
                    inputProps={{ "aria-label": "Select all purchase orders" }}
                    size="small"
                  />
                </TableCell>
              )}

              <TableCell sx={{ width: 130 }}>PO #</TableCell>
              <TableCell sx={{ width: "45%" }}>Purchase order</TableCell>
              {/* reduced width — pulls price left */}
              <TableCell sx={{ width: 120, textAlign: "left" }}>Price</TableCell>
              {/* Hide Actions col when in selection mode */}
              {!selectionMode && (
                <TableCell sx={{ width: 180, textAlign: "right" }}>
                  Actions
                </TableCell>
              )}
            </TableRow>
          </TableHead>

          <TableBody>
            {(data || []).map((po) => {
              const title = po.title ?? "Untitled";
              const desc = po.description ?? "";
              const status = po.status ?? "unknown";
              const totalAmount = po.totalAmount ?? po.total_amount ?? 0;
              const showActionButtons = status === "submitted";

              return (
                <TableRow key={po.id} hover>
                  {/* Row checkbox when selection mode */}
                  {selectionMode && (
                    <TableCell>
                      <Checkbox
                        checked={selectedIds.has(po.id)}
                        onChange={() => handleRowToggle(po.id)}
                        inputProps={{ "aria-label": `Select PO ${po.poNumber}` }}
                        size="small"
                      />
                    </TableCell>
                  )}

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
                      component={Link}
                      to={`/orders/po/${po.id}`}
                      sx={{
                        fontFamily: "monospace",
                        fontWeight: 700,
                        fontSize: "1.05rem",
                        whiteSpace: "normal",
                        wordBreak: "break-word",
                        lineHeight: 1.25,
                        pr: selectionMode ? "8px" : "32px",
                        color: "primary.main",
                        textDecoration: "none",
                        "&:hover": { textDecoration: "underline" },
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
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                      }}
                    >
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
                    <Typography
                      variant="subtitle2"
                      sx={{ fontWeight: 600, lineHeight: 1.4 }}
                      title={String(totalAmount)}
                    >
                      {formatINR(totalAmount)}
                    </Typography>
                  </TableCell>

                  {/* Actions */}
                  {!selectionMode && (
                    <TableCell
                      align="right"
                      sx={{
                        verticalAlign: "middle",
                        pr: 1.25, // pull slightly closer to center
                      }}
                    >
                      <Stack
                        direction="row"
                        spacing={0.75}
                        justifyContent="flex-end"
                        alignItems="center"
                      >
                        {showActionButtons ? (
                          <>
                            <Approve poId={po.id} />
                            <Reject poId={po.id} />
                          </>
                        ) : (
                          <Chip
                            label={
                              String(status).charAt(0).toUpperCase() +
                              String(status).slice(1)
                            }
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
                        <PoHistory
                          po={po}
                          history={po.poHistory ?? po.po_history ?? []}
                        />
                      </Stack>
                    </TableCell>
                  )}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Bulk comment modal */}
      <Dialog open={bulkModalOpen} onClose={closeBulkModal} maxWidth="sm" fullWidth>
        <DialogTitle>{bulkAction === "approve" ? "Approve POs" : "Reject POs"}</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 1 }}>
            {selectedIds.size} purchase order(s) will be{" "}
            {bulkAction === "approve" ? "approved" : "rejected"}.
          </Typography>

          <TextField
            label="Comment (required)"
            value={comment}
            onChange={(e) => {
              setComment(e.target.value);
              if (commentError) setCommentError("");
            }}
            fullWidth
            multiline
            minRows={3}
            error={!!commentError}
            helperText={commentError}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={closeBulkModal}>Cancel</Button>
          <Button
            variant="contained"
            color={bulkAction === "approve" ? "success" : "error"}
            onClick={handleConfirmBulk}
          >
            {bulkAction === "approve" ? "Confirm Approve" : "Confirm Reject"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ApproverTable;
