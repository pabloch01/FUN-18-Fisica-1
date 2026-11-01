import { useEffect, useMemo, useRef, useState } from "react";

/*
  Tema 7 · Simulación del coeficiente de restitución.
  Modo 1: pelota que cae y rebota contra el piso, con las reglas de combinación de Unity
          (Average, Minimum, Maximum, Multiply) y el umbral de rebote (bounceThreshold).
  Modo 2: choque frontal de dos carritos, para ver que el momento se conserva y la energía no.
  Toda la física se recalcula con cada cambio de control (solución analítica por tramos).
*/

const G = 9.81; // m/s²
const T_VENTANA = 8; // s que se muestran en la gráfica
const E_ITF = [Math.sqrt(135 / 254), Math.sqrt(147 / 254)]; // ≈ 0,729 – 0,761 (ITF, 2023)
const COLOR = { principal: "#1f5fa8", fantasma: "#8a8a8a", acento: "#c4562a", verde: "#2f7d5b", rejilla: "#d9d7cf", banda: "#e8eef7" };
const fmt = (v, d = 2) => (Number.isFinite(v) ? v.toFixed(d).replace(".", ",") : "—");

const REGLAS = {
  Average: { nombre: "Average (promedio)", f: (a, b) => (a + b) / 2 },
  Minimum: { nombre: "Minimum (el menor)", f: (a, b) => Math.min(a, b) },
  Maximum: { nombre: "Maximum (el mayor)", f: (a, b) => Math.max(a, b) },
  Multiply: { nombre: "Multiply (producto)", f: (a, b) => a * b },
};

/* ---------- Física de la pelota: tramos de caída libre entre choques ---------- */
function rebotes(h0, e, umbral) {
  // Devuelve los tramos [t0, t1, v0 (hacia arriba), y0] y la lista de choques.
  const tramos = [];
  const choques = [];
  let t = 0;
  // Primer tramo: caída desde h0 en reposo
  let tCaida = Math.sqrt((2 * h0) / G);
  tramos.push({ t0: 0, t1: tCaida, v0: 0, y0: h0 });
  t = tCaida;
  let vImpacto = G * tCaida;
  for (let n = 1; n <= 60 && t < T_VENTANA; n++) {
    if (vImpacto < umbral) {
      choques.push({ n, vImpacto, vSalida: 0, h: 0, perdida: 1, cortado: true, t });
      break;
    }
    const vSalida = e * vImpacto;
    const h = (vSalida * vSalida) / (2 * G);
    choques.push({ n, vImpacto, vSalida, h, perdida: 1 - e * e, cortado: false, t });
    if (vSalida < 0.02) break;
    const tVuelo = (2 * vSalida) / G;
    tramos.push({ t0: t, t1: t + tVuelo, v0: vSalida, y0: 0 });
    t += tVuelo;
    vImpacto = vSalida;
  }
  return { tramos, choques, tFin: t };
}

function alturaEn(t, tramos) {
  for (const s of tramos) {
    if (t >= s.t0 && t <= s.t1) {
      const tau = t - s.t0;
      return s.y0 + s.v0 * tau - 0.5 * G * tau * tau;
    }
  }
  return 0;
}

/* ---------- Física del choque de dos carritos ---------- */
function choque(m1, m2, u1, u2, e) {
  const M = m1 + m2;
  const v1 = (m1 * u1 + m2 * u2 + m2 * e * (u2 - u1)) / M;
  const v2 = (m1 * u1 + m2 * u2 + m1 * e * (u1 - u2)) / M;
  const pAntes = m1 * u1 + m2 * u2;
  const pDespues = m1 * v1 + m2 * v2;
  const KAntes = 0.5 * m1 * u1 * u1 + 0.5 * m2 * u2 * u2;
  const KDespues = 0.5 * m1 * v1 * v1 + 0.5 * m2 * v2 * v2;
  const mu = (m1 * m2) / M;
  const perdidaFormula = 0.5 * mu * (1 - e * e) * (u1 - u2) ** 2;
  return { v1, v2, pAntes, pDespues, KAntes, KDespues, perdidaFormula, seAcercan: u1 > u2 };
}

