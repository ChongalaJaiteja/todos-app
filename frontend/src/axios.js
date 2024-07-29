import axios from "axios";

const instance = axios.create({
    baseURL: "/api",
    withCredentials: true, // This ensures cookies are sent with every request
});

export default instance;
