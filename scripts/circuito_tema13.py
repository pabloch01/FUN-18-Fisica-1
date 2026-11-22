"""
Tema 13 · Velocidad y presión a lo largo del circuito de enfriamiento líquido de un rack de 120 kW.

Modelo (todas las hipótesis se declaran en la página):
  Caudal total:      Q = P / (ρ · c_p · ΔT)                                 (balance de energía)
  Continuidad:       Q_i = A_i · v_i ;  en los ramales Q_ramal = Q / N_bandejas
  Bernoulli:         p₁ + ½ρv₁² + ρgz₁ = p₂ + ½ρv₂² + ρgz₂ + Δp_pérdidas
  Pérdidas mayores:  Δp = f · (L/D) · ½ρv²   (Darcy–Weisbach; f = 64/Re si Re < 2300, si no Swamee–Jain)
  Pérdidas menores:  contracción K = 0,5·(1 − A₂/A₁); expansión K = (1 − A₁/A₂)²  (sobre ½ρv² del tramo angosto)
Se recorre el camino del agua hasta la bandeja más alta del rack (el camino más desfavorable) y de vuelta.
El colector vertical se divide en 18 trozos: en cada salida hacia una bandeja el caudal baja Q/18 (y en el
colector de retorno sube Q/18 en cada entrada), así que la velocidad cambia aunque el diámetro no cambie.
Salida: public/data/tema13_circuito.csv con la posición esquemática x (cada tramo tiene un ancho fijo en la
gráfica, no su longitud real), la velocidad, la presión manométrica y el nombre del tramo.
Uso: python scripts/circuito_tema13.py   (requiere numpy)
"""
import csv
import math
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent

# ---------- Parámetros declarados ----------
P = 120e3            # W, potencia térmica del rack (NVIDIA GB200 NVL72, ≈ 120 kW)
DT = 10.0            # K, aumento de temperatura del agua entre entrada y salida
RHO = 995.7          # kg/m³, agua a 30 °C
CP = 4178.0          # J/(kg·K), agua a 30 °C
MU = 0.798e-3        # Pa·s, viscosidad del agua a 30 °C
G = 9.81             # m/s²
RUGOSIDAD = 1.5e-6   # m, tubería lisa (acero inoxidable / plástico)
N_BANDEJAS = 18      # bandejas de cómputo en paralelo
P_SALIDA_CDU = 3.0e5 # Pa (manométrica), presión de suministro supuesta a la salida de la CDU

Q = P / (RHO * CP * DT)  # m³/s
QR = Q / N_BANDEJAS

# Microcanales de la placa fría de una bandeja: 50 canales de 0,5 mm × 3 mm (supuesto)
N_CANALES, W_C, H_C = 50, 0.5e-3, 3.0e-3
A_CANALES = N_CANALES * W_C * H_C
DH_CANAL = 2 * W_C * H_C / (W_C + H_C)

def area(d):
    return math.pi * d * d / 4

# Tramos del camino hasta la bandeja más alta y de vuelta:
# (nombre, diámetro hidráulico [m], área de flujo [m²], longitud [m], caudal [m³/s], subida Δz [m], ancho en la gráfica)
D_COLECTOR = 0.040
TRAMOS = [("Tubería principal de suministro (DN50)", 0.0525, area(0.0525), 10.0, Q, 0.0, 3.0)]
# Colector de suministro: 18 trozos; en cada salida a una bandeja el caudal baja Q/18 (continuidad)
for i in range(N_BANDEJAS):
    TRAMOS.append((f"Colector de suministro, tramo {i + 1}", D_COLECTOR, area(D_COLECTOR), 2.0 / N_BANDEJAS,
                   Q * (N_BANDEJAS - i) / N_BANDEJAS, 2.0 / N_BANDEJAS, 4.0 / N_BANDEJAS))
