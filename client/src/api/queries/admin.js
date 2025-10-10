import axiosClient from "../axiosClient";

const base = "users/admin";

export const approveUser = async (id,data) => {
   return axiosClient.post(`/${base}/${id}/approve`, data);
};

export const rejectUser = async (id,data) => {
   return axiosClient.post(`/${base}/${id}/reject`, data);
};

export const createApprover = (data) => {
  console.log(data)
  return axiosClient.post(`/${base}/approver`, data);
};

export const getPendingCreators = () => {
  console.log("called")
 
  return axiosClient.get(`/${base}/creators`);
};
