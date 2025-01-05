import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5001";
const API_CALL_TIMEOUT = 5000;

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: API_CALL_TIMEOUT,
});

export default axiosInstance;
