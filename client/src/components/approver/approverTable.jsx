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
  if(data.length == 0){
    return <Typography sx={{
      textAlign:"center"
    }}>No orders to show</Typography>
  }

  return (
    <TableContainer component={Paper} sx={{ overflow: "auto" }}>
      <Table aria-label="purchase orders table" size="medium">
        <TableHead>
          <TableRow>
            <TableCell sx={{ width: 160, fontWeight: 700 }}>PO #</TableCell>
            <TableCell sx={{ width: "55%", fontWeight: 700 }}>Purchase order</TableCell>

            {/* Price now left-aligned near PO#/Purchase order */}
            <TableCell sx={{ width: 160, fontWeight: 700, textAlign: "left" }}>Price</TableCell>

            {/* Actions stay at right */}
            <TableCell sx={{ width: 240, fontWeight: 700, textAlign: "right" }}>Actions</TableCell>
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

                {/* Price (left aligned, near PO# and Purchase order) */}
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

                {/* Actions (right) */}
                <TableCell
                  align="right"
                  sx={{
                    verticalAlign: "middle",
                    py: 2,
                  }}
                >
                  <Stack direction="row" spacing={1} justifyContent="flex-end" alignItems="center">
                    {showActionButtons ? (
                      <>
                        <Approve poId={po.id} />
                        <Reject poId={po.id} />
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
