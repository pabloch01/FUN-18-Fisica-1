import { useEffect, useMemo, useRef, useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
} from "recharts";

/*
  Simulación interactiva: salto de un personaje (caída libre y tiro parabólico).
  Requisito:  npm install recharts

  Modelo (Serway y Jewett, 2018; enfoque de diseño de Pittman, 2016):
    y(t) = v0·t − ½·g·t²           (subida, con vx constante)
    ápice:  t_ap = v0/g,  h = v0²/(2g)
    diseño: dados h y t_ap →  g = 2h/t_ap²,  v0 = 2h/t_ap
    bajada: desde el reposo con g_bajada = k·g  →  t_bajada = √(2h/(k·g))
*/

/* ------------------------------------------------------------------ */
/* Física (funciones puras, exportadas para poder probarlas)            */
/* ------------------------------------------------------------------ */

export const G_REF = 9.80665; // m/s², gravedad estándar
const DT = 1 / 60; // s, paso de la integración numérica

export function calcularSalto({ v0, g, k = 1, vx = 0 }) {
  const tAp = v0 / g;
  const h = (v0 * v0) / (2 * g);
  const gBajada = k * g;
  const tBajada = Math.sqrt((2 * h) / gBajada);
  const T = tAp + tBajada;
  return { v0, g, k, vx, h, tAp, tBajada, T, alcance: vx * T, vAterrizaje: Math.sqrt(2 * gBajada * h) };
}

export function desdeDiseno(h, tAp) {
  return { g: (2 * h) / (tAp * tAp), v0: (2 * h) / tAp };
}

export function alturaEn(t, p) {
  if (t <= 0) return 0;
  if (t <= p.tAp) return p.v0 * t - 0.5 * p.g * t * t;
  const s = t - p.tAp;
  return Math.max(0, p.h - 0.5 * p.k * p.g * s * s);
}

// Integración numérica: Euler semi-implícito (primero la velocidad, luego la posición)
export function nuevoEstado(p) {
  return { t: 0, x: 0, y: 0, vy: p.v0, maxY: 0, tApNum: null, aterrizo: false, TNum: null };
}

export function pasoEuler(e, p, dt = DT) {
  if (e.aterrizo) return e;
  const vPrev = e.vy;
  const yPrev = e.y;
  const a = e.vy > 0 ? p.g : p.k * p.g; // la gravedad cambia según suba o baje
  e.vy -= a * dt;
  e.y += e.vy * dt;
  e.x += p.vx * dt;
  e.t += dt;
  if (e.tApNum === null && vPrev > 0 && e.vy <= 0) {
    e.tApNum = e.t - dt + (dt * vPrev) / (vPrev - e.vy); // interpolación lineal del cruce por cero
  }
  if (e.y > e.maxY) e.maxY = e.y;
  if (e.y <= 0) {
    const frac = yPrev / (yPrev - e.y);
    e.TNum = e.t - dt + dt * frac;
    e.y = 0;
    e.x = p.vx * e.TNum;
    e.aterrizo = true;
  }
  return e;
}

export function simularNumerico(p, dt = DT) {
  const e = nuevoEstado(p);
  let n = 0;
  while (!e.aterrizo && n < 200000) {
    pasoEuler(e, p, dt);
    n += 1;
  }
  return e;
}

/* ------------------------------------------------------------------ */
/* Utilidades de presentación                                           */
/* ------------------------------------------------------------------ */

const COLOR = { principal: "#1f5fa8", referencia: "#8a8a8a", personaje: "#2f7d5b", acento: "#c4562a", rejilla: "#d9d7cf" };

const fmt = (v, d = 2) => (Number.isFinite(v) ? v.toFixed(d).replace(".", ",") : "—");

const pasoTick = (ext) => {
  const raw = ext / 6;
  const pot = Math.pow(10, Math.floor(Math.log10(raw)));
  const n = raw / pot;
  return (n < 1.5 ? 1 : n < 3.5 ? 2 : n < 7.5 ? 5 : 10) * pot;
};

const ticksHasta = (ext) => {
  const paso = pasoTick(ext);
  const out = [];
  for (let v = 0; v <= ext + 1e-9; v += paso) out.push(Number(v.toFixed(6)));
  return out;
};

const CASOS = {
  A: { v0: 6.263, g: G_REF, k: 1 },
  B: { v0: 10, g: 25, k: 1 },
  C: { v0: 10, g: G_REF, k: 1 },
  D: { v0: 10, g: 25, k: 2 },
};

