import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../utils/firebase";
import { Link } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
// TODO: Implement the ForgotPassword component
const ForgotPassword = () => {
    const actionCodeSettings = {
        url: "http://localhost:5173/auth/reset-password",
        handleCodeInApp: true,
    };
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        try {
            await sendPasswordResetEmail(auth, email, actionCodeSettings);
            toast.success(
                "Password reset email sent. Please check your inbox.",
            );
        } catch (error) {
            console.error("Error sending password reset email:", error);
            toast.error("Error sending password reset email.");
        } finally {
            setIsLoading(false);
            setEmail("");
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
            <div className="w-full max-w-md space-y-4 rounded-lg bg-white p-8 shadow-lg">
                <h1 className="text-center text-2xl font-bold">
                    Forgot Password
                </h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label
                            htmlFor="email"
                            className="mb-2 block text-sm font-medium text-gray-600"
                        >
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-blue-200"
                            placeholder="Enter your email"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full rounded-lg bg-blue-500 px-3 py-2 text-white hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-200 disabled:opacity-60"
                        disabled={isLoading}
                    >
                        {isLoading ? "Sending..." : "Send Reset Link"}
                    </button>
                </form>
                <div className="text-center">
                    <Link
                        to="/auth/signin"
                        className="text-blue-500 hover:underline"
                    >
                        Go back to login
                    </Link>
                </div>
            </div>
            <Toaster />
        </div>
    );
};

export default ForgotPassword;
