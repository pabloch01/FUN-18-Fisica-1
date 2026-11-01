import { useEffect, useMemo, useRef, useState } from "react";
import { BLOQUES, TEMAS } from "../temas.js";

/*
  Portada “Sistema orbital”.
  Cada tema es un planeta que orbita un sol. Al deslizar hacia abajo:
    1. las órbitas se aplanan y se desvanecen, y el texto de la portada sube y desaparece;
    2. los planetas vuelan hasta el planeta que les corresponde en el índice real (.indice .planeta[data-n]),
       siguiendo su posición en vivo mientras el contenido entra en pantalla;
    3. al llegar, la capa de vuelo se oculta y quedan los planetas del índice.
  El progreso p (0 → 1) es la fracción de la portada que ya se deslizó. Toda la animación se calcula
  en un bucle de requestAnimationFrame que modifica el DOM directamente: React no se vuelve a renderizar.
  Con “reducir movimiento” activado en el sistema, la portada se muestra quieta y sin vuelo.
*/

const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const lerp = (a, b, t) => a + (b - a) * t;

// Ángulos iniciales y velocidades de giro (más lentos hacia afuera, como en la tercera ley de Kepler)
const ORBITAS = TEMAS.map((t, i) => ({
  ...t,
  color: BLOQUES[t.bloque].color,
  angulo0: ((i * 47 + 15) * Math.PI) / 180,
  omega: 0.22 * Math.pow(1 + i * 0.42, -1.5), // rad/s
}));

function geometria(W, H) {
  const angosta = W < 980;
  const m = Math.min(W, H);
  return angosta
    ? { cx: W * 0.5, cy: H * 0.2, base: m * 0.06, paso: m * 0.026, sol: m * 0.05 }
    : { cx: W * 0.7, cy: H * 0.5, base: m * 0.1, paso: m * 0.042, sol: m * 0.075 };
}

function Estrellas() {
  // Cielo fijo con semilla, para que siempre se vea igual
  const estrellas = useMemo(() => {
    let s = 7;
    const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647;
    return Array.from({ length: 260 }, () => ({ x: rnd() * 100, y: rnd() * 100, r: rnd() * 1.3 + 0.2, o: 0.15 + rnd() * 0.6 }));
  }, []);
  return (
    <svg className="orbital-cielo" aria-hidden="true">
      {estrellas.map((e, i) => (
        <circle key={i} cx={`${e.x}%`} cy={`${e.y}%`} r={e.r} fill="#fff" opacity={e.o.toFixed(2)} />
      ))}
    </svg>
  );
}

