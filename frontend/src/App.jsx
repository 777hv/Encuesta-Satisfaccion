import { Link, Route, Routes, useLocation } from "react-router-dom";
import ListaEncuestas from "./pages/ListaEncuestas.jsx";
import EditarEncuesta from "./pages/EditarEncuesta.jsx";
import Responder from "./pages/Responder.jsx";
import Resultados from "./pages/Resultados.jsx";
import { useTema } from "./tema.js";

export default function App() {
  // Quien responde ve la barra (para cambiar el tema) pero sin enlace a la administración.
  const esPublica = useLocation().pathname.startsWith("/responder");
  const [tema, alternarTema] = useTema();

  return (
    <>
      <header className="barra">
        <div className="barra-contenido">
          {esPublica ? (
            <span className="marca">Encuestas</span>
          ) : (
            <Link to="/" className="marca">Encuestas</Link>
          )}
          <button type="button" onClick={alternarTema} aria-pressed={tema === "oscuro"}>
            {tema === "oscuro" ? "☀ Modo claro" : "☾ Modo oscuro"}
          </button>
        </div>
      </header>

      <main className="contenedor">
        <Routes>
          <Route path="/" element={<ListaEncuestas />} />
          <Route path="/encuestas/:id" element={<EditarEncuesta />} />
          <Route path="/encuestas/:id/resultados" element={<Resultados />} />
          <Route path="/responder/:id" element={<Responder />} />
          <Route path="*" element={<p>Esta página no existe. Vuelve a la lista de encuestas.</p>} />
        </Routes>
      </main>
    </>
  );
}
