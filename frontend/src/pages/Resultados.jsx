import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Bar, BarChart, CartesianGrid, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { api } from "../api.js";
import { useIdioma } from "../idioma.jsx";

export default function Resultados() {
  const { id } = useParams();
  const { t, idioma } = useIdioma();
  const [datos, setDatos] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let vigente = true;
    api
      .resultados(id, idioma)
      .then((d) => vigente && setDatos(d))
      .catch((e) => vigente && setError(e.message));
    return () => {
      vigente = false;
    };
  }, [id, idioma]);

  if (!datos)
    return error ? (
      <p role="alert">{t(error)}</p>
    ) : (
      <p className="texto-suave">{t("cargando")}</p>
    );

  return (
    <div data-estilo={datos.estilo}>
      <div className="encabezado">
        <div>
          <h1>{datos.titulo}</h1>
          <p className="texto-suave">{t("resultados.subtitulo")}</p>
        </div>
        <Link className="boton secundario" to={`/encuestas/${id}`}>
          {t("resultados.editar")}
        </Link>
      </div>

      <div className="metricas">
        <div>
          <div className="metrica-valor">{datos.totalRespuestas}</div>
          <div className="metrica-etiqueta">
            {t("resultados.respuestasTotales")}
          </div>
        </div>
        <div>
          <div className="metrica-valor">{datos.preguntas.length}</div>
          <div className="metrica-etiqueta">{t("resultados.preguntas")}</div>
        </div>
      </div>

      {datos.totalRespuestas === 0 ? (
        <p className="texto-suave">{t("resultados.sinRespuestas")}</p>
      ) : (
        datos.preguntas.map((p) => (
          <section key={p.preguntaId} className="resultado">
            <h2>{p.texto}</h2>
            <ResultadoPregunta tipo={p.tipo} resultado={p.resultado} />
          </section>
        ))
      )}
    </div>
  );
}

// Elige cómo mostrar el resultado según el tipo de pregunta.
function ResultadoPregunta({ tipo, resultado }) {
  const { t } = useIdioma();

  if (tipo === "Escala1a5") {
    // La API manda la distribución como objeto { "1": 0, "2": 3, ... }; Recharts necesita una lista.
    const barras = Object.entries(resultado.distribucion).map(
      ([valor, cantidad]) => ({ valor, cantidad }),
    );
    return (
      <>
        <p className="resumen">
          <span className="metrica-valor">{resultado.promedio.toFixed(1)}</span>
          <span className="texto-suave">{t("resultados.promedioDe5")}</span>
        </p>
        <Barras datos={barras} />
      </>
    );
  }

  if (tipo === "SiNo") {
    const total = resultado.si + resultado.no;
    const porcentajeSi =
      total === 0 ? 0 : Math.round((resultado.si / total) * 100);
    return (
      <>
        <p className="resumen">
          <span className="metrica-valor">{porcentajeSi} %</span>
          <span className="texto-suave">
            {t("resultados.respondieronSi", { si: resultado.si, total })}
          </span>
        </p>
        <Barras
          datos={[
            { valor: t("si"), cantidad: resultado.si },
            { valor: t("no"), cantidad: resultado.no },
          ]}
        />
      </>
    );
  }

  if (resultado.comentarios.length === 0)
    return <p className="texto-suave">{t("resultados.sinComentarios")}</p>;
  return (
    <>
      <ul className="comentarios">
        {resultado.comentarios.map((c, i) => (
          <li key={i}>{c}</li>
        ))}
      </ul>
      <p className="nota">{t("traduccion.automatica")}</p>
    </>
  );
}

// Gráfica de barras con los colores del tema (variables CSS), así funciona en modo claro y oscuro.
function Barras({ datos }) {
  const { t } = useIdioma();
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={datos} margin={{ top: 20, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid vertical={false} stroke="var(--linea)" />
        <XAxis dataKey="valor" tickLine={false} axisLine={{ stroke: "var(--linea-fuerte)" }}
          tick={{ fill: "var(--texto-suave)", fontSize: 13 }} />
        <YAxis allowDecimals={false} tickLine={false} axisLine={false} width={32}
          tick={{ fill: "var(--texto-suave)", fontSize: 13 }} />
        <Tooltip
          formatter={(n) => [n, t("resultados.respuestas")]}
          cursor={{ fill: "var(--superficie-sutil)" }}
          contentStyle={{ background: "var(--superficie)", border: "1px solid var(--linea)", borderRadius: 6, color: "var(--texto)" }}
        />
        <Bar dataKey="cantidad" fill="var(--grafica)" radius={[3, 3, 0, 0]} maxBarSize={44}>
          <LabelList dataKey="cantidad" position="top" fill="var(--texto)" fontSize={13} />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
