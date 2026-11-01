import GraficaVoyagerTema9 from "../components/GraficaVoyagerTema9.jsx";
import { Seccion, Bloque, Eq, Tabla, Destacado } from "../components/ui.jsx";

export default function Tema9() {
  return (
    <Seccion
      id="tema-9"
      numero={9}
      titulo="Asistencia gravitatoria: cómo la Voyager ganó velocidad sin gastar combustible"
      concepto="gravitación universal, energía potencial gravitatoria y conservación del momento en el marco del planeta."
      recurso="visualización de datos"
    >
      <Bloque letra="A" titulo="Caso de uso en Ingeniería del Software">
        <h4>El caso concreto</h4>
        <p>
          El software de diseño de trayectorias interplanetarias. Un ejemplo actual es GMAT (<em>General Mission Analysis
          Tool</em>), el sistema de código abierto de la NASA para el diseño, la optimización y la navegación de misiones,
          desde la órbita baja hasta el espacio profundo (NASA, 2016). Con este tipo de cálculo se planificó el recorrido
          de la <strong>Voyager 2</strong>, la única nave que ha visitado los cuatro planetas gigantes: pasó junto a
          Júpiter el 9 de julio de 1979, Saturno el 26 de agosto de 1981, Urano el 24 de enero de 1986 y Neptuno el 25 de
          agosto de 1989 (NASA Science, 2026). Cada encuentro cambió su velocidad sin gastar combustible.
        </p>

        <h4>El concepto físico</h4>
        <p>
          Lejos del planeta, la nave se mueve con una velocidad relativa al planeta <i>v</i><sub>∞</sub>. Durante el
          encuentro solo actúa la gravedad del planeta, una fuerza conservativa: en el <strong>marco del planeta</strong>,
          la nave sube por su pozo de energía potencial (<i>U</i> = −<i>GMm</i>/<i>r</i>) con la misma energía con la que
          bajó, y sale con la misma rapidez con la que entró. Solo cambia la dirección, en un ángulo δ. En el{" "}
          <strong>marco del Sol</strong> hay que sumar la velocidad del planeta, y al girar el vector <i>v</i><sub>∞</sub>,
          la rapidez respecto al Sol sí cambia (Serway y Jewett, 2018):
        </p>
        <Eq etiqueta="Asistencia gravitatoria vista desde el planeta y desde el Sol">
          <div>Marco del planeta: |<i>v</i><sub>∞,entrada</sub>| = |<i>v</i><sub>∞,salida</sub>| &nbsp;&nbsp; sen(δ/2) = 1 / (1 + <i>r</i><sub>p</sub><i>v</i><sub>∞</sub>² / <i>GM</i>)</div>
          <div>Marco del Sol: <i>v</i> = <i>V</i><sub>planeta</sub> + <i>v</i><sub>∞</sub> &nbsp;&nbsp; Δ|<i>v</i>| ≤ 2 <i>v</i><sub>∞</sub> sen(δ/2)</div>
          <div>Momento: <i>m</i> Δ<i>v</i> = −<i>M</i> Δ<i>V</i><sub>planeta</sub> &nbsp;&nbsp; Escape del Sol: <i>v</i><sub>esc</sub> = √(2<i>GM</i><sub>☉</sub>/<i>r</i>)</div>
        </Eq>
        <p>
          Aquí <i>r</i><sub>p</sub> es la distancia de máxima aproximación y <i>M</i> la masa del planeta. La energía que
          gana la nave no sale de la nada: la pierde el planeta, que se frena una cantidad imperceptible porque su masa es
          enorme. Esa es la conservación del momento, y por eso la ganancia máxima depende de la velocidad del planeta
          alrededor del Sol.
        </p>

        <Tabla
          numero={15}
          titulo="Comprobación con los datos reales del paso por Júpiter (cálculo propio)"
          nota="Velocidades heliocéntricas de la Voyager 2 y de Júpiter el 6 de junio y el 5 de agosto de 1979, de JPL Horizons (Jet Propulsion Laboratory, 2026). Distancia de máxima aproximación: 645 000 km (NASA Science, 2026). GM de Júpiter = 1,267 × 10⁸ km³/s². Masa de la Voyager 2: 721,9 kg."
        >
          <table>
            <thead>
              <tr><th>Magnitud</th><th>Antes</th><th>Después</th><th>Qué muestra</th></tr>
            </thead>
            <tbody>
              <tr><td>Rapidez relativa a Júpiter, <i>v</i><sub>∞</sub></td><td>8,24 km/s</td><td>8,33 km/s</td><td>Prácticamente igual: se conserva la energía en el marco de Júpiter</td></tr>
              <tr><td>Ángulo de giro δ</td><td colSpan={2}>97° medido · 96° según la fórmula</td><td>La fórmula reproduce el desvío real</td></tr>
              <tr><td>Rapidez respecto al Sol</td><td>10,0 km/s</td><td>20,0 km/s</td><td>Ganó 10 km/s sin combustible</td></tr>
              <tr><td>Velocidad de escape del Sol a ≈ 5,4 UA</td><td colSpan={2}>≈ 18,1 km/s</td><td>Después de Júpiter quedó desligada del Sistema Solar</td></tr>
              <tr><td>Frenado de Júpiter, Δ<i>V</i> = <i>m</i>Δ<i>v</i>/<i>M</i></td><td colSpan={2}>721,9 · 10⁴ / 1,9 × 10²⁷ ≈ 4 × 10⁻²¹ m/s</td><td>El momento ganado lo pierde el planeta</td></tr>
            </tbody>
          </table>
        </Tabla>

        <h4>Por qué modelar la física resuelve el problema mejor</h4>
        <p>
          Una trayectoria guardada en una tabla no permite explorar fechas de lanzamiento ni secuencias de planetas, y una
          órbita de Kepler alrededor del Sol, calculada sin los encuentros, predice que la nave nunca saldría del Sistema
          Solar: con 10 km/s cerca de Júpiter, la Voyager 2 estaba por debajo de la velocidad de escape. Solo combinando
          la gravitación universal con el cambio de marco de referencia se entiende y se calcula la asistencia. El costo
          es la sensibilidad: el ángulo δ depende de <i>r</i><sub>p</sub>, así que pequeños errores en la aproximación
          cambian mucho el destino final, y el software tiene que integrar con precisión y corregir la trayectoria
          durante el vuelo.
        </p>
        <p>
          Este tema se conecta con el Tema 7: la asistencia gravitatoria es, en el marco del planeta, un “choque
          elástico” sin contacto (<i>e</i> = 1), donde la nave rebota en el campo gravitatorio de un cuerpo enorme que
          se mueve, igual que una pelota que rebota en una raqueta en movimiento sale más rápido de lo que llegó.
        </p>
      </Bloque>

      <Bloque letra="B" titulo="Recurso de apoyo: visualización de datos">
        <h4>De dónde salen los datos</h4>
        <p>
          Los datos son los vectores de velocidad de la Voyager 2 respecto al centro del Sol, cada 10 días, del 25 de
          agosto de 1977 al 1 de enero de 1990 (452 puntos), consultados en el sistema de efemérides JPL Horizons del
          Jet Propulsion Laboratory (2026), en el marco eclíptico J2000 y con la solución de trayectoria
          <code> Voyager_2_ST+refit2022_m</code>. Para cada punto calculé la rapidez |<i>v</i>| = √(<i>v</i><sub>x</sub>² + <i>v</i><sub>y</sub>² + <i>v</i><sub>z</sub>²)
          (script <code>scripts/voyager2_rapidez.py</code> del repositorio).
        </p>

        <div className="figura-ancha">
          <GraficaVoyagerTema9 />
        </div>

        <h4>Cómo leer la gráfica</h4>
        <p>
          Entre encuentros, la rapidez <strong>baja</strong> poco a poco: la nave se aleja del Sol y su energía cinética se
          convierte en energía potencial gravitatoria, como una piedra que sube. En cada encuentro hay un salto. Para
          medirlo sin el efecto local del planeta, la Tabla 16 compara la rapidez un mes antes y un mes después; los
          valores muestra a muestra son un poco mayores (por ejemplo, 10,5 → 21,6 km/s en Júpiter) porque justo al pasar
          la nave todavía está dentro del pozo de energía potencial del planeta.
        </p>

        <Tabla numero={16} titulo="Cambio de rapidez respecto al Sol en cada encuentro (un mes antes y un mes después)">
          <table>
            <thead>
              <tr><th>Encuentro</th><th>Antes [km/s]</th><th>Después [km/s]</th><th>Cambio [km/s]</th></tr>
            </thead>
            <tbody>
              <tr><td>Júpiter (9 jul 1979)</td><td>10,0</td><td>19,8</td><td>+9,8</td></tr>
              <tr><td>Saturno (26 ago 1981)</td><td>15,6</td><td>20,4</td><td>+4,8</td></tr>
              <tr><td>Urano (24 ene 1986)</td><td>17,9</td><td>19,7</td><td>+1,8</td></tr>
              <tr><td>Neptuno (25 ago 1989)</td><td>18,9</td><td>16,7</td><td>−2,2</td></tr>
            </tbody>
          </table>
        </Tabla>

        <Destacado titulo="Lo que muestran los datos">
          <p>
            El salto más grande es el de Júpiter, el planeta más masivo, que duplicó la rapidez de la sonda. Los
            siguientes son cada vez menores, porque los planetas exteriores son menos masivos y se mueven más despacio
            alrededor del Sol. Y en Neptuno la Voyager 2 <strong>perdió</strong> rapidez: la asistencia no siempre
            acelera, depende de hacia dónde gira el vector <i>v</i><sub>∞</sub>. En ese último encuentro la trayectoria
            se desvió fuertemente fuera del plano de las órbitas (en los datos, la componente <i>v</i><sub>z</sub> pasa
            de +0,7 a −11,9 km/s). Aun así, la sonda siguió por encima de la velocidad de escape del Sol y hoy viaja por
            el espacio interestelar.
          </p>
        </Destacado>
      </Bloque>
    </Seccion>
  );
}
