import { Eq } from "../components/ui.jsx";

// Sección de cierre obligatoria de la entrega final
export default function QueAprendi() {
  return (
    <section id="que-aprendi" className="tema cierre" aria-labelledby="que-aprendi-titulo" style={{ "--cat": "#f7c873" }}>
      <h2 id="que-aprendi-titulo">Qué aprendí</h2>

      <div className="bloque">
        <h3><span className="bloque-letra">A</span>El mapa de conexiones</h3>
        <p>
          Al terminar los trece temas, lo que más me sorprendió es que aplicaciones que no tienen nada que ver entre sí
          comparten exactamente la misma física. Estos son tres pares.
        </p>

        <h4>Tema 5 (gatillo háptico) ↔ Tema 10 (animaciones con resorte): la ley de Hooke</h4>
        <p>
          Un gatillo de PlayStation y una tarjeta que rebota en la pantalla de un iPhone parecen no tener relación: uno es
          un motor que empuja un dedo y el otro son píxeles. Pero los dos programan un resorte que no existe con la misma
          ecuación, <i>F</i> = −<i>k</i><i>x</i>, más un término de amortiguamiento −<i>c</i><i>v</i>. En el gatillo, la
          fuerza la siente la mano; en la animación, la «fuerza» solo decide hacia dónde se mueve un elemento. En los dos
          casos el amortiguamiento define la sensación (un gatillo firme o esponjoso, una animación que rebota o que
          frena suave), y en los dos un resorte muy rígido calculado con pasos de tiempo grandes puede volverse inestable:
          el gatillo zumba y la animación tiembla, porque el integrador le inyecta energía al sistema.
        </p>

        <h4>Tema 7 (rebote en un motor de juego) ↔ Tema 9 (asistencia gravitatoria): choques y conservación del momento</h4>
        <p>
          Una pelota que rebota en Unity y la Voyager 2 pasando junto a Júpiter son el mismo problema de choque. En el
          marco de Júpiter, la sonda entra y sale prácticamente con la misma rapidez (8,24 y 8,33 km/s): es un choque elástico, con{" "}
          <i>e</i> = 1, contra un cuerpo de masa enorme, como la pelota ideal contra el piso. En los dos casos se conserva
          el momento: el que pierde la pelota lo gana la Tierra y el que gana la Voyager lo pierde Júpiter, y en los dos
          el cuerpo grande cambia su velocidad una cantidad imperceptible (4,8 × 10⁻²¹ m/s para Júpiter). La diferencia es
          el marco de referencia: en el juego el piso está quieto, mientras que Júpiter se mueve a 13 km/s alrededor del
          Sol, y por eso la sonda sale más rápida respecto al Sol.
        </p>

        <h4>Tema 6 (frenado regenerativo) ↔ Tema 13 (enfriamiento líquido): conservación de la energía</h4>
        <p>
          Un auto eléctrico frenando y un rack de inteligencia artificial enfriándose son los dos un balance de energía. En
          el auto, la energía cinética se reparte entre la batería y el calor de los frenos de fricción; en el centro de
          datos, la potencia eléctrica de los chips se convierte en calor y el agua debe llevárselo, lo que fija el caudal
          con <i>Q</i> = <i>P</i>/(<i>ρ</i><i>c</i><sub>p</sub>Δ<i>T</i>). Bernoulli, la ecuación central del Tema 13, es
          el teorema del trabajo y la energía del Tema 6 escrito por unidad de volumen de fluido, y su término de pérdidas
          tiene el mismo destino que la energía de frenado que no se recupera: se convierte en calor. En los dos sistemas,
          el ingeniero de software decide cuánta de esa energía se aprovecha y cuánta se disipa.
        </p>
      </div>

      <div className="bloque">
        <h3><span className="bloque-letra">B</span>La aplicación propia: detectar una caída o un choque desde un teléfono</h3>
        <p>
          Me interesa el software que detecta si una persona se cayó o tuvo un accidente de tránsito y pide ayuda sola. El
          Apple Watch, si detecta una caída y la persona queda inmóvil cerca de un minuto, inicia una cuenta regresiva de 30
          s y llama a emergencias (Apple Inc., 2026b); los iPhone y Apple Watch recientes hacen lo mismo ante un choque
          (Apple Inc., 2026a), y los teléfonos Pixel esperan 60 s una respuesta antes de llamar (Google, s. f.). El
          problema es difícil porque hay que avisar en una caída real sin avisar cada vez que alguien deja caer el teléfono
          o salta. Los algoritmos de laboratorio lo resuelven mal en la vida real: probados con 29 caídas reales, su
          sensibilidad promedio fue de apenas 57 %, con entre 3 y 85 falsas alarmas por día según el algoritmo (Bagalà et
          al., 2012).
        </p>
        <p>
          Creo que la física del curso da una solución más robusta que poner un umbral de «aceleración alta». Un
          acelerómetro mide la fuerza de contacto por unidad de masa, no la gravedad: en reposo marca 1 g, pero durante una
          <strong> caída libre</strong> marca casi 0 g, porque nada sostiene el cuerpo (Tema 2). Al caer de una altura
          <i> h</i> se llega al piso con <i>v</i> = √(2<i>g</i><i>h</i>), y el <strong>impulso</strong> del impacto
          (Tema 7) detiene ese movimiento en un tiempo muy corto, lo que produce un pico de aceleración enorme:
        </p>
        <Eq etiqueta="Caída libre e impulso en el impacto">
          <div>Caída de una cadera desde 0,8 m: <i>v</i><sub>impacto</sub> = √(2<i>g</i><i>h</i>) = √(2 · 9,81 · 0,8) ≈ 4,0 m/s</div>
          <div>Impacto que la detiene en 50 ms: <i>a</i><sub>prom</sub> = Δ<i>v</i>/Δ<i>t</i> = 4,0 / 0,05 ≈ 80 m/s² ≈ 8 g</div>
          <div>Choque de auto: Δ<i>v</i> = 50 km/h = 13,9 m/s en 0,1 s → <i>a</i><sub>prom</sub> ≈ 139 m/s² ≈ 14 g</div>
          <div>(promedios: los picos instantáneos son mucho mayores)</div>
        </Eq>
        <p>
          Con esos números, el programa no buscaría un solo valor, sino una secuencia física: una fase de casi 0 g que
          dura lo que tarda en caer el cuerpo, seguida de un pico de varios g, y después reposo en una postura acostada.
          Integrando la aceleración durante la caída se obtiene la velocidad de impacto, que debe ser compatible con
          √(2<i>gh</i>) para una persona. Eso distingue los casos difíciles: al saltar también hay caída libre, pero se cae
          de pie y se sigue moviendo; un teléfono que cae solo tiene un impacto que no coincide con la altura de una cadera
          y nadie queda acostado. Para los choques, la misma idea explica por qué Apple usa un acelerómetro de hasta 256 g
          (Heater, 2022): con impactos de decenas de g, un sensor común se saturaría y perdería justo el pico que hay que
          medir. Modelar la física no elimina la necesidad de datos reales, pero hace que el programa razone con
          magnitudes que tienen sentido, en lugar de memorizar ejemplos.
        </p>
      </div>
    </section>
  );
}
