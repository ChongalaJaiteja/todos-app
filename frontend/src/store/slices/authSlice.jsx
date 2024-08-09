import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../axios";
import {
    GoogleAuthProvider,
    signInWithPopup,
    sendPasswordResetEmail,
    createUserWithEmailAndPassword,
    sendEmailVerification,
    fetchSignInMethodsForEmail,
    signInWithEmailAndPassword,
} from "firebase/auth";
import { checkUserExists } from "../../utils/user";
import { auth, sendAndVerifyEmail } from "../../utils/firebase";
import { setUser, resetUser } from "./userSlice";

export const signIn = createAsyncThunk(
    "auth/signIn",
    async (data, { dispatch, rejectWithValue }) => {
        try {
            const response = await axios.post("/v1/users/login", data);
            dispatch(setUser(response.data.data.user));
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response.data.message || "Error signing in",
            );
        }
    },
);

export const googleSignIn = createAsyncThunk(
    "auth/googleSignIn",
    async (_, { rejectWithValue }) => {
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            const email = user.email;
            const avatarUrl = user.photoURL;
            const name = user.displayName;
            return { email, avatarUrl, name };
        } catch (error) {
            return rejectWithValue("Google Auth failed");
        }
    },
);

export const signUp = createAsyncThunk(
    "auth/signUp",
    async ({ email, password, navigate }, { rejectWithValue }) => {
        try {
            console.log("signUp", email, password);
            await createUserWithEmailAndPassword(auth, email, password);
            await sendAndVerifyEmail(email, password, navigate);
            return "Verification email sent. Please check your inbox and verify your email.";
        } catch (error) {
            if (error.code == "auth/email-already-in-use") {
                try {
                    const signInMethods = await fetchSignInMethodsForEmail(
                        auth,
                        email,
                    );
                    return rejectWithValue({
                        error,
                        signInMethods,
                    });
                } catch (fetchError) {
                    return rejectWithValue("Error signing up");
                }
            } else {
                return rejectWithValue(error.message || "Error signing up");
            }
        }
    },
);

export const googleSignUp = createAsyncThunk(
    "auth/googleSignUp",
    async (_, { dispatch, rejectWithValue }) => {
        try {
            // Reuse googleSignIn logic to get user details
            const { email, avatarUrl, name } =
                await dispatch(googleSignIn()).unwrap();

            try {
                // Check if user already exists
                const userExists = await checkUserExists(email);
                if (userExists)
                    throw new Error(
                        "User already exists. Please sign in instead.",
                    );
            } catch (error) {
                if (error?.response?.status === 404) {
                    // User doesn't exist, proceed with signup
                    return { email, avatarUrl, name };
                }
                throw error; // Re-throw any other errors
            }
            return { email, avatarUrl, name };
        } catch (error) {
            return rejectWithValue(error?.message || "Google Auth failed");
        }
    },
);

export const signOut = createAsyncThunk(
    "auth/signOut",
    async (_, { dispatch, rejectWithValue }) => {
        try {
            await auth.signOut();
            const response = await axios.post("/v1/users/logout", {});
            dispatch(resetUser());
            return response.data.message;
        } catch (error) {
            return rejectWithValue(
                error?.response?.data?.message || "Error signing out",
            );
        }
    },
);

const initialState = {
    isLoading: false,
    googleAuthLoading: false,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(signIn.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(signIn.fulfilled, (state) => {
            state.isLoading = false;
        });
        builder.addCase(signIn.rejected, (state) => {
            state.isLoading = false;
        });

        // google sign in
        builder.addCase(googleSignIn.pending, (state) => {
            state.googleAuthLoading = true;
        });
        builder.addCase(googleSignIn.fulfilled, (state) => {
            state.googleAuthLoading = false;
        });

        builder.addCase(googleSignIn.rejected, (state) => {
            state.googleAuthLoading = false;
        });

        // google sign up
        builder.addCase(googleSignUp.pending, (state) => {
            state.googleAuthLoading = true;
        });

        builder.addCase(googleSignUp.fulfilled, (state) => {
            state.googleAuthLoading = false;
            // state.user = action.payload;
        });
        builder.addCase(googleSignUp.rejected, (state) => {
            state.googleAuthLoading = false;
        });

        // sign up
        builder.addCase(signUp.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(signUp.fulfilled, (state) => {
            state.isLoading = false;
            // state.user = action.payload;
        });
        builder.addCase(signUp.rejected, (state) => {
            state.isLoading = false;
        });

        // sign out
        builder.addCase(signOut.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(signOut.fulfilled, (state) => {
            state.isLoading = false;
        });
        builder.addCase(signOut.rejected, (state) => {
            state.isLoading = false;
        });
    },
});

// export const {} = authSlice.actions;
export default authSlice.reducer;
