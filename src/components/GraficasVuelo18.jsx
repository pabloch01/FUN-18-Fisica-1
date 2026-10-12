import { useEffect, useState } from "react";
import Papa from "papaparse";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceArea,
  ReferenceLine,
} from "recharts";

/*
  Requisitos:  npm install recharts papaparse
  Datos:       copiar vuelo18_procesado.csv a public/data/vuelo18_procesado.csv
  Fuente:      Rodrigues et al. (2020), https://doi.org/10.1184/R1/12683453
*/

const CSV_URL = `${import.meta.env?.BASE_URL ?? "/"}data/vuelo18_procesado.csv`;

const COLOR = {
  este: "#1f5fa8",
  norte: "#c4562a",
  vertical: "#2f7d5b",
  modulo: "#333333",
  ascDesc: "#c9d6e8",
  tramo: "#e8e3d2",
};

// Fases del vuelo identificadas en los datos (segundos)
const FASES = [
  { nombre: "Ascenso", a: 9.69, b: 18.1, color: COLOR.ascDesc },
  { nombre: "Tramo 1", a: 19.7, b: 54.9, color: COLOR.tramo },
  { nombre: "Tramo 2", a: 57.8, b: 107.5, color: COLOR.tramo },
  { nombre: "Tramo 3", a: 110.1, b: 141.8, color: COLOR.tramo },
  { nombre: "Descenso", a: 142.9, b: 164.6, color: COLOR.ascDesc },
];

const T_MAX = 170.2;
const fmt = (v, d = 2) => (typeof v === "number" ? v.toFixed(d) : v);

function Fases({ yAxisId }) {
  return FASES.map((f) => (
    <ReferenceArea
      key={f.nombre}
      x1={f.a}
      x2={f.b}
      yAxisId={yAxisId}
      fill={f.color}
      fillOpacity={0.55}
      stroke="none"
      ifOverflow="hidden"
    />
  ));
}

function Panel({ titulo, children, nota }) {
  return (
    <figure style={{ margin: 0 }}>
      <figcaption style={{ fontWeight: 600, marginBottom: 6 }}>{titulo}</figcaption>
      {children}
      {nota && <p style={{ fontSize: 12, color: "#555", margin: "6px 0 0" }}>{nota}</p>}
    </figure>
  );
}

const ejeTiempo = {
  type: "number",
  dataKey: "t",
  domain: [0, T_MAX],
  ticks: [0, 20, 40, 60, 80, 100, 120, 140, 160],
  label: { value: "Tiempo [s]", position: "insideBottom", offset: -4 },
  tick: { fontSize: 12 },
};

