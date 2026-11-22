import { useEffect, useState } from "react";

// El tema inicial lo pone el script de index.html (antes de que cargue React) para que la página no parpadee.
export function useTema() {
  const [tema, setTema] = useState(document.documentElement.dataset.tema);

  useEffect(() => {
    document.documentElement.dataset.tema = tema;
    localStorage.setItem("tema", tema);
  }, [tema]);

  const alternar = () => setTema(tema === "oscuro" ? "claro" : "oscuro");
  return [tema, alternar];
}
