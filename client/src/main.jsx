import React from "react";
import ReactDOM from "react-dom/client";
import { AppRouter } from "./router";
import { AuthProvider } from "./contexts/AuthContext";
import { LoadingProvider } from "./contexts/LoadingContext";
import ThemeProviderWrapper from "./theme/ThemeProviderWrapper";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProviderWrapper>
      <AuthProvider>
        <LoadingProvider>
          <AppRouter />
        </LoadingProvider>
      </AuthProvider>
    </ThemeProviderWrapper>
  </React.StrictMode>
);
