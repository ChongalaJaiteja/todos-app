import { combineReducers, configureStore } from "@reduxjs/toolkit";
import themeReducer from "./slices/themeSlice";
import authReducer from "./slices/authSlice";
import userReducer from "./slices/userSlice";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";

// Create persist configurations for the slices you want to persist

const userPersistConfig = {
    key: "user",
    storage,
};

// Combine reducers, applying persistence to selected slices
const rootReducer = combineReducers({
    user: persistReducer(userPersistConfig, userReducer),
    auth: authReducer,
    theme: themeReducer,
});

const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                // Ignore these action types
                ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
                // Optionally ignore paths in the state
                ignoredPaths: ["_persist"],
            },
        }),
});

const persistor = persistStore(store);

export { store, persistor };
