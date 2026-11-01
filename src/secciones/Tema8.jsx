import { Seccion, Bloque, Eq, Tabla, Figura, Destacado } from "../components/ui.jsx";

export default function Tema8() {
  return (
    <Seccion
      id="tema-8"
      numero={8}
      titulo="Ruedas de reacción: cómo un satélite se gira sin empujarse contra nada"
      concepto="conservación del momento angular y torque."
      recurso="diagrama"
    >
      <Bloque letra="A" titulo="Caso de uso en Ingeniería del Software">
        <h4>El caso concreto</h4>
        <p>
          El software de control de actitud del telescopio espacial Kepler, de la NASA. Kepler apuntaba con precisión
          gracias a cuatro ruedas de reacción y necesitaba tres en funcionamiento. En mayo de 2013 falló la segunda, y
          la presión de la luz solar, que empuja la nave cuando los fotones la golpean, empezó a desviarla sin que hubiera
          una tercera rueda para compensarla. El equipo de la misión reprogramó el control para usar esa misma presión
          solar como apoyo, “como un kayak que se orienta contra la corriente”, y así nació la misión K2 (NASA Science,
          2023). Con dos ruedas, el apuntado se mantenía combinándolas con disparos de los propulsores; en una prueba de
          diciembre de 2013, las descargas de momento de las ruedas (llamadas <em>resaturations</em>) ocurrieron cada 48 horas y los ajustes de apuntado cada 12
          (NASA Ames Research Center, s. f.).
        </p>

        <h4>El concepto físico</h4>
        <p>
          En el espacio no hay nada contra qué empujarse, pero sí se puede intercambiar momento angular entre dos partes
          del mismo sistema. El motor de la rueda le aplica un torque τ a la rueda; por la tercera ley de Newton, la
          rueda le aplica −τ al cuerpo del satélite. Como no hay torque externo, el momento angular total se conserva
          (Serway y Jewett, 2018):
        </p>
        <Eq etiqueta="Conservación del momento angular en un satélite con rueda de reacción">
          <div><i>L</i> = <i>I</i><sub>s</sub>ω<sub>s</sub> + <i>I</i><sub>r</sub>Ω = constante &nbsp;&nbsp; τ = <i>I</i><sub>r</sub> dΩ/d<i>t</i> &nbsp;⟹&nbsp; −τ = <i>I</i><sub>s</sub> dω<sub>s</sub>/d<i>t</i></div>
          <div><i>I</i><sub>s</sub> Δω<sub>s</sub> = −<i>I</i><sub>r</sub> ΔΩ</div>
          <div>Saturación: <i>H</i><sub>max</sub> = <i>I</i><sub>r</sub>Ω<sub>max</sub> &nbsp;&nbsp; <i>t</i><sub>sat</sub> = <i>H</i><sub>max</sub> / τ<sub>d</sub></div>
          <div>Descarga con un torque externo: τ<sub>mag</sub> = μ × <i>B</i></div>
        </Eq>
        <p>
          Para girar el satélite en un sentido, la rueda acelera en el contrario, y el satélite se detiene cuando la rueda
          vuelve a su velocidad anterior. El problema aparece con los torques externos pequeños pero constantes, τ<sub>d</sub>,
          como la presión solar: para que el satélite no derive, la rueda tiene que ir absorbiendo ese momento, y su
          velocidad crece hasta su máximo, Ω<sub>max</sub>. Ahí la rueda está <strong>saturada</strong>: ya no puede
          acelerar más y el satélite empieza a derivar. La única salida es un torque externo que saque momento del
          sistema, por ejemplo el de un magnetorquer, una bobina con momento dipolar μ que interactúa con el campo
          magnético terrestre <i>B</i>, o el de los propulsores. Mientras ese torque frena la rueda, la rueda devuelve el
          momento al exterior sin girar el satélite.
        </p>

        <Tabla
          numero={14}
          titulo="Ejemplo numérico con una rueda comercial real y un satélite hipotético"
          nota="Datos de la rueda RWp050 de Blue Canyon Technologies (2026): momento máximo de 0,050 N·m·s y torque máximo de 0,007 N·m. El momento de inercia del satélite (0,08 kg·m², del orden de un CubeSat pequeño) y el torque perturbador (1 μN·m) son valores supuestos para el ejemplo."
        >
          <table>
            <thead>
              <tr><th>Cálculo</th><th>Ecuación</th><th>Resultado</th></tr>
            </thead>
            <tbody>
              <tr><td>Aceleración angular del satélite con el torque máximo</td><td>α = τ/<i>I</i><sub>s</sub> = 0,007/0,08</td><td>0,0875 rad/s²</td></tr>
              <tr><td>Tiempo de un giro de 90° (acelera la mitad y frena la otra)</td><td><i>t</i> = 2√(θ/α)</td><td>8,5 s</td></tr>
              <tr><td>Momento que guarda la rueda a mitad del giro</td><td><i>I</i><sub>s</sub>ω<sub>max</sub> = 0,08 · 0,371</td><td>0,030 N·m·s (59 % de su capacidad)</td></tr>
              <tr><td>Tiempo hasta saturarse con una perturbación constante</td><td><i>t</i><sub>sat</sub> = 0,050 / 1×10⁻⁶</td><td>50 000 s ≈ 13,9 h</td></tr>
            </tbody>
          </table>
        </Tabla>

        <h4>Por qué modelar la física resuelve el problema mejor</h4>
        <p>
          Una tabla de maniobras precalculadas no sabe cuánto momento angular queda guardado en cada rueda ni cuándo hay
          que descargarlo, y esa cuenta depende de las perturbaciones reales que la nave encuentra en órbita. El software
          de control lleva ese balance con la conservación del momento angular y decide en cada instante qué torque pedir
          a cada rueda y cuándo encender los magnetorquers o los propulsores. Kepler muestra el valor de hacerlo así:
          cuando perdió dos ruedas, solo un modelo con la conservación del momento angular y los torques externos
          permitió diseñar una forma nueva de apuntar con lo que quedaba. El costo es que el modelo necesita conocer
          bien los momentos de inercia y las perturbaciones, y que cada descarga gasta combustible o depende del campo
          magnético disponible.
        </p>
        <p>
          Este tema se conecta con el Tema 3 y con el proyecto de simulación del curso: la misma conservación del momento
          angular que aquí permite girar un satélite es la que, en un hábitat rotatorio, hace que la gravedad aparente
          cambie cuando se mueve masa hacia el aro o hacia el centro.
        </p>
      </Bloque>

      <Bloque letra="B" titulo="Recurso de apoyo: diagrama">
        <Figura
          numero={6}
          titulo="Satélite con una rueda de reacción: intercambio de momento angular, saturación y descarga."
          nota="Esquema propio, fuera de escala. El par τ y −τ es de acción y reacción entre la rueda y el cuerpo; el magnetorquer es la fuente del torque externo que permite descargar la rueda."
        >
          <img
            src={`${import.meta.env.BASE_URL}img/rueda_reaccion_diagrama.svg`}
            alt="Satélite con paneles solares y una rueda de reacción en su interior, montada sobre un eje. La rueda gira con velocidad angular Omega en un sentido y el cuerpo con omega s en el sentido contrario. Sobre el eje, el vector L r de la rueda apunta hacia arriba y el vector L s del satélite hacia abajo; su suma es constante. A la derecha, las ecuaciones de conservación, torque, saturación y descarga. Abajo, tres paneles: el momento guardado en la rueda crece, llega al máximo H max y la rueda queda saturada, y luego un magnetorquer con torque mu por B lo reduce."
            className="img-ancha"
            loading="lazy"
          />
        </Figura>

        <h4>Qué pasa cuando la rueda llega a su velocidad máxima</h4>
        <p>
          El diagrama muestra las tres etapas. En la primera, cada vez que el satélite necesita girar o compensar una
          perturbación, la rueda absorbe el momento angular y su velocidad crece. En la segunda, la rueda alcanza
          Ω<sub>max</sub>: el momento guardado llega a <i>H</i><sub>max</sub> y la rueda ya no puede acelerar más, así
          que cualquier torque perturbador hace derivar al satélite. Es exactamente lo que ocurría con Kepler sin su
          tercera rueda frente a la presión solar. En la tercera etapa, un torque externo, el del magnetorquer
          (τ = μ × <i>B</i>) o el de los propulsores, saca momento del sistema. Como ese torque viene de afuera, la rueda
          puede frenar sin que el satélite gire, y vuelve a tener margen para seguir trabajando.
        </p>

        <Destacado titulo="La idea central">
          <p>
            La rueda de reacción no crea ni elimina momento angular: solo lo cambia de lugar entre ella y el cuerpo del
            satélite. Por eso sirve para girar, pero no para compensar indefinidamente un torque externo. Para eso hace
            falta otro torque externo.
          </p>
        </Destacado>
      </Bloque>
    </Seccion>
  );
}
