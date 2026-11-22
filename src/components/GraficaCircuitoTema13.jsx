import { useEffect, useState } from "react";
import Papa from "papaparse";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceArea, ReferenceLine } from "recharts";

/*
  Datos: public/data/tema13_circuito.csv, generado con scripts/circuito_tema13.py.
  Camino del agua desde la salida de la CDU hasta la bandeja más alta del rack y de vuelta.
  x es una posición esquemática: cada tramo ocupa un ancho fijo en la gráfica (no su longitud real),
  para que se vean también los tramos cortos (conectores y microcanales).
*/

const CSV_URL = `${import.meta.env?.BASE_URL ?? "/"}data/tema13_circuito.csv`;
const COLOR = { v: "#33d1e6", p: "#f7c873", banda: "#1d3157", limite: "#4fd1a5" };
const fmt = (v, d = 2) => (Number.isFinite(v) ? v.toFixed(d).replace(".", ",") : "—");

// Límites de cada grupo de tramos en la escala esquemática (ver anchos en el script)
const GRUPOS = [
  { x0: 0, x1: 3, nombre: "Tubería" },
  { x0: 3, x1: 7, nombre: "Colector ↑" },
  { x0: 7, x1: 9, nombre: "Manguera" },
  { x0: 9, x1: 9.8, nombre: "QD" },
  { x0: 9.8, x1: 11.4, nombre: "Placa fría" },
  { x0: 11.4, x1: 12.2, nombre: "QD" },
  { x0: 12.2, x1: 14.2, nombre: "Manguera" },
  { x0: 14.2, x1: 18.2, nombre: "Colector ↓" },
  { x0: 18.2, x1: 21.2, nombre: "Tubería" },
];

function Separadores() {
  return GRUPOS.slice(1).map((g) => <ReferenceLine key={g.x0} x={g.x0} stroke="#3a4f86" strokeDasharray="3 3" />);
}

const ejeX = {
  type: "number",
  dataKey: "x",
  domain: [0, 21.2],
  ticks: GRUPOS.map((g) => (g.x0 + g.x1) / 2),
  tickFormatter: (x) => GRUPOS.find((g) => Math.abs((g.x0 + g.x1) / 2 - x) < 1e-6)?.nombre ?? "",
  interval: 0,
  tick: { fontSize: 11 },
  angle: -35,
  textAnchor: "end",
  height: 58,
};

const tooltip = {
  labelFormatter: (_, carga) => carga?.[0]?.payload?.tramo ?? "",
};

export default function GraficaCircuitoTema13() {
  const [datos, setDatos] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    Papa.parse(CSV_URL, {
      download: true,
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (r) => setDatos(r.data),
      error: (e) => setError(String(e)),
    });
  }, []);

  if (error) return <p role="alert">No se pudo cargar tema13_circuito.csv: {error}</p>;
  if (!datos) return <p>Cargando el cálculo del circuito…</p>;

  return (
    <section aria-label="Velocidad y presión a lo largo del circuito de enfriamiento líquido">
      <figure style={{ margin: "0 0 18px" }}>
        <figcaption style={{ fontWeight: 600, marginBottom: 6 }}>(a) Velocidad del agua en cada tramo</figcaption>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={datos} margin={{ top: 10, right: 24, bottom: 6, left: 8 }}>
            <CartesianGrid strokeOpacity={0.25} />
            <ReferenceArea y1={1.5} y2={2.5} fill={COLOR.limite} fillOpacity={0.12} stroke="none"
              label={{ value: "velocidad recomendada para agua de enfriamiento: 1,5–2,5 m/s", position: "insideTopRight", fontSize: 11, fill: COLOR.limite }} />
            {Separadores()}
            <XAxis {...ejeX} />
            <YAxis domain={[0, 4.5]} ticks={[0, 1, 2, 3, 4]} tick={{ fontSize: 12 }}
              label={{ value: "Velocidad v [m/s]", angle: -90, position: "insideLeft", style: { textAnchor: "middle" } }} />
            <Tooltip {...tooltip} formatter={(v) => [`${fmt(v)} m/s`, "Velocidad"]} />
            <Line dataKey="v_ms" stroke={COLOR.v} strokeWidth={2.4} dot={false} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </figure>

      <figure style={{ margin: 0 }}>
        <figcaption style={{ fontWeight: 600, marginBottom: 6 }}>(b) Presión manométrica del agua a lo largo del circuito</figcaption>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={datos} margin={{ top: 10, right: 24, bottom: 6, left: 8 }}>
            <CartesianGrid strokeOpacity={0.25} />
            {Separadores()}
            <XAxis {...ejeX} />
            <YAxis domain={[2.4, 3.05]} ticks={[2.4, 2.5, 2.6, 2.7, 2.8, 2.9, 3]} tickFormatter={(v) => fmt(v, 1)} tick={{ fontSize: 12 }}
              label={{ value: "Presión p [bar]", angle: -90, position: "insideLeft", style: { textAnchor: "middle" } }} />
            <Tooltip {...tooltip} formatter={(v) => [`${fmt(v, 3)} bar`, "Presión"]} />
            <Line dataKey="p_bar" stroke={COLOR.p} strokeWidth={2.4} dot={false} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </figure>
    </section>
  );
}
