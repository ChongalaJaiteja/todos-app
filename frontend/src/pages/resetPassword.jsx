import { useEffect, useState } from "react";
import { confirmPasswordReset, verifyPasswordResetCode } from "firebase/auth";
import { auth } from "../utils/firebase";
import { useNavigate, useLocation } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import axios from "../axios";

const ResetPassword = () => {
    const [newPassword, setNewPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [resetCode, setResetCode] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const query = new URLSearchParams(location.search);
        const oobCode = query.get("oobCode");
        console.log("oobCode", oobCode);
        if (oobCode) {
            verifyPasswordResetCode(auth, oobCode)
                .then(() => setResetCode(oobCode))
                .catch(() => {
                    toast.error("Invalid or expired reset code.");
                    navigate("/auth/forgot-password");
                });
        } else {
            navigate("/auth/forgot-password");
        }
    }, [location, navigate]);

    const handlePasswordReset = async (event) => {
        event.preventDefault();
        if (!resetCode) return;
        setIsLoading(true);
        try {
            await confirmPasswordReset(auth, resetCode, newPassword);
            const response = await axios.put("v1/users/reset-password", {
                password: newPassword,
            });

            const { data: responseData } = response;
            const success = responseData.success;
            if (success) {
                toast.success("Password has been reset successfully.");
                navigate("/auth/signin");
            } else {
                toast.error("Error resetting password.");
            }
        } catch (error) {
            console.error("Error resetting password:", error);
            toast.error("Error resetting password.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
            <div className="w-full max-w-md space-y-4 rounded-lg bg-white p-8 shadow-lg">
                <h1 className="text-center text-2xl font-bold">
                    Reset Password
                </h1>
                <form onSubmit={handlePasswordReset} className="space-y-6">
                    <div>
                        <label
                            htmlFor="password"
                            className="mb-2 block text-sm font-medium text-gray-600"
                        >
                            New Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-blue-200"
                            placeholder="Enter new password"
                            minLength={8}
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full rounded-lg bg-blue-500 px-3 py-2 text-white hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-200"
                        disabled={isLoading}
                    >
                        {isLoading ? "Resetting..." : "Reset Password"}
                    </button>
                </form>
            </div>
            <Toaster />
        </div>
    );
};

export default ResetPassword;
