"""
Tema 11 · Genera las dos muestras de audio (mismo tono, distinto timbre) y los datos de sus gráficas.

Cada muestra es una suma de armónicos de la misma fundamental f0 = 220 Hz (La3):
    y(t) = Σ A_n · sen(2π·n·f0·t)
  Muestra A, «timbre suave»:  A1 = 1, A2 = 0,15, A3 = 0,05 (casi una senoide pura, parecida a una flauta).
  Muestra B, «timbre hueco»:  solo armónicos impares, A_n = 1/n para n = 1, 3, 5, …, 15
                              (la receta clásica de un timbre tipo clarinete).
Las dos se normalizan al mismo valor eficaz (RMS) para que suenen con la misma intensidad.

Salidas:
  public/audio/tema11_timbre_suave.wav, public/audio/tema11_timbre_hueco.wav   (44,1 kHz, 16 bits, mono, 2,5 s)
  public/data/tema11_onda.csv      dos períodos de cada forma de onda (t en ms)
  public/data/tema11_espectro.csv  amplitud de cada armónico medida con la FFT de la muestra (relativa a la fundamental)
Uso: python scripts/sintesis_tema11.py   (requiere numpy)
"""
import csv
import wave
from pathlib import Path

import numpy as np

FS = 44100          # muestras por segundo
F0 = 220.0          # Hz, La3
DURACION = 2.5      # s
RMS_OBJETIVO = 0.2  # valor eficaz común (deja margen para no saturar)
RAIZ = Path(__file__).resolve().parent.parent

RECETAS = {
    "suave": {1: 1.0, 2: 0.15, 3: 0.05},
    "hueco": {n: 1.0 / n for n in range(1, 16, 2)},
}


def sintetizar(receta, t):
    y = np.zeros_like(t)
    for n, a in receta.items():
        y += a * np.sin(2 * np.pi * n * F0 * t)
    return y


def envolvente(t):
    # Ataque de 20 ms y caída de 200 ms para evitar chasquidos al empezar y terminar
    ataque = np.clip(t / 0.02, 0, 1)
    caida = np.clip((DURACION - t) / 0.2, 0, 1)
    return ataque * caida


def guardar_wav(ruta, y):
    datos = np.int16(np.clip(y, -1, 1) * 32767)
    with wave.open(str(ruta), "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(FS)
        w.writeframes(datos.tobytes())


def main():
    t = np.arange(int(FS * DURACION)) / FS
    senales = {}
    for nombre, receta in RECETAS.items():
        y = sintetizar(receta, t)
        y *= RMS_OBJETIVO / np.sqrt(np.mean(y ** 2))
        senales[nombre] = y
        guardar_wav(RAIZ / "public" / "audio" / f"tema11_timbre_{nombre}.wav", y * envolvente(t))

    # Forma de onda: dos períodos (2/f0 ≈ 9,09 ms) tomados del tramo estable, a 1 s
    i0 = int(1.0 * FS)
    n = int(round(2 * FS / F0)) + 1
    with open(RAIZ / "public" / "data" / "tema11_onda.csv", "w", newline="") as f:
        w = csv.writer(f)
        w.writerow(["t_ms", "suave", "hueco"])
        for k in range(n):
            w.writerow([round(1000 * k / FS, 4), round(senales["suave"][i0 + k], 5), round(senales["hueco"][i0 + k], 5)])

    # Espectro: FFT de 1 s exacto de la señal (220 ciclos completos → los armónicos caen en bins exactos)
    tramo = slice(int(0.5 * FS), int(1.5 * FS))
    with open(RAIZ / "public" / "data" / "tema11_espectro.csv", "w", newline="") as f:
        w = csv.writer(f)
        w.writerow(["armonico", "f_hz", "suave", "hueco"])
        amp = {}
        for nombre, y in senales.items():
            esp = np.abs(np.fft.rfft(y[tramo])) * 2 / FS
            amp[nombre] = [esp[int(round(m * F0))] for m in range(1, 17)]
        for m in range(1, 17):
            w.writerow([m, int(m * F0),
                        round(amp["suave"][m - 1] / amp["suave"][0], 4),
                        round(amp["hueco"][m - 1] / amp["hueco"][0], 4)])
    print("Listo: audios y datos del Tema 11")


if __name__ == "__main__":
    main()
