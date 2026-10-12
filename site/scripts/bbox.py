# Bounding box of the drawing inside a region of an image: rows/cols holding any pixel darker than THRESH.
#   python3 -I bbox.py IMG X0 Y0 W H THRESH PAD  ->  prints "w:h:x:y" for ffmpeg crop
import subprocess, sys
img, X0, Y0, W, H, T, PAD = sys.argv[1], *map(int, sys.argv[2:8])
def raw(extra=''):
    vf = f"crop={W}:{H}:{X0}:{Y0},format=gray{extra}"
    return subprocess.run(['ffmpeg', '-loglevel', 'error', '-i', img, '-vf', vf, '-f', 'rawvideo', '-'], capture_output=True, check=True).stdout
def span(buf, n):
    lines = [i for i in range(len(buf) // n) if min(buf[i*n:(i+1)*n]) < T]
    return lines[0], lines[-1]
y1, y2 = span(raw(), W)
x1, x2 = span(raw(',transpose=1'), H)
x, y = max(0, X0 + x1 - PAD), max(0, Y0 + y1 - PAD)
print(f"{x2 - x1 + 2*PAD}:{y2 - y1 + 2*PAD}:{x}:{y}")
