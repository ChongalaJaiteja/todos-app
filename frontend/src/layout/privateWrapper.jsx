import { Navigate, Outlet } from "react-router-dom";

const PrivateWrapper = () => {
    const isAuthenticated = false;
    return isAuthenticated ? <Outlet /> : <Navigate to="/auth/signin" />;
};
export default PrivateWrapper;