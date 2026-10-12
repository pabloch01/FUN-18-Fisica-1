import { useEffect, useState } from "react";
import Tema1 from "./secciones/Tema1.jsx";
import Tema2 from "./secciones/Tema2.jsx";
import Tema3 from "./secciones/Tema3.jsx";
import Tema4 from "./secciones/Tema4.jsx";
import Tema5 from "./secciones/Tema5.jsx";
import Referencias from "./secciones/Referencias.jsx";

// Nombres de los temas tal como aparecen en la consigna
const TEMAS = [
  { id: "tema-1", corto: "Tema 1", titulo: "Rastreo y navegación de un dron de reparto" },
  { id: "tema-2", corto: "Tema 2", titulo: "El salto del personaje: cómo los motores de juego falsean la gravedad" },
  { id: "tema-3", corto: "Tema 3", titulo: "Gravedad artificial por rotación en hábitats espaciales" },
  { id: "tema-4", corto: "Tema 4", titulo: "Llantas de Fórmula 1: la ventana de temperatura y el agarre" },
  { id: "tema-5", corto: "Tema 5", titulo: "El resorte detrás de un control háptico" },
];
const SECCIONES = [...TEMAS, { id: "referencias", corto: "Referencias", titulo: "Referencias" }];

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
  const activa = useSeccionActiva(SECCIONES.map((s) => s.id));

  return (
    <>
      <a className="saltar" href="#contenido">Saltar al contenido</a>

      <header className="portada">
        <div className="portada-interior">
          <p className="portada-etiqueta">Portafolio de evidencias · Avance 1</p>
          <h1>Física que se programa</h1>
          <p className="portada-sub">
            Cinemática y dinámica aplicadas al desarrollo de software: cinco casos, cada uno con su caso de uso en
            Ingeniería del Software y su recurso de apoyo.
          </p>
          <dl className="portada-datos">
            <div><dt>Autor</dt><dd>Pablo Andrés Chinchilla Moya</dd></div>
            <div><dt>Curso</dt><dd>FUN-18 Física I · Universidad CENFOTEC</dd></div>
            <div><dt>Sección y periodo</dt><dd>FCV1 · 2026-C3</dd></div>
            <div><dt>Docente facilitador</dt><dd>Andrés Castro Núñez</dd></div>
          </dl>
        </div>
      </header>

      <div className="layout">
        <nav className="indice" aria-label="Índice de temas">
          <p className="indice-titulo">Contenido</p>
          <ol>
            {SECCIONES.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className={activa === s.id ? "activo" : undefined} aria-current={activa === s.id ? "true" : undefined}>
                  <span className="indice-corto">{s.corto}</span>
                  {s.id !== "referencias" && <span className="indice-largo">{s.titulo}</span>}
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
              Los datos y el contenido de terceros están citados en formato APA 7 y se reúnen en la sección de
              referencias. Los cálculos marcados como “propios” fueron hechos por el autor a partir de las ecuaciones
              indicadas.
            </p>
          </section>

          <Tema1 />
          <Tema2 />
          <Tema3 />
          <Tema4 />
          <Tema5 />
          <Referencias />
        </main>
      </div>

      <footer className="pie">
        <p>
          Portafolio de evidencias · FUN-18 Física I · Avance 1. Los datos de Rodrigues et al. (2020) se usan con licencia
          CC BY 4.0 y fueron modificados como se explica en el Tema 1.
        </p>
      </footer>
    </>
  );
}
