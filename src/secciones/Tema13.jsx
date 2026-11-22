import GraficaCircuitoTema13 from "../components/GraficaCircuitoTema13.jsx";
import { Seccion, Bloque, Eq, Tabla, Figura, Destacado } from "../components/ui.jsx";

export default function Tema13() {
  return (
    <Seccion
      id="tema-13"
      numero={13}
      titulo="Enfriamiento líquido de un centro de datos: continuidad, caudal y Bernoulli"
      concepto="ecuación de continuidad y teorema de Bernoulli; cómo se dimensiona un circuito de refrigeración líquida para que llegue suficiente caudal a cada servidor."
      recurso="visualización de datos"
    >
      <Bloque letra="A" titulo="Caso de uso en Ingeniería del Software">
        <h4>El caso concreto</h4>
        <p>
          Los racks de servidores para inteligencia artificial ya no se pueden enfriar con aire. El sistema NVIDIA GB200
          NVL72 concentra 72 GPU en un solo rack con una densidad de potencia de 120 kW, y se enfría con líquido
          directamente sobre los chips (Hamilton, 2025; Eliahou Ontiveros et al., 2025). El agua (o una mezcla de agua y
          glicol) circula impulsada por una unidad de distribución de refrigerante (CDU), que suele tener capacidad para
          más de 1 MW, por tuberías y colectores hasta placas frías montadas sobre cada procesador (Eliahou Ontiveros et
          al., 2025). Para un rack así se necesitan del orden de 170 a 195 L/min con un aumento de temperatura de 10 °C,
          es decir, cerca de 1,5 L/min por cada kilovatio (Taki, 2026). El software de diseño de estas instalaciones, y
          el que controla las bombas de la CDU, tiene que decidir cuánto caudal hace falta, cómo se reparte entre los
          servidores y cuánta presión debe dar la bomba.
        </p>

        <h4>El concepto físico</h4>
        <p>
          Tres ecuaciones resuelven el dimensionamiento (Serway y Jewett, 2018, cap. 14). La primera es un balance de
          energía: el agua debe llevarse el calor que producen los chips. La segunda es la continuidad: un fluido
          incompresible que no se acumula en ningún lado pasa por cada sección con el mismo caudal. La tercera es
          Bernoulli, la conservación de la energía por unidad de volumen, con un término de pérdidas porque en un tubo
          real la fricción convierte parte de esa energía en calor:
        </p>
        <Eq etiqueta="Caudal necesario, continuidad y Bernoulli con pérdidas">
          <div>Caudal necesario: <i>Q</i> = <i>P</i> / (<i>ρ</i> <i>c</i><sub>p</sub> Δ<i>T</i>)</div>
          <div>Continuidad: <i>Q</i> = <i>A</i><sub>1</sub><i>v</i><sub>1</sub> = <i>A</i><sub>2</sub><i>v</i><sub>2</sub> &nbsp;&nbsp; en un colector: <i>Q</i><sub>entra</sub> = Σ <i>Q</i><sub>ramales</sub></div>
          <div>Bernoulli con pérdidas: <i>p</i><sub>1</sub> + ½<i>ρ</i><i>v</i><sub>1</sub>² + <i>ρ</i><i>g</i><i>z</i><sub>1</sub> = <i>p</i><sub>2</sub> + ½<i>ρ</i><i>v</i><sub>2</sub>² + <i>ρ</i><i>g</i><i>z</i><sub>2</sub> + Δ<i>p</i><sub>pérdidas</sub></div>
          <div>Pérdidas por fricción (Darcy–Weisbach): Δ<i>p</i> = <i>f</i> (<i>L</i>/<i>D</i>) ½<i>ρ</i><i>v</i>²</div>
          <div>Potencia de bombeo: <i>W</i> = <i>Q</i> Δ<i>p</i><sub>total</sub> / <i>η</i></div>
        </Eq>
        <p>
          Con <i>P</i> = 120 kW, agua a 30 °C (<i>ρ</i> = 995,7 kg/m³, <i>c</i><sub>p</sub> = 4178 J/(kg·K)) y Δ<i>T</i> =
          10 K, la primera ecuación da <i>Q</i> = 120 000 / (995,7 · 4178 · 10) = 2,885 × 10⁻³ m³/s ={" "}
          <strong>173 L/min</strong>, dentro del rango publicado para este rack (Taki, 2026). El rack tiene 18 bandejas de
          cómputo, cada una con 2 CPU Grace y 4 GPU Blackwell (Goldwasser et al., 2024); repartido entre ellas, a cada
          bandeja le tocan 9,6 L/min. La continuidad dice qué velocidad tendrá el agua en cada tubo
          (<i>v</i> = <i>Q</i>/<i>A</i>) y Bernoulli, cuánta presión se pierde en el camino.
        </p>

        <h4>Por qué modelar la física resuelve el problema mejor</h4>
        <p>
          La alternativa sin física es copiar valores fijos de una instalación anterior («una manguera de media pulgada
          por servidor», «la bomba de siempre»). Con 120 kW en un rack eso falla de dos maneras. Si el tubo es demasiado
          angosto, la continuidad obliga a que el agua vaya más rápido, las pérdidas crecen con <i>v</i>² y aparece
          erosión en los conectores; si es demasiado ancho, se desperdicia espacio en un rack donde no sobra. Y si no se
          calcula el reparto, los servidores del extremo del colector reciben menos caudal que los cercanos a la entrada
          y se sobrecalientan, aunque el caudal total sea el correcto. El modelo permite revisar las dos cosas antes de
          instalar. Lo que cuesta es que cada decisión tiene un precio: la potencia de bombeo crece con <i>Q</i>·Δ<i>p</i>,
          así que tubos más delgados ahorran espacio pero gastan energía todo el año, y el modelo solo es tan bueno como
          los coeficientes de pérdida de conectores y placas frías, que dependen de cada fabricante.
        </p>
        <p>
          Este tema se conecta con el Tema 6: los dos son conservación de la energía. Allí, la energía de frenado que no
          se recupera termina como calor en los frenos; aquí, la energía que la bomba le da al agua se pierde por fricción
          y también termina como calor. Y Bernoulli es, literalmente, el teorema del trabajo y la energía escrito por
          unidad de volumen de fluido.
        </p>
      </Bloque>

      <Bloque letra="B" titulo="Recurso de apoyo: visualización de datos">
        <h4>Parámetros del cálculo</h4>
        <p>
          La gráfica sigue el camino del agua desde la salida de la CDU hasta la bandeja más alta del rack, que es el
          camino más desfavorable, y de vuelta. Los datos del rack vienen de las fuentes citadas; los diámetros de tubería
          y la geometría de la placa fría son <strong>supuestos de diseño</strong> propios, con medidas comerciales
          típicas, porque el fabricante no las publica.
        </p>

        <Tabla
          numero={20}
          titulo="Parámetros declarados del cálculo"
          nota="Fuentes: potencia del rack, Hamilton (2025); caudal de referencia de 1,5 L/min por kW, Taki (2026); velocidades recomendadas para agua de enfriamiento, The Engineering ToolBox (2003). Propiedades del agua a 30 °C de tablas estándar. Los valores marcados como supuesto son elección del autor."
        >
          <table>
            <thead>
              <tr><th>Parámetro</th><th>Valor</th><th>Origen</th></tr>
            </thead>
            <tbody>
              <tr><td>Potencia térmica del rack, <i>P</i></td><td>120 kW</td><td>NVIDIA GB200 NVL72</td></tr>
              <tr><td>Aumento de temperatura del agua, Δ<i>T</i></td><td>10 K</td><td>valor de diseño de referencia</td></tr>
              <tr><td>Fluido</td><td>agua a 30 °C: <i>ρ</i> = 995,7 kg/m³; <i>c</i><sub>p</sub> = 4178 J/(kg·K); <i>μ</i> = 0,798 mPa·s</td><td>tablas</td></tr>
              <tr><td>Caudal total, <i>Q</i></td><td>173 L/min</td><td>calculado</td></tr>
              <tr><td>Bandejas de cómputo en paralelo</td><td>18 (9,6 L/min cada una)</td><td>NVL72 (Goldwasser et al., 2024)</td></tr>
              <tr><td>Tubería principal (suministro y retorno)</td><td>DN50, <i>D</i> = 52,5 mm, 10 m cada una</td><td>supuesto</td></tr>
              <tr><td>Colector vertical del rack</td><td><i>D</i> = 40 mm, 2 m de altura, 18 salidas</td><td>supuesto</td></tr>
              <tr><td>Manguera de cada bandeja</td><td><i>D</i> = 12 mm, 1,5 m</td><td>supuesto</td></tr>
              <tr><td>Conector rápido</td><td>paso interior de 7 mm</td><td>supuesto</td></tr>
              <tr><td>Placa fría</td><td>50 microcanales de 0,5 mm × 3 mm, 50 mm de largo</td><td>supuesto</td></tr>
              <tr><td>Presión de suministro de la CDU</td><td>3,0 bar (manométrica)</td><td>supuesto</td></tr>
            </tbody>
          </table>
        </Tabla>

        <Figura
          numero={10}
          titulo="Velocidad (a) y presión (b) del agua a lo largo del circuito de enfriamiento de un rack de 120 kW, desde la salida de la CDU hasta la bandeja más alta y de regreso."
          nota="Cálculo propio con continuidad, Bernoulli con pérdidas (Darcy–Weisbach y coeficientes de contracción y expansión) y los parámetros de la Tabla 20, con scripts/circuito_tema13.py. El eje horizontal es esquemático: cada tramo ocupa un ancho fijo, no su longitud real. La franja verde marca la velocidad recomendada para agua de enfriamiento (The Engineering ToolBox, 2003)."
        >
          <GraficaCircuitoTema13 />
        </Figura>

        <Tabla numero={21} titulo="Resultados por tramo (cálculo propio)" nota="Número de Reynolds Re = ρvD/μ (con el diámetro hidráulico en los microcanales). La presión en cada punto del recorrido está en la Figura 10b.">
          <table>
            <thead>
              <tr><th>Tramo</th><th>Sección</th><th>Caudal</th><th>Velocidad</th><th>Reynolds</th></tr>
            </thead>
            <tbody>
              <tr><td>Tubería principal</td><td>2165 mm²</td><td>173 L/min</td><td>1,33 m/s</td><td>87 000 (turbulento)</td></tr>
              <tr><td>Colector (de abajo hacia arriba)</td><td>1257 mm²</td><td>173 → 9,6 L/min</td><td>2,30 → 0,13 m/s</td><td>hasta 115 000</td></tr>
              <tr><td>Manguera de la bandeja</td><td>113 mm²</td><td>9,6 L/min</td><td>1,42 m/s</td><td>21 000</td></tr>
              <tr><td>Conector rápido</td><td>38 mm²</td><td>9,6 L/min</td><td><strong>4,16 m/s</strong></td><td>36 000</td></tr>
              <tr><td>Microcanales de la placa fría</td><td>75 mm² (50 canales)</td><td>9,6 L/min</td><td>2,14 m/s</td><td>2300 (en el límite laminar)</td></tr>
            </tbody>
          </table>
        </Tabla>

        <h4>Qué muestra la gráfica</h4>
        <p>
          <strong>Continuidad.</strong> En la Figura 10a cada salto de velocidad corresponde a un cambio de sección o de
          caudal. Al pasar de la manguera de 113 mm² al conector de 38 mm², el área baja a un tercio y la velocidad sube
          al triple (1,42 → 4,16 m/s), porque el mismo caudal tiene que pasar por menos espacio. En el colector ocurre lo
          contrario sin que cambie el diámetro: en cada salida hacia una bandeja se va un dieciochoavo del caudal, así que
          la velocidad baja en escalones de 2,30 a 0,13 m/s a medida que el agua sube.
        </p>
        <p>
          <strong>Bernoulli.</strong> En la Figura 10b la presión cae en escalón justo donde la velocidad sube: al entrar
          al conector rápido baja 0,10 bar de golpe, porque parte de la presión se convierte en energía cinética
          (½<i>ρ</i><i>v</i>² pasa de 1000 a 8600 Pa) y otra parte se pierde en la contracción. Al salir del conector
          hacia la placa fría, la velocidad baja y la presión se recupera en parte. En el colector, la presión cae sobre
          todo por la altura (<i>ρ</i><i>g</i>Δ<i>z</i> = 0,20 bar en 2 m), y la recupera al bajar por el retorno. En
          total, el circuito pierde 0,34 bar por fricción y por las uniones: esa es la presión que la bomba debe reponer.
        </p>
        <p>
          <strong>Decisiones de diseño.</strong> El tramo crítico es el conector rápido: con 4,16 m/s supera la velocidad
          recomendada para agua de enfriamiento (1,5–2,5 m/s), y es donde se concentran la erosión y las pérdidas. Un paso
          interior de 9 mm la bajaría a 2,5 m/s, porque <i>v</i> ∝ 1/<i>D</i>². La bandeja más alta, además, recibe el
          agua con 0,2 bar menos que la más baja por la altura del colector, por lo que el sistema necesita válvulas de
          balanceo o un retorno invertido para que todas reciban sus 9,6 L/min.
        </p>
        <p>
          <strong>Límites del modelo.</strong> Los fabricantes reportan caídas de 1,5 a 2,5 bar en el conjunto de
          colectores, conectores y placas frías de un rack así (Taki, 2026), varias veces más que los 0,34 bar de este
          cálculo. La diferencia está en que las placas frías y los conectores comerciales tienen pasajes más
          restrictivos que los supuestos aquí; el método es el mismo, pero los coeficientes reales salen de las fichas de
          cada componente. Aun con 2,5 bar, la potencia hidráulica de bombeo sería <i>Q</i>Δ<i>p</i> = 2,885 × 10⁻³ · 2,5 ×
          10⁵ ≈ 720 W, menos del 1 % de los 120 kW que se extraen.
        </p>

        <Destacado titulo="La idea central">
          <p>
            El caudal lo fija la energía (cuánto calor hay que sacar); la continuidad dice qué velocidad resulta en cada
            tubo; y Bernoulli, cuánta presión se gasta en el camino. Dimensionar el circuito es elegir las secciones para
            que las tres cosas cuadren en todos los servidores.
          </p>
        </Destacado>
      </Bloque>
    </Seccion>
  );
}
