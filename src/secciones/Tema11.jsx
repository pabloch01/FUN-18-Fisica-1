import { GraficaOnda, GraficaEspectro } from "../components/GraficasTimbreTema11.jsx";
import { Seccion, Bloque, Eq, Tabla, Figura, Destacado } from "../components/ui.jsx";

const BASE = import.meta.env?.BASE_URL ?? "/";

export default function Tema11() {
  return (
    <Seccion
      id="tema-11"
      numero={11}
      titulo="Síntesis de sonido: armónicos, timbre y el sintetizador"
      concepto="ondas sonoras y armónicas; cómo la suma de armónicos con distintas amplitudes produce timbres distintos a la misma nota."
      recurso="multimedia con análisis"
    >
      <Bloque letra="A" titulo="Caso de uso en Ingeniería del Software">
        <h4>El caso concreto</h4>
        <p>
          La <strong>Web Audio API</strong>, el estándar con el que los navegadores generan y procesan sonido, y sobre el
          que se construyen sintetizadores, juegos y estaciones de audio en la web. Su generador básico, el{" "}
          <code>OscillatorNode</code>, produce ondas periódicas de cuatro formas predefinidas (<code>sine</code>,{" "}
          <code>square</code>, <code>sawtooth</code> y <code>triangle</code>) o una forma personalizada (MDN contributors,
          s. f.-b). Para la forma personalizada se llama a <code>createPeriodicWave(real, imag)</code>, cuyos dos
          arreglos son, según la documentación, los términos coseno y seno de la onda en orden ascendente de armónicos
          (MDN contributors, s. f.-a). Es decir: el programador le entrega al navegador los coeficientes de una serie de
          Fourier, y el timbre del instrumento es exactamente esa lista de números.
        </p>

        <h4>El concepto físico</h4>
        <p>
          Un sonido periódico de período <i>T</i> se oye con una altura (nota) fijada por su frecuencia fundamental{" "}
          <i>f</i><sub>0</sub> = 1/<i>T</i>. Cualquier onda periódica puede escribirse como una suma de senoides cuyas
          frecuencias son múltiplos enteros de <i>f</i><sub>0</sub>: los armónicos (Serway y Jewett, 2018, caps. 17 y 18).
          Dos sonidos con la misma <i>f</i><sub>0</sub> suenan a la misma nota; lo que los distingue, el timbre, son las
          amplitudes <i>A</i><sub>n</sub> de los armónicos:
        </p>
        <Eq etiqueta="Serie de Fourier de una onda periódica y armónicos de un tubo cerrado">
          <div><i>y</i>(<i>t</i>) = Σ<sub>n</sub> <i>A</i><sub>n</sub> sen(2π <i>n</i> <i>f</i><sub>0</sub> <i>t</i> + <i>φ</i><sub>n</sub>) &nbsp;&nbsp; <i>f</i><sub>n</sub> = <i>n</i> <i>f</i><sub>0</sub> &nbsp;&nbsp; <i>f</i><sub>0</sub> = 1/<i>T</i></div>
          <div>Tubo abierto en ambos extremos (flauta): <i>f</i><sub>n</sub> = <i>n</i> <i>v</i>/(2<i>L</i>), &nbsp;<i>n</i> = 1, 2, 3, …</div>
          <div>Tubo cerrado en un extremo (clarinete): <i>f</i><sub>n</sub> = <i>n</i> <i>v</i>/(4<i>L</i>), &nbsp;<i>n</i> = 1, 3, 5, …</div>
        </Eq>
        <p>
          La segunda línea, de las ondas estacionarias vistas en clase, explica por qué un instrumento real tiene la
          receta de armónicos que tiene: una columna de aire cerrada en un extremo, como la de un clarinete, solo admite
          armónicos impares (Serway y Jewett, 2018, cap. 18). En la onda <code>square</code> de la Web Audio API ocurre
          lo mismo: es la suma de los armónicos impares con amplitudes 1/<i>n</i>.
        </p>

        <h4>Por qué modelar la física resuelve el problema mejor</h4>
        <p>
          La alternativa sin física es grabar cada nota de cada instrumento: muestras de varios megabytes que solo pueden
          reproducirse tal como se grabaron. Con la síntesis, una nota de cualquier altura y cualquier timbre se genera en
          tiempo real con unos pocos coeficientes, y el timbre puede cambiar mientras suena (por ejemplo, apagando los
          armónicos altos para «oscurecer» el sonido), algo que una grabación no permite. Lo que cuesta es el realismo: un
          instrumento real no tiene una receta fija, sus armónicos cambian durante el ataque de cada nota y por eso un
          piano sintetizado con pocos armónicos suena artificial. Imitarlo exige muchos osciladores con amplitudes que
          varían en el tiempo, más cálculo por cada nota. Y hay un límite digital: un armónico por encima de la mitad de
          la frecuencia de muestreo no se puede representar y aparece como una frecuencia falsa (<i>aliasing</i>).
        </p>
        <p>
          Este tema se conecta con el Tema 12: cada armónico de un tubo o una cuerda es un modo de oscilación con su
          propia frecuencia natural, la misma idea que define cuándo un puente entra en resonancia. Y con el Tema 10: las
          dos son oscilaciones, pero aquí se buscan oscilaciones que duren, y allá que se apaguen pronto.
        </p>
      </Bloque>

      <Bloque letra="B" titulo="Recurso de apoyo: multimedia con análisis">
        <h4>Las dos muestras</h4>
        <p>
          Las dos muestras son la misma nota, La3 (<i>f</i><sub>0</sub> = 220 Hz), con la misma duración (2,5 s) y el
          mismo valor eficaz, para que suenen con la misma intensidad. Solo cambia la receta de armónicos. Fueron
          generadas por el autor con el script <code>scripts/sintesis_tema11.py</code> del repositorio, por lo que no hay
          contenido de terceros.
        </p>

        <Tabla numero={18} titulo="Receta de armónicos de cada muestra" nota="Amplitudes relativas a la fundamental. Las dos señales se normalizan al mismo valor eficaz (RMS) antes de guardarse.">
          <table>
            <thead>
              <tr><th>Muestra</th><th>Armónicos presentes</th><th>Amplitudes <i>A</i><sub>n</sub></th><th>Parecido a</th></tr>
            </thead>
            <tbody>
              <tr><td>A · timbre suave</td><td>1, 2 y 3</td><td>1; 0,15; 0,05</td><td>una flauta: casi una senoide pura</td></tr>
              <tr><td>B · timbre hueco</td><td>solo impares, 1 a 15</td><td>1/<i>n</i>: 1; 0,33; 0,20; 0,14; …</td><td>un clarinete; es la onda <code>square</code> limitada a 15 armónicos</td></tr>
            </tbody>
          </table>
        </Tabla>

        <div className="audios">
          <figure>
            <figcaption><strong>Muestra A</strong> · timbre suave (La3, 220 Hz)</figcaption>
            <audio controls preload="none" src={`${BASE}audio/tema11_timbre_suave.wav`}>
              Tu navegador no puede reproducir audio WAV.
            </audio>
          </figure>
          <figure>
            <figcaption><strong>Muestra B</strong> · timbre hueco (La3, 220 Hz)</figcaption>
            <audio controls preload="none" src={`${BASE}audio/tema11_timbre_hueco.wav`}>
              Tu navegador no puede reproducir audio WAV.
            </audio>
          </figure>
        </div>

        <Figura
          numero={8}
          titulo="Forma de onda de las dos muestras durante dos períodos."
          nota="Fragmento tomado a 1 s del inicio de cada audio. Elaboración propia con scripts/sintesis_tema11.py."
        >
          <GraficaOnda />
        </Figura>

        <Figura
          numero={9}
          titulo="Contenido armónico de las dos muestras, medido con la transformada rápida de Fourier (FFT) de 1 s de cada audio."
          nota="Amplitud de cada armónico dividida entre la de la fundamental. Elaboración propia con scripts/sintesis_tema11.py."
        >
          <GraficaEspectro />
        </Figura>

        <h4>Análisis</h4>
        <p>
          <strong>Por qué suenan a la misma nota.</strong> En la Figura 8 las dos curvas se repiten exactamente cada
          4,55 ms (la línea punteada): el mismo período <i>T</i> significa la misma frecuencia fundamental,{" "}
          <i>f</i><sub>0</sub> = 1/0,004 55 s = 220 Hz, y el oído las reconoce como el mismo La3. En la Figura 9 las dos
          tienen la barra más alta en 220 Hz.
        </p>
        <p>
          <strong>Qué produce el timbre suave de la muestra A.</strong> Su forma de onda es casi una senoide: es redonda y
          sin esquinas, porque casi toda su energía está en la fundamental: como la energía de cada armónico es
          proporcional a <i>A</i><sub>n</sub>², la fundamental se lleva 1 / (1 + 0,15² + 0,05²) = 97,6 % del total. El segundo armónico (440 Hz, amplitud 0,15) apenas
          deforma la curva y hace que las crestas y los valles no sean iguales. Con tan pocos armónicos, todo el sonido
          está concentrado en una sola frecuencia, y por eso se oye limpio y suave.
        </p>
        <p>
          <strong>Qué produce el timbre hueco de la muestra B.</strong> Su forma de onda es casi cuadrada: sube de golpe,
          se queda plana y baja de golpe. Esas esquinas solo pueden construirse sumando muchos armónicos. La Figura 9
          muestra exactamente cuáles: hay barras en 660, 1100, 1540 Hz… (los armónicos 3, 5, 7…) con alturas 1/3, 1/5,
          1/7…, y <strong>no hay ninguna</strong> en 440, 880 o 1320 Hz. Esa ausencia de armónicos pares es lo que el
          oído percibe como un sonido «hueco» o nasal, el característico de un clarinete, cuya columna de aire cerrada en
          un extremo solo admite armónicos impares (<i>f</i><sub>n</sub> = <i>n</i><i>v</i>/(4<i>L</i>)). Las pequeñas
          ondulaciones sobre las partes planas de la Figura 8 son el último armónico sumado (15 · 220 = 3300 Hz): para
          una esquina perfecta harían falta infinitos.
        </p>
        <p>
          <strong>Qué no cambia.</strong> Las dos muestras tienen el mismo valor eficaz y, por lo tanto, la misma energía
          por unidad de tiempo; la diferencia que se escucha no es de volumen ni de nota, sino solo de cómo se reparte la
          energía entre los armónicos.
        </p>

        <Destacado titulo="Qué escuchar">
          <p>
            Reproduce la muestra A y, sin pausa, la muestra B. La nota no cambia, pero la B suena más brillante y con un
            zumbido nasal: son sus armónicos impares, que llegan hasta 3300 Hz. Para el oído, la muestra A es casi un
            silbido.
          </p>
        </Destacado>
      </Bloque>
    </Seccion>
  );
}
