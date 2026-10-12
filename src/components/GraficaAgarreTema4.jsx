import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceArea,
  ReferenceLine,
} from "recharts";

/*
  Requisito:  npm install recharts
  No necesita archivo de datos: la curva se calcula con la Ecuación 8.

  Fuente: Alcázar Vargas et al. (2022), Sensors, 22(17), Article 6380.
  μ_y(T) = μ_max + [1 − cosh((T − T_opt) / T_disp)]
  Tabla 4: T_opt = 88 °C, T_disp = 50 °C, μ_max = 1,1 (redondeado a 2 cifras).
  μ_max ≈ 1,07 se leyó del máximo del ajuste en la Figura 16 del artículo.
  Rango de los datos de la Figura 16: ≈ 50 a ≈ 101 °C.
*/

const MU_MAX = 1.07;
const T_OPT = 88;
const T_DISP = 50;
const T_MIN_DATOS = 50;
const T_MAX_DATOS = 101;
const T_MAX_GRAFICA = 114;
const FZ = 4000; // N, carga vertical del ensayo

const mu = (T) => MU_MAX + (1 - Math.cosh((T - T_OPT) / T_DISP));

// Ventana: μ ≥ fracción · μ_max  →  cosh(x) ≤ 1 + μ_max (1 − fracción)
const ventana = (fraccion) => {
  const x = Math.acosh(1 + MU_MAX * (1 - fraccion));
  return [T_OPT - x * T_DISP, T_OPT + x * T_DISP];
};
const V95 = ventana(0.95);
const V90 = ventana(0.9);

// Una serie para el rango con datos y otra para la extrapolación (se cruzan en T_MAX_DATOS)
const DATOS = [];
for (let T = T_MIN_DATOS; T <= T_MAX_GRAFICA + 1e-9; T += 0.5) {
  DATOS.push({
    T,
    modelo: T <= T_MAX_DATOS ? mu(T) : null,
    extrapolacion: T >= T_MAX_DATOS ? mu(T) : null,
  });
}

const fmt = (v, d = 2) => (typeof v === "number" ? v.toFixed(d).replace(".", ",") : v);

export default function GraficaAgarreTema4() {
  return (
    <figure style={{ margin: 0 }}>
      <figcaption style={{ fontWeight: 600, marginBottom: 6 }}>
        Agarre lateral de un neumático de calle según su temperatura
      </figcaption>

      <ResponsiveContainer width="100%" height={420}>
        <LineChart data={DATOS} margin={{ top: 8, right: 24, bottom: 30, left: 8 }}>
          <CartesianGrid strokeOpacity={0.25} />
          <XAxis
            type="number"
            dataKey="T"
            domain={[45, T_MAX_GRAFICA]}
            ticks={[50, 60, 70, 80, 90, 100, 110]}
            tick={{ fontSize: 12 }}
            label={{ value: "Temperatura promedio del neumático [°C]", position: "insideBottom", offset: -16 }}
          />
          <YAxis
            yAxisId="mu"
            domain={[0.7, 1.2]}
            ticks={[0.7, 0.8, 0.9, 1.0, 1.1, 1.2]}
            tickFormatter={(v) => fmt(v, 1)}
            tick={{ fontSize: 12 }}
            label={{ value: "Coeficiente de fricción lateral máximo μ_y [adimensional]", angle: -90, position: "insideLeft", style: { textAnchor: "middle" } }}
          />
          {/* Eje derecho: misma escala vertical expresada como fuerza (F = μ · F_z) */}
          <YAxis
            yAxisId="fuerza"
            orientation="right"
            domain={[0.7 * FZ, 1.2 * FZ]}
            ticks={[3000, 3500, 4000, 4500]}
            tick={{ fontSize: 12 }}
            label={{ value: `Fuerza lateral máxima con F_z = ${FZ} N [N]`, angle: 90, position: "insideRight", style: { textAnchor: "middle" } }}
          />

          <ReferenceArea yAxisId="mu" x1={V90[0]} x2={V90[1]} fill="#e8e3d2" fillOpacity={0.7} stroke="none" />
          <ReferenceArea yAxisId="mu" x1={V95[0]} x2={V95[1]} fill="#c9d6e8" fillOpacity={0.8} stroke="none" />
          <ReferenceLine
            yAxisId="mu"
            x={T_OPT}
            stroke="#c4562a"
            strokeDasharray="2 3"
            label={{ value: `T_opt = ${T_OPT} °C  ·  μ_max ≈ ${fmt(MU_MAX)}`, position: "insideTopRight", fontSize: 11, fill: "#c4562a" }}
          />

          <Tooltip
            labelFormatter={(T) => `T = ${fmt(T, 1)} °C`}
            formatter={(v, nombre) => [`μ_y = ${fmt(v, 3)}  (F_y,max ≈ ${Math.round(v * FZ)} N)`, nombre]}
          />
          <Legend verticalAlign="top" height={30} />

          <Line yAxisId="mu" dataKey="modelo" name="Modelo ajustado (datos: 50–101 °C)" stroke="#1f5fa8" strokeWidth={3} dot={false} isAnimationActive={false} connectNulls={false} />
          <Line yAxisId="mu" dataKey="extrapolacion" name="Extrapolación del modelo (sin datos)" stroke="#1f5fa8" strokeWidth={2} strokeDasharray="6 5" dot={false} isAnimationActive={false} connectNulls={false} />
        </LineChart>
      </ResponsiveContainer>

      <p style={{ fontSize: 13, color: "#444", margin: "8px 0 0" }}>
        <strong>Ventana de temperatura.</strong> μ ≥ 95 % de μ_max entre ≈ {Math.round(V95[0])} y ≈ {Math.round(V95[1])} °C
        (franja azul); μ ≥ 90 % entre ≈ {Math.round(V90[0])} y ≈ {Math.round(V90[1])} °C (franja beige). Los límites
        superiores quedan fuera del rango de los datos (≈ 101 °C), así que son extrapolación del modelo.
      </p>
      <p style={{ fontSize: 13, color: "#444", margin: "6px 0 0" }}>
        <strong>Figura 3.</strong> Coeficiente de fricción lateral máximo según la temperatura promedio del neumático.{" "}
        <em>Nota.</em> Curva calculada con la Ecuación 8 y la Tabla 4 de Alcázar Vargas et al. (2022), con μ_max ≈ 1,07
        leído de su Figura 16 (la tabla lo redondea a 1,1). Ensayo de banco con un neumático de calle (Austone Athena
        SP-6, 205/65 R15), 4 000 N, 60 km/h y ángulo de deriva de −8°; no es un neumático de F1.
      </p>
    </figure>
  );
}
