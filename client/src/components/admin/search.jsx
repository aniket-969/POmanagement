import { useState, useCallback } from "react";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton"; 
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from "@mui/icons-material/Close";
import Box from "@mui/material/Box";
import {useDebouncedCallback} from "../../hooks/useDebounce.jsx"

export default function SearchInput({ onSearch, placeholder = "Search users..." }) {
  const [value, setValue] = useState("");

  const debounced = useDebouncedCallback((q) => {
    onSearch?.(q);
  }, 300);

  const handleChange = useCallback((e) => {
    const v = e.target.value;
    setValue(v);
    debounced(v);
    console.log(v)
  }, [debounced]);

  const handleClear = useCallback(() => {
    setValue("");
    onSearch?.(""); 
  }, [onSearch]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === "Enter") {
     
      debounced.cancel?.();
      onSearch?.(value);
    }
  }, [value, onSearch, debounced]);

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
        inputProps={{
          "aria-label": "Search users",
        }}
        fullWidth
      />
    </Box>
  );
}
