import axios from "../axios";

export const checkAuth = async () => {
    try {
        const response = await axios.get("/v1/users/validate-token");
        console.log("Check auth response:", response);
        return response.data.success;
    } catch {
        console.error("Error checking authentication");
        return false;
    }
};
