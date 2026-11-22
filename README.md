# Portafolio de evidencias · Física I (FUN-18) · Entrega final

Página hecha con React + Vite + Recharts. Cada uno de los trece temas tiene su caso de uso (parte A) y su recurso de apoyo (parte B); al final, la
sección «Qué aprendí» conecta temas y propone una aplicación propia.

## Cómo ejecutarla

```bash
npm install
npm run dev        # servidor local en http://localhost:5173
npm run build      # genera la carpeta dist/ con la página lista para publicar
npm run preview    # prueba local de la versión compilada
```

La compilación usa rutas relativas (`base: "./"`), así que la carpeta `dist/` funciona desde cualquier ruta
(por ejemplo, GitHub Pages en `https://usuario.github.io/nombre-del-repositorio/`).

## Estructura

```
public/
  data/vuelo18_procesado.csv            Datos del Tema 1 (vuelo 18, ya procesados)
  data/balance_tema6.csv                Datos del Tema 6 (balance de energía en el ciclo UDDS)
  data/voyager2_rapidez.csv             Datos del Tema 9 (rapidez de la Voyager 2, JPL Horizons)
  data/tema11_onda.csv                  Datos del Tema 11 (forma de onda de las dos muestras)
  data/tema11_espectro.csv              Datos del Tema 11 (contenido armónico de las dos muestras)
  data/tema13_circuito.csv              Datos del Tema 13 (velocidad y presión a lo largo del circuito)
  audio/tema11_timbre_suave.wav         Muestra A del Tema 11 (La3, timbre suave)
  audio/tema11_timbre_hueco.wav         Muestra B del Tema 11 (La3, timbre hueco)
  img/gravedad_artificial_diagrama.svg  Diagrama del Tema 3
  img/tema5_resorte_virtual.png         Figura del Tema 5
  img/rueda_reaccion_diagrama.svg       Diagrama del Tema 8
src/
  App.jsx                               Índice y orden de las secciones
  temas.js                              Lista única de los trece temas, sus bloques y colores
  styles.css                            Estilos
  components/
    GraficasVuelo18.jsx                 Tema 1: cuatro paneles (Recharts)
    SimulacionSalto.jsx                 Tema 2: simulación interactiva
    GraficaAgarreTema4.jsx              Tema 4: agarre contra temperatura
    GraficaFrenadoTema6.jsx             Tema 6: balance de energía del frenado regenerativo
    SimulacionRebote.jsx                Tema 7: simulación del coeficiente de restitución
    GraficaVoyagerTema9.jsx             Tema 9: rapidez de la Voyager 2 respecto al Sol
    SimulacionResorte.jsx               Tema 10: simulación de una animación con resorte amortiguado
    GraficasTimbreTema11.jsx            Tema 11: forma de onda y contenido armónico
    GraficaCircuitoTema13.jsx           Tema 13: velocidad y presión en el circuito de enfriamiento
    PortadaOrbital.jsx                  Portada con el sistema orbital y la transición al índice
    ui.jsx                              Piezas de presentación (secciones, tablas, figuras)
  secciones/
    Tema1.jsx … Tema13.jsx              Texto de cada tema
    QueAprendi.jsx                      Sección de cierre «Qué aprendí»
    Referencias.jsx                     Referencias en APA 7
```

## Publicación en GitHub Pages

El archivo `.github/workflows/publicar.yml` compila y publica la página en cada `git push` a la rama `portafolios`.

## Reproducir los datos y las figuras

Los scripts están en `scripts/` (Python con pandas, numpy, scipy y matplotlib):

- `procesar_vuelo18.py` genera el CSV del Tema 1 y su figura a partir del archivo original `18.csv`.
- `grafica_tema4.py` genera la imagen de la gráfica del Tema 4.
- `figura_tema5.py` genera la figura del Tema 5.
- `modelo_tema6.py` calcula el balance de energía del Tema 6 (`python scripts/modelo_tema6.py udds` escribe
  `public/data/balance_tema6.csv`; con `hwfet` calcula el ciclo de carretera). Usa los ciclos de `scripts/datos/`.
- `voyager2_rapidez.py` genera los datos del Tema 9 a partir de `scripts/datos/voyager2_horizons_vel.txt`
  (velocidades de JPL Horizons).
- `sintesis_tema11.py` genera los dos audios del Tema 11 y los datos de su forma de onda y su espectro.
- `circuito_tema13.py` calcula la velocidad y la presión a lo largo del circuito de enfriamiento del Tema 13.
