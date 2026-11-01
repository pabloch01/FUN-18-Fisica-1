import { useEffect, useState } from "react";
import Papa from "papaparse";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ReferenceDot } from "recharts";

/*
  Datos: public/data/voyager2_rapidez.csv, generado con scripts/voyager2_rapidez.py a partir de
  JPL Horizons (Voyager 2, -32; centro: Sol; vectores de velocidad cada 10 días; trayectoria Voyager_2_ST+refit2022_m).
  |v| = √(vx² + vy² + vz²) en km/s, marco eclíptico J2000.
*/

const CSV_URL = `${import.meta.env?.BASE_URL ?? "/"}data/voyager2_rapidez.csv`;
const COLOR = { linea: "#a99bff", encuentro: "#ff9a5c" };

// Fechas de máxima aproximación (NASA Science, 2026)
const ENCUENTROS = [
  { planeta: "Júpiter", fecha: "1979-07-09" },
  { planeta: "Saturno", fecha: "1981-08-26" },
  { planeta: "Urano", fecha: "1986-01-24" },
  { planeta: "Neptuno", fecha: "1989-08-25" },
];

const aAnio = (iso) => {
  const d = new Date(`${iso}T00:00:00Z`);
  const inicio = Date.UTC(d.getUTCFullYear(), 0, 1);
  const fin = Date.UTC(d.getUTCFullYear() + 1, 0, 1);
  return d.getUTCFullYear() + (d - inicio) / (fin - inicio);
};
const fmt = (v, d = 1) => (Number.isFinite(v) ? v.toFixed(d).replace(".", ",") : "—");
const MESES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
const fechaLarga = (iso) => {
  const [a, m, d] = iso.split("-").map(Number);
  return `${d} ${MESES[m - 1]} ${a}`;
};

export default function GraficaVoyagerTema9() {
  const [datos, setDatos] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    Papa.parse(CSV_URL, {
      download: true,
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (r) => setDatos(r.data.map((f) => ({ ...f, anio: aAnio(f.fecha) }))),
      error: (e) => setError(String(e)),
    });
  }, []);

  if (error) return <p role="alert">No se pudo cargar voyager2_rapidez.csv: {error}</p>;
  if (!datos) return <p>Cargando la rapidez de la Voyager 2…</p>;

  return (
    <figure style={{ margin: 0 }}>
      <figcaption style={{ fontWeight: 600, marginBottom: 6 }}>Rapidez de la Voyager 2 respecto al Sol, 1977–1990</figcaption>
      <ResponsiveContainer width="100%" height={430}>
        <LineChart data={datos} margin={{ top: 28, right: 24, bottom: 30, left: 8 }}>
          <CartesianGrid strokeOpacity={0.25} />
          <XAxis
            type="number"
            dataKey="anio"
            domain={[1977.5, 1990]}
            ticks={[1978, 1980, 1982, 1984, 1986, 1988, 1990]}
            tick={{ fontSize: 12 }}
            label={{ value: "Fecha [año]", position: "insideBottom", offset: -16 }}
          />
          <YAxis
            domain={[0, 40]}
            ticks={[0, 5, 10, 15, 20, 25, 30, 35, 40]}
            tick={{ fontSize: 12 }}
            label={{ value: "Rapidez respecto al Sol [km/s]", angle: -90, position: "insideLeft", style: { textAnchor: "middle" } }}
          />
          {ENCUENTROS.map((e) => (
            <ReferenceLine
              key={e.planeta}
              x={aAnio(e.fecha)}
              stroke={COLOR.encuentro}
              strokeDasharray="4 4"
              label={{ value: e.planeta, position: "top", fontSize: 12, fill: COLOR.encuentro }}
            />
          ))}
          <ReferenceDot x={datos[0].anio} y={datos[0].v} r={4} fill={COLOR.linea} stroke="none" label={{ value: `lanzamiento: ${fmt(datos[0].v)} km/s`, position: "right", fontSize: 11, fill: "#c8d2e8" }} />
          <Tooltip
            labelFormatter={(a) => {
              const f = datos.find((d) => Math.abs(d.anio - a) < 1e-6);
              return f ? fechaLarga(f.fecha) : fmt(a, 2);
            }}
            formatter={(v) => [`${fmt(v, 2)} km/s`, "Rapidez respecto al Sol"]}
          />
          <Line dataKey="v" name="Rapidez respecto al Sol" stroke={COLOR.linea} strokeWidth={2.4} dot={false} isAnimationActive={false} />
        </LineChart>
      </ResponsiveContainer>
      <p style={{ fontSize: 13, color: "#a9b6d3", margin: "6px 0 0" }}>
        <strong>Figura 7.</strong> Rapidez de la sonda Voyager 2 respecto al Sol entre agosto de 1977 y enero de 1990, con
        sus cuatro encuentros planetarios. <em>Nota.</em> Datos: vectores de velocidad heliocéntrica de JPL Horizons
        (Jet Propulsion Laboratory, 2026), cada 10 días, 452 puntos. Fechas de los encuentros: NASA Science (2026).
        Procesamiento propio: cálculo de la rapidez |v| = √(v<sub>x</sub>² + v<sub>y</sub>² + v<sub>z</sub>²).
      </p>
    </figure>
  );
}
