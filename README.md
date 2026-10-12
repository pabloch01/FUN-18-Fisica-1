# Portafolio de evidencias · Física I (FUN-18) · Avance 1

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
  img/gravedad_artificial_diagrama.svg  Diagrama del Tema 3
  img/tema5_resorte_virtual.png         Figura del Tema 5
src/
  App.jsx                               Portada, índice y orden de las secciones
  styles.css                            Estilos
  components/
    GraficasVuelo18.jsx                 Tema 1: cuatro paneles (Recharts)
    SimulacionSalto.jsx                 Tema 2: simulación interactiva
    GraficaAgarreTema4.jsx              Tema 4: agarre contra temperatura
    ui.jsx                              Piezas de presentación (secciones, tablas, figuras)
  secciones/
    Tema1.jsx … Tema5.jsx               Texto de cada tema
    Referencias.jsx                     Referencias en APA 7
```

## Antes de entregar

1. **Referencias:** comprobar que cada cita del texto aparezca en `Referencias.jsx` y viceversa.
2. **Datos de terceros:** el Tema 1 usa el vuelo 18 de Rodrigues et al. (2020), licencia CC BY 4.0. El archivo
   `public/data/vuelo18_procesado.csv` es una versión modificada (coordenadas locales, velocidad rotada, aceleración derivada).
3. **Video del Tema 5:** abrir la página publicada y comprobar que el video se reproduce (si el autor desactivó la
   inserción, YouTube mostrará un error y habría que enlazarlo en lugar de incrustarlo).
4. **Entrega en Moodle:** URL de la página publicada y URL del repositorio público.

## Publicación en GitHub Pages

El archivo `.github/workflows/publicar.yml` compila y publica la página en cada `git push` a la rama `main`.
En el repositorio de GitHub, ir a **Settings → Pages → Build and deployment → Source** y elegir **GitHub Actions**.

## Reproducir los datos y las figuras

Los scripts están en `scripts/` (Python con pandas, numpy, scipy y matplotlib):

- `procesar_vuelo18.py` genera el CSV del Tema 1 y su figura a partir del archivo original `18.csv` (colocarlo junto al script).
- `grafica_tema4.py` genera la imagen de la gráfica del Tema 4.
- `figura_tema5.py` genera la figura del Tema 5.
