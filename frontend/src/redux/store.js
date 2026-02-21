import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice";
import jobSlice from "./jobSlice";
import {
    persistStore,
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import companySlice from "./companySlice";
import applicationSlice from "./applicationSlice";

// Only persist auth — jobs, companies, and applications are always re-fetched fresh.
// Persisting them bloats localStorage and causes stale data issues.
const authPersistConfig = {
    key: "auth",
    version: 1,
    storage,
    whitelist: ["user"], // Only persist the user object, not loading flag
};

const rootReducer = combineReducers({
    auth: persistReducer(authPersistConfig, authSlice),
    job: jobSlice,
    company: companySlice,
    application: applicationSlice,
});

const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
});

export default store;