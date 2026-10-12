"""Curva de agarre lateral vs temperatura (Alcázar Vargas et al., 2022, Ec. 8).
mu_y(T) = mu_max + [1 - cosh((T - T_opt)/T_disp)]
Coeficientes: Tabla 4 (T_opt = 88 °C, T_disp = 50 °C); mu_max ≈ 1,07 leído del máximo del ajuste en la Figura 16
(la Tabla 4 lo redondea a 1,1). Rango de los datos de la Figura 16: ≈ 50 a ≈ 101 °C."""
import numpy as np
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

MU_MAX, T_OPT, T_DISP = 1.07, 88.0, 50.0
T_MIN_DATA, T_MAX_DATA = 50.0, 101.0
FZ = 4000.0  # N, carga vertical del ensayo

mu = lambda T: MU_MAX + (1 - np.cosh((np.asarray(T) - T_OPT) / T_DISP))

def ventana(frac):
    x = np.arccosh(1 + MU_MAX * (1 - frac))
    return T_OPT - x * T_DISP, T_OPT + x * T_DISP

w95, w90 = ventana(0.95), ventana(0.90)
print("mu(T):", {int(t): round(float(mu(t)), 3) for t in (50, 55, 60, 70, 80, 88, 90, 100, 101)})
print("ventana >=95%:", [round(v, 1) for v in w95], "| >=90%:", [round(v, 1) for v in w90])
print("Fy,max a 50 °C y 88 °C [N]:", round(float(mu(50)) * FZ), round(float(mu(88)) * FZ), "| aumento %:", round((mu(88) / mu(50) - 1) * 100, 1))

T_in = np.linspace(T_MIN_DATA, T_MAX_DATA, 300)
T_ex = np.linspace(T_MAX_DATA, 114, 100)

plt.rcParams.update({"font.size": 10, "axes.spines.top": False, "axes.grid": True, "grid.alpha": .25})
fig, ax = plt.subplots(figsize=(9, 5.6))
ax.axvspan(w90[0], w90[1], color="#e8e3d2", alpha=.7, lw=0, label="Ventana: μ ≥ 90 % de μ_max")
ax.axvspan(w95[0], w95[1], color="#c9d6e8", alpha=.8, lw=0, label="Ventana: μ ≥ 95 % de μ_max")
ax.plot(T_in, mu(T_in), color="#1f5fa8", lw=2.6, label="Modelo ajustado (rango de los datos: 50–101 °C)")
ax.plot(T_ex, mu(T_ex), color="#1f5fa8", lw=2.0, ls="--", label="Extrapolación del modelo (sin datos)")
ax.axvline(T_OPT, color="#c4562a", lw=1.2, ls=":")
ax.annotate(f"T_opt = {T_OPT:.0f} °C\nμ_max ≈ {MU_MAX:.2f}", (T_OPT, MU_MAX), xytext=(T_OPT + 3, 0.985),
            fontsize=9, color="#c4562a", arrowprops=dict(arrowstyle="-", color="#c4562a", lw=.8))
ax.annotate(f"≈ {w95[0]:.0f} °C", (w95[0], 0.705), ha="center", fontsize=8, color="#335")
ax.annotate(f"≈ {w90[0]:.0f} °C", (w90[0], 0.705), ha="center", fontsize=8, color="#665")
ax.annotate(f"≈ {w95[1]:.0f} °C*", (w95[1], 0.705), ha="center", fontsize=8, color="#335")
ax.annotate(f"≈ {w90[1]:.0f} °C*", (w90[1], 0.705), ha="center", fontsize=8, color="#665")
ax.set_xlim(45, 114); ax.set_ylim(0.70, 1.20)
ax.set_xlabel("Temperatura promedio del neumático, T_promedio [°C]")
ax.set_ylabel("Coeficiente de fricción lateral máximo, μ_y [adimensional]")
ax.legend(loc="upper left", fontsize=8.5, frameon=True, framealpha=.95)

ax2 = ax.twinx(); ax2.spines["right"].set_visible(True); ax2.grid(False)
ax2.set_ylim(0.70 * FZ, 1.20 * FZ)
ax2.set_ylabel(f"Fuerza lateral máxima con F_z = {FZ:,.0f} N [N]".replace(",", " "))

fig.suptitle("Agarre lateral de un neumático de calle según su temperatura", x=0.06, ha="left", fontsize=12.5)
fig.text(0.06, 0.012,
    "Curva calculada con la Ecuación 8 y la Tabla 4 de Alcázar Vargas et al. (2022): μ_max ≈ 1,07 (leído de su Figura 16; la tabla lo redondea a 1,1),\n"
    "T_opt = 88 °C, T_disp = 50 °C. Ensayo de banco: Austone Athena SP-6 205/65 R15, 4 000 N, 60 km/h, ángulo de deriva −8°. Neumático de calle, no de F1.\n"
    "* Límite superior de la ventana fuera del rango de los datos (extrapolación del modelo).",
    fontsize=7.3, color="#555", va="bottom")
fig.tight_layout(rect=[0, 0.09, 1, 0.96])
fig.savefig("tema4_agarre_vs_temperatura.png", dpi=170)
