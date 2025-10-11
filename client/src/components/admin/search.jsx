import React, { useState, useCallback, useEffect } from "react";
import { Box, OutlinedInput, InputAdornment, IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import { useDebouncedCallback } from './../../hooks/useDebounce';

export default function DebugSearchInput({
  onSearch,
  placeholder = "Search users...",
  initialValue = "",
  delay = 300,
}) {
  const [value, setValue] = useState(initialValue ?? "");

  useEffect(() => {
    setValue(initialValue ?? "");
  }, [initialValue]);

  const debouncedSearch = useDebouncedCallback((query) => {
    // console.log(`[debounced] fired at ${performance.now().toFixed(1)} ms with: "${query}"`);
    onSearch?.(query);
  }, delay);

  useEffect(() => {
    return () => debouncedSearch.cancel();
  }, [debouncedSearch]);

  const handleChange = useCallback((e) => {
    const newValue = e.target.value;
    setValue(newValue);
    // console.log(`[handleChange] typed at ${performance.now().toFixed(1)} ms: "${newValue}"`);
    debouncedSearch(newValue);
  }, [debouncedSearch]);

  const handleClear = useCallback(() => {
    debouncedSearch.cancel();
    setValue("");
    // console.log(`[handleClear] cleared at ${performance.now().toFixed(1)} ms`);
    onSearch?.("");
  }, [debouncedSearch, onSearch]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === "Enter") {
      debouncedSearch.cancel();
      // console.log(`[enter] immediate search at ${performance.now().toFixed(1)} ms: "${value}"`);
      onSearch?.(value);
    }
  }, [value, onSearch, debouncedSearch]);

  return (
    <Box sx={{ minWidth: 280 }}>
      <OutlinedInput
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        size="small"
        startAdornment={
          <InputAdornment position="start">
            <SearchIcon color="action" />
          </InputAdornment>
        }
        endAdornment={
          value ? (
            <InputAdornment position="end">
              <IconButton 
                onClick={handleClear} 
                aria-label="Clear search" 
                edge="end" 
                size="small"
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </InputAdornment>
          ) : null
        }
        inputProps={{ "aria-label": "Search users" }}
        fullWidth
      />
    </Box>
  );
}