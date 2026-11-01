import { useEffect, useState } from "react";
import Papa from "papaparse";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

/*
  Datos: public/data/balance_tema6.csv, generado con scripts/modelo_tema6.py.
  Ciclo UDDS de la EPA (1 Hz) y parámetros del Renault Zoe ZE50 R135 del archivo de FASTSim 3.1.0 (NREL).
  Columnas (energía acumulada en Wh desde t = 0):
    trac  trabajo de tracción en las ruedas        fren  energía de frenado disponible en las ruedas
    recup recuperada en la batería                 perd_reg  pérdidas de conversión al regenerar
    fric  disipada en los frenos de fricción       aero, rod  trabajo contra el aire y la rodadura
*/

const CSV_URL = `${import.meta.env?.BASE_URL ?? "/"}data/balance_tema6.csv`;
const COLOR = {
  vel: "#c8d2e8",
  trac: "#e6ebf5",
  aero: "#8d9bbb",
  rod: "#d4c38f",
  fren: "#ff9a5c",
  recup: "#4fd1a5",
  perd: "#f2c46d",
  fric: "#ff6b6b",
};
const T_MAX = 1369;
const TICKS_T = [0, 200, 400, 600, 800, 1000, 1200, 1369];
const fmt = (v, d = 1) => (Number.isFinite(v) ? v.toFixed(d).replace(".", ",") : "—");

const ejeTiempo = {
  type: "number",
  dataKey: "t",
  domain: [0, T_MAX],
  ticks: TICKS_T,
  tick: { fontSize: 12 },
  label: { value: "Tiempo [s]", position: "insideBottom", offset: -14 },
};

function Panel({ titulo, children }) {
  return (
    <figure style={{ margin: "0 0 18px" }}>
      <figcaption style={{ fontWeight: 600, marginBottom: 6 }}>{titulo}</figcaption>
      {children}
    </figure>
  );
}

export default function GraficaFrenadoTema6() {
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

  if (error) return <p role="alert">No se pudo cargar balance_tema6.csv: {error}</p>;
  if (!datos) return <p>Cargando el balance de energía…</p>;

  const fin = datos[datos.length - 1];
  const tooltipWh = {
    labelFormatter: (t) => `t = ${t} s`,
    formatter: (v, nombre) => [`${fmt(v)} Wh`, nombre],
  };

  return (
    <section aria-label="Balance de energía del Renault Zoe en el ciclo urbano UDDS">
      <Panel titulo="(a) Velocidad del ciclo urbano UDDS">
        <ResponsiveContainer width="100%" height={190}>
          <LineChart data={datos} margin={{ top: 6, right: 24, bottom: 26, left: 8 }}>
            <CartesianGrid strokeOpacity={0.25} />
            <XAxis {...ejeTiempo} />
            <YAxis domain={[0, 100]} ticks={[0, 25, 50, 75, 100]} tick={{ fontSize: 12 }} label={{ value: "Velocidad [km/h]", angle: -90, position: "insideLeft", style: { textAnchor: "middle" } }} />
            <Tooltip labelFormatter={(t) => `t = ${t} s`} formatter={(v) => [`${fmt(v)} km/h`, "Velocidad"]} />
            <Line dataKey="v_kmh" name="Velocidad" stroke={COLOR.vel} strokeWidth={1.4} dot={false} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </Panel>

      <Panel titulo="(b) A dónde va el trabajo de tracción (energía acumulada en las ruedas)">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={datos} margin={{ top: 6, right: 24, bottom: 26, left: 8 }}>
            <CartesianGrid strokeOpacity={0.25} />
            <XAxis {...ejeTiempo} />
            <YAxis domain={[0, 1600]} ticks={[0, 400, 800, 1200, 1600]} tick={{ fontSize: 12 }} label={{ value: "Energía acumulada [Wh]", angle: -90, position: "insideLeft", style: { textAnchor: "middle" } }} />
            <Tooltip {...tooltipWh} />
            <Legend verticalAlign="top" height={30} />
            <Line dataKey="trac" name="Trabajo de tracción" stroke={COLOR.trac} strokeWidth={2.4} dot={false} isAnimationActive={false} />
            <Line dataKey="fren" name="Energía de frenado disponible" stroke={COLOR.fren} strokeWidth={2.4} dot={false} isAnimationActive={false} />
            <Line dataKey="rod" name="Contra la rodadura" stroke={COLOR.rod} strokeWidth={1.8} dot={false} isAnimationActive={false} />
            <Line dataKey="aero" name="Contra el aire" stroke={COLOR.aero} strokeWidth={1.8} dot={false} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </Panel>

      <Panel titulo="(c) Qué pasa con la energía de frenado (áreas apiladas: su suma es la curva naranja del panel b)">
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={datos} margin={{ top: 6, right: 24, bottom: 26, left: 8 }}>
            <CartesianGrid strokeOpacity={0.25} />
            <XAxis {...ejeTiempo} />
            <YAxis domain={[0, 700]} ticks={[0, 175, 350, 525, 700]} tick={{ fontSize: 12 }} label={{ value: "Energía acumulada [Wh]", angle: -90, position: "insideLeft", style: { textAnchor: "middle" } }} />
            <Tooltip {...tooltipWh} />
            <Legend verticalAlign="top" height={30} />
            <Area dataKey="recup" stackId="f" name="Recuperada en la batería" stroke={COLOR.recup} fill={COLOR.recup} fillOpacity={0.75} isAnimationActive={false} />
            <Area dataKey="perd_reg" stackId="f" name="Pérdidas de conversión (motor, transmisión, batería)" stroke={COLOR.perd} fill={COLOR.perd} fillOpacity={0.8} isAnimationActive={false} />
            <Area dataKey="fric" stackId="f" name="Disipada en los frenos de fricción" stroke={COLOR.fric} fill={COLOR.fric} fillOpacity={0.85} isAnimationActive={false} />
          </AreaChart>
        </ResponsiveContainer>
      </Panel>

      <p style={{ fontSize: 13, color: "#a9b6d3", margin: "4px 0 0" }}>
        <strong>Al final del ciclo:</strong> trabajo de tracción {fmt(fin.trac)} Wh = aire {fmt(fin.aero)} Wh + rodadura{" "}
        {fmt(fin.rod)} Wh + frenado {fmt(fin.fren)} Wh. De la energía de frenado, {fmt(fin.recup)} Wh (
        {fmt((100 * fin.recup) / fin.fren)} %) vuelven a la batería, {fmt(fin.perd_reg)} Wh (
        {fmt((100 * fin.perd_reg) / fin.fren)} %) se pierden en la conversión y {fmt(fin.fric)} Wh (
        {fmt((100 * fin.fric) / fin.fren)} %) se disipan en los frenos de fricción.
      </p>
      <p style={{ fontSize: 13, color: "#a9b6d3", margin: "6px 0 0" }}>
        <strong>Figura 5.</strong> Balance de energía de un Renault Zoe ZE50 R135 a lo largo del ciclo urbano UDDS.{" "}
        <em>Nota.</em> Perfil de velocidad: EPA (2026). Parámetros del vehículo: archivo del Zoe en FASTSim 3.1.0
        (National Renewable Energy Laboratory, s. f.). Cálculo propio segundo a segundo con P = (m·a + ½ρC<sub>d</sub>A·v² +
        C<sub>rr</sub>·m·g)·v; el modelo da 115,6 Wh/km frente a 116,2 Wh/km de FASTSim para el mismo ciclo.
      </p>
    </section>
  );
}
