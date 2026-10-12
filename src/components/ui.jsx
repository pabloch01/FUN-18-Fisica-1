// Piezas de presentación reutilizadas en todas las secciones

export function Seccion({ id, numero, titulo, concepto, recurso, children }) {
  return (
    <section id={id} className="tema" aria-labelledby={`${id}-titulo`}>
      <header className="tema-cabecera">
        <span className="tema-numero" aria-hidden="true">{numero}</span>
        <div>
          <h2 id={`${id}-titulo`}>Tema {numero} — {titulo}</h2>
          <p className="tema-meta">
            <span><strong>Concepto:</strong> {concepto}</span>
            <span className="etiqueta-recurso">Recurso: {recurso}</span>
          </p>
        </div>
      </header>
      {children}
    </section>
  );
}

export function Bloque({ letra, titulo, children }) {
  return (
    <div className="bloque">
      <h3><span className="bloque-letra">{letra}</span>{titulo}</h3>
      {children}
    </div>
  );
}

export function Eq({ children, etiqueta }) {
  return (
    <div className="eq" role="math" aria-label={etiqueta}>
      {children}
    </div>
  );
}

export function Tabla({ numero, titulo, children, nota }) {
  return (
    <figure className="tabla">
      <figcaption>
        <strong>Tabla {numero}.</strong> <em>{titulo}</em>
      </figcaption>
      <div className="tabla-scroll">{children}</div>
      {nota && <p className="nota"><em>Nota.</em> {nota}</p>}
    </figure>
  );
}

export function Figura({ numero, titulo, children, nota }) {
  return (
    <figure className="figura">
      {children}
      <figcaption>
        <strong>Figura {numero}.</strong> {titulo}
        {nota && (<> <em>Nota.</em> {nota}</>)}
      </figcaption>
    </figure>
  );
}

// Marca visible de lo que falta por completar antes de entregar
export function Pendiente({ children }) {
  return <mark className="pendiente" title="Completar antes de entregar">[{children}]</mark>;
}

export function Destacado({ titulo, children }) {
  return (
    <aside className="destacado">
      {titulo && <strong>{titulo}</strong>}
      {children}
    </aside>
  );
}
