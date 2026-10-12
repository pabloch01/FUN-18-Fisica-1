"""Figura del Tema 5: resorte virtual de un gatillo háptico (modelo idealizado, valores ilustrativos).
(a) Fuerza contra desplazamiento: zona libre, resorte F = k(x - x0), tope mecánico.
(b) Estabilidad de un resorte virtual muestreado: K < 2b/T (Colgate y Schenkel, 1997)."""
import numpy as np
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

K = 1000.0      # N/m, rigidez virtual
X0 = 2.0e-3     # m, posición donde empieza la resistencia
XW = 7.0e-3     # m, tope mecánico (fin del recorrido del resorte virtual)
B = 0.5         # N·s/m, amortiguamiento físico del dispositivo (ilustrativo)

plt.rcParams.update({"font.size": 10, "axes.spines.top": False, "axes.spines.right": False, "axes.grid": True, "grid.alpha": .25})
fig, ax = plt.subplots(1, 2, figsize=(13, 5.4))

# (a) F contra x
a = ax[0]
x = np.linspace(0, 9e-3, 400)
F = np.where(x < X0, 0.0, np.where(x <= XW, K * (x - X0), np.nan))
a.fill_between(x[(x >= X0) & (x <= XW)] * 1e3, 0, F[(x >= X0) & (x <= XW)], color="#c9d6e8", alpha=.8, label="Trabajo del dedo  W = ½k(x − x₀)² = 12,5 mJ")
a.plot(x[x < X0] * 1e3, F[x < X0], color="#1f5fa8", lw=3)
a.plot(x[(x >= X0) & (x <= XW)] * 1e3, F[(x >= X0) & (x <= XW)], color="#1f5fa8", lw=3)
a.plot([XW * 1e3, XW * 1e3], [K * (XW - X0), 9.0], color="#c4562a", lw=3)
a.annotate("① Zona libre\nF = 0  (x < x₀)", (1.0, 0.0), xytext=(0.25, 1.4), fontsize=9.5, color="#333")
a.annotate("② Resorte virtual\nF = k (x − x₀)\npendiente k = 1 000 N/m", (4.5, 2.5), xytext=(2.6, 5.9), fontsize=9.5, color="#1f5fa8",
           arrowprops=dict(arrowstyle="-", color="#1f5fa8", lw=.8))
a.annotate("③ Tope mecánico\n(la fuerza sube de golpe)", (7.0, 7.5), xytext=(7.25, 3.6), fontsize=9.5, color="#c4562a",
           arrowprops=dict(arrowstyle="-", color="#c4562a", lw=.8))
a.axvline(X0 * 1e3, color="#888", ls=":", lw=1); a.text(X0 * 1e3 - .08, 0.35, "x₀ = 2 mm", fontsize=9, color="#555", ha="right")
a.set_xlim(0, 9); a.set_ylim(0, 9.2)
a.set_xlabel("Desplazamiento del gatillo, x [mm]"); a.set_ylabel("Fuerza sobre el dedo, F [N]")
a.legend(loc="upper left", fontsize=8.5, frameon=True, bbox_to_anchor=(0.0, 1.0))
a.set_title("(a) Curva fuerza–desplazamiento del resorte virtual", loc="left", fontsize=11)

# (b) mapa de estabilidad K–T
b = ax[1]
T = np.logspace(np.log10(0.2e-3), np.log10(30e-3), 300)
Kmax = 2 * B / T
b.fill_between(T * 1e3, 10, Kmax, color="#dbeadf", alpha=.9, label="Región pasiva (estable)")
b.fill_between(T * 1e3, Kmax, 2e4, color="#f3d9cc", alpha=.9, label="Región no pasiva (puede zumbar)")
b.plot(T * 1e3, Kmax, color="#333", lw=2, label="Límite  K = 2b/T  (b = 0,5 N·s/m)")
pts = [(1.0, 1000, "k = 1 000 N/m, T = 1 ms\n(justo en el límite)", (1.25, 2600)),
       (10.0, 1000, "k = 1 000 N/m, T = 10 ms\n(inestable)", (5.0, 6500)),
       (10.0, 50, "k = 50 N/m, T = 10 ms\n(estable)", (3.0, 22))]
for tt, kk, txt, pos in pts:
    b.plot(tt, kk, "o", color="#c4562a", ms=7, zorder=5)
    b.annotate(txt, (tt, kk), xytext=pos, fontsize=8.8, color="#333", arrowprops=dict(arrowstyle="-", color="#888", lw=.8))
b.set_xscale("log"); b.set_yscale("log")
b.set_xlim(0.2, 30); b.set_ylim(10, 2e4)
b.set_xlabel("Tiempo de muestreo del lazo de control, T [ms]"); b.set_ylabel("Rigidez virtual, K [N/m]")
b.legend(loc="lower left", fontsize=8.5, frameon=True)
b.set_title("(b) Estabilidad del resorte virtual según el muestreo", loc="left", fontsize=11)

fig.suptitle("Resorte virtual de un gatillo háptico: modelo idealizado", x=0.06, ha="left", fontsize=13, y=0.99)
fig.text(0.06, 0.012,
    "Modelo idealizado con valores ilustrativos (k = 1 000 N/m, x₀ = 2 mm, tope en 7 mm, b = 0,5 N·s/m); no son mediciones de un control real.\n"
    "Condición de pasividad de una pared virtual muestreada: b > K·T/2 (Colgate y Schenkel, 1997). Ley de Hooke: Serway y Jewett (2018).",
    fontsize=7.8, color="#555", va="bottom")
fig.tight_layout(rect=[0, 0.07, 1, 0.96])
fig.savefig("tema5_resorte_virtual.png", dpi=170)
print("W =", 0.5 * K * (XW - X0) ** 2, "J ; F al tope =", K * (XW - X0), "N ; T_max para K=1000:", 2 * B / K * 1e3, "ms")
