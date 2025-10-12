// FilterDropdown.jsx
import React from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Box,
  Chip,
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import { useSearchParams } from "react-router-dom";

export default function FilterDropdown({
  paramName,
  label,
  options = [],
  multiple = false,
  placeholder = "All",
  size = "small",
}) {
  const [searchParams, setSearchParams] = useSearchParams();

  const raw = searchParams.get(paramName);
  const selected = React.useMemo(() => {
    if (raw == null) return multiple ? [] : "";
    if (multiple) return raw.split(",").filter(Boolean);
    return raw;
  }, [raw, multiple]);

  const setParam = React.useCallback(
    (value) => {
      const next = new URLSearchParams(searchParams.toString());

      next.delete(paramName);
      if (value != null && value !== "" && (!Array.isArray(value) || value.length > 0)) {
        if (Array.isArray(value)) {
          // serialize as CSV
          next.set(paramName, value.join(","));
        } else {
          next.set(paramName, String(value));
        }
      }

      next.delete("page");
      next.set("page", "1");

      setSearchParams(next, { replace: true });
    },
    [paramName, searchParams, setSearchParams]
  );

  const handleChange = (evt) => {
    const val = evt.target.value;
    setParam(val);
  };

  const handleClear = (e) => {
    e.stopPropagation();
    setParam(multiple ? [] : "");
  };

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <FormControl size={size} variant="outlined" sx={{ minWidth: 160 }}>
        <InputLabel>{label}</InputLabel>

        <Select
          label={label}
          value={selected}
          onChange={handleChange}
          multiple={multiple}
          renderValue={(v) => {
            if ((Array.isArray(v) && v.length === 0) || v === "") return placeholder;
            if (Array.isArray(v)) {
              // show as chips
              return (
                <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
                  {v.map((val) => {
                    const opt = options.find((o) => o.value === val);
                    return <Chip key={val} label={opt?.label ?? val} size="small" />;
                  })}
                </Box>
              );
            }
            const opt = options.find((o) => o.value === v);
            return opt?.label ?? v;
          }}
        >
          {/* an "All" option that clears the filter */}
          <MenuItem value="">
            <em>{placeholder}</em>
          </MenuItem>

          {options.map((opt) => (
            <MenuItem key={opt.value} value={opt.value}>
              {opt.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* show clear button only when something selected */}
      {((multiple && Array.isArray(selected) && selected.length > 0) ||
        (!multiple && selected && selected !== "")) && (
        <IconButton
          size="small"
          onClick={handleClear}
          aria-label={`Clear ${label} filter`}
          title="Clear filter"
        >
          <ClearIcon fontSize="small" />
        </IconButton>
      )}
    </Box>
  );
}
