# bbox of the plan drawing: rows/cols that hold any pixel darker than 200 (key plan + footer masked out)
import subprocess, sys, pathlib
X0, Y0, W, H = 60, 352, 1700, 1680
MASK = "drawbox=x=0:y=0:w=260:h=540:color=white:t=fill,drawbox=x=1265:y=1870:w=600:h=700:color=white:t=fill,drawbox=x=0:y=2010:w=1810:h=600:color=white:t=fill"
def raw(f, extra=''):
    vf = f"{MASK},crop={W}:{H}:{X0}:{Y0},format=gray{extra}"
    return subprocess.run(['ffmpeg', '-loglevel', 'error', '-i', str(f), '-vf', vf, '-f', 'rawvideo', '-'], capture_output=True, check=True).stdout
def span(buf, n):  # n = line length
    lines = [i for i in range(len(buf) // n) if min(buf[i*n:(i+1)*n]) < 200]
    return lines[0], lines[-1]
for f in sorted(pathlib.Path(sys.argv[1]).glob('*.jpg')):
    y1, y2 = span(raw(f), W)
    x1, x2 = span(raw(f, ',transpose=1'), H)
    pad = 28
    x, y = X0 + x1 - pad, Y0 + y1 - pad
    print(f.name, x2 - x1 + 2*pad, y2 - y1 + 2*pad, x, y)
