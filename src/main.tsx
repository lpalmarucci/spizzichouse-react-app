import React from "react";
import ReactDOM from "react-dom/client";
import { NextUIProvider } from "@nextui-org/react";
import "./index.css";
import "./i18n.tsx";
import { Router, RouterProvider } from "react-router-dom";
import { router } from "./routes/index.ts";
import { ErrorBoundary } from "react-error-boundary";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ErrorBoundary fallback={<h1>Something went wronngs</h1>}>
      <NextUIProvider>
        <RouterProvider router={router} />
      </NextUIProvider>
    </ErrorBoundary>
  </React.StrictMode>,
);
