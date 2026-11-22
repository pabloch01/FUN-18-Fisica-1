import { useEffect, useMemo, useRef, useState } from "react";

/*
  Tema 10 · Simulación de una animación con resorte (spring animation).
  Cada tarjeta es una masa m unida a su destino por un resorte de rigidez k con amortiguamiento c:
      m·x″ = −k·(x − destino) − c·x′
  Se integra con Runge-Kutta de 4.º orden a pasos de 1/240 s, en vivo, cada cuadro de animación.
  Las cuatro tarjetas comparten k y m; la primera usa la c elegida y las otras tres usan la c que da
  ζ = 0,3 (subamortiguado), ζ = 1 (crítico) y ζ = 2 (sobreamortiguado).
  Si se pulsa «Animar» a mitad del movimiento, el destino cambia pero cada tarjeta conserva su posición
  y su velocidad: así se comporta un resorte real y por eso la animación nunca «salta».
*/

const DT = 1 / 240; // s
const COLOR = { tuyo: "#ff7ac6", sub: "#6aa8ff", crit: "#4fd1a5", sobre: "#ff9a5c", rejilla: "#2a3a63", texto: "#9aa8c6" };
const fmt = (v, d = 2) => (Number.isFinite(v) ? v.toFixed(d).replace(".", ",") : "—");

const caja = { border: `1px solid ${COLOR.rejilla}`, borderRadius: 12, padding: 14, background: "#0e1528" };
const fila = { display: "grid", gridTemplateColumns: "1fr auto", alignItems: "baseline", gap: 8, marginTop: 10 };
const etiqueta = { fontSize: 13 };
const valor = { fontVariantNumeric: "tabular-nums", fontWeight: 600, fontSize: 13 };
const boton = { border: `1px solid ${COLOR.tuyo}`, background: "transparent", color: COLOR.tuyo, borderRadius: 6, padding: "6px 10px", cursor: "pointer", fontSize: 13 };
const botonPrimario = { ...boton, background: COLOR.tuyo, color: "#071022", fontWeight: 600 };

// Ajustes de partida con fuente: Framer Motion (Heckel, 2020) y el ejemplo de la documentación de Apple
const PRESETS = [
  { nombre: "Framer Motion (k 100, c 10, m 1)", k: 100, c: 10, m: 1 },
  { nombre: "SwiftUI duration 0,5 · bounce 0,3", k: 157.9, c: 17.6, m: 1 },
  { nombre: "Sin amortiguamiento (c = 0)", k: 100, c: 0, m: 1 },
  { nombre: "Muy amortiguado", k: 100, c: 50, m: 1 },
];

function Deslizador({ id, texto, valorTexto, ...props }) {
  return (
    <>
      <div style={fila}>
        <label htmlFor={id} style={etiqueta}>{texto}</label>
        <span style={valor}>{valorTexto}</span>
      </div>
      <input id={id} type="range" style={{ width: "100%" }} {...props} />
    </>
  );
}

// Aceleración del resorte amortiguado
const acel = (x, v, destino, k, c, m) => (-k * (x - destino) - c * v) / m;

// Un paso de Runge-Kutta 4 para el sistema (x, v)
function pasoRK4(s, destino, k, c, m, dt) {
  const a1 = acel(s.x, s.v, destino, k, c, m);
  const x2 = s.x + (s.v * dt) / 2, v2 = s.v + (a1 * dt) / 2;
  const a2 = acel(x2, v2, destino, k, c, m);
  const x3 = s.x + (v2 * dt) / 2, v3 = s.v + (a2 * dt) / 2;
  const a3 = acel(x3, v3, destino, k, c, m);
  const x4 = s.x + v3 * dt, v4 = s.v + a3 * dt;
  const a4 = acel(x4, v4, destino, k, c, m);
  return {
    x: s.x + (dt / 6) * (s.v + 2 * v2 + 2 * v3 + v4),
    v: s.v + (dt / 6) * (a1 + 2 * a2 + 2 * a3 + a4),
  };
}

// Respuesta completa desde el reposo en 0 hacia el destino 1, para la gráfica
function respuesta(k, c, m, tMax) {
  const puntos = [];
  let s = { x: 0, v: 0 };
  let tAsiento = 0;
  for (let i = 0, t = 0; t <= tMax + 1e-9; i++, t = i * DT) {
    if (i % 4 === 0) puntos.push([t, s.x]);
    if (Math.abs(s.x - 1) > 0.01) tAsiento = t;
    s = pasoRK4(s, 1, k, c, m, DT);
  }
  // Si sigue fuera de la banda del 1 % al final, no se asentó dentro de la ventana
  return { puntos, tAsiento: Math.abs(s.x - 1) > 0.01 ? Infinity : tAsiento };
}

