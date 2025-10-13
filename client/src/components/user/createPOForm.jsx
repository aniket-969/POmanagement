import React from "react";
import { Box, Paper, Stack, TextField, Button } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createPurchaseOrderSchema } from "../../schema/purchaseOrder.js"; 
import { usePO } from './../../hooks/usePO';

const defaultValues = {
  title: "",
  description: "",
  total_amount: 0, 
};

const CreatePoForm = ({ handleClose }) => {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(createPurchaseOrderSchema),
    defaultValues,
  });

  const { createMutation } = usePO();

  const onSubmit = async (data) => {
    try {
     
      const raw = String(data.total_amount).replace(/,/g, "").trim();
      const total_amount = raw === "" ? undefined : Number(raw);

      const payload = {
        title: data.title,
        description: data.description,
        total_amount,
      };

      await createMutation.mutateAsync(payload);

      reset(defaultValues);
    } catch (err) {
      
      console.error("Create PO error:", err);
    } finally {
      
      if (typeof handleClose === "function") handleClose();
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          width: "100%",
          maxWidth: "480px",
          p: 4,
          m: 2,
          borderRadius: 3,
        }}
      >
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Stack spacing={2}>
            {/* Title */}
            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Title"
                  placeholder="e.g., Office chairs for Team B"
                  error={!!errors.title}
                  helperText={errors.title?.message}
                  fullWidth
                />
              )}
            />

            {/* Description */}
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Description (optional)"
                  placeholder="Optional: add details, vendor, delivery timeline..."
                  error={!!errors.description}
                  helperText={errors.description?.message}
                  fullWidth
                  multiline
                  minRows={3}
                />
              )}
            />

            {/* Total amount */}
            <Controller
              name="total_amount"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Total amount(in rupees)"
                  placeholder="Enter amount, e.g., 12500"
                  error={!!errors.total_amount}
                  helperText={
                    errors.total_amount?.message ||
                    "Enter numeric value. Currency formatting is visual only."
                  }
                  fullWidth
                  inputMode="decimal"
                />
              )}
            />

            <Stack direction="row" spacing={1} justifyContent="flex-end">
              <Button
                variant="outlined"
                onClick={() => {
                  
                  reset(defaultValues);
                  if (typeof handleClose === "function") handleClose();
                }}
                disabled={isSubmitting}
              >
                Cancel
              </Button>

              <Button
                variant="contained"
                color="primary"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating..." : "Submit"}
              </Button>
            </Stack>
          </Stack>
        </form>
      </Paper>
    </Box>
  );
};

export default CreatePoForm;
