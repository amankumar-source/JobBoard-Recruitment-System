
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { Toaster } from "sonner";
import { Provider } from "react-redux";
import store from "./redux/store.js";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";

const persistor = persistStore(store);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />

        <Toaster
  position="top-center"
  duration={3000}
  closeButton={false}
  richColors={false}
  toastOptions={{
    style: {
      borderRadius: "14px",
      padding: "14px 20px",
      fontSize: "15px",
      fontWeight: "600",
      color: "#1f2937", // gray-800
      background: "linear-gradient(135deg, #ffffff, #fafafa)",
      boxShadow:
        "0 12px 30px rgba(168, 85, 247, 0.15), 0 4px 10px rgba(0,0,0,0.06)",
      border: "1px solid rgba(168, 85, 247, 0.25)",
    },

    success: {
      style: {
        background:
          "linear-gradient(135deg, #f5f3ff, #fdf2f8)", // light purple → pink
        color: "#5b21b6", // purple-800
        border: "1px solid #d8b4fe",
      },
    },

    error: {
      style: {
        background:
          "linear-gradient(135deg, #fef2f2, #fff1f2)",
        color: "#991b1b",
        border: "1px solid #fecaca",
      },
    },
  }}
/>

      </PersistGate>
    </Provider>
  </React.StrictMode>
);


