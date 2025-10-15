import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createPurchaseOrder,
  getAllPurchaseOrders,
  getPurchaseOrderById,
  submitPurchaseOrder,
  getApproverOrders,
  approvePurchaseOrder,
  rejectPurchaseOrder,
  getApproverReviewedOrders,
  bulkUpdatePoStatus,
} from "../api/queries/purchaseOrder.js";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom";

const DEFAULTS = {
  page: 1,
  limit: 5,
  q: "",
  status: "",
  sortBy: "createdAt",
  sortOrder: "desc",
};

export const usePO = () => {
  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const [searchParams] = useSearchParams();

  const q = searchParams.get("q") ?? DEFAULTS.q;
  const page = Number(searchParams.get("page") ?? DEFAULTS.page);
  const limit = Number(searchParams.get("limit") ?? DEFAULTS.limit);
  const status = searchParams.get("status") ?? DEFAULTS.status;
  const sortBy = searchParams.get("sortBy") ?? DEFAULTS.sortBy;
  const sortOrder = searchParams.get("sortOrder") ?? DEFAULTS.sortOrder;

  const params = {
    q: q || undefined,
    page: Number.isFinite(page) ? page : DEFAULTS.page,
    limit: Number.isFinite(limit) ? limit : DEFAULTS.limit,
    status: status || undefined,
    sortBy,
    sortOrder,
  };

  const poListQuery = useQuery({
    queryKey: ["pos", params],
    queryFn: getAllPurchaseOrders,
    enabled: true,
    refetchOnWindowFocus: false,
    staleTime: 30 * 60 * 1000,
    cacheTime: 60 * 60 * 1000,
  });

  const createMutation = useMutation({
    mutationFn: createPurchaseOrder,
    onSuccess: (data) => {
      toast("Purchase order created");
      queryClient.invalidateQueries(["pos"]);
      const created = data?.data?.data;
      if (created?.id) {
        navigate(`/po/${created.id}`);
      }
    },
    onError: (error) => {
      toast(error?.response?.data?.message || "Failed to create PO");
      console.error("Create PO error:", error);
    },
  });

  const submitMutation = useMutation({
    mutationFn: (id) => submitPurchaseOrder(id),
    onSuccess: (_, variables) => {
      toast("Purchase order submitted");
      queryClient.invalidateQueries(["pos"]);
      queryClient.invalidateQueries(["pos"]);
    },
    onError: (error) => {
      toast(error?.response?.data?.message || "Failed to submit PO");
      console.error("Submit PO error:", error);
    },
  });

  return {
    poListQuery,
    createMutation,
    submitMutation,
  };
};

export const useApproverPO = () => {
  const queryClient = useQueryClient();

  const [searchParams] = useSearchParams();

  const q = searchParams.get("q") ?? DEFAULTS.q;
  const page = Number(searchParams.get("page") ?? DEFAULTS.page);
  const limit = Number(searchParams.get("limit") ?? DEFAULTS.limit);
  const status = searchParams.get("status") ?? DEFAULTS.status;
  const sortBy = searchParams.get("sortBy") ?? DEFAULTS.sortBy;
  const sortOrder = searchParams.get("sortOrder") ?? DEFAULTS.sortOrder;

  const params = {
    q: q || undefined,
    page: Number.isFinite(page) ? page : DEFAULTS.page,
    limit: Number.isFinite(limit) ? limit : DEFAULTS.limit,
    status: status || undefined,
    sortBy,
    sortOrder,
  };

  const approverListQuery = useQuery({
    queryKey: ["approver", "pos", params],
    queryFn: getApproverOrders,
    enabled: true,
    refetchOnWindowFocus: false,
    staleTime: 30 * 60 * 1000,
    cacheTime: 60 * 60 * 1000,
  });

  const approverReviewListQuery = useQuery({
    queryKey: ["approver", "pos", "review", params],
    queryFn: getApproverReviewedOrders,
    enabled: true,
    refetchOnWindowFocus: false,
    staleTime: 30 * 60 * 1000,
    cacheTime: 60 * 60 * 1000,
  });

  const approveMutation = useMutation({
    mutationFn: ({ id, data }) => approvePurchaseOrder(id, data),
    onSuccess: (_, variables) => {
      toast("Purchase order approved");
      queryClient.invalidateQueries(["approver", "pos"]);
    },
    onError: (error) => {
      toast(error?.response?.data?.message || "Failed to approve PO");
      console.error("Approve PO error:", error);
    },
  });

  const rejectMutation = useMutation({
    mutationFn: ({ id, data }) => rejectPurchaseOrder(id, data),
    onSuccess: (_, variables) => {
      toast("Purchase order rejected");
      queryClient.invalidateQueries(["approver", "pos"]);
    },
    onError: (error) => {
      toast(error?.response?.data?.message || "Failed to reject PO");
      console.error("Reject PO error:", error);
    },
  });

  const updateBulkStatusMutation = useMutation({
    mutationFn: ( data ) => bulkUpdatePoStatus(data),
    onSuccess: () => {
      toast("PO status updated");
      queryClient.invalidateQueries(["approver", "pos"]);
    },
    onError: (error) => {
      toast(error?.response?.data?.message || "Failed to update po status");
      console.error("Reject PO error:", error);
    },
  });

  return {
    approverListQuery,
    approveMutation,
    rejectMutation,
    approverReviewListQuery,
    updateBulkStatusMutation,
  };
};

export const useSinglePO = (poId) =>
  useQuery({
    queryKey: ["po", poId],
    queryFn: () => getPurchaseOrderById(poId),
    refetchOnWindowFocus: false,
    staleTime: 30 * 60 * 1000,
    cacheTime: 60 * 60 * 1000,
    enabled: !!poId,
  });

export default usePO;
