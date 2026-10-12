import { Seccion, Bloque, Eq, Tabla, Figura } from "../components/ui.jsx";

export default function Tema3() {
  return (
    <Seccion
      id="tema-3"
      numero={3}
      titulo="Gravedad artificial por rotación en hábitats espaciales"
      concepto="movimiento circular uniforme, aceleración centrípeta, período y frecuencia angular."
      recurso="diagrama"
    >
      <Bloque letra="A" titulo="Caso de uso en Ingeniería del Software">
        <h4>El caso concreto</h4>
        <p>
          El software de validación y control de un hábitat espacial rotatorio (industria aeroespacial). Dado el radio
          del aro y una gravedad objetivo, el programa debe calcular la velocidad angular necesaria y comprobar que no
          supere el máximo de revoluciones por minuto que tolera la tripulación. Como ejemplo se toma un hábitat de
          100 m de radio con un máximo de 2 rpm y un objetivo cercano a la gravedad de Marte (≈ 0,38 g₀, la razón
          entre la gravedad superficial de Marte y la terrestre que publica la NASA; Williams, s. f.).
        </p>

        <h4>El concepto físico</h4>
        <p>
          Un punto que se mueve en una circunferencia con rapidez angular constante tiene aceleración centrípeta hacia
          el centro (Serway y Jewett, 2018). En un hábitat rotatorio, el piso empuja a la tripulación hacia el eje con
          esa aceleración, y ese empuje se percibe como peso:
        </p>
        <Eq etiqueta="Relaciones del movimiento circular uniforme">
          <div><i>v</i> = ω<i>R</i> &nbsp;&nbsp; <i>a</i><sub>c</sub> = <i>v</i>²/<i>R</i> = ω²<i>R</i></div>
          <div><i>T</i> = 2π/ω &nbsp;&nbsp; <i>f</i> = 1/<i>T</i> &nbsp;&nbsp; ω [rad/s] = rpm · 2π/60</div>
        </Eq>

        <Tabla
          numero={5}
          titulo="Ejemplo numérico propio: hábitat de 100 m de radio con un máximo de 2 rpm"
          nota="Con 2 rpm (ω = 0,2094 rad/s) este hábitat solo alcanza a_c = ω²R = 4,39 m/s² ≈ 0,45 g₀."
        >
          <table>
            <thead>
              <tr><th>Gravedad objetivo</th><th>ω necesaria [rad/s]</th><th>rpm</th><th>¿Cumple el máximo de 2 rpm?</th></tr>
            </thead>
            <tbody>
              <tr><td>0,38 g₀</td><td>0,193</td><td>1,84</td><td>Sí</td></tr>
              <tr><td>1 g₀</td><td>0,313</td><td>2,99</td><td>No</td></tr>
            </tbody>
          </table>
        </Tabla>

        <h4>Por qué modelar la física resuelve el problema mejor</h4>
        <p>
          Una tabla de “valores recomendados” no cubre un espacio de diseño continuo, porque cada radio y cada
          gravedad objetivo producen una velocidad angular distinta. Además, la intuición lineal falla: como a<sub>c</sub> ∝ ω²,
          duplicar las rpm cuadruplica la gravedad aparente. Y la elección del radio es un compromiso, porque para una
          gravedad dada se puede girar más rápido con un radio menor o más despacio con un radio mayor (Lackner y
          DiZio, 2000). Los primeros estudios sugerían alrededor de 3 rpm como límite superior; trabajos posteriores
          indican que, con aumentos graduales de la velocidad, podrían tolerarse entre 7,5 y 10 rpm (Lackner y DiZio,
          2000). El software tiene que calcular esa relación, no consultarla.
        </p>
      </Bloque>

      <Bloque letra="B" titulo="Recurso de apoyo: diagrama">
        <Figura
          numero={2}
          titulo="Corte transversal de un hábitat rotatorio con la aceleración centrípeta y el caso numérico de 1 g."
          nota="Esquema propio, fuera de escala. Valores calculados con g₀ = 9,80665 m/s²."
        >
          <img
            src={`${import.meta.env.BASE_URL}img/gravedad_artificial_diagrama.svg`}
            alt="Esquema de un hábitat en forma de aro que gira con velocidad angular ω alrededor de un eje perpendicular al plano. Un tripulante con los pies en la cara interna tiene velocidad tangencial v = ωR y aceleración centrípeta a_c = ω²R dirigida hacia el eje. A la derecha aparecen las ecuaciones y el caso numérico de 1 g con 2 rpm."
            className="img-ancha"
            loading="lazy"
          />
        </Figura>

        <h4>Caso trabajado: ¿qué radio y qué rpm producen 1 g?</h4>
        <p>
          La condición es <i>R</i>ω² = g₀ = 9,80665 m/s², así que no hay una sola respuesta sino una familia: <i>R</i> = g₀/ω².
          Al fijar el máximo de 2 rpm, la velocidad angular es ω = 2 · 2π/60 = 0,2094 rad/s y el radio necesario es
          <i> R</i> = 9,80665/0,2094² ≈ <strong>223,6 m</strong>. En el piso la rapidez es <i>v</i> = ω<i>R</i> ≈ 46,8 m/s, el período es
          <i> T</i> = 2π/ω = 30 s y la frecuencia es <i>f</i> ≈ 0,033 Hz. Para una persona de 1,8 m, la diferencia relativa
          de gravedad entre los pies y la cabeza es Δa/a = <i>h</i>/<i>R</i> ≈ 0,8 %.
        </p>

        <Tabla
          numero={6}
          titulo="Radio necesario para obtener 1 g₀ según las revoluciones por minuto"
          nota="Cálculo propio con R = g₀/ω²."
        >
          <table>
            <thead>
              <tr><th>rpm</th><th>ω [rad/s]</th><th>R para 1 g₀ [m]</th><th>Período T [s]</th></tr>
            </thead>
            <tbody>
              <tr><td>1</td><td>0,105</td><td>894,3</td><td>60,0</td></tr>
              <tr><td>2</td><td>0,209</td><td>223,6</td><td>30,0</td></tr>
              <tr><td>3</td><td>0,314</td><td>99,4</td><td>20,0</td></tr>
              <tr><td>4</td><td>0,419</td><td>55,9</td><td>15,0</td></tr>
              <tr><td>6</td><td>0,628</td><td>24,8</td><td>10,0</td></tr>
              <tr><td>7,5</td><td>0,785</td><td>15,9</td><td>8,0</td></tr>
              <tr><td>10</td><td>1,047</td><td>8,94</td><td>6,0</td></tr>
            </tbody>
          </table>
        </Tabla>

        <h4>Una comprobación con datos publicados</h4>
        <p>
          Bretl y Clark (2020) reportan que, tras un protocolo gradual de 50 días, la tolerancia promedio de los
          participantes subió de 1,4 a 26,2 rpm, lo que reduce el radio necesario para 1 g en los pies de 456,6 m a
          1,3 m. La fórmula <i>R</i> = g₀/ω² da 456 m para 1,4 rpm y 1,30 m para 26,2 rpm, es decir, reproduce sus cifras.
        </p>
      </Bloque>
    </Seccion>
  );
}
