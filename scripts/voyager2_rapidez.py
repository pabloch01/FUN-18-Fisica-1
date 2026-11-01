"""Tema 9 · Rapidez heliocéntrica de la Voyager 2 (1977-1990).
Datos: JPL Horizons (COMMAND=-32, CENTER=500@10, VECTORS, VEC_TABLE=5, km/s, eclíptica J2000,
paso de 10 días; trayectoria Voyager_2_ST+refit2022_m), consultados el 31 de octubre de 2026.
El archivo datos/voyager2_horizons_vel.txt guarda fecha, VX, VY, VZ redondeados a 4-5 decimales."""
import pathlib, numpy as np, pandas as pd
AQUI = pathlib.Path(__file__).parent
d = pd.read_csv(AQUI / "datos" / "voyager2_horizons_vel.txt", header=None, names=["fecha", "vx", "vy", "vz"])
d["fecha"] = pd.to_datetime(d.fecha, format="%Y-%b-%d").dt.strftime("%Y-%m-%d")
d["v"] = np.sqrt(d.vx**2 + d.vy**2 + d.vz**2)
d.to_csv(AQUI.parent / "public" / "data" / "voyager2_rapidez.csv", index=False, float_format="%.4f")
print(len(d), "filas; v máx", d.v.max().round(2), "km/s")
