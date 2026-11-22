import { Link, Route, Routes, useLocation } from "react-router-dom";
import ListaEncuestas from "./pages/ListaEncuestas.jsx";
import EditarEncuesta from "./pages/EditarEncuesta.jsx";
import Responder from "./pages/Responder.jsx";
import Resultados from "./pages/Resultados.jsx";

export default function App() {
  // Quien responde no debe ver el enlace a la administración.
  const esPublica = useLocation().pathname.startsWith("/responder");

  return (
    <>
      {!esPublica && (
        <header className="barra">
          <div className="barra-contenido">
            <Link to="/" className="marca">
              Encuestas
            </Link>
          </div>
        </header>
      )}

      <main className="contenedor">
        <Routes>
          <Route path="/" element={<ListaEncuestas />} />
          <Route path="/encuestas/:id" element={<EditarEncuesta />} />
          <Route path="/encuestas/:id/resultados" element={<Resultados />} />
          <Route path="/responder/:id" element={<Responder />} />
          <Route
            path="*"
            element={
              <p>Esta página no existe. Vuelve a la lista de encuestas.</p>
            }
          />
        </Routes>
      </main>
    </>
  );
}
