import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { NextUIProvider } from "@nextui-org/react";
import "./index.css";
import "./i18n.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <NextUIProvider>
      <main className="w-full h-[100dvh] dark text-foreground bg-background p-8 flex items-start justify-center">
        <App />
      </main>
    </NextUIProvider>
  </React.StrictMode>,
);
