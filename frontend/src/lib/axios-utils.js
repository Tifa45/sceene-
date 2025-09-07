import axios from "axios";

const api = axios.create({
  // baseURL: "https://sceene.onrender.com/api",
  baseURL: "https://sceene-production.up.railway.app",
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const token = JSON.parse(localStorage.getItem("token"));
    if (token) {
      config.headers.Authorization = token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.data?.message === "Expired token!" &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const { data } = await api.post("/refresh/access-token");
        const newAccessToken = data.token;
        localStorage.setItem("token", JSON.stringify(newAccessToken));
        originalRequest.headers.Authorization = newAccessToken;

        return api(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
