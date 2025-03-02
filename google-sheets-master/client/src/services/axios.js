import Axios from "axios";
import { cookie } from "@/utils";

const axiosInstance = Axios.create({});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = cookie.get("auth_token");
    if (token) {
      config.headers["authorization"] = token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      document.dispatchEvent(new CustomEvent("unauthorized"));
    }
    return Promise.reject(error?.response?.data);
  }
);

export default axiosInstance;
