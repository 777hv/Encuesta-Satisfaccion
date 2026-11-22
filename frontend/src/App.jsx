import { Link, Route, Routes, useLocation } from "react-router-dom";
import ListaEncuestas from "./pages/ListaEncuestas.jsx";
import EditarEncuesta from "./pages/EditarEncuesta.jsx";
import Responder from "./pages/Responder.jsx";
import Resultados from "./pages/Resultados.jsx";
import { useTema } from "./tema.js";
import { useIdioma } from "./idioma.jsx";

export default function App() {
  // Quien responde ve la barra (para tema e idioma) pero sin enlace a la administración.
  const esPublica = useLocation().pathname.startsWith("/responder");
  const [tema, alternarTema] = useTema();
  const { idioma, setIdioma, t } = useIdioma();

  const marca = (
    <>
      <img src="/favicon.svg?v=2" alt="" width="24" height="24" />
      {t("marca")}
    </>
  );
  const textoTema = tema === "oscuro" ? t("tema.claro") : t("tema.oscuro");

  return (
    <>
      <header className="barra">
        <div className="barra-contenido">
          {esPublica ? <span className="marca">{marca}</span> : <Link to="/" className="marca">{marca}</Link>}

          <div className="barra-acciones">
            <button
              type="button"
              className="secundario boton-icono"
              onClick={() => setIdioma(idioma === "es" ? "en" : "es")}
              aria-label={`${idioma.toUpperCase()}: ${t("idioma.cambiar")}`}
              title={t("idioma.cambiar")}
            >
              {idioma.toUpperCase()}
            </button>
            <button
              type="button"
              className="secundario boton-icono"
              onClick={alternarTema}
              aria-label={textoTema}
              title={textoTema}
            >
              {tema === "oscuro" ? "☀" : "☾"}
            </button>
          </div>
        </div>
      </header>

      <main className="contenedor">
        <Routes>
          <Route path="/" element={<ListaEncuestas />} />
          <Route path="/encuestas/:id" element={<EditarEncuesta />} />
          <Route path="/encuestas/:id/resultados" element={<Resultados />} />
          <Route path="/responder/:id" element={<Responder />} />
          <Route path="*" element={<p>{t("noEncontrada")}</p>} />
        </Routes>
      </main>
    </>
  );
}