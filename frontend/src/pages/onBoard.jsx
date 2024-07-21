import { useLocation } from "react-router-dom";
import Loader from "../components/loader";
import { useState } from "react";
import { LuUpload } from "react-icons/lu";
import { MdOutlineDone } from "react-icons/md";
import { twMerge } from "tailwind-merge";
import axios from "../axios";
import toast, { Toaster } from "react-hot-toast";

const OnBoard = () => {
    const location = useLocation();
    const { email, password = "", avatarUrl = "", name = "" } = location.state;

    const INITIAL_FORM_DATA = {
        username: "",
        fullName: name,
        avatar: avatarUrl || null,
    };

    const INITIAL_FORM_ERRORS = {
        username: "",
        fullName: "",
        avatar: "",
    };

    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState(INITIAL_FORM_DATA);
    const [error, setError] = useState(INITIAL_FORM_ERRORS);
    const [avatarPreview, setAvatarPreview] = useState(avatarUrl);
    const validate = () => {
        const errors = {};
        const usernameRegex = /^[a-zA-Z][a-zA-Z0-9_]*$/;
        const { username, fullName, avatar } = formData;
        if (!username.trim()) errors.username = "Username is required *";
        else {
            if (username.length < 3 || username.length > 15) {
                errors.username =
                    "Username must be between 3 and 15 characters.";
            } else if (!usernameRegex.test(username)) {
                errors.username =
                    "Username must start with a letter and contain only letters, numbers, and underscores.";
            }
        }

        if (!fullName.trim()) errors.fullName = "Full name is required *";
        if (!avatar) errors.avatar = "Photo is required *";
        return errors;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setError((prev) => ({
                ...prev,
                ...validationErrors,
            }));
            return;
        }
        setIsLoading(true);
        try {
            const formDataToSend = new FormData();
            formDataToSend.append("username", formData.username);
            formDataToSend.append("fullName", formData.fullName);
            formDataToSend.append("avatar", formData.avatar);
            formDataToSend.append("email", email);
            formDataToSend.append("password", password);
            const response = await axios.post(
                "/v1/users/register",
                formDataToSend,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                },
            );
            const userData = response.data.data;
            console.log("User registered successfully:", userData);
            toast.success("Registered Successfully");
        } catch (error) {
            const { response } = error;
            const message = response?.data?.message || "Error creating user";
            console.error("Error creating user:", message);
            toast.error(message);
        } finally {
            setFormData(INITIAL_FORM_DATA);
            setIsLoading(false);
        }
    };

    const handleChange = (event) => {
        const { name, value, files, type } = event.target;
        if (type === "file" && files && files.length > 0) {
            const file = files[0];
            setFormData((prev) => ({
                ...prev,
                [name]: file,
            }));
            setAvatarPreview(URL.createObjectURL(file));
        } else if (type !== "file") {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const handleBlur = (event) => {
        const validationErrors = validate();
        const { name } = event.target;
        setError((prev) => ({
            ...prev,
            [name]: validationErrors[name] || "",
        }));
    };

    const { username, fullName, avatar } = formData;

    return (
        <>
            <div className="flex flex-col ~p-5/10">
                <form onSubmit={handleSubmit} className="flex flex-col gap-2">
                    <h1 className="mb-7 font-extrabold ~/md:~text-2xl/3xl">
                        Create your profile
                    </h1>
                    <div className="flex w-full cursor-default items-center gap-2 rounded-lg border border-gray-300 outline-gray-200 ~text-base/lg ~p-2/3 focus:outline">
                        {avatar && (
                            <label htmlFor="avatar" className="cursor-pointer">
                                <img
                                    src={avatarPreview}
                                    alt="Profile"
                                    className="rounded-full object-cover object-center ~h-10/11 ~w-10/11"
                                />
                            </label>
                        )}

                        {!avatar && (
                            <label
                                htmlFor="avatar"
                                className="cursor-pointer rounded-full bg-gray-200/60 p-2 hover:bg-gray-300"
                            >
                                <LuUpload className="text-gray-500 ~text-base/lg" />
                            </label>
                        )}

                        <input
                            id="avatar"
                            name="avatar"
                            type="file"
                            accept=".jpg,.jpeg,.png"
                            className="hidden"
                            onChange={handleChange}
                            onBlur={handleBlur}
                        />

                        <span className="grow font-semibold text-gray-600 ~text-base/lg">
                            {avatar ? "Looking good!" : "Upload your photo"}
                        </span>

                        {avatar && (
                            <MdOutlineDone className="mx-auto text-green-600 ~text-base/lg" />
                        )}
                    </div>

                    {error.avatar && (
                        <span className="text-red-500 ~text-xs/sm">
                            {error.avatar}
                        </span>
                    )}

                    <div className="relative mt-5">
                        <input
                            id="username"
                            name="username"
                            className="peer w-full rounded-lg border border-gray-300 px-4 py-2 placeholder-transparent outline-gray-200 focus:outline"
                            placeholder="username"
                            onChange={handleChange}
                            value={username}
                            onBlur={handleBlur}
                        />
                        <label
                            htmlFor="username"
                            className={twMerge(
                                "absolute left-1.5 top-2 z-10 bg-white px-1 transition-all duration-200 ease-in-out",
                                username
                                    ? "-top-3 text-sm text-gray-500"
                                    : "peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-gray-400 peer-focus:top-0.5 peer-focus:text-sm peer-focus:text-gray-500",
                            )}
                        >
                            Username
                        </label>
                    </div>

                    {error.username && (
                        <span className="text-red-500 ~text-xs/sm">
                            {error.username}
                        </span>
                    )}

                    <div className="relative mt-5">
                        <input
                            placeholder="full name"
                            id="fullName"
                            name="fullName"
                            className="peer w-full rounded-lg border border-gray-300 px-4 py-2 placeholder-transparent outline-gray-200 focus:outline"
                            value={fullName}
                            onChange={handleChange}
                            onBlur={handleBlur}
                        />
                        <label
                            htmlFor="fullName"
                            className={twMerge(
                                "absolute left-1.5 top-2 z-10 bg-white px-1 transition-all duration-200 ease-in-out",
                                fullName
                                    ? "-top-3 text-sm text-gray-500"
                                    : "peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-gray-400 peer-focus:top-0.5 peer-focus:text-sm peer-focus:text-gray-500",
                            )}
                        >
                            Full Name
                        </label>
                    </div>

                    {error.fullName && (
                        <span className="text-red-500 ~text-xs/sm">
                            {error.fullName}
                        </span>
                    )}

                    <button
                        type="submit"
                        className={`mt-5 flex items-center justify-center gap-2 rounded-xl bg-red-500 font-extrabold text-white ~text-sm/lg ~p-2.5/3 hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50`}
                        disabled={isLoading}
                    >
                        <Loader loading={isLoading} size={13} />
                        Continue
                    </button>
                </form>

                <div></div>
            </div>
            <Toaster />
        </>
    );
};

export default OnBoard;
