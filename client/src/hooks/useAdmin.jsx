import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
  approveUser,
  createApprover,
  getPendingCreators,
  getUsersForAdmin,
  rejectUser,
  updateUserStatus,
} from "../api/queries/admin";
import { useSearchParams } from "react-router-dom";

export const useAdmin = () => {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const q = searchParams.get("q") ?? "";
  const page = Number(searchParams.get("page") ?? 1);
  const limit = Number(searchParams.get("limit") ?? 5);

  const role = searchParams.get("role") ?? "";
  const status = searchParams.get("status") ?? "";
  // console.log(q, page, limit,role,status);

  const pendingCreatorsQuery = useQuery({
    queryKey: ["admin", "pending-creators", { q, page, limit }],
    queryFn: getPendingCreators,
    refetchOnWindowFocus: false,
    staleTime: 30 * 60 * 1000,
    cacheTime: 60 * 60 * 1000,
    enabled: true,
  });

  const adminUsersQuery = useQuery({
    queryKey: ["admin", "users", { q, page, limit,role,status }],
    queryFn: getUsersForAdmin,
    refetchOnWindowFocus: false,
    staleTime: 30 * 60 * 1000,
    cacheTime: 60 * 60 * 1000,
    enabled: true,
  });

  const approveMutation = useMutation({
    mutationFn: ({ id }) => approveUser(id),
    onSuccess: () => {
      toast.success("User approved successfully!");
      queryClient.invalidateQueries(["admin", "pending-creators"]);
    },
    onError: (error) => {
      const message =
        error?.response?.data?.message || "Failed to approve user.";
      toast.error(message);
      console.error("Approve user error:", error);
    },
  });

  const rejectMutation = useMutation({
    mutationFn: ({ id }) => rejectUser(id),
    onSuccess: () => {
      toast.success("User approved successfully!");
      queryClient.invalidateQueries(["admin", "pending-creators"]);
    },
    onError: (error) => {
      const message =
        error?.response?.data?.message || "Failed to approve user.";
      toast.error(message);
      console.error("Approve user error:", error);
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }) => updateUserStatus(id, { status }),
    onSuccess: () => {
      toast.success("User status updated successfully!");
      queryClient.invalidateQueries(["admin", "pending-creators"]);
    },
    onError: (error) => {
      const message =
        error?.response?.data?.message || "Failed to update user status.";
      toast.error(message);
    },
  });

  const createApproverMutation = useMutation({
    mutationFn: createApprover,
    onSuccess: () => {
      toast.success("Approver created successfully!");
      queryClient.invalidateQueries(["admin", "approvers"]);
    },
    onError: (error) => {
      const message =
        error?.response?.data?.message || "Failed to create approver.";
      toast.error(message);
      console.error("Create approver error:", error);
    },
  });

  return {
    pendingCreatorsQuery,
    approveMutation,
    createApproverMutation,
    rejectMutation,
    updateStatusMutation,
    adminUsersQuery,
  };
};

export default useAdmin;
