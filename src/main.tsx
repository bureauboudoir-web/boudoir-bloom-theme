import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "./i18n/config";

// Sentry can be initialized here with a real DSN after export
// import * as Sentry from "@sentry/react";
// Sentry.init({
//   dsn: "your-actual-sentry-dsn",
//   environment: import.meta.env.MODE,
//   enabled: import.meta.env.PROD,
// });

createRoot(document.getElementById("root")!).render(<App />);
