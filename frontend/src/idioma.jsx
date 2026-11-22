import { createContext, useContext, useEffect, useState } from "react";
import { textos } from "./textos.js";

const IdiomaContext = createContext(null);

// Guarda el idioma elegido y lo comparte con toda la app.
export function IdiomaProvider({ children }) {
  const [idioma, setIdioma] = useState(
    () => localStorage.getItem("idioma") ?? (navigator.language.startsWith("en") ? "en" : "es")
  );

  useEffect(() => {
    document.documentElement.lang = idioma;
    localStorage.setItem("idioma", idioma);
  }, [idioma]);

  // t("clave", { n: 3 }) devuelve el texto traducido y reemplaza {n}. Si la clave no existe, devuelve el texto tal cual.
  function t(clave, valores = {}) {
    const texto = textos[idioma][clave] ?? clave;
    return texto.replace(/\{(\w+)\}/g, (_, nombre) => valores[nombre] ?? "");
  }

  return <IdiomaContext.Provider value={{ idioma, setIdioma, t }}>{children}</IdiomaContext.Provider>;
}

export const useIdioma = () => useContext(IdiomaContext);