// src/main.jsx
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./pages/App.jsx";

// 전역 오류가 나면 화면에 표시
window.addEventListener("error", (e) => {
  const el = document.getElementById("boot-error");
  if (el) el.textContent = `JS Error: ${e.message}`;
});
window.addEventListener("unhandledrejection", (e) => {
  const el = document.getElementById("boot-error");
  if (el) el.textContent = `Promise Error: ${e.reason?.message || e.reason}`;
});

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
