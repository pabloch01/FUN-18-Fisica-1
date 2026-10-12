import SimulacionSalto from "../components/SimulacionSalto.jsx";
import { Seccion, Bloque, Eq, Tabla, Destacado } from "../components/ui.jsx";

export default function Tema2() {
  return (
    <Seccion
      id="tema-2"
      numero={2}
      titulo="El salto del personaje: cómo los motores de juego falsean la gravedad"
      concepto="caída libre y tiro parabólico; por qué casi ningún juego usa 9,81 m/s² y cómo se ajustan la altura del salto y el tiempo en el aire."
      recurso="simulación interactiva"
    >
      <Bloque letra="A" titulo="Caso de uso en Ingeniería del Software">
        <h4>El caso concreto</h4>
        <p>
          El motor de movimiento de un personaje en un videojuego de plataformas 2D. Quien diseña los niveles piensa en
          “cuánto sube y cuánto tarda el salto”, no en metros por segundo al cuadrado. Pittman (2016), en su charla
          <em> Math for game programmers: Building a better jump</em>, propone armar el salto a partir de datos
          cercanos al diseñador, como la altura y la distancia deseadas, y que el programa calcule los parámetros
          físicos. Los motores también separan la gravedad global de la que sufre cada objeto: en Unity 2D, por ejemplo,
          cada cuerpo tiene un <code>gravityScale</code> que fija qué proporción de la gravedad le afecta (Unity
          Technologies, s. f.).
        </p>

        <h4>El concepto físico</h4>
        <p>
          Con aceleración constante, el movimiento vertical es el de la caída libre (Serway y Jewett, 2018). En el
          ápice la velocidad vertical es cero, y eso permite despejar los parámetros a partir de lo que pide el
          diseñador:
        </p>
        <Eq etiqueta="Ecuaciones del salto y despeje de los parámetros de diseño">
          <div><i>y</i>(<i>t</i>) = <i>v</i><sub>0</sub><i>t</i> − ½<i>g</i><i>t</i>² &nbsp;&nbsp; <i>x</i>(<i>t</i>) = <i>v</i><sub>x</sub><i>t</i></div>
          <div><i>t</i><sub>ap</sub> = <i>v</i><sub>0</sub>/<i>g</i> &nbsp;&nbsp; <i>h</i> = <i>v</i><sub>0</sub>²/(2<i>g</i>)</div>
          <div>Datos de diseño (<i>h</i>, <i>t</i><sub>ap</sub>): &nbsp; <b><i>g</i> = 2<i>h</i>/<i>t</i><sub>ap</sub>²</b> &nbsp;&nbsp; <b><i>v</i><sub>0</sub> = 2<i>h</i>/<i>t</i><sub>ap</sub></b></div>
          <div>Bajada con gravedad <i>g</i><sub>b</sub> = <i>k</i>·<i>g</i>: &nbsp; <i>t</i><sub>b</sub> = √(2<i>h</i>/(<i>k</i><i>g</i>))</div>
        </Eq>

        <Tabla
          numero={3}
          titulo="Ejemplo numérico propio: un salto de 2,0 m de altura"
          nota="Con g = 25 m/s² el personaje es 2,55 veces más “pesado” que en la Tierra, pero el salto se siente ágil: sube en 0,40 s en lugar de 0,64 s."
        >
          <table>
            <thead>
              <tr><th>Gravedad</th><th><i>g</i> [m/s²]</th><th><i>v</i><sub>0</sub> [m/s]</th><th><i>t</i><sub>ap</sub> [s]</th><th>Tiempo en el aire [s]</th></tr>
            </thead>
            <tbody>
              <tr><td>Elegida por diseño (<i>t</i><sub>ap</sub> = 0,40 s)</td><td>25,00</td><td>10,00</td><td>0,40</td><td>0,80</td></tr>
              <tr><td>Terrestre (9,81 m/s²)</td><td>9,81</td><td>6,26</td><td>0,64</td><td>1,28</td></tr>
            </tbody>
          </table>
        </Tabla>

        <h4>Por qué modelar la física resuelve el problema mejor</h4>
        <p>
          Con una animación pregrabada del salto, cada cambio de altura o de separación entre plataformas obliga a
          rehacer la curva a mano. Con el modelo, las restricciones del nivel (cuánto debe subir y cuánto debe tardar)
          fijan <i>g</i> y <i>v</i><sub>0</sub> directamente, y los valores se pueden ajustar sin tocar el resto del
          nivel. El mismo modelo permite usar una gravedad distinta al descender, algo que la charla de Pittman (2016)
          incluye entre las formas de dar mejor sensación a un salto. Con g = 9,81 m/s² y una altura de 2 m el
          personaje queda en el aire 1,28 s, casi el doble de lo que dura el salto de diseño, y se siente flotante.
        </p>
      </Bloque>

      <Bloque letra="B" titulo="Recurso de apoyo: simulación interactiva">
        <p>
          La simulación recalcula la trayectoria cada vez que se mueve un control, sin animaciones pregrabadas.
          Los dos controles principales son el <strong>impulso de salto</strong> <i>v</i><sub>0</sub> y la
          <strong> gravedad</strong> <i>g</i>. También se puede cambiar a modo diseño (altura y tiempo al ápice),
          sumar una velocidad horizontal, cambiar el factor de caída <i>k</i> y comparar con el mismo salto bajo la
          gravedad terrestre.
        </p>

        <SimulacionSalto />

        <h4>Cómo comprobar la simulación</h4>
        <p>
          Los botones A a D cargan los casos de la Tabla 4. Los valores analíticos que aparecen en la simulación
          coinciden con ellos.
        </p>
        <Tabla numero={4} titulo="Casos de verificación de la simulación">
          <table>
            <thead>
              <tr><th>Caso</th><th><i>v</i><sub>0</sub> [m/s]</th><th><i>g</i> [m/s²]</th><th><i>k</i></th><th><i>h</i> [m]</th><th><i>t</i><sub>ap</sub> [s]</th><th>Tiempo total [s]</th></tr>
            </thead>
            <tbody>
              <tr><td>A</td><td>6,263</td><td>9,807</td><td>1</td><td>2,00</td><td>0,639</td><td>1,277</td></tr>
              <tr><td>B</td><td>10</td><td>25</td><td>1</td><td>2,00</td><td>0,400</td><td>0,800</td></tr>
              <tr><td>C</td><td>10</td><td>9,807</td><td>1</td><td>5,10</td><td>1,020</td><td>2,039</td></tr>
              <tr><td>D</td><td>10</td><td>25</td><td>2</td><td>2,00</td><td>0,400</td><td>0,683</td></tr>
            </tbody>
          </table>
        </Tabla>

        <Destacado titulo="El error de la integración numérica">
          <p>
            El panel de resultados compara la solución analítica con una integración numérica (Euler semi-implícito,
            Δt = 1/60 s), que es como un motor de juego calcula cada fotograma. La diferencia no es cero: en el caso B
            la altura numérica es 1,917 m frente a 2,000 m, y el tiempo total es 0,783 s frente a 0,800 s. Es un error
            sistemático del método, de orden ½·<i>g</i>·Δ<i>t</i>·<i>t</i><sub>ap</sub> = ½ · 25 · (1/60) · 0,40 ≈ 0,083 m, que coincide con
            lo medido. Mientras más grande es <i>g</i> o más grande es Δ<i>t</i>, más se nota.
          </p>
        </Destacado>
      </Bloque>
    </Seccion>
  );
}