export default function PortadaOrbital() {
  const seccion = useRef(null);
  const texto = useRef(null);
  const svg = useRef(null);
  const vuelo = useRef(null);
  const [quieta] = useState(() => typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches);

  useEffect(() => {
    const raiz = svg.current;
    const capa = vuelo.current;
    const sol = raiz.querySelector(".sol");
    const halo = raiz.querySelector(".halo");
    const elipses = [...raiz.querySelectorAll(".orbita")];
    const planetasCielo = [...raiz.querySelectorAll(".planeta-cielo")];
    const planetasVuelo = capa ? [...capa.querySelectorAll(".planeta-vuelo")] : [];
    const indice = document.querySelector(".indice");
    const destinos = () => [...document.querySelectorAll(".indice .planeta[data-n]")];

    let id = 0;
    const inicio = performance.now();

    const dibujar = (ahora) => {
      const W = window.innerWidth;
      const H = window.innerHeight;
      const g = geometria(W, H);
      const caja = seccion.current.getBoundingClientRect();
      if (!quieta && caja.bottom < -40) {
        // La portada ya quedó atrás: nada que dibujar, solo esperar a que vuelva a la vista
        if (capa) capa.style.visibility = "hidden";
        indice?.classList.remove("en-vuelo");
        id = requestAnimationFrame(dibujar);
        return;
      }
      const p = quieta ? 0 : clamp(-caja.top / caja.height);
      const t = quieta ? 0 : (ahora - inicio) / 1000;

      const eAplanar = ease(clamp(p / 0.55));
      const eVuelo = ease(clamp((p - 0.12) / 0.88));
      const enVuelo = !quieta && p > 0.001 && p < 0.999;

      sol.setAttribute("cx", g.cx);
      sol.setAttribute("cy", g.cy);
      sol.setAttribute("r", lerp(g.sol, g.sol * 0.4, eAplanar));
      sol.style.opacity = 1 - eAplanar * 0.9;
      halo.setAttribute("cx", g.cx);
      halo.setAttribute("cy", g.cy);
      halo.setAttribute("r", g.sol * 2.6);
      halo.style.opacity = 0.5 * (1 - eAplanar);

      const objetivos = enVuelo ? destinos().map((d) => d.getBoundingClientRect()) : [];

      ORBITAS.forEach((o, i) => {
        const rx = lerp(g.base + i * g.paso, g.base + i * g.paso + 80, eAplanar);
        const ry = rx * lerp(0.9, 0.28, eAplanar);
        const el = elipses[i];
        el.setAttribute("cx", g.cx);
        el.setAttribute("cy", g.cy);
        el.setAttribute("rx", rx);
        el.setAttribute("ry", ry);
        el.style.opacity = (0.34 * (1 - clamp(p / 0.6))).toFixed(3);

        const ang = o.angulo0 + o.omega * t + p * 1.9;
        const x0 = g.cx + rx * Math.cos(ang);
        const y0 = g.cy + ry * Math.sin(ang);
        const r0 = 7 + i * 0.6;

        // Planeta dentro de la escena (solo cuando no vuela)
        const pc = planetasCielo[i];
        pc.setAttribute("transform", `translate(${x0.toFixed(1)} ${y0.toFixed(1)})`);
        pc.style.opacity = enVuelo ? 0 : 1;

        // Planeta de la capa de vuelo: de la órbita al índice
        const pv = planetasVuelo[i];
        if (!pv) return;
        const d = objetivos[i];
        if (enVuelo && d && d.width > 0) {
          const x1 = d.left + d.width / 2;
          const y1 = d.top + d.height / 2;
          const r1 = d.width / 2;
          const x = lerp(x0, x1, eVuelo);
          const y = lerp(y0, y1, eVuelo);
          const r = lerp(r0, r1, eVuelo);
          pv.setAttribute("transform", `translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(${(r / 10).toFixed(3)})`);
          pv.style.opacity = 1;
        } else {
          pv.style.opacity = 0;
        }
      });

      if (texto.current) {
        texto.current.style.opacity = clamp(1 - p * 2.6);
        texto.current.style.transform = `${W < 980 ? "" : "translateY(-50%) "}translateY(${(-120 * ease(clamp(p / 0.5))).toFixed(1)}px)`;
      }
      if (capa) capa.style.visibility = enVuelo ? "visible" : "hidden";
      if (indice) indice.classList.toggle("en-vuelo", enVuelo);

      // Solo se sigue animando mientras la portada esté a la vista
      if (!quieta) id = requestAnimationFrame(dibujar);
    };

    id = requestAnimationFrame(dibujar);
    const alCambiar = () => quieta && requestAnimationFrame(dibujar);
    window.addEventListener("resize", alCambiar);
    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener("resize", alCambiar);
      indice?.classList.remove("en-vuelo");
    };
  }, [quieta]);

  return (
    <header ref={seccion} className={`orbital${quieta ? " quieta" : ""}`}>
      <div className="orbital-escena">
        <Estrellas />
        <svg ref={svg} className="orbital-svg" aria-hidden="true">
          <defs>
            <radialGradient id="sol-grad">
              <stop offset="0%" stopColor="#fff6d8" />
              <stop offset="40%" stopColor="#ffc65a" />
              <stop offset="100%" stopColor="#ff7a3d" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle className="halo" fill="#ffb347" opacity="0.4" style={{ filter: "blur(30px)" }} />
          {ORBITAS.map((o, i) => (
            <ellipse key={o.id} className="orbita" fill="none" stroke={o.color} strokeWidth="1.2" strokeDasharray={i % 2 ? "2 5" : undefined} />
          ))}
          <circle className="sol" fill="url(#sol-grad)" />
          {ORBITAS.map((o, i) => (
            <g key={o.id} className="planeta-cielo">
              <circle r={7 + i * 0.6 + 7} fill={o.color} opacity="0.18" />
              <circle r={7 + i * 0.6} fill={o.color} />
              <text y="3.6" textAnchor="middle" fontSize="10" fontWeight="800" fill="#071022" fontFamily="Inter, sans-serif">{o.numero}</text>
            </g>
          ))}
        </svg>

        <div ref={texto} className="orbital-texto">
          <p className="orbital-etiqueta">Portafolio de evidencias · FUN-18 Física I</p>
          <h1>Física que<br /><span>se programa</span></h1>
          <p className="orbital-sub">
            Nueve sistemas de software que funcionan porque respetan las leyes de la mecánica: del dron que calcula su
            hora de llegada a la Voyager que le roba velocidad a Júpiter.
          </p>
          <dl className="orbital-datos">
            <div><dt>Autor</dt><dd>Pablo Andrés Chinchilla Moya</dd></div>
            <div><dt>Docente facilitador</dt><dd>Andrés Castro Núñez</dd></div>
            <div><dt>Curso</dt><dd>FUN-18 Física I · Universidad CENFOTEC</dd></div>
            <div><dt>Sección y periodo</dt><dd>FCV1 · 2026-C3 · Avance 2</dd></div>
          </dl>
          <p className="orbital-pista"><span aria-hidden="true">↓</span> {quieta ? "Los nueve temas están abajo" : "Desliza para entrar en órbita"}</p>
        </div>
      </div>

      {!quieta && (
        <div ref={vuelo} className="orbital-vuelo" aria-hidden="true" style={{ visibility: "hidden" }}>
          <svg>
            {ORBITAS.map((o) => (
              <g key={o.id} className="planeta-vuelo" style={{ opacity: 0 }}>
                <circle r="16" fill={o.color} opacity="0.2" />
                <circle r="10" fill={o.color} />
                <text y="3.6" textAnchor="middle" fontSize="10" fontWeight="800" fill="#071022" fontFamily="Inter, sans-serif">{o.numero}</text>
              </g>
            ))}
          </svg>
        </div>
      )}
    </header>
  );
}
