"""Procesa el vuelo 18 (Rodrigues et al., 2020) y genera vuelo18_procesado.csv y vuelo18_graficas.png.
Uso: colocar 18.csv junto a este archivo y ejecutar:  python procesar_vuelo18.py
Requiere: pandas, numpy, scipy, matplotlib"""
import pandas as pd, numpy as np
from scipy.ndimage import uniform_filter1d

df = pd.read_csv("18.csv")
t = df.time.values
R = 6.371e6
lon0, lat0 = df.position_x.iloc[0], df.position_y.iloc[0]

# 1) posición en metros locales (origen = punto de despegue)
E = np.radians(df.position_x.values - lon0) * R * np.cos(np.radians(lat0))
N = np.radians(df.position_y.values - lat0) * R
h = df.position_z.values - df.position_z.values[0]

# 2) velocidad en marco del mundo (rotación por el yaw del cuaternión)
qx, qy, qz, qw = [df[c].values for c in ["orientation_x","orientation_y","orientation_z","orientation_w"]]
psi = np.arctan2(2*(qw*qz + qx*qy), 1 - 2*(qy**2 + qz**2))
vx, vy = df.velocity_x.values, df.velocity_y.values
vE = vx*np.cos(psi) - vy*np.sin(psi)
vN = vx*np.sin(psi) + vy*np.cos(psi)
vUp = df.velocity_z.values
speed = np.hypot(vE, vN)

# 3) aceleración derivada de la velocidad (media móvil de 5 muestras + derivada)
def deriv(v, w=5):
    return np.gradient(uniform_filter1d(v, w), t)
aE, aN, aUp = deriv(vE), deriv(vN), deriv(vUp)
aMag = np.sqrt(aE**2 + aN**2 + aUp**2)

# 4) distancia recorrida (integral de la rapidez horizontal)
s = np.concatenate([[0], np.cumsum(0.5*(speed[1:]+speed[:-1])*np.diff(t))])

out = pd.DataFrame({"t":t,"E":E,"N":N,"h":h,"vE":vE,"vN":vN,"vUp":vUp,"speed":speed,
                    "aE":aE,"aN":aN,"aUp":aUp,"aMag":aMag,"s":s}).round(4)
out.to_csv("vuelo18_procesado.csv", index=False)


# ---------------- figura ----------------
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

d = pd.read_csv("vuelo18_procesado.csv")
phases = [("Ascenso",9.69,18.1,"#c9d6e8"),("Tramo 1",19.7,54.9,"#e8e3d2"),
          ("Tramo 2",57.8,107.5,"#e8e3d2"),("Tramo 3",110.1,141.8,"#e8e3d2"),("Descenso",142.9,164.6,"#c9d6e8")]
C = {"E":"#1f5fa8","N":"#c4562a","up":"#2f7d5b","mag":"#333333"}
plt.rcParams.update({"font.size":10,"axes.spines.top":False,"axes.spines.right":False,"axes.grid":True,"grid.alpha":.25})

def shade(ax, labels=False):
    for name,a,b,c in phases:
        ax.axvspan(a,b,color=c,alpha=.55,lw=0)
        if labels: ax.text((a+b)/2, 1.02, name, transform=ax.get_xaxis_transform(), ha="center", va="bottom", fontsize=8, color="#444")

fig, ax = plt.subplots(2,2,figsize=(13,9))

# (a) trayectoria
a = ax[0,0]
a.plot(d.E,d.N,color=C["E"],lw=1.8)
a.plot(d.E.iloc[0],d.N.iloc[0],"o",color="k",ms=7)
a.annotate("Despegue y\naterrizaje",(d.E.iloc[0],d.N.iloc[0]),xytext=(-10,0),textcoords="offset points",fontsize=9,ha="right",va="center")
for lab,tt,off,ha in [("Tramo 1",37,(-4,10),"right"),("Tramo 2",82,(10,0),"left"),("Tramo 3",126,(-10,0),"right")]:
    i=(d.t-tt).abs().idxmin()
    a.annotate(lab,(d.E[i],d.N[i]),xytext=off,textcoords="offset points",fontsize=9,color="#444",ha=ha,va="center")
a.set_xlim(-60,150)
a.set_aspect("equal"); a.set_xlabel("Este [m]"); a.set_ylabel("Norte [m]")
a.set_title("(a) Trayectoria en el plano horizontal",loc="left",fontsize=11)

# (b) posición
b = ax[0,1]
b.plot(d.t,d.h,color=C["up"],lw=1.6,label="Altitud sobre el despegue")
b.set_xlabel("Tiempo [s]"); b.set_ylabel("Altitud [m]",color=C["up"])
b2=b.twinx(); b2.spines["right"].set_visible(True); b2.grid(False)
b2.plot(d.t,d.s,color=C["N"],lw=1.6,label="Distancia recorrida")
b2.set_ylabel("Distancia recorrida [m]",color=C["N"])
shade(b,labels=True)
b.set_title("(b) Posición vertical y distancia recorrida",loc="left",fontsize=11,pad=22)

# (c) velocidad
c = ax[1,0]
c.plot(d.t,d.vE,color=C["E"],lw=1,alpha=.8,label="vₑ (Este)")
c.plot(d.t,d.vN,color=C["N"],lw=1,alpha=.8,label="vₙ (Norte)")
c.plot(d.t,d.vUp,color=C["up"],lw=1,alpha=.8,label="v_vertical (arriba +)")
c.plot(d.t,d.speed,color=C["mag"],lw=1.6,label="Rapidez horizontal |v|")
c.axhline(4,color="#888",ls="--",lw=1); c.text(171,4.1,"4 m/s programada",ha="right",fontsize=8,color="#666")
shade(c); c.set_xlabel("Tiempo [s]"); c.set_ylabel("Velocidad [m/s]")
c.legend(fontsize=8,ncol=2,loc="lower left"); c.set_title("(c) Velocidad",loc="left",fontsize=11)

# (d) aceleración
e = ax[1,1]
e.plot(d.t,d.aE,color=C["E"],lw=.9,alpha=.85,label="aₑ (Este)")
e.plot(d.t,d.aN,color=C["N"],lw=.9,alpha=.85,label="aₙ (Norte)")
e.plot(d.t,d.aUp,color=C["up"],lw=.9,alpha=.85,label="a_vertical (arriba +)")
shade(e); e.set_xlabel("Tiempo [s]"); e.set_ylabel("Aceleración [m/s²]")
e.legend(fontsize=8,ncol=3,loc="upper right"); e.set_title("(d) Aceleración (derivada de la velocidad)",loc="left",fontsize=11)

for x in (b,c,e): x.set_xlim(0,170.2)
fig.suptitle("Vuelo 18 de un DJI Matrice 100 de reparto (4 m/s, 25 m, 250 g)",fontsize=13,x=0.06,ha="left",y=0.99)
fig.text(0.06,0.008,"Datos: Rodrigues et al. (2020), https://doi.org/10.1184/R1/12683453. Procesamiento propio: coordenadas locales desde el despegue; velocidad rotada al marco Este–Norte con el yaw medido;\n"
         "aceleración = derivada de la velocidad suavizada (5 muestras). La altitud proviene del GNSS (precisión vertical del sensor: ±5 m).",fontsize=7.5,color="#555",va="bottom")
fig.tight_layout(rect=[0,0.04,1,0.97])
fig.savefig("vuelo18_graficas.png",dpi=170)
