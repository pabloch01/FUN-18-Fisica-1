# Portafolio de evidencias · Física I (FUN-18) · Avance 2

Página hecha con React + Vite + Recharts. Cada tema tiene su caso de uso (parte A) y su recurso de apoyo (parte B).

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
  img/gravedad_artificial_diagrama.svg  Diagrama del Tema 3
  img/tema5_resorte_virtual.png         Figura del Tema 5
  img/rueda_reaccion_diagrama.svg       Diagrama del Tema 8
src/
  App.jsx                               Portada, índice y orden de las secciones
  styles.css                            Estilos
  components/
    GraficasVuelo18.jsx                 Tema 1: cuatro paneles (Recharts)
    SimulacionSalto.jsx                 Tema 2: simulación interactiva
    GraficaAgarreTema4.jsx              Tema 4: agarre contra temperatura
    GraficaFrenadoTema6.jsx             Tema 6: balance de energía del frenado regenerativo
    SimulacionRebote.jsx                Tema 7: simulación del coeficiente de restitución
    GraficaVoyagerTema9.jsx             Tema 9: rapidez de la Voyager 2 respecto al Sol
    ui.jsx                              Piezas de presentación (secciones, tablas, figuras)
  secciones/
    Tema1.jsx … Tema9.jsx               Texto de cada tema
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
