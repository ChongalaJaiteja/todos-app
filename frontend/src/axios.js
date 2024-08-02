import axios from "axios";
import createAuthRefreshInterceptor from "axios-auth-refresh";

const instance = axios.create({
    baseURL: "/api",
    withCredentials: true, // This ensures cookies are sent with every request
});

const refreshAuthLogic = async (failedRequest) => {
    try {
        const tokenRefreshResponse = await instance.post(
            "/v1/users/refresh-token",
        );
        const { accessToken } = tokenRefreshResponse.data.data;
        instance.defaults.headers.common["Authorization"] =
            `Bearer ${accessToken}`;
        failedRequest.response.config.headers["Authorization"] =
            `Bearer ${accessToken}`;
        return Promise.resolve();
    } catch (error) {
        console.log(error);
        console.error("Error in refreshAuthLogic:", error.message);
        // Redirect to login if refresh token is also expired
        window.location.href = "/auth/signin";
        return Promise.reject(error);
    }
};

// Instantiate the interceptor (you can chain it as it returns the axios instance)
createAuthRefreshInterceptor(instance, refreshAuthLogic);

export default instance;
