import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ParticipantProvider } from "./contexts/ParticipantContext";
import { HistoryProvider } from "./contexts/HistoryContext";
import { SettingsProvider } from "./contexts/SettingsContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <SettingsProvider>
      <HistoryProvider>
        <ParticipantProvider>
          <App />
        </ParticipantProvider>
      </HistoryProvider>
    </SettingsProvider>
  </React.StrictMode>,
);
