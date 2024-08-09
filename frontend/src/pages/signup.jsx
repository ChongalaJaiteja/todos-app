import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
    signInWithEmailAndPassword,
} from "firebase/auth";
import { auth, sendAndVerifyEmail } from "../utils/firebase";
import { validateEmail } from "../utils/user";
import {googleSignUp, signUp } from "../store/slices/authSlice";
import { FaGoogle, FaEye, FaEyeSlash } from "react-icons/fa";
import Loader from "../components/loader";
import { Link, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

const initialFormData = {
    email: "",
    password: "",
};

const SignUp = () => {
    const dispatch = useDispatch();
    const { isLoading, googleAuthLoading } = useSelector((state) => state.auth);
    const [formData, setFormData] = useState(initialFormData);
    const { email, password } = formData;
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
        setTimeout(() => {
            setShowPassword(false);
        }, 2000);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const trimmedEmail = email.trim();
        const trimmedPassword = password.trim();

        if (trimmedPassword === "") {
            toast.error("Invalid password");
            return;
        }

        if (!validateEmail(trimmedEmail)) {
            toast.error("Invalid email");
            return;
        }

        try {
            const response = await dispatch(
                signUp({
                    email: trimmedEmail,
                    password: trimmedPassword,
                    navigate,
                }),
            ).unwrap();
            setFormData(initialFormData);
            toast.success(response);
        } catch (rejectedValueOrSerializedError) {
            if (
                rejectedValueOrSerializedError?.error?.code ==
                "auth/email-already-in-use"
            ) {
                if (
                    rejectedValueOrSerializedError?.signInMethods.includes(
                        "password",
                    )
                ) {
                    try {
                        // The email is associated with a password-based account
                        // Check if the email is verified
                        const userCredential = await signInWithEmailAndPassword(
                            auth,
                            trimmedEmail,
                            trimmedPassword,
                        );

                        const user = userCredential.user;
                        if (!user.emailVerified) {
                            await sendAndVerifyEmail(
                                trimmedEmail,
                                trimmedPassword,
                                navigate,
                            );
                            toast.success(
                                "Verification email sent. Please check your inbox and verify your email.",
                            );
                        } else {
                            toast.error("User already exists please sign in.");
                        }
                    } catch (error) {
                        if (error.code === "auth/wrong-password") {
                            toast.error(
                                "User already exists enter correct password to check email verification.",
                            );
                        } else {
                            console.error("Error signing up:", error.message);
                            toast.error(error.message || "Error signing up");
                        }
                    }
                } else {
                    toast.error(
                        "User already exists with a different sign-in method.",
                    );
                }
            } else {
                toast.error(
                    rejectedValueOrSerializedError || "Error signing up",
                );
            }
            setFormData({ ...initialFormData, password: "" });
        }
    };

    const handleOnChange = (event) => {
        setFormData({ ...formData, [event.target.name]: event.target.value });
    };

    const handleGoogleSignUp = async () => {
        try {
            const response = await dispatch(googleSignUp()).unwrap();
            toast.success("Google sign-up successful");
            navigate("/app/onboard", { state: { ...response } });
        } catch (error) {
            toast.error(error || "Google sign-up error");
        }
    };

    return (
        <div className="flex min-h-screen flex-col justify-center ~p-5/10 lg:flex-row lg:items-center lg:justify-around lg:gap-4">
            <div className="hidden max-w-xl lg:order-2 lg:block">
                <img
                    src="https://img.freepik.com/free-vector/privacy-policy-concept-illustration_114360-7853.jpg?t=st=1720705229~exp=1720708829~hmac=c4b38904218d756bb47c9ae77947f724a37e0918c12cd0724618c08a06943127&w=740"
                    alt="signup"
                    className="w-full"
                />
            </div>

            <div className="mx-auto w-full max-w-lg lg:max-w-md">
                <h1 className="mb-14 font-extrabold ~/md:~text-3xl/4xl">
                    Sign up
                </h1>
                <div className="flex flex-col gap-4">
                    <button
                        className="flex items-center justify-center gap-2 rounded-lg border font-extrabold transition-colors duration-75 ~text-base/lg ~p-3/4 hover:bg-slate-100/60 hover:shadow-sm"
                        onClick={handleGoogleSignUp}
                    >
                        <Loader
                            loading={googleAuthLoading}
                            size={14}
                            color="black"
                        />
                        <FaGoogle />
                        Continue with Google
                    </button>
                </div>
                <div className="my-6 flex items-center">
                    <hr className="flex-grow border-t border-gray-300" />
                    <span className="mx-4 text-gray-500">or</span>
                    <hr className="flex-grow border-t border-gray-300" />{" "}
                </div>
                <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                    <input
                        type="email"
                        placeholder="Enter your email..."
                        name="email"
                        onChange={handleOnChange}
                        value={email}
                        className="w-full rounded-lg border border-gray-300 outline-gray-200 ~p-2/3 placeholder:~text-base/lg focus:outline"
                        required
                    />

                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder="Enter your password..."
                            onChange={handleOnChange}
                            value={password}
                            className="w-full rounded-lg border border-gray-300 outline-gray-200 ~p-2/3 placeholder:~text-base/lg focus:outline"
                            required
                            minLength={8}
                        />
                        <span
                            className="absolute inset-y-0 right-4 flex cursor-pointer items-center"
                            onClick={toggleShowPassword}
                        >
                            {showPassword ? <FaEye /> : <FaEyeSlash />}
                        </span>
                    </div>

                    <button
                        type="submit"
                        className={`mt-2 flex items-center justify-center gap-2 rounded-xl bg-red-500 font-extrabold text-white ~text-sm/lg ~p-2.5/3 hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50`}
                        disabled={isLoading}
                    >
                        <Loader loading={isLoading} size={13} />
                        Sign up with Email
                    </button>
                </form>
                <p className="mt-6 text-center text-gray-500 ~text-xs/sm">
                    By signing up, you agree to our{" "}
                    <a href="#" className="underline">
                        Terms of Service{" "}
                    </a>{" "}
                    and{" "}
                    <a href="#" className="underline">
                        Privacy Policy{" "}
                    </a>
                    .{" "}
                </p>
                <p className="mt-4 text-center text-gray-600 ~text-sm/base">
                    Already signed up?{" "}
                    <Link
                        to={"/auth/signin"}
                        className="text-blue-500 hover:underline"
                    >
                        Go to Login
                    </Link>
                </p>{" "}
            </div>
            <Toaster />
        </div>
    );
};

export default SignUp;
