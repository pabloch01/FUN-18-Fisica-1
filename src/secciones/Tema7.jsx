import SimulacionRebote from "../components/SimulacionRebote.jsx";
import { Seccion, Bloque, Eq, Tabla, Destacado } from "../components/ui.jsx";

export default function Tema7() {
  return (
    <Seccion
      id="tema-7"
      numero={7}
      titulo="El coeficiente de restitución en un motor de videojuego: por qué la pelota rebota mal"
      concepto="colisiones elásticas e inelásticas, conservación del momento lineal y coeficiente de restitución."
      recurso="simulación interactiva"
    >
      <Bloque letra="A" titulo="Caso de uso en Ingeniería del Software">
        <h4>El caso concreto</h4>
        <p>
          El motor de física de Unity. Cada material físico tiene un valor de <em>bounciness</em>: con 0 el objeto no
          rebota y con 1 rebota sin perder energía (Unity Technologies, s. f.-b). Cuando dos objetos chocan, Unity
          combina los valores de ambos materiales con una regla que elige el desarrollador: <em>Average</em>{" "}
          (promedio), <em>Minimum</em> (el menor), <em>Maximum</em> (el mayor) o <em>Multiply</em> (el producto)
          (Unity Technologies, s. f.-c). Además, los choques cuya velocidad relativa está por debajo de un umbral,{" "}
          <code>bounceThreshold</code> (2 m/s por defecto), se tratan como inelásticos y no rebotan (Unity
          Technologies, s. f.-a). Esas dos decisiones de software son las que hacen que una pelota “rebote mal”.
        </p>

        <h4>El concepto físico</h4>
        <p>
          En cualquier choque entre dos cuerpos se conserva el momento lineal, porque las fuerzas que se hacen son un par
          de acción y reacción. Lo que no siempre se conserva es la energía cinética. El coeficiente de restitución
          <i> e</i> mide cuánta velocidad relativa se recupera después del choque (Serway y Jewett, 2018):
        </p>
        <Eq etiqueta="Momento lineal, coeficiente de restitución y energía perdida">
          <div><i>m</i><sub>1</sub><i>v</i><sub>1</sub> + <i>m</i><sub>2</sub><i>v</i><sub>2</sub> = <i>m</i><sub>1</sub><i>v</i><sub>1</sub>′ + <i>m</i><sub>2</sub><i>v</i><sub>2</sub>′ &nbsp;&nbsp; <i>e</i> = −(<i>v</i><sub>2</sub>′ − <i>v</i><sub>1</sub>′) / (<i>v</i><sub>2</sub> − <i>v</i><sub>1</sub>)</div>
          <div>Δ<i>K</i> = ½ μ (1 − <i>e</i>²)(<i>v</i><sub>1</sub> − <i>v</i><sub>2</sub>)² &nbsp;&nbsp; μ = <i>m</i><sub>1</sub><i>m</i><sub>2</sub>/(<i>m</i><sub>1</sub> + <i>m</i><sub>2</sub>)</div>
          <div><i>e</i> = 1: elástico &nbsp;&nbsp; 0 &lt; <i>e</i> &lt; 1: inelástico &nbsp;&nbsp; <i>e</i> = 0: perfectamente inelástico</div>
          <div>Contra el piso (masa enorme): <i>v</i>′ = −<i>e</i><i>v</i> &nbsp;&nbsp; <i>h</i><sub>n</sub> = <i>e</i><sup>2n</sup><i>h</i><sub>0</sub> &nbsp;&nbsp; <i>e</i> = √(<i>h</i><sub>rebote</sub>/<i>h</i><sub>caída</sub>)</div>
        </Eq>
        <p>
          Cuando la pelota choca contra el piso también se conserva el momento: el que pierde la pelota lo gana la
          Tierra, pero su masa es tan grande que su cambio de velocidad es imperceptible. Por eso basta con escribir
          <i> v</i>′ = −<i>e</i><i>v</i>.
        </p>

        <h4>Qué es un rebote realista: un dato de norma</h4>
        <p>
          La Federación Internacional de Tenis exige que una pelota tipo 2, soltada desde 254 cm sobre un bloque rígido,
          rebote entre 135 y 147 cm (International Tennis Federation [ITF], 2023). Con <i>e</i> = √(<i>h</i><sub>rebote</sub>/<i>h</i><sub>caída</sub>),
          eso corresponde a <strong>0,73 ≤ <i>e</i> ≤ 0,76</strong> (cálculo propio, sin contar la resistencia del aire).
          Ese es el rango que un jugador reconoce como “una pelota de tenis normal”.
        </p>

        <Tabla
          numero={12}
          titulo="Ejemplo numérico propio: la misma pelota (e = 0,75) sobre un piso con e = 0,3, según la regla de Unity"
          nota="En la física real, e es una propiedad del par de materiales que chocan, no de cada objeto por separado; la regla de combinación es una aproximación del motor."
        >
          <table>
            <thead>
              <tr><th>Regla</th><th>Cálculo</th><th><i>e</i> efectivo</th><th>Altura del primer rebote desde 2 m</th></tr>
            </thead>
            <tbody>
              <tr><td>Average</td><td>(0,75 + 0,3)/2</td><td>0,525</td><td>0,55 m</td></tr>
              <tr><td>Minimum</td><td>mín(0,75; 0,3)</td><td>0,300</td><td>0,18 m</td></tr>
              <tr><td>Maximum</td><td>máx(0,75; 0,3)</td><td>0,750</td><td>1,13 m</td></tr>
              <tr><td>Multiply</td><td>0,75 · 0,3</td><td>0,225</td><td>0,10 m</td></tr>
            </tbody>
          </table>
        </Tabla>

        <Tabla
          numero={13}
          titulo="Ejemplo numérico propio: una pelota con e = 0,75 soltada desde 2 m y el umbral de 2 m/s"
          nota="Rapidez de llegada vₙ = eⁿ⁻¹·√(2gh₀); altura siguiente = (e·vₙ)²/(2g)."
        >
          <table>
            <thead>
              <tr><th>Choque</th><th>Llega a [m/s]</th><th>Sin umbral: sube a [m]</th><th>Con umbral de 2 m/s</th></tr>
            </thead>
            <tbody>
              <tr><td>1</td><td>6,26</td><td>1,125</td><td>rebota</td></tr>
              <tr><td>2</td><td>4,70</td><td>0,633</td><td>rebota</td></tr>
              <tr><td>3</td><td>3,52</td><td>0,356</td><td>rebota</td></tr>
              <tr><td>4</td><td>2,64</td><td>0,200</td><td>rebota</td></tr>
              <tr><td>5</td><td>1,98</td><td>0,113</td><td><strong>se queda quieta de golpe</strong></td></tr>
            </tbody>
          </table>
        </Tabla>

        <h4>Por qué modelar la física resuelve el problema mejor</h4>
        <p>
          Una animación de rebote hecha a mano no responde a la altura de caída, al material del piso ni a un choque con
          otro objeto: habría que animar cada caso. Con el coeficiente de restitución, una sola ecuación produce todos los
          rebotes, y la conservación del momento resuelve cualquier choque entre objetos. Lo que cuesta es entender las
          aproximaciones del motor. La regla de combinación hace que una pelota realista sobre un piso con bounciness
          bajo rebote como una pelota “muerta” (Tabla 12). El umbral, que el motor usa para que los objetos en reposo no
          tiemblen con microrrebotes, corta de golpe el último rebote visible (Tabla 13). Y si el desarrollador pone un
          valor mayor que 1, cada choque crea energía de la nada, algo que ninguna pelota real puede hacer.
        </p>
        <p>
          Este tema se conecta con el Tema 2: la pelota cae con la misma ecuación de caída libre que el personaje, y el
          motor que la calcula es el mismo tipo de integrador por pasos de tiempo.
        </p>
      </Bloque>

      <Bloque letra="B" titulo="Recurso de apoyo: simulación interactiva">
        <p>
          La simulación recalcula todo cada vez que se mueve un control. En el modo 1, el control principal es el{" "}
          <strong>coeficiente de restitución de la pelota</strong>; también se pueden cambiar el coeficiente del piso,
          la regla de combinación del motor, el umbral de rebote y la altura inicial. La línea punteada es un rebote
          realista (<i>e</i> = 0,75 sin umbral) para comparar. En el modo 2, dos carritos chocan de frente y la tabla
          muestra que el momento se conserva siempre, mientras que la energía cinética se pierde según <i>e</i>.
        </p>

        <SimulacionRebote />

        <Destacado titulo="Qué probar">
          <p>
            Con “Piso muerto”, la misma pelota de tenis rebota apenas 10 cm porque el motor multiplica los dos
            coeficientes. Con “Umbral de 2 m/s”, la pelota se detiene de golpe en el quinto choque, aunque todavía
            debería subir 11 cm. Con “e &gt; 1”, la pelota sube cada vez más. En el modo 2, el caso de verificación
            (2 kg a 3 m/s contra 1 kg en reposo, <i>e</i> = 0,5) da 1,5 m/s y 3,0 m/s después del choque, con el momento
            igual a 6 kg·m/s antes y después y una pérdida de 2,25 J de energía cinética.
          </p>
        </Destacado>
      </Bloque>
    </Seccion>
  );
}
