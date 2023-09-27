import React from "react";
import ReactDOM from "react-dom/client";
import { NextUIProvider } from "@nextui-org/react";
import "./index.css";
import "./i18n.tsx";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes/index.ts";
import { ErrorBoundary } from "react-error-boundary";
import { AuthProvider } from "react-auth-kit";
import { ToastProvider } from "./context/Toast.context.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ErrorBoundary fallback={<h1>Something went wronngs</h1>}>
      <NextUIProvider>
        <AuthProvider
          authType="cookie"
          authName={"_auth"}
          cookieDomain={window.location.hostname}
          cookieSecure={window.location.protocol === "https:"}
        >
          <ToastProvider>
            <RouterProvider router={router} />
          </ToastProvider>
        </AuthProvider>
      </NextUIProvider>
    </ErrorBoundary>
  </React.StrictMode>,
);
