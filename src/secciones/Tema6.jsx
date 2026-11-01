import GraficaFrenadoTema6 from "../components/GraficaFrenadoTema6.jsx";
import { Seccion, Bloque, Eq, Tabla, Destacado } from "../components/ui.jsx";

export default function Tema6() {
  return (
    <Seccion
      id="tema-6"
      numero={6}
      titulo="Frenado regenerativo en un vehículo eléctrico"
      concepto="trabajo, energía cinética y transformación de energía; cuánta de la energía del frenado se recupera y cuánta se disipa."
      recurso="visualización de datos"
    >
      <Bloque letra="A" titulo="Caso de uso en Ingeniería del Software">
        <h4>El caso concreto</h4>
        <p>
          El software que estima el consumo y la autonomía de un vehículo eléctrico. El ejemplo es FASTSim, el
          simulador del National Renewable Energy Laboratory (NREL) de Estados Unidos que compara trenes motrices y
          estima la eficiencia, el desempeño y el costo de vehículos livianos, medianos y pesados (Brooker et al., 2015).
          El vehículo de este tema es un Renault Zoe ZE50 R135, con los parámetros de su archivo en FASTSim, y el
          recorrido es el ciclo urbano UDDS de la Agencia de Protección Ambiental de Estados Unidos, la llamada “prueba de
          ciudad” (U.S. Environmental Protection Agency [EPA], 2026): 1 369 s, 11,99 km y 17 detenciones. Dentro del
          auto, el mismo cálculo lo hace en tiempo real el software que decide cuánto del frenado va al motor y cuánto a
          los frenos de fricción.
        </p>

        <h4>El concepto físico</h4>
        <p>
          Por el teorema del trabajo y la energía, el trabajo neto sobre el auto es igual al cambio de su energía cinética
          (Serway y Jewett, 2018). Para acelerar hay que hacer trabajo positivo; para detenerse, el auto debe quitarse esa
          energía cinética. Sumando las fuerzas que actúan en cada instante, la potencia que piden las ruedas es:
        </p>
        <Eq etiqueta="Trabajo, energía cinética y potencia en las ruedas">
          <div><i>W</i><sub>neto</sub> = Δ<i>K</i> &nbsp;&nbsp; <i>K</i> = ½<i>m</i><i>v</i>²</div>
          <div><i>P</i><sub>rueda</sub> = (<i>m</i><sub>eq</sub><i>a</i> + ½ρ<i>C</i><sub>d</sub><i>A</i><i>v</i>² + <i>C</i><sub>rr</sub><i>m</i><i>g</i>) · <i>v</i></div>
          <div>Si <i>P</i><sub>rueda</sub> &lt; 0: &nbsp; <i>E</i><sub>frenado</sub> = ∫ (−<i>P</i><sub>rueda</sub>) d<i>t</i></div>
          <div><i>E</i><sub>recuperada</sub> = <i>f</i>(<i>v</i>) · η<sub>tr</sub> · η<sub>m</sub> · η<sub>bat</sub> · <i>E</i><sub>frenado</sub> &nbsp;&nbsp; <i>E</i><sub>disipada</sub> = <i>E</i><sub>frenado</sub> − <i>E</i><sub>recuperada</sub></div>
          <div><i>f</i>(<i>v</i>) = 0,98 / (1 + 500 · e<sup>−0,99 (<i>v</i><sub>mph</sub> + 1)</sup>)</div>
        </Eq>
        <p>
          El primer término es la fuerza para acelerar (<i>m</i><sub>eq</sub> incluye la inercia de las ruedas que
          giran), el segundo es la resistencia del aire y el tercero la resistencia a la rodadura. Cuando la suma es
          negativa, el auto tiene energía cinética que debe frenar. El motor, usado como generador, la convierte en
          electricidad, pero con pérdidas en la transmisión (η<sub>tr</sub>), en el propio motor (η<sub>m</sub>) y en la
          batería (η<sub>bat</sub>). Además, a baja velocidad el motor casi no puede frenar y los frenos de fricción
          toman el control: <i>f</i>(<i>v</i>) es la fracción del frenado que va al motor, con la forma y las constantes
          (500 y 0,99) que usa FASTSim 2; el máximo de 0,98 es un supuesto de este cálculo.
        </p>

        <Tabla
          numero={10}
          titulo="Ejemplo numérico propio: detener el Zoe desde 50 km/h"
          nota="m_eq ≈ 1 634 kg. Eficiencia de la cadena regenerativa ≈ 0,92 · 0,95 · 0,985 ≈ 0,86 con el motor a carga media. Para simplificar, este ejemplo ignora el aire y la rodadura."
        >
          <table>
            <thead>
              <tr><th>Cómo se frena</th><th>Energía cinética a quitar</th><th>Vuelve a la batería</th><th>Termina como calor</th></tr>
            </thead>
            <tbody>
              <tr><td>Solo frenos de fricción</td><td>≈ 158 kJ (44 Wh)</td><td>0 Wh</td><td>≈ 44 Wh</td></tr>
              <tr><td>Frenado regenerativo</td><td>≈ 158 kJ (44 Wh)</td><td>≈ 38 Wh (86 %)</td><td>≈ 6 Wh</td></tr>
            </tbody>
          </table>
        </Tabla>

        <h4>Por qué modelar la física resuelve el problema mejor</h4>
        <p>
          La alternativa no física es un consumo fijo en Wh/km, por ejemplo el promedio de una ficha técnica. Pero la
          energía recuperable depende de cuántas veces se detiene el auto y desde qué velocidad. Con el modelo de este
          tema, la regeneración le ahorra al mismo Zoe un <strong>28 %</strong> de energía en el ciclo urbano UDDS
          (de 160,5 a 115,6 Wh/km), pero solo un <strong>6,5 %</strong> en el ciclo de carretera HWFET de la EPA (de
          149,6 a 139,8 Wh/km), donde casi no frena (cálculo propio). Un factor fijo no puede capturar esa diferencia,
          y una estimación de autonomía basada en él falla justo en la ciudad, que es donde más se usan estos autos.
          El costo es que el modelo necesita los parámetros del vehículo y un perfil de velocidad, y que la eficiencia
          real de la regeneración depende del estado de la batería, que aquí no se modela.
        </p>
        <p>
          Este tema se conecta con el Tema 1: las aceleraciones <i>a</i> = d<i>v</i>/d<i>t</i> que allí se derivan de
          los datos del dron son las mismas que aquí determinan, segundo a segundo, si el vehículo pide o devuelve energía.
        </p>
      </Bloque>

      <Bloque letra="B" titulo="Recurso de apoyo: visualización de datos">
        <h4>De dónde salen los datos</h4>
        <ol>
          <li>El perfil de velocidad es el UDDS oficial de la EPA (2026), segundo a segundo, tal como lo incluye FASTSim.</li>
          <li>Los parámetros del vehículo salen del archivo del Renault Zoe ZE50 R135 de FASTSim 3.1.0 (National Renewable Energy Laboratory, s. f.): masa de prueba de 1 600 kg, <i>C</i><sub>d</sub> = 0,33, área frontal de 2,51 m², <i>C</i><sub>rr</sub> = 0,009, transmisión del 92 %, curva de eficiencia del motor entre 84 y 95 % y batería del 98,5 %.</li>
          <li>El balance lo calculé segundo a segundo con las ecuaciones de la parte A (script <code>scripts/modelo_tema6.py</code> del repositorio), con ρ = 1,2 kg/m³ y un consumo auxiliar de 250 W.</li>
          <li>Comprobaciones: el balance cierra exactamente (tracción − frenado = aire + rodadura, porque el auto empieza y termina detenido), y el consumo neto que da el modelo, 115,6 Wh/km, difiere en un 0,5 % del que calcula FASTSim para el mismo auto y el mismo ciclo (116,2 Wh/km).</li>
        </ol>

        <div className="figura-ancha">
          <GraficaFrenadoTema6 />
        </div>

        <h4>Cómo leer la gráfica</h4>
        <p>
          En el panel (b), la curva oscura es todo el trabajo que hicieron las ruedas. Sube en cada aceleración y queda
          plana en cada parada. La curva naranja, la energía de frenado, sube en escalones: cada escalón es una de las 17
          detenciones del ciclo, y los más altos corresponden al tramo rápido de los primeros 300 s, donde el auto llega
          a 91 km/h. En el panel (c) esa misma energía se reparte: casi toda vuelve a la batería (verde), una parte se
          pierde en la conversión (amarillo) y solo una franja delgada termina en los frenos de fricción (rojo), que
          trabajan sobre todo en los últimos metros de cada parada.
        </p>

        <Tabla numero={11} titulo="Balance de energía del ciclo urbano UDDS completo (cálculo propio)">
          <table>
            <thead>
              <tr><th>Concepto</th><th>Energía [Wh]</th><th>Parte del frenado</th></tr>
            </thead>
            <tbody>
              <tr><td>Trabajo de tracción en las ruedas</td><td>1 519,5</td><td>—</td></tr>
              <tr><td>&nbsp;&nbsp;Contra el aire</td><td>363,1</td><td>—</td></tr>
              <tr><td>&nbsp;&nbsp;Contra la rodadura</td><td>470,5</td><td>—</td></tr>
              <tr><td>&nbsp;&nbsp;Energía cinética que hubo que frenar</td><td>685,9</td><td>100 %</td></tr>
              <tr><td>Recuperada en la batería</td><td>538,4</td><td>78,5 %</td></tr>
              <tr><td>Pérdidas de conversión (motor, transmisión, batería)</td><td>110,2</td><td>16,1 %</td></tr>
              <tr><td>Disipada en los frenos de fricción</td><td>37,3</td><td>5,4 %</td></tr>
            </tbody>
          </table>
        </Tabla>

        <Destacado titulo="Lo que muestra el balance">
          <p>
            Casi la mitad del trabajo de tracción (686 de 1 520 Wh) se convierte en energía cinética que luego hay que
            frenar. Sin regeneración, toda esa energía terminaría como calor en los discos; con ella, el 78,5 % vuelve a
            la batería. Lo que no se recupera se disipa por dos caminos distintos: las pérdidas de conversión, que son
            inevitables porque ninguna máquina es 100 % eficiente, y los frenos de fricción, que actúan cuando el auto
            va tan lento que el motor ya no puede frenarlo.
          </p>
        </Destacado>
      </Bloque>
    </Seccion>
  );
}