export default function SimulacionResorte() {
  const [k, setK] = useState(100);
  const [c, setC] = useState(10);
  const [m, setM] = useState(1);
  const [destino, setDestino] = useState(0);
  const estados = useRef([0, 1, 2, 3].map(() => ({ x: 0, v: 0 })));
  const tarjetas = useRef([]);
  const raf = useRef(null);
  const ultimo = useRef(null);

  const cCrit = 2 * Math.sqrt(k * m);
  const zeta = c / cCrit;
  const w0 = Math.sqrt(k / m);
  const regimen = zeta < 0.995 ? "subamortiguado" : zeta > 1.005 ? "sobreamortiguado" : "crítico";
  const carriles = useMemo(
    () => [
      { nombre: "Tu resorte", c, color: COLOR.tuyo },
      { nombre: "ζ = 0,3 · subamortiguado", c: 0.3 * cCrit, color: COLOR.sub },
      { nombre: "ζ = 1 · crítico", c: cCrit, color: COLOR.crit },
      { nombre: "ζ = 2 · sobreamortiguado", c: 2 * cCrit, color: COLOR.sobre },
    ],
    [c, cCrit]
  );

  // Ventana de la gráfica: lo suficiente para ver asentarse al crítico y varias oscilaciones
  const tMax = Math.min(6, Math.max(1, 12 / w0));
  const curvas = useMemo(() => carriles.map((r) => respuesta(k, r.c, m, tMax)), [carriles, k, m, tMax]);

  // Bucle de animación: integra cada tarjeta en vivo hacia el destino actual
  useEffect(() => {
    const paso = (ahora) => {
      const dtReal = ultimo.current == null ? 0 : Math.min(0.05, (ahora - ultimo.current) / 1000);
      ultimo.current = ahora;
      let enMovimiento = false;
      const n = Math.round(dtReal / DT);
      estados.current.forEach((s, i) => {
        let e = s;
        for (let j = 0; j < n; j++) e = pasoRK4(e, destino, k, carriles[i].c, m, DT);
        estados.current[i] = e;
        if (Math.abs(e.x - destino) > 1e-4 || Math.abs(e.v) > 1e-3) enMovimiento = true;
        const el = tarjetas.current[i];
        if (el) el.style.left = `calc((100% - 56px) * ${(0.15 + 0.7 * e.x).toFixed(4)})`;
      });
      if (enMovimiento) raf.current = requestAnimationFrame(paso);
      else ultimo.current = null;
    };
    ultimo.current = null;
    raf.current = requestAnimationFrame(paso);
    return () => cancelAnimationFrame(raf.current);
  }, [destino, k, m, carriles]);

  const aplicar = (p) => { setK(p.k); setC(p.c); setM(p.m); };

  // Gráfica x(t)
  const W = 640, H = 240, M = { l: 44, r: 12, t: 12, b: 36 };
  const yMin = -0.6, yMax = 1.8;
  const sx = (t) => M.l + (t / tMax) * (W - M.l - M.r);
  const sy = (y) => M.t + ((yMax - Math.min(yMax, Math.max(yMin, y))) / (yMax - yMin)) * (H - M.t - M.b);
  const ticksT = Array.from({ length: 7 }, (_, i) => (tMax * i) / 6);

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
        <div style={caja}>
          <strong style={{ fontSize: 14 }}>Parámetros del resorte</strong>
          <Deslizador id="res-k" texto="Rigidez k [N/m]" valorTexto={fmt(k, 1)} min={10} max={400} step={0.1} value={k} onChange={(e) => setK(+e.target.value)} />
          <Deslizador id="res-c" texto="Amortiguamiento c [N·s/m]" valorTexto={fmt(c, 1)} min={0} max={80} step={0.1} value={c} onChange={(e) => setC(+e.target.value)} />
          <Deslizador id="res-m" texto="Masa m [kg]" valorTexto={fmt(m, 2)} min={0.2} max={5} step={0.05} value={m} onChange={(e) => setM(+e.target.value)} />
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 12 }}>
            {PRESETS.map((p) => (
              <button key={p.nombre} type="button" style={boton} onClick={() => aplicar(p)}>{p.nombre}</button>
            ))}
          </div>
        </div>
        <div style={caja} aria-live="polite">
          <strong style={{ fontSize: 14 }}>Lo que calcula la física</strong>
          <div style={fila}><span style={etiqueta}>Frecuencia natural ω₀ = √(k/m)</span><span style={valor}>{fmt(w0)} rad/s</span></div>
          <div style={fila}><span style={etiqueta}>Amortiguamiento crítico c<sub>c</sub> = 2√(k·m)</span><span style={valor}>{fmt(cCrit, 1)} N·s/m</span></div>
          <div style={fila}><span style={etiqueta}>Razón de amortiguamiento ζ = c / c<sub>c</sub></span><span style={valor}>{fmt(zeta, 3)}</span></div>
          <div style={fila}><span style={etiqueta}>Régimen</span><span style={{ ...valor, color: COLOR.tuyo }}>{regimen}</span></div>
          <div style={fila}><span style={etiqueta}>«bounce» equivalente de SwiftUI = 1 − ζ</span><span style={valor}>{zeta <= 1 ? fmt(1 - zeta) : "negativo"}</span></div>
          <div style={fila}>
            <span style={etiqueta}>Tiempo para quedar a ±1 % del destino</span>
            <span style={valor}>{Number.isFinite(curvas[0].tAsiento) ? `${fmt(curvas[0].tAsiento)} s` : `más de ${fmt(tMax, 1)} s`}</span>
          </div>
        </div>
      </div>

      <div style={caja}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
          <strong style={{ fontSize: 14 }}>Cuatro tarjetas, mismo k y m</strong>
          <button type="button" style={botonPrimario} onClick={() => setDestino((d) => (d === 0 ? 1 : 0))}>
            Animar {destino === 0 ? "→" : "←"}
          </button>
        </div>
        <div style={{ display: "grid", gap: 10, marginTop: 12 }}>
          {carriles.map((r, i) => (
            <div key={r.nombre}>
              <div style={{ fontSize: 12, color: COLOR.texto, marginBottom: 3 }}>
                {r.nombre}{i === 0 ? ` (ζ = ${fmt(zeta)})` : ""}
              </div>
              <div style={{ position: "relative", height: 34, borderRadius: 8, background: "#141d36", border: `1px dashed ${COLOR.rejilla}`, overflow: "hidden" }}>
                <div
                  ref={(el) => (tarjetas.current[i] = el)}
                  aria-hidden="true"
                  style={{ position: "absolute", top: 3, left: "calc((100% - 56px) * 0.15)", width: 56, height: 26, borderRadius: 6, background: r.color, boxShadow: `0 0 12px ${r.color}66` }}
                />
              </div>
            </div>
          ))}
        </div>
        <p style={{ margin: "10px 0 0", color: COLOR.texto, fontSize: 12 }}>
          Prueba pulsar «Animar» dos veces seguidas: cada tarjeta da media vuelta conservando su velocidad, sin saltos.
          Una animación por duración tendría que empezar de nuevo desde cero.
        </p>
      </div>

      <figure style={{ ...caja, margin: 0 }}>
        <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Posición contra tiempo de las cuatro tarjetas" style={{ width: "100%", height: "auto", display: "block" }}>
          <rect x={M.l} y={sy(1.01)} width={W - M.l - M.r} height={sy(0.99) - sy(1.01)} fill="#1d3157" />
          {[-0.5, 0, 0.5, 1, 1.5].map((y) => (
            <g key={y}>
              <line x1={M.l} x2={W - M.r} y1={sy(y)} y2={sy(y)} stroke={COLOR.rejilla} strokeDasharray={y === 1 ? "4 3" : undefined} />
              <text x={M.l - 6} y={sy(y) + 4} fill={COLOR.texto} fontSize="11" textAnchor="end">{fmt(y, 1)}</text>
            </g>
          ))}
          {ticksT.map((t) => (
            <text key={t} x={sx(t)} y={H - M.b + 16} fill={COLOR.texto} fontSize="11" textAnchor="middle">{fmt(t, t < 2 ? 2 : 1)}</text>
          ))}
          <text x={(W + M.l) / 2} y={H - 4} fill={COLOR.texto} fontSize="12" textAnchor="middle">Tiempo t [s]</text>
          <text x={12} y={(H - M.b) / 2} fill={COLOR.texto} fontSize="12" textAnchor="middle" transform={`rotate(-90 12 ${(H - M.b) / 2})`}>Posición x (0 → 1)</text>
          {curvas.map((cv, i) => (
            <polyline
              key={i}
              fill="none"
              stroke={carriles[i].color}
              strokeWidth={i === 0 ? 3 : 1.6}
              strokeDasharray={i === 0 ? undefined : "5 4"}
              points={cv.puntos.map(([t, x]) => `${sx(t).toFixed(1)},${sy(x).toFixed(1)}`).join(" ")}
            />
          ))}
        </svg>
        <figcaption style={{ fontSize: 12, color: COLOR.texto, marginTop: 6 }}>
          Respuesta desde el reposo hasta el destino x = 1, calculada con m·x″ = −k(x − 1) − c·x′. La banda clara marca
          ±1 % del destino. Línea gruesa: tu resorte; líneas punteadas: los tres regímenes de referencia.
        </figcaption>
      </figure>
    </div>
  );
}
