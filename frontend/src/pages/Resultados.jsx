import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { api } from "../api.js";

export default function Resultados() {
  const { id } = useParams();
  const [datos, setDatos] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .resultados(id)
      .then(setDatos)
      .catch((e) => setError(e.message));
  }, [id]);

  if (!datos) return error ? <p role="alert">{error}</p> : <p>Cargando…</p>;

  return (
    <>
      <h1>Resultados: {datos.titulo}</h1>
      <p>
        <strong>{datos.totalRespuestas}</strong> respuestas ·{" "}
        <Link to={`/encuestas/${id}`}>Editar encuesta</Link>
      </p>

      {datos.totalRespuestas === 0 ? (
        <p>
          Todavía no hay respuestas. Comparte el enlace público para empezar a
          recibirlas.
        </p>
      ) : (
        datos.preguntas.map((p) => (
          <section key={p.preguntaId} style={{ marginBottom: "2rem" }}>
            <h2 style={{ fontSize: "1.1rem" }}>{p.texto}</h2>
            <ResultadoPregunta tipo={p.tipo} resultado={p.resultado} />
          </section>
        ))
      )}
    </>
  );
}

// Elige cómo mostrar el resultado según el tipo de pregunta.
function ResultadoPregunta({ tipo, resultado }) {
  if (tipo === "Escala1a5") {
    // La API manda la distribución como objeto { "1": 0, "2": 3, ... }; Recharts necesita una lista.
    const barras = Object.entries(resultado.distribucion).map(
      ([valor, cantidad]) => ({ valor, cantidad }),
    );
    return (
      <>
        <p>
          Promedio:{" "}
          <strong style={{ fontSize: "1.5rem" }}>{resultado.promedio}</strong> /
          5
        </p>
        <Barras datos={barras} />
      </>
    );
  }

  if (tipo === "SiNo") {
    const total = resultado.si + resultado.no;
    const porcentaje = (n) => (total === 0 ? 0 : Math.round((n / total) * 100));
    return (
      <>
        <p>
          Sí: {resultado.si} ({porcentaje(resultado.si)} %) · No: {resultado.no}{" "}
          ({porcentaje(resultado.no)} %)
        </p>
        <Barras
          datos={[
            { valor: "Sí", cantidad: resultado.si },
            { valor: "No", cantidad: resultado.no },
          ]}
        />
      </>
    );
  }

  if (resultado.comentarios.length === 0) return <p>Sin comentarios.</p>;
  return (
    <ul>
      {resultado.comentarios.map((c, i) => (
        <li key={i}>{c}</li>
      ))}
    </ul>
  );
}

// Gráfica de barras sencilla: una barra por valor, con la cantidad encima.
function Barras({ datos }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={datos} margin={{ top: 20, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid vertical={false} stroke="#e5e5e5" />
        <XAxis dataKey="valor" tickLine={false} />
        <YAxis
          allowDecimals={false}
          tickLine={false}
          axisLine={false}
          width={32}
        />
        <Tooltip
          formatter={(n) => [n, "Respuestas"]}
          cursor={{ fill: "#f2f2f2" }}
        />
        <Bar
          dataKey="cantidad"
          fill="#2a6fdb"
          radius={[4, 4, 0, 0]}
          maxBarSize={48}
        >
          <LabelList dataKey="cantidad" position="top" />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
