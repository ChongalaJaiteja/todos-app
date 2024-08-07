import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import axios from "../axios";
import Loader from "../components/loader";

const PrivateWrapper = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);
    const verifyAuth = async () => {
        try {
            const response = await axios.get("/v1/auth/validate-token");
            setIsAuthenticated(response.data.success);
        } catch (error) {
            setIsAuthenticated(false);
            console.error("Error verifying authentication:", error);
        }
    };
    useEffect(() => {
        verifyAuth();
    }, []);
    if (isAuthenticated === null) {
        return <Loader size={30} color="red" />;
    }
    return isAuthenticated ? (
        <Outlet />
    ) : (
        <Navigate to="/auth/signin" replace />
    );
};

export default PrivateWrapper;
