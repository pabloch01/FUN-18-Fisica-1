import GraficaAgarreTema4 from "../components/GraficaAgarreTema4.jsx";
import { Seccion, Bloque, Eq, Tabla, Destacado } from "../components/ui.jsx";

export default function Tema4() {
  return (
    <Seccion
      id="tema-4"
      numero={4}
      titulo="Llantas de Fórmula 1: la ventana de temperatura y el agarre"
      concepto="fuerza de fricción, coeficiente estático y cinético, fuerza normal, y por qué el agarre real no es proporcional a la carga como predice el modelo simple."
      recurso="visualización de datos"
    >
      <Bloque letra="A" titulo="Caso de uso en Ingeniería del Software">
        <h4>El caso concreto</h4>
        <p>
          El modelo de neumático de un simulador de carreras o de un gemelo digital para estrategia. Los simuladores
          serios incluyen un modelo térmico del neumático: Alcázar Vargas et al. (2022) citan como ejemplos el modelo
          SETA, usado en Project Cars 2, y el NTM V7 de iRacing, que calculan a la vez la deformación, las fuerzas en
          la banda de rodamiento y la transferencia de calor. En la Fórmula 1 el calentamiento previo incluso está
          regulado: según Straw (2022), en 2021 las mantas podían mantener los neumáticos delanteros a 100 °C y los
          traseros a 80 °C, y desde 2022 el máximo bajó a 70 °C.
        </p>

        <h4>El concepto físico</h4>
        <p>
          El modelo simple de fricción dice que la fuerza máxima antes de deslizar es <i>F</i><sub>max</sub> = μ<i>N</i>,
          con μ constante, así que sería proporcional a la carga y no dependería de la temperatura (Serway y Jewett,
          2018). El neumático real no se comporta así. Primero, μ cambia con la temperatura; Alcázar Vargas et al.
          (2022) lo modelan con:
        </p>
        <Eq etiqueta="Coeficiente de fricción lateral en función de la temperatura">
          <div>μ<sub>y</sub>(<i>T</i>) = μ<sub>max</sub> + [1 − cosh((<i>T</i> − <i>T</i><sub>opt</sub>)/<i>T</i><sub>disp</sub>)]</div>
          <div><i>F</i><sub>y,max</sub> = μ<sub>y</sub>(<i>T</i>) · <i>F</i><sub>z</sub></div>
        </Eq>
        <p>
          Segundo, el coeficiente de agarre disminuye al aumentar la carga (sensibilidad a la carga; Milliken y
          Milliken, 1995), de modo que la fuerza máxima no crece en proporción a la carga como predice μ constante.
        </p>

        <Tabla
          numero={7}
          titulo="Ejemplo numérico propio con la carga vertical del ensayo, F_z = 4 000 N"
        >
          <table>
            <thead>
              <tr><th>Temperatura</th><th>μ<sub>y</sub></th><th><i>F</i><sub>y,max</sub> = μ<sub>y</sub> · <i>F</i><sub>z</sub></th></tr>
            </thead>
            <tbody>
              <tr><td>50 °C</td><td>0,77</td><td>≈ 3 070 N</td></tr>
              <tr><td>88 °C (temperatura óptima)</td><td>1,07</td><td>≈ 4 280 N (+39 %)</td></tr>
            </tbody>
          </table>
        </Tabla>

        <h4>Por qué modelar la física resuelve el problema mejor</h4>
        <p>
          Un software con μ fija sobreestima el agarre con el neumático frío (por ejemplo, en la vuelta de salida) y
          no puede explicar por qué existe una “ventana”. En el ensayo de Alcázar Vargas et al. (2022), el
          coeficiente de fricción pasó de ≈ 0,7 a un máximo de ≈ 1,05 al calentarse el neumático, un aumento de
          alrededor del 50 %. Hay además un límite que conviene declarar: según Straw (2022), lo que importa es la
          temperatura dentro del compuesto y del núcleo, no la superficial, mientras que el estudio mide la
          superficie con sensores infrarrojos.
        </p>
      </Bloque>

      <Bloque letra="B" titulo="Recurso de apoyo: visualización de datos">
        <h4>De dónde salen los datos</h4>
        <p>
          La fuente es Alcázar Vargas et al. (2022): un ensayo de banco con un neumático comercial de verano (Austone
          Athena SP-6, 205/65 R15), con 4 000 N de carga vertical, 60 km/h y un ángulo de deriva de −8°, partiendo en frío
          hasta que algunas zonas llegaron a 120 °C. <strong>Es un neumático de calle, no de F1</strong>: los autores
          señalan que la temperatura de vitrificación de los neumáticos de competición es mayor que la de los de
          verano, así que en F1 la ventana está desplazada. Lo que se transfiere es la forma de la curva, no los
          números.
        </p>

        <h4>Cómo se construyó la curva</h4>
        <p>
          La curva se calcula con la Ecuación 8 del artículo y los coeficientes de su Tabla 4: <i>T</i><sub>opt</sub> = 88 °C y
          <i> T</i><sub>disp</sub> = 50 °C. La tabla da μ<sub>max</sub> = 1,1, pero redondeado a dos cifras; el máximo del
          ajuste que se ve en la Figura 16 del artículo es ≈ 1,07, y con ese valor la ecuación reproduce la curva
          publicada. Por eso se usó μ<sub>max</sub> = 1,07. Los datos de esa figura cubren de ≈ 50 a ≈ 101 °C; fuera de ese
          rango la curva es extrapolación del modelo y se dibuja punteada. No se muestran los puntos experimentales
          (que están en la Figura 16 del artículo); los puntos de la figura original quedan dentro de ≈ ±0,03 de la curva.
        </p>

        <div className="figura-ancha">
          <GraficaAgarreTema4 />
        </div>

        <Tabla numero={8} titulo="Coeficiente de fricción lateral calculado con la Ecuación 8" nota="Cálculo propio con μ_max = 1,07, T_opt = 88 °C y T_disp = 50 °C.">
          <table>
            <thead>
              <tr><th>T [°C]</th><th>50</th><th>55</th><th>60</th><th>70</th><th>80</th><th>88</th><th>90</th><th>100</th></tr>
            </thead>
            <tbody>
              <tr><td>μ<sub>y</sub></td><td>0,77</td><td>0,84</td><td>0,91</td><td>1,00</td><td>1,06</td><td>1,07</td><td>1,07</td><td>1,04</td></tr>
            </tbody>
          </table>
        </Tabla>

        <Destacado titulo="La ventana de temperatura">
          <p>
            Si se define la ventana como el intervalo donde μ se mantiene por encima de cierto porcentaje de su
            máximo, el modelo da: μ ≥ 95 % de μ<sub>max</sub> entre ≈ 72 y ≈ 104 °C, y μ ≥ 90 % entre ≈ 65 y ≈ 111 °C. Los
            límites inferiores están dentro del rango de los datos; los superiores quedan fuera (≈ 101 °C), así
            que son extrapolación y están marcados con asterisco en la figura.
          </p>
        </Destacado>
      </Bloque>
    </Seccion>
  );
}
