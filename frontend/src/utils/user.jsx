import axios from "../axios";

export const checkUserExists = async (email) => {
    try {
        const response = await axios.post("/v1/users/verify", {
            email,
        });
        const { success } = response.data;
        if (success) {
            return true;
        }
    } catch (error) {
        console.error("checkUserExists error:", error);
    }
    return false;
};

export const validateEmail = (email) =>
    /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/.test(String(email).toLowerCase());

export const validateUsername = (username) =>
    /^[a-zA-Z][a-zA-Z0-9_]{2,14}$/.test(username);
