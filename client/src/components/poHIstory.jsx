import React from 'react'
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
import InfoIcon  from '@mui/icons-material/Info';

const PoHistory = ({ po, history = [] }) => {const [open, setOpen] = React.useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <Tooltip title="View history">
        <IconButton
          size="small"
          onClick={handleOpen}
          aria-label={`View history for PO ${po?.poNumber ?? ""}`}
        >
          <InfoIcon fontSize="small" />
        </IconButton>
      </Tooltip>

      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="md"
        aria-labelledby="po-history-title"
      >
        <DialogTitle id="po-history-title">
          {po ? `History — ${po.poNumber}` : "History"}
        </DialogTitle>

        <DialogContent dividers>
          {Array.isArray(history) && history.length > 0 ? (
            <Stack spacing={2}>
              {history.map((h) => {
                const userLabel =
                  (h.user && (h.user.fullName || h.user.email || h.user.id)) ||
                  h.userName ||
                  h.userId ||
                  "Unknown";
                const ts = h.createdAt || h.timestamp || h.created_at;
                return (
                  <Paper
                    key={h.id ?? `${h.action}-${ts ?? Math.random()}`}
                    sx={{ p: 2 }}
                    elevation={0}
                  >
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="flex-start"
                    >
                      <Box>
                        <Typography variant="subtitle2">
                          {userLabel} — {String(h.action ?? "action")}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {ts ? new Date(ts).toLocaleString() : "Unknown time"}
                        </Typography>
                      </Box>

                      {h.comment || h.description ? (
                        <Box sx={{ ml: 2, maxWidth: "60%" }}>
                          <Typography variant="body2">
                            {h.comment ?? h.description}
                          </Typography>
                        </Box>
                      ) : null}
                    </Stack>
                  </Paper>
                );
              })}
            </Stack>
          ) : (
            <Typography color="text.secondary">No history available.</Typography>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default PoHistory