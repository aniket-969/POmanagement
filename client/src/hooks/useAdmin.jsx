 import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
  approveUser,
  createApprover, 
  getPendingCreators,
  rejectUser,
} from "../api/queries/admin";

export const useAdmin = () => {
  const queryClient = useQueryClient();

  const pendingCreatorsQuery = useQuery({
    queryKey: ["admin", "pending-creators"],
    queryFn: getPendingCreators,
    refetchOnWindowFocus: false,
    staleTime: 30 * 60 * 1000, 
    cacheTime: 60 * 60 * 1000,
    enabled:true 
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
    mutationFn: ({ id}) => rejectUser(id),
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
    rejectMutation
  };
};

export default useAdmin;
