"""Tema 6 · Balance de energía del Renault Zoe ZE50 R135 en el ciclo urbano UDDS (EPA).
Parámetros del vehículo: archivo 2022_Renault_Zoe_ZE50_R135.yaml de FASTSim (NREL).
Límite de regeneración a baja velocidad: fórmula de FASTSim 2 (regen_a = 500, regen_b = 0,99).
Uso:  python scripts/modelo_tema6.py [udds|hwfet]   (UDDS escribe public/data/balance_tema6.csv)"""
import numpy as np, pandas as pd

import sys, pathlib
AQUI = pathlib.Path(__file__).parent
CICLO = sys.argv[1] if len(sys.argv) > 1 else "udds"   # "udds" (ciudad) o "hwfet" (carretera)
c = pd.read_csv(AQUI / "datos" / f"{CICLO}.csv")            # t [s], v [m/s], 1 Hz
t, v = c.t.to_numpy(), c.v.to_numpy()

m       = 1600.0                       # masa de prueba [kg]
I_rueda = 0.815; r_rueda = 0.31045     # inercia [kg·m²] y radio [m] de cada rueda
m_eq    = m + 4 * I_rueda / r_rueda**2 # masa equivalente con las ruedas girando
Cd, A   = 0.33, 2.5121646              # coef. aerodinámico, área frontal [m²]
Crr, g, rho = 0.009, 9.81, 1.2         # resistencia a la rodadura, gravedad, densidad del aire
eta_tr  = 0.92                         # transmisión
eta_bat = 0.9848857801796105           # batería (un sentido)
P_mot   = 100e3                        # potencia máxima del motor [W]
frac_grid = np.array([0, .02, .04, .06, .08, .1, .2, .4, .6, .8, 1.0])
eff_grid  = np.array([.84, .86, .88, .90, .91, .92, .94, .95, .95, .94, .93])
P_aux   = 250.0                        # consumo auxiliar [W]
max_regen, regen_a, regen_b = 0.98, 500.0, 0.99

def eta_m(P):                          # eficiencia del motor según la carga
    return np.interp(min(abs(P) / P_mot, 1.0), frac_grid, eff_grid)

filas = []
acum = dict(trac=0, fren=0, aero=0, rod=0, recup=0, fric=0, perd_reg=0, bat_trac=0, aux=0)
for i in range(len(t) - 1):
    dt = t[i+1] - t[i]
    vm = (v[i] + v[i+1]) / 2
    a  = (v[i+1] - v[i]) / dt
    F_in, F_aero = m_eq * a, 0.5 * rho * Cd * A * vm**2
    F_rod = Crr * m * g if vm > 0 else 0.0
    P = (F_in + F_aero + F_rod) * vm               # potencia en las ruedas [W]
    acum["aero"] += F_aero * vm * dt
    acum["rod"]  += F_rod * vm * dt
    acum["aux"]  += P_aux * dt
    if P >= 0:
        acum["trac"] += P * dt
        acum["bat_trac"] += P * dt / (eta_tr * eta_m(P / eta_tr) * eta_bat)
    else:
        E = -P * dt                                 # energía de frenado disponible [J]
        mph = vm * 2.2369362920544
        f = max_regen / (1 + regen_a * np.exp(-regen_b * (mph + 1)))
        E_reg = f * E                               # pasa por el motor
        E_bat = E_reg * eta_tr * eta_m(-P * f * eta_tr) * eta_bat
        acum["fren"] += E; acum["recup"] += E_bat
        acum["fric"] += E - E_reg; acum["perd_reg"] += E_reg - E_bat
    filas.append(dict(t=t[i+1], v_kmh=v[i+1]*3.6, **{k: acum[k]/3600 for k in acum}))  # Wh acumulados

df = pd.DataFrame(filas)
if CICLO == "udds":
    df[["t","v_kmh","trac","fren","recup","fric","perd_reg","aero","rod"]].to_csv(AQUI.parent / "public" / "data" / "balance_tema6.csv", index=False, float_format="%.2f")
d_km = np.trapezoid(v, t) / 1e3
r = acum
E_bat_bruta = r["bat_trac"] + r["aux"]; E_bat_neta = E_bat_bruta - r["recup"]
print(f"distancia {d_km:.3f} km, KE max {0.5*m_eq*v.max()**2/1e3:.1f} kJ")
for k in r: print(f"{k:9s} {r[k]/1e3:9.1f} kJ  {r[k]/3.6e3:7.1f} Wh")
print("cierre trac - fren - aero - rod =", (r['trac']-r['fren']-r['aero']-r['rod'])/1e3, "kJ")
print(f"recuperado / frenado = {r['recup']/r['fren']:.3f}; friccion/frenado {r['fric']/r['fren']:.3f}; perd {r['perd_reg']/r['fren']:.3f}")
print(f"bat bruta {E_bat_bruta/3.6e3:.1f} Wh, neta {E_bat_neta/3.6e3:.1f} Wh -> {E_bat_neta/3.6e3/d_km:.1f} Wh/km; sin regen {E_bat_bruta/3.6e3/d_km:.1f} Wh/km; ahorro {r['recup']/E_bat_bruta:.3f}")
print("Referencia FASTSim 3.1.0 en UDDS: 1393,4 Wh -> 116,2 Wh/km")
