import React, { useMemo } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  Chip,
} from "@mui/material";
import { History as HistoryIcon } from "@mui/icons-material";
import usePO, { useSinglePO } from "../../hooks/usePO"; // adjust path if needed

// helpers
const formatDate = (iso) => {
  if (!iso) return "-";
  try {
    return new Date(iso).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
  } catch {
    return iso;
  }
};

const formatCurrency = (amount) => {
  if (amount === null || amount === undefined || amount === "") return "-";
  const n = typeof amount === "string" ? Number(amount) : amount;
  if (Number.isNaN(n)) return amount;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(n);
};

const InfoRow = ({ label, value }) => (
  <Box sx={{ display: "flex", gap: 1, mb: 1, alignItems: "flex-start" }}>
    <Typography
      variant="subtitle2"
      sx={{ minWidth: 140, color: "text.secondary" }}
    >
      {label}
    </Typography>
    <Typography
      variant="body2"
      sx={{
        wordBreak: "break-word",
        overflowWrap: "anywhere",
        whiteSpace: "pre-wrap",
      }}
    >
      {value ?? "-"}
    </Typography>
  </Box>
);

const HistoryItem = ({ item }) => {
  const actor =
    item.user?.fullName ?? (item.userId ? `User #${item.userId}` : "System");
  return (
    <ListItem alignItems="flex-start" sx={{ py: 1 }}>
      <ListItemAvatar>
        <Avatar sx={{ bgcolor: "primary.main" }}>
          {(actor || "S").charAt(0)}
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={
          <Box
            sx={{
              display: "flex",
              gap: 1,
              alignItems: "center",
              flexWrap: "wrap",
              wordBreak: "break-word",
              overflowWrap: "anywhere",
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: 700 }}>
              {item.action ?? "action"}
            </Typography>
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              {formatDate(item.createdAt)}
            </Typography>
            {item.description && item.description.length < 80 ? (
              <Chip
                label={item.description}
                size="small"
                sx={{
                  ml: 1,
                  maxWidth: "100%",
                  whiteSpace: "normal",
                  wordBreak: "break-word",
                }}
              />
            ) : null}
          </Box>
        }
        secondary={
          <Box sx={{ mt: 0.5 }}>
            {item.description ? (
              <Typography
                variant="body2"
                sx={{
                  wordBreak: "break-word",
                  overflowWrap: "anywhere",
                  whiteSpace: "pre-wrap",
                }}
              >
                {item.description}
              </Typography>
            ) : null}
            <Typography
              variant="caption"
              sx={{
                display: "block",
                color: "text.secondary",
                mt: 0.5,
              }}
            >
              By: {actor} {item.user?.email ? `(${item.user.email})` : ""}
            </Typography>
          </Box>
        }
      />
    </ListItem>
  );
};

export default function PODetail() {
  const { id } = useParams();
  const { data, isLoading, error } = useSinglePO(id);

  const payload = data?.data?.data ?? data?.data ?? data ?? {};
  const po = payload.purchaseOrder ?? payload;

  const history = useMemo(() => {
    const arr = Array.isArray(po.poHistory) ? [...po.poHistory] : [];
    return arr.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [po.poHistory]);
  if (isLoading)
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <CircularProgress />
      </Box>
    );
  if (error)
    return (
      <Box sx={{ p: 4 }}>
        <Typography color="error">Error loading PO</Typography>
      </Box>
    );

  return (
    <Box
      sx={{
        p: { xs: 2, md: 4 },
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Grid container spacing={3}>
        {/* Left: PO details */}
        <Grid item xs={12} md={8}>
          <Card variant="outlined">
            <CardContent>
              <Typography
                variant="h5"
                sx={{
                  mb: 1,
                  fontWeight: 700,
                  wordBreak: "break-word",
                  overflowWrap: "anywhere",
                }}
              >
                {po.poNumber || "Purchase Order"}
              </Typography>

              <Divider sx={{ mb: 2 }} />

              <InfoRow label="Title" value={po.title || "-"} />
              <InfoRow label="Description" value={po.description || "-"} />
              <InfoRow
                label="Total amount"
                value={formatCurrency(po.totalAmount)}
              />
              <InfoRow label="Status" value={po.status ?? "-"} />
              <InfoRow
                label="Submitted at"
                value={formatDate(po.submittedAt)}
              />
              <InfoRow label="Reviewed at" value={formatDate(po.reviewedAt)} />

              <Divider sx={{ my: 2 }} />

              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Created by
              </Typography>
              <Box
                sx={{ display: "flex", gap: 2, alignItems: "center", mb: 2 }}
              >
                <Avatar>{(po.createdBy?.fullName || "U").charAt(0)}</Avatar>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>
                    {po.createdBy?.fullName ?? `User #${po.createdById}`}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {po.createdBy?.email ?? "-"}
                  </Typography>
                </Box>
              </Box>

              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Reviewed by
              </Typography>
              {po.reviewedBy ? (
                <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                  <Avatar>{(po.reviewedBy?.fullName || "R").charAt(0)}</Avatar>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                      {po.reviewedBy?.fullName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {po.reviewedBy?.email ?? "-"}
                    </Typography>
                  </Box>
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Not reviewed yet
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Right: History */}
        <Grid item xs={12} md={4}>
          <Card variant="outlined">
            <CardContent>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
              >
                <HistoryIcon fontSize="small" />
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  History
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ color: "text.secondary", ml: "auto" }}
                >
                  {history.length} events
                </Typography>
              </Box>
              <Divider sx={{ mb: 1 }} />

              {history.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  No history available
                </Typography>
              ) : (
                <List dense>
                  {history.map((h) => (
                    <React.Fragment key={h.id}>
                      <HistoryItem item={h} />
                      <Divider component="li" />
                    </React.Fragment>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
