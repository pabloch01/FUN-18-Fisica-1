import { Seccion, Bloque, Eq, Tabla, Figura } from "../components/ui.jsx";

// Segundo del video donde empieza el mecanismo del gatillo (9:32 = 9 × 60 + 32)
const INICIO_VIDEO = 572; // 9:32

export default function Tema5() {
  return (
    <Seccion
      id="tema-5"
      numero={5}
      titulo="El resorte detrás de un control háptico"
      concepto="ley de Hooke, fuerza elástica y tercera ley de Newton; cómo un motor de vibración o un gatillo adaptativo simula que uno está tensando algo que no existe."
      recurso="multimedia con análisis"
    >
      <Bloque letra="A" titulo="Caso de uso en Ingeniería del Software">
        <h4>El caso concreto</h4>
        <p>
          El software de efectos de un gatillo adaptativo (periféricos hápticos, industria de los videojuegos). Un
          efecto como “tensar un arco” se modela como un resorte virtual con una posición de inicio <i>x</i><sub>0</sub> y una
          rigidez <i>k</i>: el programa lee la posición del gatillo, calcula la fuerza que corresponde y ordena esa fuerza
          al motor, todo dentro de un lazo de control que se repite varias veces por milisegundo.
        </p>

        <h4>El concepto físico</h4>
        <p>
          La ley de Hooke da la fuerza de un resorte proporcional a su deformación, y la tercera ley de Newton dice
          que si el dedo empuja el gatillo, el gatillo empuja al dedo con una fuerza igual y opuesta (Serway y Jewett,
          2018). Esa reacción es lo que se siente:
        </p>
        <Eq etiqueta="Resorte virtual del gatillo">
          <div><i>F</i> = 0 para <i>x</i> &lt; <i>x</i><sub>0</sub> &nbsp;&nbsp; <i>F</i> = <i>k</i>(<i>x</i> − <i>x</i><sub>0</sub>) para <i>x</i> ≥ <i>x</i><sub>0</sub></div>
          <div>Trabajo del dedo: <i>W</i> = ½<i>k</i>(<i>x</i> − <i>x</i><sub>0</sub>)²</div>
        </Eq>
        <p>
          Como el lazo es discreto, aparece una restricción física. Colgate y Schenkel (1997) estudiaron la pasividad
          de sistemas con una planta continua y un controlador muestreado, motivados por la estabilidad de las
          interfaces hápticas. Para un resorte virtual muestreado con tiempo de muestreo <i>T</i>, la condición de
          pasividad es <i>b</i> &gt; <i>K</i><i>T</i>/2, donde <i>K</i> es la rigidez virtual y <i>b</i> es el amortiguamiento del dispositivo. Si se
          añade un amortiguamiento virtual <i>B</i>, la condición pasa a ser <i>b</i> &gt; <i>K</i><i>T</i>/2 + <i>B</i> (Colgate y Schenkel,
          1997).
        </p>

        <Tabla
          numero={9}
          titulo="Ejemplo numérico ilustrativo (valores hipotéticos, no medidos en un control real)"
          nota="Con b = 0,5 N·s/m y K = 1 000 N/m, el tiempo de muestreo máximo para un resorte pasivo es T = 2b/K = 1 ms. Con k = 1 000 N/m y 5 mm de recorrido, F = 5 N y W = 12,5 mJ."
        >
          <table>
            <thead>
              <tr><th>Tiempo de muestreo <i>T</i></th><th>Rigidez máxima pasiva <i>K</i> = 2<i>b</i>/<i>T</i></th></tr>
            </thead>
            <tbody>
              <tr><td>1 ms</td><td>1 000 N/m</td></tr>
              <tr><td>10 ms</td><td>100 N/m</td></tr>
            </tbody>
          </table>
        </Tabla>

        <h4>Por qué modelar la física resuelve el problema mejor</h4>
        <p>
          Un “si presiona, vibra” da una retroalimentación binaria, y una tabla de fuerzas fija no responde a cuánto ni
          cuán rápido se jala. El resorte virtual hace que la fuerza dependa de la posición, que es lo que el dedo
          espera de un resorte real. Y si se ignora la condición de pasividad, un efecto “rígido” se vuelve inestable
          y zumba, porque el controlador discreto le inyecta energía al sistema.
        </p>
      </Bloque>

      <Bloque letra="B" titulo="Recurso de apoyo: multimedia con análisis">
        <h4>Video</h4>
        <div className="video">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/4rNITneXnCo?start=${INICIO_VIDEO}`}
            title="Desarmado de un control DualSense de PlayStation 5, con el mecanismo del gatillo adaptativo"
            loading="lazy"
            allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </div>
        <p className="nota">
          TronicsFix. (2020). <em>PS5 DualSense Controller Teardown - A Repairability Perspective</em> [Video]. YouTube.{" "}
          <a href="https://www.youtube.com/watch?v=4rNITneXnCo">https://www.youtube.com/watch?v=4rNITneXnCo</a>. El
          video empieza en el instante del análisis del gatillo.
        </p>

        <h4>Análisis</h4>
        <p>
          En 9:35 el autor del video (TronicsFix, 2020) muestra el mecanismo del gatillo, al que llama <em>gatillo adaptativo</em>. Se ve un motor
          eléctrico pequeño cuyo eje termina en un tornillo sin fin, que engrana con una rueda dentada; esa rueda mueve una pieza
          negra en forma de sector, montada sobre un pivote con un resorte pequeño. Esa pieza es contra la que llega el gatillo,
          y su posición la fija el motor a través de los engranajes. Esa posición define <i>x</i><sub>0</sub>: antes de ella el gatillo se
          mueve libre y <i>F</i> = 0, que es el tramo ① de la Figura 4a. En 9:46 el gatillo llega a esa pieza y empieza la
          resistencia: desde ahí la fuerza que siente el dedo crece con el recorrido, como en la ley de Hooke,
          <i> F</i> = <i>k</i>(<i>x</i> − <i>x</i><sub>0</sub>); es el tramo ② de la figura, cuya pendiente es la rigidez <i>k</i>. Esa fuerza es la reacción de
          la que habla la tercera ley de Newton: el dedo empuja el gatillo con <i>F</i> y el gatillo empuja al dedo con −<i>F</i>. Al final
          del recorrido, el tope mecánico del tramo ③ hace subir la fuerza de golpe.
        </p>
        <p>
          La curva fuerza–desplazamiento de la Figura 4a es, entonces, una zona libre, una recta de pendiente <i>k</i> y un tope. Y como el
          software calcula la fuerza en pasos de tiempo discretos, la rigidez que puede simular de forma estable está limitada por
          <i> K</i> &lt; 2<i>b</i>/<i>T</i> (Colgate y Schenkel, 1997), como muestra la Figura 4b.
        </p>

        <Figura
          numero={4}
          titulo="Resorte virtual de un gatillo háptico: modelo idealizado."
          nota="Valores ilustrativos (k = 1 000 N/m, x₀ = 2 mm, tope en 7 mm, b = 0,5 N·s/m); no son mediciones de un control real. En (a), el área sombreada es el trabajo del dedo, W = 12,5 mJ. En (b), la condición de pasividad es b > K·T/2 (Colgate y Schenkel, 1997)."
        >
          <img
            src={`${import.meta.env.BASE_URL}img/tema5_resorte_virtual.png`}
            alt="Dos gráficas. (a) Fuerza contra desplazamiento del gatillo: cero hasta 2 mm, una recta de pendiente 1 000 newton por metro hasta 7 mm donde la fuerza llega a 5 newton, y un tope mecánico donde la fuerza sube de golpe. (b) Rigidez virtual contra tiempo de muestreo: una línea decreciente K igual a 2b entre T separa la región estable, debajo, de la región que puede zumbar, arriba."
            className="img-ancha"
            loading="lazy"
          />
        </Figura>
      </Bloque>
    </Seccion>
  );
}
