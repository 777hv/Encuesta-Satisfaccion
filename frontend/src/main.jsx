import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./estilos.css";
import { BrowserRouter } from "react-router-dom";
import { IdiomaProvider } from "./idioma.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <IdiomaProvider>
        <App />
      </IdiomaProvider>
    </BrowserRouter>
  </React.StrictMode>
);