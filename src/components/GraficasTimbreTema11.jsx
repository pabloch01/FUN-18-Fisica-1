import { useEffect, useState } from "react";
import Papa from "papaparse";
import { ResponsiveContainer, LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine } from "recharts";

/*
  Datos: public/data/tema11_onda.csv y public/data/tema11_espectro.csv, generados con scripts/sintesis_tema11.py
  a partir de las mismas señales que los dos audios (La3, f0 = 220 Hz).
  Forma de onda: dos períodos tomados a 1 s del inicio. Espectro: FFT de 1 s de señal, amplitud de cada armónico
  relativa a la fundamental.
*/

const BASE = import.meta.env?.BASE_URL ?? "/";
const COLOR = { suave: "#6aa8ff", hueco: "#ff7ac6" };
const NOMBRE = { suave: "Muestra A · timbre suave", hueco: "Muestra B · timbre hueco" };
const fmt = (v, d = 2) => (Number.isFinite(v) ? v.toFixed(d).replace(".", ",") : "—");

function useCsv(archivo) {
  const [estado, setEstado] = useState({ datos: null, error: null });
  useEffect(() => {
    Papa.parse(`${BASE}data/${archivo}`, {
      download: true,
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (r) => setEstado({ datos: r.data, error: null }),
      error: (e) => setEstado({ datos: null, error: String(e) }),
    });
  }, [archivo]);
  return estado;
}

export function GraficaOnda() {
  const { datos, error } = useCsv("tema11_onda.csv");
  if (error) return <p role="alert">No se pudo cargar tema11_onda.csv: {error}</p>;
  if (!datos) return <p>Cargando las formas de onda…</p>;
  return (
    <figure style={{ margin: 0 }}>
      <figcaption style={{ fontWeight: 600, marginBottom: 6 }}>Forma de onda: dos períodos de cada muestra</figcaption>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={datos} margin={{ top: 10, right: 24, bottom: 30, left: 8 }}>
          <CartesianGrid strokeOpacity={0.25} />
          <XAxis
            type="number"
            dataKey="t_ms"
            domain={[0, 9.1]}
            ticks={[0, 1, 2, 3, 4, 4.55, 6, 7, 8, 9.09]}
            tickFormatter={(v) => fmt(v, v === 4.55 || v === 9.09 ? 2 : 0)}
            tick={{ fontSize: 12 }}
            label={{ value: "Tiempo t [ms]", position: "insideBottom", offset: -16 }}
          />
          <YAxis domain={[-0.5, 0.5]} ticks={[-0.4, -0.2, 0, 0.2, 0.4]} tickFormatter={(v) => fmt(v, 1)} tick={{ fontSize: 12 }}
            label={{ value: "Presión sonora relativa", angle: -90, position: "insideLeft", style: { textAnchor: "middle" } }} />
          <ReferenceLine x={4.545} stroke="#f7c873" strokeDasharray="4 4" label={{ value: "T = 1/f₀ = 4,55 ms", position: "insideBottomRight", fontSize: 11, fill: "#f7c873" }} />
          <Tooltip labelFormatter={(t) => `t = ${fmt(t, 3)} ms`} formatter={(v, n) => [fmt(v, 3), NOMBRE[n]]} />
          <Legend verticalAlign="top" height={28} formatter={(n) => NOMBRE[n]} />
          <Line dataKey="suave" stroke={COLOR.suave} strokeWidth={2.2} dot={false} isAnimationActive={false} />
          <Line dataKey="hueco" stroke={COLOR.hueco} strokeWidth={2.2} dot={false} isAnimationActive={false} />
        </LineChart>
      </ResponsiveContainer>
    </figure>
  );
}

export function GraficaEspectro() {
  const { datos, error } = useCsv("tema11_espectro.csv");
  if (error) return <p role="alert">No se pudo cargar tema11_espectro.csv: {error}</p>;
  if (!datos) return <p>Cargando el contenido armónico…</p>;
  return (
    <figure style={{ margin: 0 }}>
      <figcaption style={{ fontWeight: 600, marginBottom: 6 }}>Contenido armónico: amplitud de cada armónico (relativa a la fundamental)</figcaption>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={datos} margin={{ top: 10, right: 24, bottom: 30, left: 8 }} barGap={1}>
          <CartesianGrid strokeOpacity={0.25} vertical={false} />
          <XAxis dataKey="f_hz" tick={{ fontSize: 11 }} interval={0} angle={-45} textAnchor="end" height={50}
            label={{ value: "Frecuencia [Hz] (armónico n · 220 Hz)", position: "insideBottom", offset: -24 }} />
          <YAxis domain={[0, 1]} ticks={[0, 0.25, 0.5, 0.75, 1]} tickFormatter={(v) => fmt(v, 2)} tick={{ fontSize: 12 }}
            label={{ value: "Amplitud relativa Aₙ / A₁", angle: -90, position: "insideLeft", style: { textAnchor: "middle" } }} />
          <Tooltip labelFormatter={(f) => `${f} Hz (armónico ${f / 220})`} formatter={(v, n) => [fmt(v, 3), NOMBRE[n]]} />
          <Legend verticalAlign="top" height={28} formatter={(n) => NOMBRE[n]} />
          <Bar dataKey="suave" fill={COLOR.suave} isAnimationActive={false} />
          <Bar dataKey="hueco" fill={COLOR.hueco} isAnimationActive={false} />
        </BarChart>
      </ResponsiveContainer>
    </figure>
  );
}
