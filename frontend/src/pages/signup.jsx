import { useState } from "react";
import {
    createUserWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup,
    sendEmailVerification,
    reload,
} from "firebase/auth";
import { auth } from "../utils/firebase";
import { FaGoogle, FaEye, FaEyeSlash } from "react-icons/fa";
import Loader from "../components/loader";
import { Link, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

const initialFormData = {
    email: "",
    password: "",
};

const SignUp = () => {
    const [formData, setFormData] = useState(initialFormData);
    const { email, password } = formData;
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState({
        submit: false,
        google: false,
    });

    const navigate = useNavigate();

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
        setTimeout(() => {
            setShowPassword(false);
        }, 2000);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading((prevState) => ({ ...prevState, submit: true }));
        if (password.trim() === "") {
            toast.error("Invalid password");
            setIsLoading((prevState) => ({ ...prevState, submit: false }));
            return;
        }
        try {
            const userData = await createUserWithEmailAndPassword(
                auth,
                email,
                password,
            );
            await sendEmailVerification(auth.currentUser);
            console.log("submit", userData);
            toast.success(
                "Verification email sent. Please check your inbox and verify your email.",
            );
            setFormData(initialFormData);
            let interval = setInterval(async () => {
                await reload(auth.currentUser);
                if (auth.currentUser.emailVerified) {
                    clearInterval(interval);
                    navigate("/app/onboard", { state: { email, password } });
                }
            }, 1000);
        } catch (error) {
            console.error("Error signing up:", error.message);
            toast.error(error.message);
        } finally {
            setIsLoading((prevState) => ({ ...prevState, submit: false }));
        }
    };

    const handleOnChange = (event) => {
        setFormData({ ...formData, [event.target.name]: event.target.value });
    };

    const handleGoogleSignUp = async () => {
        const provider = new GoogleAuthProvider();
        setIsLoading((prevState) => ({ ...prevState, google: true }));
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            console.log("google", result);
            navigate("/app/onboard", {
                state: {
                    email: user.email,
                    avatarUrl: user.photoURL,
                },
            });
        } catch (error) {
            toast.error("Google sign-up error");
            console.error("Google sign-up error:", error);
        } finally {
            setIsLoading((prevState) => ({ ...prevState, google: false }));
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
                <h1 className="mb-14 font-extrabold ~/md:~text-lg/3xl ~lg/xl:~text-3xl/5xl">
                    Sign up
                </h1>
                <div className="flex flex-col gap-4">
                    <button
                        className="text- flex items-center justify-center gap-2 rounded-lg border p-3 font-extrabold transition-colors duration-75 hover:bg-slate-100/60 hover:shadow-sm"
                        onClick={handleGoogleSignUp}
                    >
                        <Loader
                            loading={isLoading.google}
                            size={14}
                            color="black"
                        />
                        <FaGoogle />
                        Continue with Google
                    </button>
                    {/* <button
                        className="flex items-center justify-center gap-2 rounded-lg border p-3 font-extrabold transition-colors duration-75 hover:bg-slate-100/60 hover:shadow-sm"
                        onClick={handleFacebookSignUp}
                    >
                        <FaFacebook />
                        Continue with Facebook
                    </button>
                    <button className="flex items-center justify-center gap-2 rounded-lg border p-3 font-extrabold transition-colors duration-75 hover:bg-slate-100/60 hover:shadow-sm">
                        <FaApple />
                        Continue with Apple
                    </button> */}
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
                        className="w-full rounded-lg border border-gray-300 p-2 outline-gray-200 focus:outline"
                        required
                    />

                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder="Enter your password..."
                            onChange={handleOnChange}
                            value={password}
                            className="w-full rounded-lg border border-gray-300 p-2 outline-gray-200 focus:outline"
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
                        className={`mt-2 flex items-center justify-center gap-2 rounded-xl bg-red-500 p-2.5 font-extrabold text-white hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50`}
                        disabled={isLoading.submit}
                    >
                        <Loader loading={isLoading.submit} size={13} />
                        Sign up with Email
                    </button>
                </form>
                <p className="mt-6 text-center text-xs text-gray-500">
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
                <p className="mt-4 text-center text-sm text-gray-600">
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
