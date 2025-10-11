import axiosClient from "../axiosClient";

const base = "purchaseOrder"; 

export const createPurchaseOrder = (data) => {
  console.log(data)
  return axiosClient.post(`/${base}`, data);
};

export const getAllPurchaseOrders = ({queryKey}) => {
  const [,params] = queryKey
  return axiosClient.get(`/${base}`,{params});
};

export const getPurchaseOrderById = (id) => {
  return axiosClient.get(`/${base}/${id}`);
};

export const submitPurchaseOrder = (id) => {
  return axiosClient.patch(`/${base}/${id}/submit`);
};

export const getApproverOrders = () => {
  return axiosClient.get(`/${base}/approver`);
};

export const approvePurchaseOrder = (id, data) => {
  return axiosClient.patch(`/${base}/approver/${id}/approve`, data);
};

export const rejectPurchaseOrder = (id, data) => {
  return axiosClient.patch(`/${base}/approver/${id}/reject`, data);
};
