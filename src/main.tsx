import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import TrpcProvider from "./providers/trpc.tsx";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <TrpcProvider>
      <App />
    </TrpcProvider>
  </React.StrictMode>
);
