import { configureStore } from "@reduxjs/toolkit";
import themeReducer from "./slices/themeSlice";
import authReducer from "./slices/authSlice";
import userReducer from "./slices/userSlice";

const store = configureStore({
    reducer: {
        auth: authReducer,
        user: userReducer,
        theme: themeReducer,
    },
});

export default store;
