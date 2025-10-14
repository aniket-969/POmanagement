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
 
export const getPendingCreators = ({ queryKey }) => {
  
  const [, , params] = queryKey;
  // console.log(params)
  const { q = "", page = 1, limit = 5 } = params || {};

  return axiosClient.get(`/${base}/creators`, {
    params: {
      q: q || undefined,
      page,
      limit,
    },
  });
};
 
export const getUsersForAdmin = ({ queryKey }) => {
  
  const [, , params] = queryKey;
  // console.log(params)
  const { q = "", page = 1, limit = 5 } = params || {};

  return axiosClient.get(`/${base}/users`, {
    params: {
      q: q || undefined,
      page,
      limit,
    },
  });
};

export const updateUserStatus = (id,data) => {
  console.log(data)
  return axiosClient.patch(`/${base}/${id}/status`, data);
};
 
