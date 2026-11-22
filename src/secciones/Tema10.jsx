import SimulacionResorte from "../components/SimulacionResorte.jsx";
import { Seccion, Bloque, Eq, Tabla, Destacado } from "../components/ui.jsx";

export default function Tema10() {
  return (
    <Seccion
      id="tema-10"
      numero={10}
      titulo="Spring animations: el resorte amortiguado detrás de las animaciones de iOS y de Framer Motion"
      concepto="oscilación amortiguada, constante elástica y coeficiente de amortiguamiento; por qué las interfaces modernas describen sus animaciones con rigidez y amortiguamiento en vez de con una duración."
      recurso="simulación interactiva"
    >
      <Bloque letra="A" titulo="Caso de uso en Ingeniería del Software">
        <h4>El caso concreto</h4>
        <p>
          Las bibliotecas de animación de interfaces. En <strong>Framer Motion</strong> (hoy publicada como Motion), una
          transición de tipo <code>spring</code> no se configura con una duración, sino con <code>stiffness</code>{" "}
          (rigidez), <code>damping</code> (amortiguamiento) y <code>mass</code> (masa); su documentación advierte que con
          un amortiguamiento de 0 el resorte oscila indefinidamente (Motion, s. f.). Los valores típicos de Framer Motion
          son <i>k</i> = 100, <i>c</i> = 10 y <i>m</i> = 1 (Heckel, 2020). En <strong>iOS</strong>, SwiftUI ofrece el tipo{" "}
          <code>Spring</code> con los inicializadores <code>Spring(mass:stiffness:damping:)</code> y{" "}
          <code>Spring(response:dampingRatio:)</code>, donde la razón de amortiguamiento se define como la fracción del
          amortiguamiento necesario para el amortiguamiento crítico (Apple Inc., s. f.).
        </p>

        <h4>El concepto físico</h4>
        <p>
          Cada elemento animado se trata como una masa unida a su posición de destino por un resorte (ley de Hooke) y
          frenada por una fuerza proporcional a su velocidad. Es el oscilador armónico amortiguado (Serway y Jewett, 2018,
          cap. 15):
        </p>
        <Eq etiqueta="Oscilador armónico amortiguado">
          <div><i>m</i> <i>x</i>″ = −<i>k</i> (<i>x</i> − <i>x</i><sub>destino</sub>) − <i>c</i> <i>x</i>′</div>
          <div><i>ω</i><sub>0</sub> = √(<i>k</i>/<i>m</i>) &nbsp;&nbsp; <i>c</i><sub>c</sub> = 2√(<i>k</i>·<i>m</i>) &nbsp;&nbsp; <i>ζ</i> = <i>c</i> / <i>c</i><sub>c</sub></div>
          <div><i>ζ</i> &lt; 1: subamortiguado (rebota) &nbsp;&nbsp; <i>ζ</i> &gt; 1: sobreamortiguado (llega lento)</div>
          <div><i>ζ</i> = 1: crítico (llega lo más rápido posible sin pasarse)</div>
          <div>Subamortiguado: <i>x</i>(<i>t</i>) − 1 = −<i>e</i><sup>−<i>ζω</i>₀<i>t</i></sup> [cos(<i>ω</i><sub>d</sub><i>t</i>) + (<i>ζω</i><sub>0</sub>/<i>ω</i><sub>d</sub>) sen(<i>ω</i><sub>d</sub><i>t</i>)], &nbsp; <i>ω</i><sub>d</sub> = <i>ω</i><sub>0</sub>√(1 − <i>ζ</i>²)</div>
        </Eq>
        <p>
          La documentación de Apple permite comprobar que SwiftUI usa exactamente este modelo. Sus dos ejemplos de
          conversión entre parámetros cuadran con las ecuaciones de arriba si la «respuesta» es el período natural,{" "}
          2π/<i>ω</i><sub>0</sub>, y el «rebote» (<i>bounce</i>) es 1 − <i>ζ</i>:
        </p>

        <Tabla
          numero={17}
          titulo="Los parámetros de SwiftUI comprobados con las ecuaciones del oscilador amortiguado (cálculo propio)"
          nota="Valores de entrada y de salida de la documentación de Spring (Apple Inc., s. f.); las dos últimas columnas son cálculo propio."
        >
          <table>
            <thead>
              <tr><th>Ejemplo de Apple</th><th>Equivale a</th><th><i>ζ</i> = <i>c</i>/(2√(<i>km</i>))</th><th>2π/<i>ω</i><sub>0</sub></th></tr>
            </thead>
            <tbody>
              <tr><td><code>Spring(duration: 0.5, bounce: 0.3)</code></td><td><i>m</i> = 1, <i>k</i> = 157,9, <i>c</i> = 17,6</td><td>17,6 / 25,13 = 0,70 = 1 − 0,3</td><td>2π/12,57 = 0,50 s</td></tr>
              <tr><td><code>Spring(mass: 1, stiffness: 100, damping: 10)</code></td><td>duración 0,63 s, rebote 0,5</td><td>10 / 20 = 0,50 = 1 − 0,5</td><td>2π/10 = 0,63 s</td></tr>
            </tbody>
          </table>
        </Tabla>

        <h4>Por qué modelar la física resuelve el problema mejor</h4>
        <p>
          Una animación por duración (por ejemplo, 300 ms con una curva <i>ease-in-out</i>) es una trayectoria
          precalculada: si el usuario cambia de opinión a la mitad, por ejemplo al soltar un panel que venía arrastrando o
          al tocar de nuevo un botón, la curva tiene que empezar desde cero y la velocidad del elemento salta de golpe. Un
          resorte no tiene ese problema, porque su estado es la posición y la velocidad actuales: basta con cambiar el
          destino y la ecuación continúa sin saltos, incluso heredando la velocidad del dedo. Además, la sensación
          completa del movimiento queda en un solo número con significado físico, <i>ζ</i>: el diseñador no ajusta
          fotogramas, ajusta cuánto rebota.
        </p>
        <p>
          Lo que cuesta es que la duración ya no se elige, sale de la física: un resorte sobreamortiguado tarda más de lo
          que parece y uno con <i>c</i> = 0 nunca termina. Por eso las bibliotecas añaden umbrales para dar la
          animación por acabada (<code>restSpeed</code> y <code>restDelta</code> en Motion) y Apple creó la forma{" "}
          <code>duration</code> y <code>bounce</code>, que traduce internamente a <i>k</i> y <i>c</i> (Tabla 17). También
          hay que integrar con cuidado: con una rigidez alta y un paso de tiempo grande, un integrador simple puede
          inyectar energía y hacer que la animación tiemble, el mismo problema de estabilidad del resorte virtual háptico.
        </p>
        <p>
          Este tema se conecta con el Tema 5: el gatillo háptico y la animación usan la misma ley de Hooke, uno para
          producir una fuerza que siente el dedo y el otro para mover píxeles. Y con el Tema 12: aquí el amortiguamiento se
          elige para que la oscilación muera pronto; en un puente, cuando el amortiguamiento efectivo se vuelve negativo,
          la oscilación crece hasta destruirlo.
        </p>
      </Bloque>

      <Bloque letra="B" titulo="Recurso de apoyo: simulación interactiva">
        <p>
          La simulación integra en vivo la ecuación <i>m</i><i>x</i>″ = −<i>k</i>(<i>x</i> − destino) − <i>c</i><i>x</i>′
          con el método de Runge-Kutta de cuarto orden, a pasos de 1/240 s. Los controles de <strong>rigidez</strong>,{" "}
          <strong>amortiguamiento</strong> y masa cambian la tarjeta rosada; las otras tres usan la misma rigidez y masa,
          pero con el amortiguamiento que da <i>ζ</i> = 0,3, <i>ζ</i> = 1 y <i>ζ</i> = 2, para ver lado a lado los
          regímenes subamortiguado, crítico y sobreamortiguado. La gráfica muestra la posición contra el tiempo de las
          cuatro.
        </p>

        <SimulacionResorte />

        <Destacado titulo="Qué probar">
          <p>
            Con el ajuste de Framer Motion (<i>k</i> = 100, <i>c</i> = 10, <i>m</i> = 1) la razón es <i>ζ</i> = 0,5: la
            tarjeta se pasa del destino un 16 % y vuelve. Sube el amortiguamiento hasta 20 N·s/m y llegarás al crítico, el
            más rápido sin rebote. Pon <i>c</i> = 0 y la tarjeta oscila para siempre. Si duplicas la masa con el mismo
            <i> k</i>, el movimiento se vuelve más lento y además rebota más, porque <i>c</i><sub>c</sub> = 2√(<i>km</i>)
            crece y <i>ζ</i> baja.
          </p>
        </Destacado>
      </Bloque>
    </Seccion>
  );
}
