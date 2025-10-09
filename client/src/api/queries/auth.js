import axiosClient from "../axiosClient";

const base = "users";

export const fetchSession = async () => {
  const response = await axiosClient.get(`/${base}/session`);
  localStorage.setItem("session", JSON.stringify(response.data?.data));
  return response.data?.data;
};

export const registerUser = (data) => {
  return axiosClient.post(`/${base}/register`, data);
};
  
export const loginUser = (data) => {
  return axiosClient.post(`/${base}/login`, data);
};

export const logOut = () => {
  return axiosClient.post(`/${base}/logout`);
};

 