// Filter.jsx
import React from "react";
import { Box, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { useSearchParams } from "react-router-dom";

export default function Filter({
  paramName = "status",
  label = "Status",
  options = [],
  size = "small",
  onSelect,
}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const current = searchParams.get(paramName) ?? "";

  const handleChange = (e) => {
    const value = e.target.value;
    onSelect(value);
  };

  return (
    <Box>
      <FormControl size={size} sx={{ minWidth: 160 }}>
        <InputLabel id={`${paramName}-label`}>{label}</InputLabel>
        <Select
          labelId={`${paramName}-label`}
          id={`${paramName}-select`}
          label={label}
          value={current}
          onChange={handleChange}
        >
          <MenuItem value="">
            <em>All</em>
          </MenuItem>

          {options.map((opt) => (
            <MenuItem key={opt.value} value={opt.value}>
              {opt.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
