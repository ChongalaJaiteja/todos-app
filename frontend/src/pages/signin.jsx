import { useState } from "react";
import {
    signInWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup,
    sendPasswordResetEmail,
    fetchSignInMethodsForEmail,
    sendEmailVerification,
    reload,
} from "firebase/auth";
import { auth } from "../utils/firebase";
import { FaGoogle } from "react-icons/fa";
import Loader from "../components/loader";
import { Link, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

const initialFormData = {
    email: "",
    password: "",
};

const SignIn = () => {
    const [formData, setFormData] = useState(initialFormData);
    const { email, password } = formData;
    const [isLoading, setIsLoading] = useState({
        submit: false,
        google: false,
        forgotPassword: false,
    });
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading((prevState) => ({ ...prevState, submit: true }));
        try {
            const userCredential = await signInWithEmailAndPassword(
                auth,
                email,
                password,
            );

            const user = userCredential.user;

            await reload(user);

            if (user.emailVerified) {
                toast.success("Sign in successful!");
                navigate("/");
            } else {
                await sendEmailVerification(user);
                let interval = setInterval(async () => {
                    await reload(auth.currentUser);
                    if (auth.currentUser.emailVerified) {
                        clearInterval(interval);
                        navigate("/");
                    }
                }, 1000);
                toast.error(
                    "Please verify your email. A verification email has been sent to your inbox.",
                );
            }
        } catch (error) {
            console.error("Error signing in:", error.message);
            toast.error(error.message);
        } finally {
            setIsLoading((prevState) => ({ ...prevState, submit: false }));
            setFormData(initialFormData);
        }
    };

    const handleOnChange = (event) => {
        setFormData({ ...formData, [event.target.name]: event.target.value });
    };

    const checkUserExists = () => {
        return true;
    };

    const handleGoogleSignIn = async () => {
        const provider = new GoogleAuthProvider();
        setIsLoading((prevState) => ({ ...prevState, google: true }));
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            if (!checkUserExists()) {
                toast.error(
                    "No account found with this email. Please sign up first.",
                );

                return;
            }
            // console.log(user);
            // // Log user email for debugging
            // console.log("User email:", user.email);

            // // Check if the user already exists
            // const signInMethods = await fetchSignInMethodsForEmail(
            //     auth,
            //     user.email,
            // );

            // // Log signInMethods for debugging
            // console.log("Sign-in methods:", signInMethods);

            // if (signInMethods.length === 0) {
            //     // User is new, handle the case where the user needs to sign up first
            //     toast.error(
            //         "No account found with this email. Please sign up first.",
            //     );
            //     // Optionally redirect to sign-up page:
            //     // navigate("/auth/signup");
            // } else {
            toast.success("Google sign-in successful!");
            navigate("/");
            // }
        } catch (error) {
            toast.error("Google sign-in error");
            console.error("Google sign-in error:", error);
        } finally {
            setIsLoading((prevState) => ({ ...prevState, google: false }));
        }
    };

    const handleForgotPassword = async () => {
        if (!email) {
            toast.error("Please enter your email to reset password");
            return;
        }
        setIsLoading((prevState) => ({ ...prevState, forgotPassword: true }));
        try {
            await sendPasswordResetEmail(auth, email);
            toast.success("Password reset email sent!");
        } catch (error) {
            toast.error("Error sending password reset email");
            console.error("Password reset error:", error);
        } finally {
            setIsLoading((prevState) => ({
                ...prevState,
                forgotPassword: false,
            }));
        }
    };

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
                        disabled={isLoading.google}
                    >
                        <Loader
                            loading={isLoading.google}
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
                    <p
                        onClick={handleForgotPassword}
                        className="cursor-pointer self-end text-sm text-blue-500 hover:underline"
                    >
                        <Loader
                            loading={isLoading.forgotPassword}
                            size={13}
                            color="black"
                            className="mr-2"
                        />
                        Forgot Password?
                    </p>
                    <button
                        type="submit"
                        className={`mt-2 flex items-center justify-center gap-2 rounded-xl bg-red-500 font-extrabold text-white ~text-sm/lg ~p-2.5/3 hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50`}
                        disabled={isLoading.submit}
                    >
                        <Loader loading={isLoading.submit} size={13} />
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
