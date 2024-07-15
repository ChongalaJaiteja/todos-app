import { configureStore } from "@reduxjs/toolkit";

import themeReducer from "./slices/themeSlice";

const store = configureStore({
    reducer: {
        // todo,
        theme: themeReducer,
    },
});

export default store;
