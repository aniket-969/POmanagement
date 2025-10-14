import { useSearchParams } from "react-router-dom";
import UserList from "../../../components/admin/users/userList";
import { Box } from "@mui/material";
import SearchInput from "../../../components/ui/search";
import Filter from "../../../components/ui/filter";

const ManageUsers = () => {
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
  const handleRoleSelect = (value) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "") params.set("role", value);
    else params.delete("role");
    params.set("page", "1");
    setSearchParams(params, { replace: true });
  };
  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          gap: 3,
        }}
      >
        <SearchInput onSearch={onSearch} />
       <Filter
          paramName="role"
          label="Role"
          options={[
            { label: "Approver", value: "approver" },
            { label: "Creator", value: "creator" },
          ]}
          onSelect={handleRoleSelect}
        />

        <Filter
          paramName="status"
          label="Status"
          options={[
            { label: "Suspended", value: "suspended" },
            { label: "Active", value: "active" },
          ]}
          onSelect={handleStatusSelect}
        />
      </Box>
      <UserList />
    </Box>
  );
};

export default ManageUsers;