/* ------------------------------------------------------------------ */
/* Componente                                                           */
/* ------------------------------------------------------------------ */

export default function SimulacionSalto() {
  const [modo, setModo] = useState("fisico"); // "fisico" | "diseno"
  const [v0, setV0] = useState(10);
  const [g, setG] = useState(25);
  const [k, setK] = useState(1);
  const [vx, setVx] = useState(4);
  const [hDis, setHDis] = useState(2);
  const [tApDis, setTApDis] = useState(0.4);
  const [comparar, setComparar] = useState(true);
  const [vel, setVel] = useState(1);
  const [corriendo, setCorriendo] = useState(false);
  const [anim, setAnim] = useState(null);

  // Parámetros efectivos: se recalculan en vivo con cada cambio de control
  const p = useMemo(() => {
    if (modo === "diseno") {
      const d = desdeDiseno(hDis, tApDis);
      return calcularSalto({ v0: d.v0, g: d.g, k, vx });
    }
    return calcularSalto({ v0, g, k, vx });
  }, [modo, v0, g, k, vx, hDis, tApDis]);

  // Referencia: misma altura máxima, pero con g = 9,81 m/s²
  const ref = useMemo(
    () => calcularSalto({ v0: Math.sqrt(2 * G_REF * p.h), g: G_REF, k: 1, vx }),
    [p.h, vx]
  );

  const num = useMemo(() => simularNumerico(p), [p]);

  const est = useRef(null);
  const pRef = useRef(p);
  pRef.current = p;

  // Si cambia cualquier parámetro, se descarta la animación anterior
  useEffect(() => {
    setCorriendo(false);
    setAnim(null);
  }, [p.v0, p.g, p.k, p.vx]);

  useEffect(() => {
    if (!corriendo) return undefined;
    let raf;
    let ultimo = null;
    let acc = 0;
    const bucle = (ahora) => {
      if (ultimo === null) ultimo = ahora;
      acc += Math.min((ahora - ultimo) / 1000, 0.1) * vel;
      ultimo = ahora;
      const e = est.current;
      while (acc >= DT && !e.aterrizo) {
        pasoEuler(e, pRef.current, DT);
        acc -= DT;
      }
      setAnim({ t: e.t, x: e.x, y: e.y, aterrizo: e.aterrizo, maxY: e.maxY, TNum: e.TNum });
      if (e.aterrizo) {
        setCorriendo(false);
        return;
      }
      raf = requestAnimationFrame(bucle);
    };
    raf = requestAnimationFrame(bucle);
    return () => cancelAnimationFrame(raf);
  }, [corriendo, vel]);

  const saltar = () => {
    est.current = nuevoEstado(pRef.current);
    setAnim({ t: 0, x: 0, y: 0, aterrizo: false, maxY: 0, TNum: null });
    setCorriendo(true);
  };

  const cargarCaso = (id) => {
    const c = CASOS[id];
    setModo("fisico");
    setV0(c.v0);
    setG(c.g);
    setK(c.k);
  };

  /* ---------- Escena (SVG) ---------- */
  const W = 760;
  const H = 380;
  const M = { l: 54, r: 16, t: 16, b: 46 };
  const pw = W - M.l - M.r;
  const ph = H - M.t - M.b;
  const X_MIN = -0.4; // margen a la izquierda del origen (m): deja el personaje (0,5 m de ancho) dentro de la escena
  const xExt = Math.max(p.alcance, comparar ? ref.alcance : 0, 3) * 1.08 - X_MIN;
  const yExt = Math.max(p.h * 1.3, 1.5);
  const s = Math.min(pw / xExt, ph / yExt); // misma escala en x e y
  const X = (x) => M.l + (x - X_MIN) * s;
  const Y = (y) => M.t + ph - y * s;

  const trayectoria = (q) => {
    const pts = [];
    for (let i = 0; i <= 160; i += 1) {
      const t = (q.T * i) / 160;
      pts.push(`${X(q.vx * t).toFixed(1)},${Y(alturaEn(t, q)).toFixed(1)}`);
    }
    return pts.join(" ");
  };

  /* ---------- Gráfica y(t) ---------- */
  const datosYT = useMemo(() => {
    const Tmax = Math.max(p.T, comparar ? ref.T : 0);
    const tiempos = new Set([p.T, ref.T]);
    for (let i = 0; i <= 140; i += 1) tiempos.add((Tmax * i) / 140);
    return [...tiempos]
      .filter((t) => t <= Tmax + 1e-9)
      .sort((a, b) => a - b)
      .map((t) => ({
        t,
        y: t <= p.T + 1e-9 ? alturaEn(t, p) : null,
        yRef: comparar && t <= ref.T + 1e-9 ? alturaEn(t, ref) : null,
      }));
  }, [p, ref, comparar]);

  /* ---------- Estilos ---------- */
  const caja = { border: `1px solid ${COLOR.rejilla}`, borderRadius: 6, padding: 14, background: "#fff" };
  const fila = { display: "grid", gridTemplateColumns: "1fr auto", alignItems: "baseline", gap: 8, marginTop: 10 };
  const etiqueta = { fontSize: 13 };
  const valor = { fontVariantNumeric: "tabular-nums", fontWeight: 600, fontSize: 13 };
  const boton = { border: `1px solid ${COLOR.principal}`, background: "#fff", color: COLOR.principal, borderRadius: 4, padding: "6px 10px", cursor: "pointer", fontSize: 13 };
  const botonPrimario = { ...boton, background: COLOR.principal, color: "#fff" };
  const celda = { padding: "4px 8px", textAlign: "right", fontVariantNumeric: "tabular-nums", fontSize: 13, borderBottom: `1px solid ${COLOR.rejilla}` };
  const celdaIzq = { ...celda, textAlign: "left" };

  const enDiseno = modo === "diseno";

  return (
    <section aria-label="Simulación del salto de un personaje" style={{ display: "flex", flexWrap: "wrap", gap: 20 }}>
      {/* ---------------- Controles ---------------- */}
      <div style={{ ...caja, flex: "0 0 300px", maxWidth: "100%" }}>
        <fieldset style={{ border: "none", padding: 0, margin: 0 }}>
          <legend style={{ fontWeight: 600, marginBottom: 6 }}>Cómo definir el salto</legend>
          <label style={{ display: "block", fontSize: 13 }}>
            <input type="radio" name="modo" checked={!enDiseno} onChange={() => setModo("fisico")} /> Impulso y gravedad (v₀, g)
          </label>
          <label style={{ display: "block", fontSize: 13, marginTop: 4 }}>
            <input type="radio" name="modo" checked={enDiseno} onChange={() => setModo("diseno")} /> Diseño: altura y tiempo al ápice
          </label>
        </fieldset>

        <div style={{ marginTop: 14, opacity: enDiseno ? 0.45 : 1 }}>
          <div style={fila}>
            <label htmlFor="v0" style={etiqueta}>Impulso de salto v₀ [m/s]</label>
            <span style={valor}>{fmt(p.v0)}</span>
          </div>
          <input id="v0" type="range" min="2" max="14" step="0.01" value={v0} disabled={enDiseno} onChange={(e) => setV0(Number(e.target.value))} style={{ width: "100%" }} />

          <div style={fila}>
            <label htmlFor="g" style={etiqueta}>Gravedad g [m/s²]</label>
            <span style={valor}>{fmt(p.g)}</span>
          </div>
          <input id="g" type="range" min="1" max="30" step="0.01" value={g} disabled={enDiseno} onChange={(e) => setG(Number(e.target.value))} style={{ width: "100%" }} />
        </div>

        <div style={{ marginTop: 14, opacity: enDiseno ? 1 : 0.45 }}>
          <div style={fila}>
            <label htmlFor="hDis" style={etiqueta}>Altura del salto h [m]</label>
            <span style={valor}>{fmt(hDis)}</span>
          </div>
          <input id="hDis" type="range" min="0.5" max="6" step="0.05" value={hDis} disabled={!enDiseno} onChange={(e) => setHDis(Number(e.target.value))} style={{ width: "100%" }} />

          <div style={fila}>
            <label htmlFor="tAp" style={etiqueta}>Tiempo hasta el ápice t_ap [s]</label>
            <span style={valor}>{fmt(tApDis)}</span>
          </div>
          <input id="tAp" type="range" min="0.15" max="1.2" step="0.01" value={tApDis} disabled={!enDiseno} onChange={(e) => setTApDis(Number(e.target.value))} style={{ width: "100%" }} />
        </div>

        <div style={{ marginTop: 14 }}>
          <div style={fila}>
            <label htmlFor="k" style={etiqueta}>Factor de caída k (g_bajada = k·g)</label>
            <span style={valor}>{fmt(k)}</span>
          </div>
          <input id="k" type="range" min="1" max="3" step="0.05" value={k} onChange={(e) => setK(Number(e.target.value))} style={{ width: "100%" }} />

          <div style={fila}>
            <label htmlFor="vx" style={etiqueta}>Velocidad horizontal vₓ [m/s]</label>
            <span style={valor}>{fmt(vx)}</span>
          </div>
          <input id="vx" type="range" min="0" max="10" step="0.1" value={vx} onChange={(e) => setVx(Number(e.target.value))} style={{ width: "100%" }} />
        </div>

        <label style={{ display: "block", fontSize: 13, marginTop: 14 }}>
          <input type="checkbox" checked={comparar} onChange={(e) => setComparar(e.target.checked)} /> Comparar con la misma altura a g = 9,81 m/s²
        </label>

        <label htmlFor="vel" style={{ ...etiqueta, display: "block", marginTop: 12 }}>Velocidad de reproducción</label>
        <select id="vel" value={vel} onChange={(e) => setVel(Number(e.target.value))} style={{ marginTop: 4, fontSize: 13 }}>
          <option value={1}>Tiempo real (1×)</option>
          <option value={0.25}>Cámara lenta (0,25×)</option>
        </select>

        <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
          <button type="button" style={botonPrimario} onClick={saltar} disabled={corriendo}>Saltar</button>
          <button type="button" style={boton} onClick={() => { setCorriendo(false); setAnim(null); }}>Reiniciar</button>
        </div>

        <div style={{ marginTop: 16, fontSize: 12, color: "#555" }}>
          Casos de verificación:
          <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
            {Object.keys(CASOS).map((id) => (
              <button key={id} type="button" style={{ ...boton, padding: "3px 9px" }} onClick={() => cargarCaso(id)}>{id}</button>
            ))}
          </div>
        </div>
      </div>

      {/* ---------------- Escena y resultados ---------------- */}
      <div style={{ flex: "1 1 460px", minWidth: 0 }}>
        <div style={caja}>
          <svg viewBox={`0 0 ${W} ${H}`} width="100%" role="img" aria-label="Trayectoria del salto del personaje" style={{ display: "block" }}>
            {/* rejilla y ejes */}
            {ticksHasta(xExt + X_MIN).map((v) => (
              <g key={`x${v}`}>
                <line x1={X(v)} x2={X(v)} y1={M.t} y2={M.t + ph} stroke={COLOR.rejilla} strokeWidth="0.7" />
                <text x={X(v)} y={H - M.b + 16} fontSize="11" textAnchor="middle" fill="#555">{fmt(v, v % 1 ? 1 : 0)}</text>
              </g>
            ))}
            {ticksHasta(yExt).map((v) => (
              <g key={`y${v}`}>
                <line x1={M.l} x2={M.l + pw} y1={Y(v)} y2={Y(v)} stroke={COLOR.rejilla} strokeWidth="0.7" />
                <text x={M.l - 8} y={Y(v) + 4} fontSize="11" textAnchor="end" fill="#555">{fmt(v, v % 1 ? 1 : 0)}</text>
              </g>
            ))}
            <text x={M.l + pw / 2} y={H - 8} fontSize="12" textAnchor="middle" fill="#333">Distancia horizontal [m]</text>
            <text transform={`translate(14 ${M.t + ph / 2}) rotate(-90)`} fontSize="12" textAnchor="middle" fill="#333">Altura [m]</text>

            {/* suelo */}
            <line x1={M.l} x2={M.l + pw} y1={Y(0)} y2={Y(0)} stroke="#333" strokeWidth="1.5" />

            {/* trayectoria de referencia y trayectoria principal */}
            {comparar && <polyline points={trayectoria(ref)} fill="none" stroke={COLOR.referencia} strokeWidth="1.6" strokeDasharray="6 5" />}
            <polyline points={trayectoria(p)} fill="none" stroke={COLOR.principal} strokeWidth="2.4" />

            {/* ápice y aterrizaje (analíticos) */}
            <circle cx={X(p.vx * p.tAp)} cy={Y(p.h)} r="4" fill={COLOR.acento} />
            <text x={X(p.vx * p.tAp) + 8} y={Y(p.h) - 8} fontSize="11" fill={COLOR.acento}>h = {fmt(p.h)} m</text>
            <circle cx={X(p.alcance)} cy={Y(0)} r="3.5" fill="#333" />

            {/* personaje (0,5 m × 1,0 m) */}
            {(() => {
              const px = anim ? anim.x : 0;
              const py = anim ? anim.y : 0;
              return <rect x={X(px) - 0.25 * s} y={Y(py) - 1.0 * s} width={0.5 * s} height={1.0 * s} rx={Math.min(6, 0.15 * s)} fill={COLOR.personaje} />;
            })()}
          </svg>
          <div style={{ fontSize: 12, color: "#555", marginTop: 4 }}>
            Línea continua: salto con los parámetros elegidos. Línea punteada: misma altura máxima con g = 9,81 m/s². El personaje mide 1,0 m en la escena.
          </div>
        </div>

        <div style={{ ...caja, marginTop: 16, overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }} aria-live="polite">
            <thead>
              <tr>
                <th style={{ ...celdaIzq, fontWeight: 600 }}>Magnitud</th>
                <th style={{ ...celda, fontWeight: 600 }}>Salto elegido</th>
                {comparar && <th style={{ ...celda, fontWeight: 600 }}>Misma altura, g = 9,81</th>}
              </tr>
            </thead>
            <tbody>
              {[
                ["Gravedad de subida g [m/s²]", fmt(p.g), fmt(ref.g)],
                ["Impulso inicial v₀ [m/s]", fmt(p.v0), fmt(ref.v0)],
                ["Altura máxima h = v₀²/(2g) [m]", fmt(p.h), fmt(ref.h)],
                ["Tiempo hasta el ápice t_ap = v₀/g [s]", fmt(p.tAp, 3), fmt(ref.tAp, 3)],
                ["Tiempo total en el aire [s]", fmt(p.T, 3), fmt(ref.T, 3)],
                ["Alcance horizontal vₓ·T [m]", fmt(p.alcance), fmt(ref.alcance)],
                ["Rapidez al aterrizar [m/s]", fmt(p.vAterrizaje), fmt(ref.vAterrizaje)],
              ].map(([nombre, a, b]) => (
                <tr key={nombre}>
                  <td style={celdaIzq}>{nombre}</td>
                  <td style={celda}>{a}</td>
                  {comparar && <td style={celda}>{b}</td>}
                </tr>
              ))}
            </tbody>
          </table>

          <p style={{ fontSize: 13, margin: "12px 0 0" }}>
            <strong>Integración numérica</strong> (Euler semi-implícito, Δt = 1/60 s): h = {fmt(num.maxY, 3)} m
            (Δ = {fmt(num.maxY - p.h, 3)} m) y tiempo total = {fmt(num.TNum, 3)} s (Δ = {fmt(num.TNum - p.T, 3)} s) respecto a la solución analítica.
            {anim && anim.aterrizo && " La animación terminó en el mismo valor."}
          </p>
        </div>

        <div style={{ ...caja, marginTop: 16 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Altura contra tiempo</div>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={datosYT} margin={{ top: 8, right: 16, bottom: 28, left: 8 }}>
              <CartesianGrid strokeOpacity={0.25} />
              <XAxis type="number" dataKey="t" domain={[0, "dataMax"]} tickFormatter={(v) => fmt(v, 1)} tick={{ fontSize: 12 }} label={{ value: "Tiempo [s]", position: "insideBottom", offset: -14 }} />
              <YAxis domain={[0, "auto"]} tickFormatter={(v) => fmt(v, 1)} tick={{ fontSize: 12 }} label={{ value: "Altura [m]", angle: -90, position: "insideLeft" }} />
              <Tooltip labelFormatter={(t) => `t = ${fmt(t, 3)} s`} formatter={(v, nombre) => [`${fmt(v, 3)} m`, nombre]} />
              <Legend verticalAlign="top" height={28} />
              {anim && !anim.aterrizo && <ReferenceLine x={anim.t} stroke={COLOR.acento} strokeDasharray="3 3" />}
              <Line dataKey="y" name="Salto elegido" stroke={COLOR.principal} strokeWidth={2.4} dot={false} isAnimationActive={false} connectNulls={false} />
              {comparar && <Line dataKey="yRef" name="Misma altura, g = 9,81 m/s²" stroke={COLOR.referencia} strokeWidth={1.8} strokeDasharray="6 5" dot={false} isAnimationActive={false} connectNulls={false} />}
            </LineChart>
          </ResponsiveContainer>
        </div>

        <p style={{ fontSize: 12, color: "#555", marginTop: 12 }}>
          Modelo: y(t) = v₀t − ½gt²; h = v₀²/(2g); t_ap = v₀/g; en modo diseño g = 2h/t_ap² y v₀ = 2h/t_ap; bajada desde el reposo con
          g_bajada = k·g (Serway y Jewett, 2018; enfoque de diseño de saltos según Pittman, 2016).
        </p>
      </div>
    </section>
  );
}
