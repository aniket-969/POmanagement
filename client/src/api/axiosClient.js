import axios from "axios";

const axiosClient = axios.create({
  baseURL: import.meta.env.REACT_APP_API_URL || "http://localhost:9000/api/v1",
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log(error)
  }
);

export default axiosClient;