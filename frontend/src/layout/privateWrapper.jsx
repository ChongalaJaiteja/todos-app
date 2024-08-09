import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import axios from "../axios";
import Loader from "../components/loader";
import { useSelector } from "react-redux";

const PrivateWrapper = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);
    const { isLoggedIn } = useSelector((state) => state.user);

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
    }, [isLoggedIn]);
    if (isAuthenticated === null) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader size={30} color="red" />
            </div>
        );
    }
    return isAuthenticated ? (
        <Outlet />
    ) : (
        <Navigate to="/auth/signin" replace />
    );
};

export default PrivateWrapper;
