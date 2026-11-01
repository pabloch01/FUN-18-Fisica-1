// Lista única de temas: la usan la portada orbital, el índice y la cabecera de cada sección.
// Los títulos son los de la consigna; el color identifica el bloque temático.

export const BLOQUES = {
  cinematica: { nombre: "Cinemática", color: "#5aa9ff" },
  dinamica: { nombre: "Dinámica", color: "#ff9a5c" },
  conservacion: { nombre: "Conservación", color: "#4fd1a5" },
  gravitacion: { nombre: "Gravitación", color: "#a99bff" },
};

export const TEMAS = [
  { id: "tema-1", numero: 1, bloque: "cinematica", corto: "Dron de reparto", titulo: "Rastreo y navegación de un dron de reparto" },
  { id: "tema-2", numero: 2, bloque: "cinematica", corto: "El salto del personaje", titulo: "El salto del personaje: cómo los motores de juego falsean la gravedad" },
  { id: "tema-3", numero: 3, bloque: "dinamica", corto: "Gravedad artificial", titulo: "Gravedad artificial por rotación en hábitats espaciales" },
  { id: "tema-4", numero: 4, bloque: "dinamica", corto: "Llantas de F1", titulo: "Llantas de Fórmula 1: la ventana de temperatura y el agarre" },
  { id: "tema-5", numero: 5, bloque: "dinamica", corto: "Resorte háptico", titulo: "El resorte virtual detrás de un control háptico" },
  { id: "tema-6", numero: 6, bloque: "conservacion", corto: "Frenado regenerativo", titulo: "Frenado regenerativo en un vehículo eléctrico" },
  { id: "tema-7", numero: 7, bloque: "conservacion", corto: "Coeficiente de restitución", titulo: "El coeficiente de restitución en un motor de videojuego: por qué la pelota rebota mal" },
  { id: "tema-8", numero: 8, bloque: "conservacion", corto: "Ruedas de reacción", titulo: "Ruedas de reacción: cómo un satélite se gira sin empujarse contra nada" },
  { id: "tema-9", numero: 9, bloque: "gravitacion", corto: "Asistencia gravitatoria", titulo: "Asistencia gravitatoria: cómo la Voyager ganó velocidad sin gastar combustible" },
];

export const colorDeTema = (numero) => BLOQUES[TEMAS[numero - 1]?.bloque]?.color ?? "#6aa8ff";
export const bloqueDeTema = (numero) => BLOQUES[TEMAS[numero - 1]?.bloque]?.nombre ?? "";
