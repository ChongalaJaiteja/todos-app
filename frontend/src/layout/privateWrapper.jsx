import { Navigate, Outlet, useLocation } from "react-router-dom";
import { checkAuth } from "../utils/auth";
import { useEffect, useState } from "react";

const PrivateWrapper = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);
    const location = useLocation();
    useEffect(() => {
        const verifyAuth = async () => {
            console.log("Verifying authentication...");
            try {
                const authenticated = await checkAuth();
                console.log("Authenticated:", authenticated);
                setIsAuthenticated(authenticated);
            } catch (error) {
                console.error("Error verifying authentication:", error);
                setIsAuthenticated(false);
            }
        };
        verifyAuth();
    }, [location.pathname]);

    if (isAuthenticated === null) {
        console.log("Loading...");
        return <div>Loading...</div>; // Or some loading spinner
    }
    console.log("Render component, isAuthenticated:", isAuthenticated);

    return isAuthenticated ? <Outlet /> : <Navigate to="/auth/signin" />;
};

export default PrivateWrapper;
