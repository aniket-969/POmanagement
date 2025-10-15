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
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import PoHistory from "./../poHIstory";
import Reject from "./reject";
import Approve from "./approve";
import { Link } from "react-router-dom";

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
            <TableCell sx={{ width: 130 }}>PO #</TableCell>
            <TableCell sx={{ width: "45%" }}>Purchase order</TableCell>
            {/* reduced width — pulls price left */}
            <TableCell sx={{ width: 120, textAlign: "left" }}>Price</TableCell>
            {/* slightly narrower Actions col */}
            <TableCell sx={{ width: 180, textAlign: "right" }}>
              Actions
            </TableCell>
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
                      pr: "32px",
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
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ApproverTable;