/* ---------- Estilos ---------- */
const caja = { border: `1px solid ${COLOR.rejilla}`, borderRadius: 6, padding: 14, background: "#fff" };
const fila = { display: "grid", gridTemplateColumns: "1fr auto", alignItems: "baseline", gap: 8, marginTop: 10 };
const etiqueta = { fontSize: 13 };
const valor = { fontVariantNumeric: "tabular-nums", fontWeight: 600, fontSize: 13 };
const boton = { border: `1px solid ${COLOR.principal}`, background: "#fff", color: COLOR.principal, borderRadius: 4, padding: "6px 10px", cursor: "pointer", fontSize: 13 };
const botonPrimario = { ...boton, background: COLOR.principal, color: "#fff" };
const celda = { padding: "4px 8px", textAlign: "right", fontVariantNumeric: "tabular-nums", fontSize: 13, borderBottom: `1px solid ${COLOR.rejilla}` };
const celdaIzq = { ...celda, textAlign: "left" };

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

/* ================================================================== */
function ModoPelota() {
  const [ePelota, setEPelota] = useState(0.75);
  const [ePiso, setEPiso] = useState(0.75);
  const [regla, setRegla] = useState("Average");
  const [umbral, setUmbral] = useState(2);
  const [h0, setH0] = useState(2);
  const [fantasma, setFantasma] = useState(true);
  const [tAnim, setTAnim] = useState(null);
  const raf = useRef(null);

  const e = REGLAS[regla].f(ePelota, ePiso);
  const sim = useMemo(() => rebotes(h0, e, umbral), [h0, e, umbral]);
  const ref = useMemo(() => rebotes(h0, 0.75, 0), [h0]);
  const enBandaITF = e >= E_ITF[0] - 1e-9 && e <= E_ITF[1] + 1e-9;
  const cortado = sim.choques.find((c) => c.cortado);

  // Cualquier cambio de control cancela la animación en curso
  useEffect(() => {
    cancelAnimationFrame(raf.current);
    setTAnim(null);
  }, [ePelota, ePiso, regla, umbral, h0]);
  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  const soltar = () => {
    cancelAnimationFrame(raf.current);
    const inicio = performance.now();
    const paso = (ahora) => {
      const t = (ahora - inicio) / 1000;
      if (t >= T_VENTANA) {
        setTAnim(T_VENTANA);
        return;
      }
      setTAnim(t);
      raf.current = requestAnimationFrame(paso);
    };
    raf.current = requestAnimationFrame(paso);
  };

  /* Escena */
  const W = 620, H = 320, M = { l: 50, r: 14, t: 14, b: 42 };
  const pw = W - M.l - M.r, ph = H - M.t - M.b;
  const yMax = Math.max(h0, ...sim.choques.map((c) => c.h)) * 1.12;
  const X = (t) => M.l + (t / T_VENTANA) * pw;
  const Y = (y) => M.t + ph - (y / yMax) * ph;
  const curva = (s) => {
    const pts = [];
    const tFin = Math.min(Math.max(s.tFin, 0.01), T_VENTANA);
    for (let i = 0; i <= 900; i++) {
      const t = (T_VENTANA * i) / 900;
      pts.push(`${X(t).toFixed(1)},${Y(t <= tFin ? alturaEn(t, s.tramos) : 0).toFixed(1)}`);
    }
    return pts.join(" ");
  };
  const ticksY = [];
  const pasoY = yMax > 6 ? 2 : yMax > 3 ? 1 : 0.5;
  for (let v = 0; v <= yMax + 1e-9; v += pasoY) ticksY.push(Number(v.toFixed(2)));
  const yBola = tAnim === null ? h0 : Math.max(alturaEn(Math.min(tAnim, sim.tFin), sim.tramos), 0);
  const radio = 7;

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 20 }}>
      <div style={{ ...caja, flex: "0 0 300px", maxWidth: "100%" }}>
        <Deslizador id="ePelota" texto="Coeficiente de restitución de la pelota" valorTexto={fmt(ePelota)} min="0" max="1.1" step="0.01" value={ePelota} onChange={(ev) => setEPelota(Number(ev.target.value))} />
        <div style={{ fontSize: 11.5, color: "#555", marginTop: 2 }}>
          Franja realista de una pelota de tenis (ITF): {fmt(E_ITF[0])} – {fmt(E_ITF[1])}
        </div>
        <Deslizador id="ePiso" texto="Coeficiente del piso" valorTexto={fmt(ePiso)} min="0" max="1" step="0.01" value={ePiso} onChange={(ev) => setEPiso(Number(ev.target.value))} />

        <label htmlFor="regla" style={{ ...etiqueta, display: "block", marginTop: 12 }}>Regla de combinación del motor</label>
        <select id="regla" value={regla} onChange={(ev) => setRegla(ev.target.value)} style={{ marginTop: 4, fontSize: 13, width: "100%" }}>
          {Object.entries(REGLAS).map(([k, r]) => <option key={k} value={k}>{r.nombre}</option>)}
        </select>

        <Deslizador id="umbral" texto="Umbral de rebote [m/s]" valorTexto={fmt(umbral, 1)} min="0" max="4" step="0.1" value={umbral} onChange={(ev) => setUmbral(Number(ev.target.value))} />
        <Deslizador id="h0" texto="Altura inicial h₀ [m]" valorTexto={fmt(h0, 1)} min="0.5" max="5" step="0.1" value={h0} onChange={(ev) => setH0(Number(ev.target.value))} />

        <label style={{ display: "block", fontSize: 13, marginTop: 12 }}>
          <input type="checkbox" checked={fantasma} onChange={(ev) => setFantasma(ev.target.checked)} /> Comparar con un rebote realista (e = 0,75, sin umbral)
        </label>

        <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
          <button type="button" style={botonPrimario} onClick={soltar}>Soltar</button>
          <button type="button" style={boton} onClick={() => { cancelAnimationFrame(raf.current); setTAnim(null); }}>Reiniciar</button>
        </div>

        <div style={{ marginTop: 14, fontSize: 12, color: "#555" }}>
          Combinaciones rápidas:
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 6 }}>
            <button type="button" style={{ ...boton, padding: "3px 8px" }} onClick={() => { setEPelota(0.75); setEPiso(0.75); setRegla("Average"); setUmbral(0); }}>Realista</button>
            <button type="button" style={{ ...boton, padding: "3px 8px" }} onClick={() => { setEPelota(0.75); setEPiso(0.3); setRegla("Multiply"); setUmbral(2); }}>Piso “muerto”</button>
            <button type="button" style={{ ...boton, padding: "3px 8px" }} onClick={() => { setEPelota(0.75); setEPiso(0.75); setRegla("Average"); setUmbral(2); }}>Umbral de 2 m/s</button>
            <button type="button" style={{ ...boton, padding: "3px 8px" }} onClick={() => { setEPelota(1.05); setEPiso(1); setRegla("Maximum"); setUmbral(0); }}>e &gt; 1</button>
          </div>
        </div>
      </div>

      <div style={{ flex: "1 1 460px", minWidth: 0 }}>
        <div style={caja}>
          <svg viewBox={`0 0 ${W} ${H}`} width="100%" role="img" aria-label="Altura de la pelota contra el tiempo" style={{ display: "block" }}>
            {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((v) => (
              <g key={`x${v}`}>
                <line x1={X(v)} x2={X(v)} y1={M.t} y2={M.t + ph} stroke={COLOR.rejilla} strokeWidth="0.7" />
                <text x={X(v)} y={H - M.b + 16} fontSize="11" textAnchor="middle" fill="#555">{v}</text>
              </g>
            ))}
            {ticksY.map((v) => (
              <g key={`y${v}`}>
                <line x1={M.l} x2={M.l + pw} y1={Y(v)} y2={Y(v)} stroke={COLOR.rejilla} strokeWidth="0.7" />
                <text x={M.l - 8} y={Y(v) + 4} fontSize="11" textAnchor="end" fill="#555">{fmt(v, v % 1 ? 1 : 0)}</text>
              </g>
            ))}
            <text x={M.l + pw / 2} y={H - 8} fontSize="12" textAnchor="middle" fill="#333">Tiempo [s]</text>
            <text transform={`translate(14 ${M.t + ph / 2}) rotate(-90)`} fontSize="12" textAnchor="middle" fill="#333">Altura de la base de la pelota [m]</text>
            <line x1={M.l} x2={M.l + pw} y1={Y(0)} y2={Y(0)} stroke="#333" strokeWidth="1.5" />

            {fantasma && <polyline points={curva(ref)} fill="none" stroke={COLOR.fantasma} strokeWidth="1.5" strokeDasharray="6 5" />}
            <polyline points={curva(sim)} fill="none" stroke={COLOR.principal} strokeWidth="2.2" />
            {cortado && (
              <g>
                <circle cx={X(cortado.t)} cy={Y(0)} r="5" fill={COLOR.acento} />
                <line x1={X(cortado.t)} x2={X(cortado.t)} y1={Y(0) - 6} y2={Y(0) - 34} stroke={COLOR.acento} strokeWidth="1" />
                <text x={X(cortado.t) + 4} y={Y(0) - 38} fontSize="12" fill={COLOR.acento}>se “pega”: {fmt(cortado.vImpacto)} m/s &lt; umbral</text>
              </g>
            )}
            {tAnim !== null && (
              <circle cx={X(Math.min(tAnim, T_VENTANA))} cy={Y(yBola) - radio} r={radio} fill={COLOR.verde} />
            )}
          </svg>
          <div style={{ fontSize: 12, color: "#555", marginTop: 4 }}>
            Línea continua: rebote con los valores elegidos (e efectivo = {fmt(e, 3)}). Línea punteada: rebote realista de referencia. “Soltar” anima la pelota en tiempo real.
          </div>
        </div>

        <div style={{ ...caja, marginTop: 16, fontSize: 13 }} aria-live="polite">
          <p style={{ margin: 0 }}>
            <strong>Coeficiente efectivo:</strong> {REGLAS[regla].nombre} de {fmt(ePelota)} y {fmt(ePiso)} = <strong>{fmt(e, 3)}</strong>.{" "}
            {e > 1
              ? "Con e > 1 cada choque crea energía: la pelota sube más alto en cada rebote, algo imposible en la realidad."
              : enBandaITF
                ? "Está dentro de la franja de una pelota de tenis aprobada por la ITF."
                : e < E_ITF[0]
                  ? "Está por debajo de la franja de la ITF: la pelota se siente “muerta”."
                  : "Está por encima de la franja de la ITF: la pelota se siente “de goma”."}
          </p>
          {cortado && (
            <p style={{ margin: "8px 0 0", color: COLOR.acento }}>
              En el choque {cortado.n} la pelota llega a {fmt(cortado.vImpacto)} m/s, por debajo del umbral de {fmt(umbral, 1)} m/s: el motor trata el choque como
              inelástico y la pelota se queda quieta de golpe. Una pelota real seguiría rebotando a {fmt(e * cortado.vImpacto)} m/s ({fmt((100 * (e * cortado.vImpacto) ** 2) / (2 * G), 1)} cm de altura).
            </p>
          )}
          <div style={{ overflowX: "auto", marginTop: 10 }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={{ ...celdaIzq, fontWeight: 600 }}>Choque</th>
                  <th style={{ ...celda, fontWeight: 600 }}>Llega a [m/s]</th>
                  <th style={{ ...celda, fontWeight: 600 }}>Sale a [m/s]</th>
                  <th style={{ ...celda, fontWeight: 600 }}>Altura siguiente [m]</th>
                  <th style={{ ...celda, fontWeight: 600 }}>Energía perdida (1 − e²)</th>
                </tr>
              </thead>
              <tbody>
                {sim.choques.slice(0, 8).map((c) => (
                  <tr key={c.n}>
                    <td style={celdaIzq}>{c.n}{c.cortado ? " (umbral)" : ""}</td>
                    <td style={celda}>{fmt(c.vImpacto)}</td>
                    <td style={celda}>{fmt(c.vSalida)}</td>
                    <td style={celda}>{fmt(c.h, 3)}</td>
                    <td style={celda}>{fmt(100 * c.perdida, 1)} %</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={{ margin: "8px 0 0", color: "#555", fontSize: 12 }}>
            Rapidez de salida v′ = e·v; altura siguiente h = v′²/(2g); en cada choque se pierde la fracción 1 − e² de la energía cinética. Se muestran hasta 8 choques.
          </p>
        </div>
      </div>
    </div>
  );
}

/* ================================================================== */
function ModoCarritos() {
  const [m1, setM1] = useState(2);
  const [m2, setM2] = useState(1);
  const [u1, setU1] = useState(3);
  const [u2, setU2] = useState(0);
  const [e, setE] = useState(0.5);
  const r = choque(m1, m2, u1, u2, e);

  const W = 600, H = 230;
  const carrito = (x, y, m, color, texto) => {
    const ancho = 50 + 14 * m;
    return (
      <g>
        <rect x={x - ancho / 2} y={y - 34} width={ancho} height={30} rx="4" fill={color} />
        <circle cx={x - ancho / 4} cy={y} r="5" fill="#333" />
        <circle cx={x + ancho / 4} cy={y} r="5" fill="#333" />
        <text x={x} y={y - 15} fontSize="12" textAnchor="middle" fill="#fff">{texto}</text>
      </g>
    );
  };
  const flecha = (x, y, v, color) => {
    if (Math.abs(v) < 1e-3) return <text x={x} y={y + 4} fontSize="11" textAnchor="middle" fill="#555">en reposo</text>;
    const largo = 18 * v;
    return (
      <g>
        <line x1={x} y1={y} x2={x + largo} y2={y} stroke={color} strokeWidth="3" />
        <polygon points={`${x + largo},${y - 6} ${x + largo + Math.sign(v) * 10},${y} ${x + largo},${y + 6}`} fill={color} />
        <text x={x + largo / 2} y={y - 9} fontSize="11" textAnchor="middle" fill={color}>{fmt(v)} m/s</text>
      </g>
    );
  };

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 20 }}>
      <div style={{ ...caja, flex: "0 0 300px", maxWidth: "100%" }}>
        <Deslizador id="m1" texto="Masa del carrito 1 m₁ [kg]" valorTexto={fmt(m1, 1)} min="0.5" max="5" step="0.1" value={m1} onChange={(ev) => setM1(Number(ev.target.value))} />
        <Deslizador id="m2" texto="Masa del carrito 2 m₂ [kg]" valorTexto={fmt(m2, 1)} min="0.5" max="5" step="0.1" value={m2} onChange={(ev) => setM2(Number(ev.target.value))} />
        <Deslizador id="u1" texto="Velocidad inicial v₁ [m/s]" valorTexto={fmt(u1, 1)} min="-5" max="5" step="0.1" value={u1} onChange={(ev) => setU1(Number(ev.target.value))} />
        <Deslizador id="u2" texto="Velocidad inicial v₂ [m/s]" valorTexto={fmt(u2, 1)} min="-5" max="5" step="0.1" value={u2} onChange={(ev) => setU2(Number(ev.target.value))} />
        <Deslizador id="eC" texto="Coeficiente de restitución e" valorTexto={fmt(e)} min="0" max="1" step="0.01" value={e} onChange={(ev) => setE(Number(ev.target.value))} />
        <div style={{ marginTop: 14 }}>
          <button type="button" style={{ ...boton, padding: "3px 8px" }} onClick={() => { setM1(2); setM2(1); setU1(3); setU2(0); setE(0.5); }}>Caso de verificación</button>
        </div>
      </div>

      <div style={{ flex: "1 1 460px", minWidth: 0 }}>
        <div style={caja}>
          {!r.seAcercan ? (
            <p style={{ margin: 0, fontSize: 13 }}>Con estas velocidades los carritos no se acercan (v₁ ≤ v₂), así que no chocan. Aumente v₁ o reduzca v₂.</p>
          ) : (
            <svg viewBox={`0 0 ${W} ${H}`} width="100%" role="img" aria-label="Carritos antes y después del choque" style={{ display: "block" }}>
              <text x="12" y="22" fontSize="13" fontWeight="600" fill="#333">Antes del choque</text>
              <line x1="12" x2={W - 12} y1="92" y2="92" stroke="#999" />
              {carrito(190, 87, m1, COLOR.principal, `m₁ = ${fmt(m1, 1)} kg`)}
              {carrito(400, 87, m2, COLOR.acento, `m₂ = ${fmt(m2, 1)} kg`)}
              {flecha(190, 40, u1, COLOR.principal)}
              {flecha(400, 40, u2, COLOR.acento)}
              <text x="12" y="132" fontSize="13" fontWeight="600" fill="#333">Después del choque</text>
              <line x1="12" x2={W - 12} y1="202" y2="202" stroke="#999" />
              {carrito(190, 197, m1, COLOR.principal, `m₁`)}
              {carrito(400, 197, m2, COLOR.acento, `m₂`)}
              {flecha(190, 150, r.v1, COLOR.principal)}
              {flecha(400, 150, r.v2, COLOR.acento)}
            </svg>
          )}
        </div>
        {r.seAcercan && (
          <div style={{ ...caja, marginTop: 16, overflowX: "auto" }} aria-live="polite">
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={{ ...celdaIzq, fontWeight: 600 }}>Magnitud</th>
                  <th style={{ ...celda, fontWeight: 600 }}>Antes</th>
                  <th style={{ ...celda, fontWeight: 600 }}>Después</th>
                </tr>
              </thead>
              <tbody>
                <tr><td style={celdaIzq}>Velocidades v₁ ; v₂ [m/s]</td><td style={celda}>{fmt(u1)} ; {fmt(u2)}</td><td style={celda}>{fmt(r.v1)} ; {fmt(r.v2)}</td></tr>
                <tr><td style={celdaIzq}>Momento total p = m₁v₁ + m₂v₂ [kg·m/s]</td><td style={celda}>{fmt(r.pAntes, 3)}</td><td style={celda}>{fmt(r.pDespues, 3)}</td></tr>
                <tr><td style={celdaIzq}>Energía cinética total K [J]</td><td style={celda}>{fmt(r.KAntes, 3)}</td><td style={celda}>{fmt(r.KDespues, 3)}</td></tr>
              </tbody>
            </table>
            <p style={{ fontSize: 13, margin: "10px 0 0" }}>
              El momento se conserva siempre. La energía cinética perdida es {fmt(r.KAntes - r.KDespues, 3)} J, igual a ½·μ·(1 − e²)·(v₁ − v₂)² ={" "}
              {fmt(r.perdidaFormula, 3)} J, con μ = m₁m₂/(m₁ + m₂). Con e = 1 no se pierde nada; con e = 0 los carritos quedan juntos.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SimulacionRebote() {
  const [modo, setModo] = useState("pelota");
  return (
    <section aria-label="Simulación del coeficiente de restitución">
      <div role="tablist" aria-label="Modo de la simulación" style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
        <button type="button" role="tab" aria-selected={modo === "pelota"} style={modo === "pelota" ? botonPrimario : boton} onClick={() => setModo("pelota")}>1 · Pelota que rebota</button>
        <button type="button" role="tab" aria-selected={modo === "carritos"} style={modo === "carritos" ? botonPrimario : boton} onClick={() => setModo("carritos")}>2 · Choque de dos carritos</button>
      </div>
      {modo === "pelota" ? <ModoPelota /> : <ModoCarritos />}
    </section>
  );
}
