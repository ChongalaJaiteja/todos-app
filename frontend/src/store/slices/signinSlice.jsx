import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: null,
};

const signinSlice = createSlice({
    name: "signin",
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
        },
    },
});

export const { setUser } = signinSlice.actions;
export default signinSlice.reducer;
