import { Seccion, Bloque, Eq, Tabla, Destacado } from "../components/ui.jsx";

export default function Tema12() {
  return (
    <Seccion
      id="tema-12"
      numero={12}
      titulo="Resonancia estructural: Tacoma Narrows y por qué las tropas rompen el paso al cruzar un puente"
      concepto="oscilación forzada y resonancia; qué pasa cuando la frecuencia de excitación coincide con la frecuencia natural del sistema."
      recurso="multimedia con análisis"
    >
      <Bloque letra="A" titulo="Caso de uso en Ingeniería del Software">
        <h4>El caso concreto</h4>
        <p>
          El software de análisis estructural por elementos finitos. Programas como Ansys Mechanical incluyen un tipo de
          análisis llamado <strong>análisis modal</strong>, que calcula las frecuencias naturales y las formas de vibrar de
          una estructura a partir de su geometría, su masa y su rigidez, antes de construirla (Ansys, Inc., s. f.). El
          caso que mostró por qué ese cálculo no es opcional fue el <strong>Puente del Milenio de Londres</strong>: se
          inauguró el 10 de junio de 2000, ese día lo cruzaron cerca de 100 000 personas, con hasta 2000 a la vez, y empezó
          a balancearse de lado con aceleraciones de hasta 0,25 <i>g</i>; se cerró dos días después, el 12 de junio, y no
          reabrió hasta el 22 de febrero de 2002 (Fitzpatrick y Ridsdill Smith, s. f.; Taylor, 2002). Sus modos laterales estaban en 0,49 Hz (tramo central), 0,77 Hz (tramo sur) y 1,05 Hz
          (tramo norte), y los ingenieros de Arup concluyeron que el fenómeno puede aparecer en cualquier puente con una
          frecuencia lateral menor de 1,3 Hz, por la frecuencia normal de los pasos de los peatones (Fitzpatrick y
          Ridsdill Smith, s. f.). Desde entonces, revisar en el modelo si hay modos laterales por debajo de ese límite es
          un paso del diseño de pasarelas.
        </p>

        <h4>El concepto físico</h4>
        <p>
          Una estructura se comporta como un oscilador con frecuencia natural <i>ω</i><sub>0</sub> y amortiguamiento{" "}
          <i>c</i>. Si se le aplica una fuerza periódica de frecuencia <i>ω</i>, después de un tiempo oscila a esa
          frecuencia con una amplitud que depende de qué tan cerca está <i>ω</i> de <i>ω</i><sub>0</sub> (Serway y
          Jewett, 2018, cap. 15):
        </p>
        <Eq etiqueta="Oscilación forzada, resonancia y amortiguamiento negativo">
          <div><i>m</i> <i>x</i>″ + <i>c</i> <i>x</i>′ + <i>k</i> <i>x</i> = <i>F</i><sub>0</sub> cos(<i>ω</i><i>t</i>) &nbsp;&nbsp; <i>ω</i><sub>0</sub> = √(<i>k</i>/<i>m</i>) &nbsp;&nbsp; <i>f</i><sub>0</sub> = <i>ω</i><sub>0</sub>/2π</div>
          <div><i>A</i>(<i>ω</i>) = (<i>F</i><sub>0</sub>/<i>m</i>) / √[(<i>ω</i><sub>0</sub>² − <i>ω</i>²)² + (<i>c</i><i>ω</i>/<i>m</i>)²] &nbsp;&nbsp; en resonancia (<i>ω</i> = <i>ω</i><sub>0</sub>): <i>A</i> = <i>F</i><sub>0</sub> / (<i>c</i> <i>ω</i><sub>0</sub>)</div>
          <div>Amortiguamiento negativo (flameo): <i>m</i> <i>x</i>″ + (<i>c</i> − <i>c</i><sub>viento</sub>) <i>x</i>′ + <i>k</i> <i>x</i> = 0</div>
          <div>si <i>c</i><sub>viento</sub> &gt; <i>c</i>: &nbsp; <i>x</i>(<i>t</i>) ∝ <i>e</i><sup>+(<i>c</i><sub>viento</sub> − <i>c</i>)<i>t</i>/2<i>m</i></sup> cos(<i>ω</i><sub>d</sub><i>t</i>) &nbsp; (la amplitud crece en cada ciclo)</div>
        </Eq>
        <p>
          La segunda línea dice por qué la resonancia es peligrosa: cuando la excitación coincide con la frecuencia
          natural, la amplitud solo la limita el amortiguamiento, y en estructuras esbeltas el amortiguamiento es pequeño.
          La tercera línea describe otra forma de crecer, que es la que destruyó el puente de Tacoma Narrows: no hace falta
          una fuerza externa con la frecuencia justa si el propio movimiento hace que el viento empuje a favor de él.
        </p>

        <Tabla
          numero={19}
          titulo="Cuatro puentes y tres formas de excitación"
          nota="Broughton: Lancaster Gazette (1831) y Hodgkinson (1831), citados en Grace's Guide to British Industrial History (s. f.). Angers: Musée du Génie (s. f.) y Gautier (2013). Tacoma Narrows: Olson et al. (2015) y Green y Unruh (2004). Milenio: Fitzpatrick y Ridsdill Smith (s. f.), Dallard et al. (2001) y Taylor (2002)."
        >
          <table>
            <thead>
              <tr><th>Puente</th><th>Excitación</th><th>Mecanismo</th><th>Qué pasó</th></tr>
            </thead>
            <tbody>
              <tr><td>Broughton, Inglaterra (11 abr. 1831)</td><td>Unos 70 soldados marchando al paso</td><td>Fuerza periódica de los pasos sobre un puente colgante; la investigación halló además un defecto de construcción en una de las cadenas</td><td>Cayó; 20 heridos y ningún muerto. El ejército británico ordenó romper el paso al cruzar puentes</td></tr>
              <tr><td>Angers, Francia (16 abr. 1850)</td><td>Un batallón cruzando con una tormenta que ya hacía oscilar el puente</td><td>Oscilación causada por la tormenta y resonancia por la tropa marchando al paso, sobre cables portantes debilitados por la oxidación</td><td>Cayó; murieron 224 personas (222 soldados y 2 empleados)</td></tr>
              <tr><td>Tacoma Narrows, EE. UU. (7 nov. 1940)</td><td>Viento de unos 68 km/h</td><td>Flameo aeroelástico: amortiguamiento efectivo negativo en torsión</td><td>Torsión de 0,2 Hz durante cerca de una hora; cayó el tramo central</td></tr>
              <tr><td>Milenio, Londres (10 jun. 2000)</td><td>Miles de peatones</td><td>Excitación lateral sincronizada: el balanceo hace que la gente camine al ritmo del puente</td><td>Aceleración lateral de hasta 0,25 <i>g</i>; cerrado casi dos años; 37 amortiguadores viscosos y otros de masa sintonizada</td></tr>
            </tbody>
          </table>
        </Tabla>

        <h4>Por qué modelar la física resuelve el problema mejor</h4>
        <p>
          Sin el modelo, la única forma de saber cómo responde un puente es construirlo y esperar: un cálculo estático, que
          solo verifica que el puente aguante su peso y el de la gente, no ve la resonancia, porque la fuerza de unos
          cuantos peatones es diminuta comparada con la resistencia de la estructura. Lo que importa es cuándo se aplica
          esa fuerza respecto al movimiento. El análisis modal encuentra las frecuencias peligrosas en la computadora, y
          permite corregirlas cambiando la rigidez (que mueve <i>ω</i><sub>0</sub>) o agregando amortiguamiento (que
          baja <i>A</i>), que fue exactamente la solución del Milenio: con los amortiguadores, sus modos pasaron a tener más
          del 20 % del amortiguamiento crítico (Dallard et al., 2001), es decir, <i>ζ</i> &gt; 0,2 en el lenguaje del Tema
          10. Lo que cuesta es que el modelo solo es tan bueno
          como sus supuestos: el amortiguamiento real es difícil de estimar antes de construir, y en el Milenio el modelo
          no incluía el efecto de los peatones que se sincronizan con el puente. En Tacoma, la física necesaria para
          predecir el flameo (la interacción entre el viento y la estructura) no formaba parte del diseño de puentes de
          la época; los ensayos y modelos aeroelásticos se volvieron parte del diseño después del colapso.
        </p>
        <p>
          Este tema se conecta con el Tema 10: allí se elige el amortiguamiento para que la animación deje de oscilar
          pronto; aquí, cuando el amortiguamiento efectivo se vuelve negativo, la oscilación crece sola. Y con el Tema 11:
          cada modo de un puente, como cada armónico de un tubo, es una frecuencia natural del sistema.
        </p>
      </Bloque>

      <Bloque letra="B" titulo="Recurso de apoyo: multimedia con análisis">
        <h4>Video</h4>
        <div className="video video-4x3">
          <iframe
            src="https://archive.org/embed/CEP176"
            title="Colapso del puente de Tacoma Narrows, 7 de noviembre de 1940"
            loading="lazy"
            allow="fullscreen"
            allowFullScreen
          />
        </div>
        <p className="nota">
          Stillman Fires Collection y Tacoma Fire Department. (1940). <em>Tacoma Narrows Bridge collapse (standard
          4:3)</em> [Video, 2:05]. Internet Archive. Dominio público.{" "}
          <a href="https://archive.org/details/CEP176">https://archive.org/details/CEP176</a>
        </p>

        <h4>Análisis</h4>
        <p>
          <strong>Qué se ve (0:12 a 0:30 y 1:05 a 1:48).</strong> La cámara está sobre la calzada mirando hacia la torre.
          La calzada no sube y baja como un todo: un borde sube mientras el otro baja, y las líneas de los postes y de
          los cables de suspensión se inclinan alternadamente a un lado y al otro. Es una oscilación de{" "}
          <strong>torsión</strong> alrededor de la línea central de la calzada, que es la línea que permanece quieta
          (el eje nodal descrito por Olson et al., 2015). Hacia 1:30 se ve a una persona caminando sobre la calzada
          inclinada, y en 1:51 cae el tramo central.
        </p>
        <p>
          <strong>Frecuencia natural.</strong> El profesor Farquharson, que estudiaba el puente, cronometró ese día la
          torsión: 12 ciclos por minuto, es decir, un período de 5 s y una frecuencia <i>f</i> = 1/5 s = 0,2 Hz, con una
          amplitud de unos 4 m (13 pies), más de 0,7 rad (Olson et al., 2015; Green y Unruh, 2004). Esa es la frecuencia
          natural del modo de torsión, el modo en que el puente terminó oscilando. Un detalle para quien cronometre el
          video: la película original se filmó a unos 16 cuadros por segundo, y muchas copias circulan a 24, por lo que la
          torsión se ve un 50 % más rápida de lo que fue (Olson et al., 2015). Si en este video un ciclo parece durar
          unos 3,3 s y no 5 s, la causa es esa copia, no el puente.
        </p>
        <p>
          <strong>Fuente de la excitación.</strong> El viento, de unos 19 m/s (68 km/h) ese día (Green y Unruh, 2004). Aquí está la diferencia con una resonancia de libro de texto: un viento constante no
          empuja con ninguna frecuencia. Los remolinos que se desprenden de la calzada (la calle de vórtices de von
          Kármán) tenían una frecuencia de cerca de 1 Hz con ese viento, lejos de los 0,2 Hz del puente, así que no
          podían producir una resonancia forzada (Green y Unruh, 2004). Por eso los físicos Billah y Scanlan (1991)
          criticaron que los textos presentaran Tacoma como «resonancia»; la guía actual del DVD de la AAPT dice que «no
          fue un caso de resonancia» (Olson et al., 2015).
        </p>
        <p>
          <strong>Por qué crece la amplitud.</strong> Cuando la calzada gira, cambia el ángulo con que el viento la golpea,
          y la fuerza del viento cambia con el mismo ritmo que el giro. Por encima de una velocidad crítica de viento, esa
          fuerza queda siempre a favor del movimiento: en cada ciclo el viento entrega más energía de la que el puente
          disipa. En la ecuación, el término <i>c</i><sub>viento</sub> supera al amortiguamiento estructural <i>c</i>, el
          amortiguamiento efectivo se vuelve negativo y la amplitud crece como <i>e</i><sup>+<i>λt</i></sup> hasta que algo
          se rompe (Green y Unruh, 2004). Es una autoexcitación: el puente oscila a su propia frecuencia natural y el
          viento se acopla a ella.
        </p>
        <p>
          <strong>Las tropas, en cambio, sí son resonancia forzada.</strong> Un grupo que marcha al paso aplica una fuerza
          periódica con una frecuencia fija, la de sus pasos (cerca de 2 pasos por segundo). Si esa frecuencia, o la mitad
          de ella para la fuerza lateral de cada pie, coincide con una frecuencia natural del puente, se cumple{" "}
          <i>ω</i> = <i>ω</i><sub>0</sub> y la amplitud solo la limita el amortiguamiento. Romper el paso hace que cada
          soldado empuje con una fase distinta: las fuerzas ya no se suman ciclo tras ciclo y la amplitud no crece. Esa
          es la orden que dio el ejército británico después de Broughton, y la misma idea explica el Milenio, donde los
          peatones terminaron caminando sincronizados con el balanceo.
        </p>

        <Destacado titulo="En una frase">
          <p>
            En la resonancia forzada (tropas, Milenio) la amplitud crece porque la excitación tiene la frecuencia natural
            del puente; en Tacoma creció porque el viento, sin frecuencia propia, terminó entregando energía al puente a
            su frecuencia natural en cada ciclo.
          </p>
        </Destacado>
      </Bloque>
    </Seccion>
  );
}
