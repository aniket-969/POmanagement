import axiosClient from "../axiosClient";

const base = "users/admin";

export const approveUser = async (id,data) => {
   return axiosClient.post(`/${base}/${id}/approve`, data);
};

export const createApprover = (data) => {
  return axiosClient.post(`/${base}/approver`, data);
};

export const getPendingCreators = () => {
  return axiosClient.get(`/${base}/creators`);
};