export default function GraficasVuelo18() {
  const [datos, setDatos] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    Papa.parse(CSV_URL, {
      download: true,
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (r) => setDatos(r.data),
      error: (e) => setError(e.message),
    });
  }, []);

  if (error) return <p role="alert">No se pudo cargar el archivo de datos: {error}</p>;
  if (!datos) return <p>Cargando datos del vuelo 18…</p>;

  const tooltipTiempo = {
    labelFormatter: (t) => `t = ${fmt(t, 1)} s`,
    formatter: (v, nombre) => [fmt(v), nombre],
  };
  const alto = 300;

  return (
    <section aria-label="Gráficas del vuelo 18 de un dron de reparto">

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
          gap: 28,
        }}
      >
        {/* (a) Trayectoria */}
        <Panel titulo="(a) Trayectoria en el plano horizontal">
          <ResponsiveContainer width="100%" aspect={1}>
            <ScatterChart margin={{ top: 8, right: 16, bottom: 28, left: 8 }}>
              <CartesianGrid strokeOpacity={0.25} />
              <XAxis
                type="number"
                dataKey="E"
                domain={[-60, 150]}
                ticks={[-50, 0, 50, 100, 150]}
                label={{ value: "Este [m]", position: "insideBottom", offset: -14 }}
                tick={{ fontSize: 12 }}
              />
              <YAxis
                type="number"
                dataKey="N"
                domain={[-125, 85]}
                ticks={[-100, -50, 0, 50]}
                label={{ value: "Norte [m]", angle: -90, position: "insideLeft" }}
                tick={{ fontSize: 12 }}
              />
              <Tooltip
                cursor={false}
                formatter={(v, n) => [`${fmt(v, 1)} m`, n]}
                labelFormatter={() => "Posición"}
              />
              <Scatter
                name="Trayectoria"
                data={datos}
                line={{ stroke: COLOR.este, strokeWidth: 2 }}
                lineType="joint"
                shape={() => null}
                isAnimationActive={false}
              />
              <ReferenceLine x={0} stroke="#999" strokeDasharray="3 3" />
              <ReferenceLine y={0} stroke="#999" strokeDasharray="3 3" />
            </ScatterChart>
          </ResponsiveContainer>
        </Panel>

        {/* (b) Posición vertical y distancia recorrida */}
        <Panel titulo="(b) Posición vertical y distancia recorrida">
          <ResponsiveContainer width="100%" height={alto + 40}>
            <LineChart data={datos} margin={{ top: 8, right: 12, bottom: 28, left: 8 }}>
              <CartesianGrid strokeOpacity={0.25} />
              <XAxis {...ejeTiempo} />
              <YAxis
                yAxisId="alt"
                domain={[-2, 26]}
                tick={{ fontSize: 12 }}
                label={{ value: "Altitud [m]", angle: -90, position: "insideLeft", fill: COLOR.vertical }}
              />
              <YAxis
                yAxisId="dist"
                orientation="right"
                domain={[-20, 500]}
                tick={{ fontSize: 12 }}
                label={{ value: "Distancia recorrida [m]", angle: 90, position: "insideRight", fill: COLOR.norte }}
              />
              <Fases yAxisId="alt" />
              <Tooltip {...tooltipTiempo} />
              <Legend verticalAlign="top" height={28} />
              <Line yAxisId="alt" dataKey="h" name="Altitud sobre el despegue" stroke={COLOR.vertical} strokeWidth={2} dot={false} isAnimationActive={false} />
              <Line yAxisId="dist" dataKey="s" name="Distancia recorrida" stroke={COLOR.norte} strokeWidth={2} dot={false} isAnimationActive={false} />
            </LineChart>
          </ResponsiveContainer>
        </Panel>

        {/* (c) Velocidad */}
        <Panel titulo="(c) Velocidad">
          <ResponsiveContainer width="100%" height={alto + 40}>
            <LineChart data={datos} margin={{ top: 8, right: 12, bottom: 28, left: 8 }}>
              <CartesianGrid strokeOpacity={0.25} />
              <XAxis {...ejeTiempo} />
              <YAxis
                yAxisId="v"
                domain={[-4.5, 5]}
                tick={{ fontSize: 12 }}
                label={{ value: "Velocidad [m/s]", angle: -90, position: "insideLeft" }}
              />
              <Fases yAxisId="v" />
              <ReferenceLine yAxisId="v" y={4} stroke="#888" strokeDasharray="5 4" label={{ value: "4 m/s programada", position: "insideTopRight", fontSize: 11, fill: "#666" }} />
              <Tooltip {...tooltipTiempo} />
              <Legend verticalAlign="top" height={44} />
              <Line yAxisId="v" dataKey="vE" name="vE (Este)" stroke={COLOR.este} strokeWidth={1} dot={false} isAnimationActive={false} />
              <Line yAxisId="v" dataKey="vN" name="vN (Norte)" stroke={COLOR.norte} strokeWidth={1} dot={false} isAnimationActive={false} />
              <Line yAxisId="v" dataKey="vUp" name="v vertical (arriba +)" stroke={COLOR.vertical} strokeWidth={1} dot={false} isAnimationActive={false} />
              <Line yAxisId="v" dataKey="speed" name="Rapidez horizontal |v|" stroke={COLOR.modulo} strokeWidth={2} dot={false} isAnimationActive={false} />
            </LineChart>
          </ResponsiveContainer>
        </Panel>

        {/* (d) Aceleración */}
        <Panel
          titulo="(d) Aceleración (derivada de la velocidad)"
          nota="Calculada derivando la velocidad suavizada con una media móvil de 5 muestras."
        >
          <ResponsiveContainer width="100%" height={alto + 40}>
            <LineChart data={datos} margin={{ top: 8, right: 12, bottom: 28, left: 8 }}>
              <CartesianGrid strokeOpacity={0.25} />
              <XAxis {...ejeTiempo} />
              <YAxis
                yAxisId="a"
                domain={[-4.5, 3.5]}
                tick={{ fontSize: 12 }}
                label={{ value: "Aceleración [m/s²]", angle: -90, position: "insideLeft" }}
              />
              <Fases yAxisId="a" />
              <Tooltip {...tooltipTiempo} />
              <Legend verticalAlign="top" height={28} />
              <Line yAxisId="a" dataKey="aE" name="aE (Este)" stroke={COLOR.este} strokeWidth={1} dot={false} isAnimationActive={false} />
              <Line yAxisId="a" dataKey="aN" name="aN (Norte)" stroke={COLOR.norte} strokeWidth={1} dot={false} isAnimationActive={false} />
              <Line yAxisId="a" dataKey="aUp" name="a vertical (arriba +)" stroke={COLOR.vertical} strokeWidth={1} dot={false} isAnimationActive={false} />
            </LineChart>
          </ResponsiveContainer>
        </Panel>
      </div>

      <p style={{ fontSize: 13, color: "#444", marginTop: 16 }}>
        <strong>Figura 1.</strong> Perfiles de posición, velocidad y aceleración del vuelo 18 de un dron
        de reparto. <em>Nota.</em> Datos de Rodrigues et al. (2020), licencia CC BY 4.0, modificados por el autor. Procesamiento propio: coordenadas
        locales desde el punto de despegue, velocidad rotada al marco Este–Norte con el yaw medido y
        aceleración obtenida derivando la velocidad. La altitud proviene del GNSS (precisión vertical del
        sensor: ±5 m). Las franjas sombreadas marcan las fases del vuelo.
      </p>
    </section>
  );
}
