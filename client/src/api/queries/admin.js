import axiosClient from "../axiosClient";

const base = "users/admin";

export const approveUser = async (id) => {
  console.log(id)
   return axiosClient.patch(`/${base}/${id}/approve`);
};

export const rejectUser = async (id) => {
   return axiosClient.patch(`/${base}/${id}/reject`);
};

export const createApprover = (data) => {
  console.log(data)
  return axiosClient.post(`/${base}/approver`, data);
};

export const getPendingCreators = () => {
  console.log("called")
 
  return axiosClient.get(`/${base}/creators`);
};
