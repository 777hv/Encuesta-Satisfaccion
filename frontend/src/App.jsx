import { Link, Route, Routes, useLocation } from "react-router-dom";
import ListaEncuestas from "./pages/ListaEncuestas.jsx";
import EditarEncuesta from "./pages/EditarEncuesta.jsx";
import Responder from "./pages/Responder.jsx";

export default function App() {
  // Quien responde no debe ver el enlace a la administración.
  const esPublica = useLocation().pathname.startsWith("/responder");

  return (
    <main
      style={{
        maxWidth: 720,
        margin: "2rem auto",
        padding: "0 1rem",
        fontFamily: "system-ui",
      }}
    >
      {!esPublica && (
        <nav>
          <Link to="/">← Todas las encuestas</Link>
        </nav>
      )}

      <Routes>
        <Route path="/" element={<ListaEncuestas />} />
        <Route path="/encuestas/:id" element={<EditarEncuesta />} />
        <Route path="/responder/:id" element={<Responder />} />
        <Route path="*" element={<p>Página no encontrada.</p>} />
      </Routes>
    </main>
  );
}
