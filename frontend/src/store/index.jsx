import { configureStore } from "@reduxjs/toolkit";
import themeReducer from "./slices/themeSlice";
import authReducer from "./slices/authSlice";
import signinReducer from "./slices/signinSlice";

const store = configureStore({
    reducer: {
        // todo,
        auth: authReducer,
        signin: signinReducer,
        theme: themeReducer,
    },
});

export default store;
