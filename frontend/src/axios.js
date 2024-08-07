import axios from "axios";

// Create an Axios instance
const api = axios.create({
    baseURL: "/api",
    withCredentials: true, // Ensures cookies are sent with every request
});

// Request Interceptor
api.interceptors.request.use(
    (config) => {
        if (!config._retry) {
            config._retry = false;
        }
        return config;
    },
    (error) => Promise.reject(error),
);

// Response Interceptor
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        // Check if the error is a 401 and retry is not yet attempted
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                // Attempt to refresh the token
                await axios.post(
                    "/api/v1/auth/refresh-token",
                    {},
                    { withCredentials: true },
                );
                // Retry the original request with the new token
                return api(originalRequest);
            } catch (refreshError) {
                console.error("Refresh token failed:", refreshError);
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    },
);

export default api;
