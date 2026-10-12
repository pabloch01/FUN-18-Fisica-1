import GraficasVuelo18 from "../components/GraficasVuelo18.jsx";
import { Seccion, Bloque, Eq, Tabla, Destacado } from "../components/ui.jsx";

export default function Tema1() {
  return (
    <Seccion
      id="tema-1"
      numero={1}
      titulo="Rastreo y navegación de un dron de reparto"
      concepto="cinemática en dos dimensiones, vectores de posición, velocidad y aceleración, y descomposición en componentes."
      recurso="visualización de datos"
    >
      <Bloque letra="A" titulo="Caso de uso en Ingeniería del Software">
        <h4>El caso concreto</h4>
        <p>
          Un servicio de logística de última milla con drones necesita un módulo de seguimiento que haga dos cosas:
          estimar la hora de llegada (ETA) de cada paquete y avisar si el dron se desvía de su ruta. El sistema solo
          recibe posiciones GNSS tomadas varias veces por segundo; la rapidez, el rumbo y la aceleración hay que
          calcularlas a partir de ellas. Como referencia real se usa un DJI Matrice 100 de reparto de paquetes,
          medido por Rodrigues et al. (2021) en 209 vuelos que suman 10 h 45 min y unos 65 km.
        </p>

        <h4>El concepto físico</h4>
        <p>
          Es cinemática en dos dimensiones con componentes (Serway y Jewett, 2018). La posición, la velocidad y la
          aceleración son vectores, y el software trabaja con sus componentes:
        </p>
        <Eq etiqueta="Definiciones de velocidad y aceleración en componentes">
          <div><i>r</i>(<i>t</i>) = (<i>x</i>, <i>y</i>) &nbsp;→&nbsp; <i>v</i> = d<i>r</i>/d<i>t</i> = (<i>v</i><sub>x</sub>, <i>v</i><sub>y</sub>) &nbsp;→&nbsp; <i>a</i> = d<i>v</i>/d<i>t</i> = (<i>a</i><sub>x</sub>, <i>a</i><sub>y</sub>)</div>
          <div>|<i>v</i>| = √(<i>v</i><sub>x</sub>² + <i>v</i><sub>y</sub>²) &nbsp;&nbsp; θ = atan2(<i>v</i><sub>y</sub>, <i>v</i><sub>x</sub>)</div>
          <div>Con datos muestreados: <i>v</i><sub>i</sub> ≈ (<i>r</i><sub>i+1</sub> − <i>r</i><sub>i</sub>)/Δ<i>t</i></div>
          <div><i>v</i><sub>suelo</sub> = <i>v</i><sub>aire</sub> + <i>w</i> &nbsp;&nbsp; ETA = <i>d</i><sub>restante</sub> / (<i>v</i><sub>suelo</sub> · û)</div>
        </Eq>
        <p>
          La última línea es la que importa para el software: el viento <i>w</i> se suma como vector, y el tiempo de
          llegada depende de la componente de la velocidad sobre el suelo en la dirección del siguiente punto de la
          ruta (û), no de la rapidez que marca el controlador.
        </p>

        <Tabla
          numero={1}
          titulo="Ejemplo numérico propio: un tramo de 300 m volado a 12 m/s respecto al aire"
          nota="Con viento cruzado el dron debe apuntar θ = arcsin(5/12) ≈ 24,6° contra el viento y solo avanza √(12² − 5²) ≈ 10,9 m/s sobre la ruta."
        >
          <table>
            <thead>
              <tr><th>Condición</th><th>Rapidez sobre la ruta</th><th>Tiempo</th></tr>
            </thead>
            <tbody>
              <tr><td>Sin viento</td><td>12,0 m/s</td><td>25,0 s</td></tr>
              <tr><td>Viento de frente de 5 m/s</td><td>7,0 m/s</td><td>42,9 s</td></tr>
              <tr><td>Viento cruzado de 5 m/s</td><td>10,9 m/s</td><td>27,5 s</td></tr>
            </tbody>
          </table>
        </Tabla>

        <h4>Por qué modelar la física resuelve el problema mejor</h4>
        <p>
          Las alternativas no físicas serían una tabla de tiempos fijos por ruta o calcular ETA = distancia / velocidad
          nominal. Ambas tratan la rapidez como un escalar constante, y los datos reales muestran lo que cuesta
          eso. Entre tres vuelos con el mismo plan (12 m/s, 75 m de altura y 500 g de carga), el vuelo 129 sufrió más
          viento, voló más lento, pasó más tiempo en crucero y consumió 24,8 Wh frente a 21,8 y 21,3 Wh de los otros
          dos (Rodrigues et al., 2021). Eso es entre un 14 % y un 16 % más de energía (cálculo propio). Una estimación
          basada en el tiempo nominal subestimaría el consumo de ese vuelo, y una trayectoria precalculada no lo
          detectaría.
        </p>
        <p>
          El segundo problema es el ruido. Derivar la aceleración por diferencias finitas lo amplifica: con la
          precisión de velocidad del sensor (±0,1 m/s; Rodrigues et al., 2021) y el intervalo medio de este vuelo
          (Δt ≈ 0,11 s), el error de la aceleración sería de σ<sub>a</sub> ≈ √2 · 0,1 / 0,11 ≈ 1,3 m/s² (estimación propia).
          Por eso el software debe suavizar las señales antes de derivar, como se hizo en la gráfica de abajo.
        </p>
      </Bloque>

      <Bloque letra="B" titulo="Recurso de apoyo: visualización de datos">
        <h4>De dónde salen los datos</h4>
        <p>
          La gráfica usa el vuelo 18 del conjunto de datos publicado por Rodrigues et al. (2020): un dron DJI Matrice
          100 recorriendo una ruta triangular a 4 m/s, a 25 m de altura y con 250 g de carga (ruta R1). El archivo
          contiene 1 135 filas en 170,2 s, con un intervalo mediano de 0,11 s. Los datos se publican con licencia
          CC BY 4.0; aquí se modificaron como se indica abajo.
        </p>

        <h4>Cómo se procesaron</h4>
        <ol>
          <li>La latitud y la longitud se convirtieron a metros locales con origen en el punto de despegue, usando <i>x</i> = Δλ · (π/180) · <i>R</i><sub>T</sub> · cos φ<sub>0</sub> y <i>y</i> = Δφ · (π/180) · <i>R</i><sub>T</sub>, con <i>R</i><sub>T</sub> = 6,371 × 10⁶ m.</li>
          <li>Las componentes <code>velocity_x</code> y <code>velocity_y</code> del archivo no están en el marco Este-Norte: giran con el dron. Se rotaron con el ángulo de guiñada del cuaternión de orientación. La comprobación fue integrar esa velocidad y compararla con la ruta GNSS: el recorrido da 464 m contra 471 m, y la diferencia máxima de posición es de 3,4 m (el sensor tiene una precisión horizontal de ±2 m).</li>
          <li><code>velocity_z</code> resultó positiva hacia arriba (correlación de 0,92 con la derivada de la altitud) y la altitud se grafica relativa al despegue.</li>
          <li>La aceleración se obtuvo derivando la velocidad suavizada con una media móvil de 5 muestras. El acelerómetro del archivo no se usó: su componente vertical incluye la gravedad (−9,807 m/s² en reposo) y sus componentes horizontales no coincidieron con la derivada de la velocidad en ningún marco probado.</li>
        </ol>

        <div className="figura-ancha">
          <GraficasVuelo18 />
        </div>

        <h4>Cómo leer las gráficas</h4>
        <p>
          La trayectoria (a) es un triángulo que cierra a 0,5 m del punto de partida. En el panel (c) se ve la
          naturaleza vectorial de la velocidad: en el tramo 1 las componentes son <i>v</i><sub>E</sub> ≈ 3,6 m/s y
          <i> v</i><sub>N</sub> ≈ 1,7 m/s, de modo que |<i>v</i>| = 4,0 m/s y el rumbo es atan2(3,6; 1,7) ≈ 65°. En el
          tramo 2 el dron vuela hacia el sur-suroeste y las dos componentes cambian de signo, pero la rapidez sigue
          siendo de 4 m/s. Las franjas de aceleración (d) aparecen donde la rapidez cae a cero en cada vértice, con
          valores de hasta unos 4 m/s² en las detenciones.
        </p>

        <Tabla numero={2} titulo="Fases del vuelo 18 identificadas en los datos">
          <table>
            <thead>
              <tr><th>Fase</th><th>Intervalo [s]</th><th>Resultado medido</th></tr>
            </thead>
            <tbody>
              <tr><td>Ascenso vertical</td><td>9,7 – 18,1</td><td>≈ 2,9 m/s hacia arriba</td></tr>
              <tr><td>Tramo 1</td><td>19,7 – 54,9</td><td>138 m, rumbo 65°</td></tr>
              <tr><td>Tramo 2</td><td>57,8 – 107,5</td><td>197 m, rumbo 206°</td></tr>
              <tr><td>Tramo 3</td><td>110,1 – 141,8</td><td>125 m, rumbo 341°</td></tr>
              <tr><td>Descenso</td><td>142,9 – 164,6</td><td>≈ 1,05 m/s hacia abajo</td></tr>
            </tbody>
          </table>
        </Tabla>

        <Destacado titulo="Lo que muestran los datos de este vuelo">
          <p>
            En crucero la rapidez mediana es de 3,97 m/s, casi la programada (4 m/s). Al arrancar cada tramo el dron
            llega a 4,6 m/s, un 15 % por encima, y se estabiliza en cerca de un segundo. El artículo describe el
            ascenso como de ≈ 2,5 m/s y el descenso como de ≈ 1,5 m/s; en este vuelo se midieron 2,9 y 1,05 m/s.
            La altitud relativa baja hasta −0,9 m y termina en −0,6 m, algo normal porque la precisión vertical del GNSS es de ±5 m.
          </p>
        </Destacado>
      </Bloque>
    </Seccion>
  );
}
