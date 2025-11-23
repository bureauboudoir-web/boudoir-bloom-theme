import { createRoot } from "react-dom/client";
import * as Sentry from "@sentry/react";
import App from "./App.tsx";
import "./index.css";
import "./i18n/config";

// Initialize Sentry for error tracking
Sentry.init({
  dsn: "https://your-sentry-dsn@o0.ingest.sentry.io/0", // Replace with your actual Sentry DSN
  environment: import.meta.env.MODE,
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration({
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],
  // Performance Monitoring
  tracesSampleRate: import.meta.env.PROD ? 0.1 : 1.0,
  // Session Replay
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  // Only enable in production
  enabled: import.meta.env.PROD,
});

createRoot(document.getElementById("root")!).render(<App />);
