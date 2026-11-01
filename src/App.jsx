import { useEffect, useMemo, useState } from "react";
import PortadaOrbital from "./components/PortadaOrbital.jsx";
import { BLOQUES, TEMAS } from "./temas.js";
import Tema1 from "./secciones/Tema1.jsx";
import Tema2 from "./secciones/Tema2.jsx";
import Tema3 from "./secciones/Tema3.jsx";
import Tema4 from "./secciones/Tema4.jsx";
import Tema5 from "./secciones/Tema5.jsx";
import Tema6 from "./secciones/Tema6.jsx";
import Tema7 from "./secciones/Tema7.jsx";
import Tema8 from "./secciones/Tema8.jsx";
import Tema9 from "./secciones/Tema9.jsx";
import Referencias from "./secciones/Referencias.jsx";

// Índice: los nueve temas (títulos de la consigna, en temas.js) y las referencias
const SECCIONES = [
  ...TEMAS.map((t) => ({ ...t, etiqueta: `Tema ${t.numero}`, color: BLOQUES[t.bloque].color })),
  { id: "referencias", etiqueta: "Referencias", titulo: "Referencias", color: "#9aa8c6" },
];

function useSeccionActiva(ids) {
  const [activa, setActiva] = useState(ids[0]);
  useEffect(() => {
    const observador = new IntersectionObserver(
      (entradas) => {
        const visibles = entradas.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visibles.length) setActiva(visibles[0].target.id);
      },
      { rootMargin: "-10% 0px -70% 0px" }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observador.observe(el);
    });
    return () => observador.disconnect();
  }, [ids]);
  return activa;
}

export default function App() {
  const ids = useMemo(() => SECCIONES.map((s) => s.id), []);
  const activa = useSeccionActiva(ids);

  // En móvil, si la barra de planetas no cabe completa (pantallas muy angostas), se desplaza sola
  // para que el planeta de la sección activa quede a la vista
  useEffect(() => {
    const barra = document.querySelector(".indice");
    const li = barra?.querySelector("a.activo")?.parentElement;
    if (!barra || !li || barra.scrollWidth <= barra.clientWidth) return;
    barra.scrollTo({ left: li.offsetLeft - (barra.clientWidth - li.offsetWidth) / 2, behavior: "smooth" });
  }, [activa]);

  return (
    <>
      <a className="saltar" href="#contenido">Saltar al contenido</a>

      <PortadaOrbital />

      <div className="layout">
        <nav className="indice" aria-label="Índice de temas">
          <p className="indice-titulo">Contenido</p>
          <ol>
            {SECCIONES.map((s) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  className={activa === s.id ? "activo" : undefined}
                  aria-current={activa === s.id ? "true" : undefined}
                  style={{ "--cat": s.color }}
                  title={s.titulo}
                >
                  {s.numero ? (
                    <span className="planeta" data-n={s.numero} aria-hidden="true">{s.numero}</span>
                  ) : (
                    <span className="planeta referencias" aria-hidden="true">R</span>
                  )}
                  <span className="indice-corto">{s.etiqueta}</span>
                  {s.numero && <span className="indice-largo">{s.corto}</span>}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <main id="contenido">
          <section className="intro" aria-labelledby="intro-titulo">
            <h2 id="intro-titulo">Cómo leer este portafolio</h2>
            <p>
              Cada tema tiene dos partes. La <strong>parte A</strong> presenta un caso de uso concreto en Ingeniería del
              Software: nombra el producto, el sistema o la industria, escribe de forma explícita la ecuación física que
              se aplica y explica por qué modelar la física resuelve el problema mejor que las alternativas que no la
              usan. La <strong>parte B</strong> contiene el recurso de apoyo prescrito para ese tema: visualización de
              datos, simulación interactiva, diagrama o multimedia con análisis.
            </p>
            <p>
              El color de cada tema indica su bloque: azul para cinemática, naranja para dinámica, verde para las leyes de
              conservación y violeta para gravitación. Los datos y el contenido de terceros están citados en formato APA 7
              y se reúnen en la sección de referencias. Los cálculos marcados como “propios” fueron hechos por el autor a
              partir de las ecuaciones indicadas.
            </p>
          </section>

          <Tema1 />
          <Tema2 />
          <Tema3 />
          <Tema4 />
          <Tema5 />
          <Tema6 />
          <Tema7 />
          <Tema8 />
          <Tema9 />
          <Referencias />
        </main>
      </div>

      <footer className="pie">
        <p>
          Portafolio de evidencias · FUN-18 Física I · Avance 2. Los datos de Rodrigues et al. (2020) se usan con licencia
          CC BY 4.0 y fueron modificados como se explica en el Tema 1.
        </p>
      </footer>
    </>
  );
}