TRAMOS += [
    ("Manguera de la bandeja", 0.012, area(0.012), 1.5, QR, 0.0, 2.0),
    ("Conector rápido (entrada)", 0.007, area(0.007), 0.05, QR, 0.0, 0.8),
    ("Microcanales de la placa fría", DH_CANAL, A_CANALES, 0.05, QR, 0.0, 1.6),
    ("Conector rápido (salida)", 0.007, area(0.007), 0.05, QR, 0.0, 0.8),
    ("Manguera de retorno", 0.012, area(0.012), 1.5, QR, 0.0, 2.0),
]
# Colector de retorno: el caudal crece Q/18 en cada entrada mientras baja
for i in range(N_BANDEJAS):
    TRAMOS.append((f"Colector de retorno, tramo {i + 1}", D_COLECTOR, area(D_COLECTOR), 2.0 / N_BANDEJAS,
                   Q * (i + 1) / N_BANDEJAS, -2.0 / N_BANDEJAS, 4.0 / N_BANDEJAS))
TRAMOS.append(("Tubería principal de retorno (DN50)", 0.0525, area(0.0525), 10.0, Q, 0.0, 3.0))


def factor_friccion(re, d):
    if re < 2300:
        return 64 / re
    return 0.25 / math.log10(RUGOSIDAD / (3.7 * d) + 5.74 / re ** 0.9) ** 2


def grupo(nombre):
    return nombre.split(",")[0]


def main():
    puntos = []   # serie para la gráfica: x esquemática, velocidad y presión
    resumen = {}  # tabla por tipo de tramo
    p = P_SALIDA_CDU
    x = 0.0
    v_prev = a_prev = None
    for nombre, d, a, l, q, dz, ancho in TRAMOS:
        v = q / a
        if v_prev is not None and abs(a - a_prev) > 1e-12:
            if a < a_prev:  # contracción: Bernoulli + pérdida menor sobre ½ρv² del tramo angosto
                k = 0.5 * (1 - a / a_prev)
                p -= 0.5 * RHO * (v * v - v_prev * v_prev) + k * 0.5 * RHO * v * v
            else:           # expansión (Borda–Carnot)
                k = (1 - a_prev / a) ** 2
                p -= 0.5 * RHO * (v * v - v_prev * v_prev) + k * 0.5 * RHO * v_prev * v_prev
        elif v_prev is not None:  # misma sección, distinto caudal (salidas/entradas del colector)
            p -= 0.5 * RHO * (v * v - v_prev * v_prev)
        re = RHO * v * d / MU
        f = factor_friccion(re, d)
        friccion = f * (l / d) * 0.5 * RHO * v * v
        puntos.append([round(x, 3), round(v, 3), round(p / 1e5, 4), nombre])
        p_ini = p
        p = p - friccion - RHO * G * dz
        x += ancho
        puntos.append([round(x, 3), round(v, 3), round(p / 1e5, 4), nombre])
        g = grupo(nombre)
        r = resumen.setdefault(g, {"d": d, "a": a, "qmin": q, "qmax": q, "vmin": v, "vmax": v, "re": re, "dp": 0.0})
        r["qmin"], r["qmax"] = min(r["qmin"], q), max(r["qmax"], q)
        r["vmin"], r["vmax"] = min(r["vmin"], v), max(r["vmax"], v)
        r["dp"] += p_ini - p
        v_prev, a_prev = v, a
    with open(RAIZ / "public" / "data" / "tema13_circuito.csv", "w", newline="") as fh:
        w = csv.writer(fh)
        w.writerow(["x", "v_ms", "p_bar", "tramo"])
        w.writerows(puntos)
    print(f"Q = {Q*6e4:.1f} L/min; por bandeja {QR*6e4:.2f} L/min; caída total {(P_SALIDA_CDU-p)/1e5:.3f} bar")
    for g, r in resumen.items():
        print(f"{g}: D={r['d']*1000:.2f} mm A={r['a']*1e6:.1f} mm² Q={r['qmin']*6e4:.2f}-{r['qmax']*6e4:.2f} L/min "
              f"v={r['vmin']:.2f}-{r['vmax']:.2f} m/s Re={r['re']:.0f} Δp(tramo, sin transiciones)={r['dp']/1e5:.4f} bar")


if __name__ == "__main__":
    main()
