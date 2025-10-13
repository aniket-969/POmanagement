import React from "react";
import { Box } from "@mui/material";
import Topbar from "../../components/user/topbar";
import SearchInput from "../../components/ui/search";
import PoTable from "../../components/user/poTable";
import Filter from "./../../components/ui/filter";
import { useSearchParams } from "react-router-dom";

const User = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const onSearch = (q) => {
    const params = new URLSearchParams(searchParams);
    if (q && q.trim() != "") params.set("q", q.trim());
    else params.delete("q");
    params.set("page", "1");
    setSearchParams(params);
  };

  const handleStatusSelect = (value) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "") params.set("status", value);
    else params.delete("status");
    params.set("page", "1");
    setSearchParams(params, { replace: true });
  };

  return (
    <Box sx={{ width: "100%" ,
      p:2
    }}>
      <Topbar />

      <Box
        sx={{
          display: "flex",
          justifyItems: "",
          alignItems: "center",
          gap: 4,
          width: "100%",
        }}
      >
        <SearchInput onSearch={onSearch} />
        <Filter
          paramName="status"
          label="Status"
          options={[
            { label: "Draft", value: "draft" },
            { label: "Submitted", value: "submitted" },
            { label: "Approved", value: "approved" },
            { label: "Rejected", value: "rejected" },
          ]}
          onSelect={handleStatusSelect}
        />
      </Box>
      <PoTable />
    </Box>
  );
};

export default User;
