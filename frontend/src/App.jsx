import { Link, Route, Routes } from "react-router-dom";
import ListaEncuestas from "./pages/ListaEncuestas.jsx";

export default function App() {
  return (
    <main style={{ maxWidth: 720, margin: "2rem auto", padding: "0 1rem", fontFamily: "system-ui" }}>
      <nav>
        <Link to="/">← Todas las encuestas</Link>
      </nav>

      <Routes>
        <Route path="/" element={<ListaEncuestas />} />
        <Route path="*" element={<p>Página no encontrada.</p>} />
      </Routes>
    </main>
  );
}