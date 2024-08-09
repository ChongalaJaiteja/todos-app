import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signIn, googleSignIn } from "../store/slices/authSlice";
import { validateEmail, validateUsername } from "../utils/user";
import { FaGoogle } from "react-icons/fa";
import Loader from "../components/loader";
import { Link, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

const initialFormData = {
    identifier: "",
    password: "",
};

const SignIn = () => {
    const [formData, setFormData] = useState(initialFormData);
    const { identifier, password } = formData;
    const dispatch = useDispatch();
    const { isLoading, googleAuthLoading } = useSelector((state) => state.auth);
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        const trimmedPassword = password.trim();
        const trimmedIdentifier = identifier.trim();
        const isEmail = validateEmail(trimmedIdentifier);
        const isUsername = validateUsername(trimmedIdentifier);
        if (!isEmail && !isUsername) {
            toast.error("Invalid email or username");
            return;
        }
        const data = {
            [isEmail ? "email" : "username"]: trimmedIdentifier,
            password: trimmedPassword,
        };
        try {
            const response = await dispatch(signIn(data)).unwrap();
            toast.success(response.message);
            navigate("/", { replace: true });
        } catch (error) {
            toast.error(error);
        } finally {
            setFormData((prev) => ({ ...prev, password: "" }));
        }
    };

    const handleOnChange = (event) => {
        setFormData({ ...formData, [event.target.name]: event.target.value });
    };

    const handleGoogleSignIn = async () => {
        try {
            const { email } = await dispatch(googleSignIn()).unwrap();
            try {
                const response = await dispatch(
                    signIn({ email, googleSignIn: true }),
                ).unwrap();
                toast.success(response.message);
                navigate("/", { replace: true });
            } catch (error) {
                toast.error(error);
            }
        } catch (error) {
            toast.error(error);
            console.error(error);
        }
    };

    // // TODO: Implement the following functions
    // const handleForgotPassword = async () => {
    //     if (!validateEmail(identifier)) {
    //         toast.error("Please enter your email to reset password");
    //         return;
    //     }

    //     const userExists = await checkUserExists(identifier);
    //     if (!userExists) {
    //         toast.error("No account found with this email");
    //         return;
    //     }

    //     setIsLoading((prevState) => ({ ...prevState, forgotPassword: true }));
    //     try {
    //         await sendPasswordResetEmail(auth, identifier, actionCodeSettings);
    //         toast.success("Password reset email sent!");
    //     } catch (error) {
    //         toast.error("Error sending password reset email");
    //         console.error("Password reset error:", error);
    //     } finally {
    //         setIsLoading((prevState) => ({
    //             ...prevState,
    //             forgotPassword: false,
    //         }));
    //     }
    // };

    return (
        <div className="flex min-h-screen flex-col justify-center ~p-5/10 lg:flex-row lg:items-center lg:justify-around lg:gap-4 lg:p-10">
            <div className="hidden max-w-xl lg:order-2 lg:block">
                <img
                    src="https://img.freepik.com/free-vector/privacy-policy-concept-illustration_114360-7853.jpg?t=st=1720705229~exp=1720708829~hmac=c4b38904218d756bb47c9ae77947f724a37e0918c12cd0724618c08a06943127&w=740"
                    alt="signup"
                    className="w-full"
                />
            </div>

            <div className="mx-auto w-full max-w-lg lg:max-w-md">
                <h1 className="mb-14 font-extrabold ~/md:~text-3xl/4xl">
                    Sign In
                </h1>
                <div className="flex flex-col gap-4">
                    <button
                        className="text- flex items-center justify-center gap-2 rounded-lg border font-extrabold transition-colors duration-75 ~text-base/lg ~p-3/4 hover:bg-slate-100/60 hover:shadow-sm"
                        onClick={handleGoogleSignIn}
                        disabled={googleAuthLoading}
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
                        type="text"
                        placeholder="Enter your username or email..."
                        name="identifier"
                        onChange={handleOnChange}
                        value={identifier}
                        className="w-full rounded-lg border border-gray-300 outline-gray-200 ~p-2/3 placeholder:~text-base/lg focus:outline"
                        required
                    />

                    <input
                        type="password"
                        name="password"
                        placeholder="Enter your password..."
                        onChange={handleOnChange}
                        value={password}
                        className="w-full rounded-lg border border-gray-300 outline-gray-200 ~p-2/3 placeholder:~text-base/lg focus:outline"
                        required
                        minLength={8}
                    />
                    <Link
                        to={"/auth/forgot-password"}
                        className="cursor-pointer self-end text-blue-500 ~text-sm/base hover:underline"
                    >
                        Forgot Password?
                    </Link>
                    <button
                        type="submit"
                        className={`mt-2 flex items-center justify-center gap-2 rounded-xl bg-red-500 font-extrabold text-white ~text-sm/lg ~p-2.5/3 hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50`}
                        disabled={isLoading}
                    >
                        <Loader loading={isLoading} size={13} />
                        Sign In
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
                    Don&apos;t have an account ?{" "}
                    <Link
                        to={"/auth/signup"}
                        className="text-blue-500 hover:underline"
                    >
                        Sign up
                    </Link>
                </p>{" "}
            </div>
            <Toaster />
        </div>
    );
};

export default SignIn;
