import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../axios";

const initialState = {
    user: null,
    isLoading: false,
    isLoggedIn: false,
};

export const registerUser = createAsyncThunk(
    "user/register",
    async (userData, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            Object.keys(userData).forEach((key) =>
                formData.append(key, userData[key]),
            );

            const response = await axios.post("/v1/users/register", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            return response.data;
        } catch (error) {
            const message =
                error.response?.data?.message || "Error registering user";
            return rejectWithValue(message);
        }
    },
);

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        resetUser: (state) => {
            state.user = null;
            state.isLoggedIn = false;
        },
        setUser: (state, action) => {
            state.user = action.payload;
            state.isLoggedIn = true;
        },
    },

    extraReducers: (builder) => {
        builder.addCase(registerUser.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(registerUser.fulfilled, (state, action) => {
            state.isLoading = false;
            state.user = action.payload.data;
        });
        builder.addCase(registerUser.rejected, (state) => {
            state.isLoading = false;
        });
    },
});

export const { resetUser, setUser } = userSlice.actions;
export default userSlice.reducer;
