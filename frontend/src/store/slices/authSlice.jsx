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
    reload,
} from "firebase/auth";
import { checkUserExists, validateEmail } from "../../utils/user";
import { auth } from "../../utils/firebase";

// export const signUpWithEmail = createAsyncThunk(
//     "auth/signUpWithEmail",
//     async ({ email, password }) => {
//         try {
//             const response = await axios.post("/v1/users/signup", {
//                 email,
//                 password,
//             });
//             const { user } = response.data;
//             return user;
//         } catch (error) {
//             console.error("signUpWithEmail error:", error);
//             throw error;
//         }
//     },
// );

// export const signUp = createAsyncThunk(
//     "auth/signUp",
//     async ({ email, password }, thunkAPI) => {
//         try {
//             const userCredential = await createUserWithEmailAndPassword(
//                 auth,
//                 email,
//                 password,
//             );
//             await sendEmailVerification(auth.currentUser);
//             return userCredential.user;
//         } catch (error) {
//             return thunkAPI.rejectWithValue(error.message);
//         }
//     },
// );

export const signIn = createAsyncThunk(
    "auth/signIn",
    async (data, { rejectWithValue }) => {
        try {
            const response = await axios.post("/v1/users/login", data);
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

// export const signUp = createAsyncThunk(
//     "auth/signUp",
//     async ({ email, password }, { rejectWithValue }) => {
//         try {
//             await createUserWithEmailAndPassword(auth, email, password);
//         } catch (error) {

//         }
//     },
// );

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

const initialState = {
    user: null,
    isLoading: false,
    googleAuthLoading: false,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(signIn.pending, (state, action) => {
            state.isLoading = true;
        });
        builder.addCase(signIn.fulfilled, (state, action) => {
            state.isLoading = false;
            state.user = action.payload.data.user;
        });
        builder.addCase(signIn.rejected, (state, action) => {
            state.isLoading = false;
        });

        // google sign in
        builder.addCase(googleSignIn.pending, (state, action) => {
            state.googleAuthLoading = true;
        });
        builder.addCase(googleSignIn.fulfilled, (state, action) => {
            state.googleAuthLoading = false;
            state.user = action.payload;
        });

        builder.addCase(googleSignIn.rejected, (state, action) => {
            state.googleAuthLoading = false;
        });

        // google sign up
        builder.addCase(googleSignUp.pending, (state, action) => {
            state.googleAuthLoading = true;
        });

        builder.addCase(googleSignUp.fulfilled, (state, action) => {
            state.googleAuthLoading = false;
            // state.user = action.payload;
        });

        builder.addCase(googleSignUp.rejected, (state, action) => {
            state.googleAuthLoading = false;
        });

        // builder.addCase(signUpWithEmail.pending, (state, action) => {
        //     state.loading = true;
        //     state.error = null;
        // });
        // builder.addCase(signUpWithEmail.fulfilled, (state, action) => {
        //     state.loading = false;
        //     state.user = action.payload;
        // });
        // builder.addCase(signUpWithEmail.rejected, (state, action) => {
        //     state.loading = false;
        //     state.error = action.error.message;
        // });
    },
});

// export const {} = authSlice.actions;
export default authSlice.reducer;
