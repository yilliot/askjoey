"""Build the v2 proposal: inline images, generate the Woodlands -> home route maps.

Usage: python3 -I build2.py template2.html assets out.html
Placeholders:  {{name}}            -> data URI of assets/name.webp
               {{SVG:desk:anim}}   -> animated desktop map (classes only)
               {{SVG:phone:anim}}  -> animated phone map
               {{SVG:desk:fN}}     -> static storyboard frame N (2..5)
"""
import base64, re, sys, pathlib

# ── geometry ──────────────────────────────────────────────────────────────
G = {
 'desk': dict(
   vb=(1200, 720),
   jb_coast="M0,318 C120,296 230,334 360,316 S560,292 640,312 S820,326 940,300 S1110,292 1200,306",
   jb_end=(1200, 306), jb_start=(0, 318),
   sg_coast="M0,486 C140,500 250,468 380,484 S600,500 700,478 S900,470 1010,492 S1140,500 1200,486",
   sg_end=(1200, 486), sg_start=(0, 486),
   roads=["M0,200 C200,222 400,176 600,206 S1000,186 1200,214", "M760,0 C772,120 748,200 782,300",
          "M0,640 C300,612 520,650 800,616 S1100,640 1200,606", "M300,486 C320,560 280,640 330,720"],
   causeway=((600, 314), (608, 478)), causeway_lbl=(618, 404),
   strait_lbl=(92, 410),
   jb_lbl=(430, 92), sg_lbl=(60, 568),
   tel="M470,530 C486,600 500,660 520,720",
   rts="M470,530 C468,460 520,420 512,360 S500,280 505,252",
   walk="M505,252 C530,262 560,276 585,286",
   bridge="M585,286 C650,300 720,306 790,298 S830,290 845,286",
   mall="M845,286 L905,236",
   bridge_lbl=(706, 334),
   pins=dict(
     wn=dict(at=(470, 530), lbl=(486, 534), anchor='start', name='Woodlands North', sub='RTS Link · TEL'),
     bc=dict(at=(505, 252), lbl=(492, 248), anchor='end', name='Bukit Chagar', sub='RTS terminus'),
     ciq=dict(at=(585, 286), lbl=(585, 266), anchor='middle', name='JB CIQ', sub=None),
     mall=dict(at=(845, 286), lbl=(845, 314), anchor='middle', name='R&amp;F Mall', sub=None),
     home=dict(at=(905, 236), lbl=(924, 262), anchor='start', name='New Casa Suites', sub='R&amp;F Princess Cove · Phase 3'),
   ),
   fs=1.0),
 'phone': dict(
   vb=(390, 740),
   jb_coast="M0,332 C60,318 110,342 170,330 S260,316 300,328 S360,334 390,322",
   jb_end=(390, 322), jb_start=(0, 332),
   sg_coast="M0,458 C70,470 120,446 190,460 S300,472 330,454 S370,450 390,460",
   sg_end=(390, 460), sg_start=(0, 458),
   roads=["M0,236 C90,250 200,214 390,240", "M352,0 C356,100 346,200 360,326", "M0,640 C120,620 260,660 390,630"],
   causeway=((190, 334), (196, 456)), causeway_lbl=(202, 402),
   strait_lbl=(232, 446),
   jb_lbl=(18, 82), sg_lbl=(18, 566),
   tel="M110,505 C122,560 136,600 150,650",
   rts="M110,505 C108,450 140,410 133,360 S124,300 128,282",
   walk="M128,282 C145,292 160,304 175,312",
   bridge="M175,312 C200,318 225,312 250,300",
   mall="M250,300 L300,250",
   bridge_lbl=(205, 362),
   pins=dict(
     wn=dict(at=(110, 505), lbl=(122, 509), anchor='start', name='Woodlands North', sub='RTS Link · TEL'),
     bc=dict(at=(128, 282), lbl=(116, 278), anchor='end', name='Bukit Chagar', sub=None),
     ciq=dict(at=(175, 312), lbl=(175, 338), anchor='middle', name='JB CIQ', sub=None),
     mall=dict(at=(250, 300), lbl=(258, 322), anchor='start', name='R&amp;F Mall', sub=None),
     home=dict(at=(300, 250), lbl=(288, 254), anchor='end', name='New Casa Suites', sub=None),
   ),
   fs=0.86),
}

# static storyboard states: draw progress per route segment + visible pins
FRAMES = {
  'f2': dict(rts=0, walk=0, bridge=0, mall=0, pins={'wn'}),
  'f3': dict(rts=.85, walk=0, bridge=0, mall=0, pins={'wn'}),
  'f4': dict(rts=1, walk=1, bridge=.7, mall=0, pins={'wn', 'bc', 'ciq'}),
  'f5': dict(rts=1, walk=1, bridge=1, mall=1, pins={'wn', 'bc', 'ciq', 'mall', 'home'}),
}


_n = [0]
def svg(kind, state):
    _n[0] += 1
    g = G[kind]; W, H = g['vb']; s = g['fs']; uid = f"{kind}{state}{_n[0]}"
    st = None if state == 'anim' else FRAMES[state]
    def seg(name, d, cls):
        if st is None:
            return f'<path class="jr {cls}" d="{d}" pathLength="1"/>'
        return f'<path class="jr" d="{d}" pathLength="1" style="stroke-dashoffset:{1 - st[name]:.2f}"/>'
    def pin(key):
        p = g['pins'][key]; x, y = p['at']; lx, ly = p['lbl']
        hide = '' if st is None or key in st['pins'] else ' style="opacity:0"'
        dot = (f'<circle cx="{x}" cy="{y}" r="{17*s:.1f}" class="jp-ring"/><circle cx="{x}" cy="{y}" r="{9*s:.1f}" fill="#BC8C68"/>'
               if key == 'home' else
               f'<circle cx="{x}" cy="{y}" r="{6.5*s:.1f}" fill="#FBF8F3" stroke="#2A2826" stroke-width="1.6"/>')
        name_cls = 'jt-s' if key == 'home' else 'jt'
        name_fs = (22 if key == 'home' else 12.5) * s
        txt = f'<text x="{lx}" y="{ly}" text-anchor="{p["anchor"]}" class="{name_cls}" font-size="{name_fs:.1f}">{p["name"]}</text>'
        if p['sub']:
            txt += f'<text x="{lx}" y="{ly + 16*s:.0f}" text-anchor="{p["anchor"]}" class="jt-m" font-size="{10*s:.1f}">{p["sub"]}</text>'
        return f'<g class="jp jp-{key}"{hide}>{dot}{txt}</g>'
    (cx1, cy1), (cx2, cy2) = g['causeway']
    walk = (f'<path class="jr-walk" d="{g["walk"]}"/>' if st is None else
            f'<path class="jr-walk" d="{g["walk"]}" style="opacity:{st["walk"]}"/>')
    blbl_op = '' if st is None else f' style="opacity:{1 if st["bridge"] > 0 else 0}"'
    out = f'''<svg viewBox="0 0 {W} {H}" preserveAspectRatio="xMidYMid slice" aria-label="Route from Woodlands North to New Casa Suites (schematic)">
<defs><pattern id="h-{uid}" width="12" height="12" patternUnits="userSpaceOnUse"><path d="M0,6 H12" stroke="#D8CEBF" stroke-width="1"/></pattern></defs>
<rect width="{W}" height="{H}" fill="#E8E1D5"/><rect width="{W}" height="{H}" fill="url(#h-{uid})"/>
<path d="{g['jb_coast']} L{W},0 L0,0 Z" fill="#F6F1E9" stroke="#CDC2B2" stroke-width="1"/>
<path d="{g['sg_coast']} L{W},{H} L0,{H} Z" fill="#F6F1E9" stroke="#CDC2B2" stroke-width="1"/>
{''.join(f'<path d="{r}" fill="none" stroke="#E7DFD2" stroke-width="{6*s:.0f}" stroke-linecap="round"/>' for r in g['roads'])}
<line x1="{cx1}" y1="{cy1}" x2="{cx2}" y2="{cy2}" stroke="#B9AE9F" stroke-width="{4*s:.1f}"/>
<text x="{g['causeway_lbl'][0]}" y="{g['causeway_lbl'][1]}" class="jt-m jt-faint" font-size="{10*s:.1f}">Causeway · 1,056 m</text>
<text x="{g['strait_lbl'][0]}" y="{g['strait_lbl'][1]}" class="jt-s jt-faint" font-style="italic" font-size="{20*s:.1f}" fill="#9C9286">Straits of Johor</text>
<text x="{g['jb_lbl'][0]}" y="{g['jb_lbl'][1]}" class="jt-cap" font-size="{12*s:.1f}">JOHOR BAHRU</text>
<text x="{g['jb_lbl'][0]}" y="{g['jb_lbl'][1] + 17*s:.0f}" class="jt-m" font-size="{10*s:.1f}">Malaysia · 1.46° N</text>
<text x="{g['sg_lbl'][0]}" y="{g['sg_lbl'][1]}" class="jt-cap" font-size="{12*s:.1f}">SINGAPORE</text>
<path d="{g['tel']}" fill="none" stroke="#B9AE9F" stroke-width="{3*s:.1f}" stroke-dasharray="1 {7*s:.0f}" stroke-linecap="round"/>
<path d="{g['bridge']}" fill="none" stroke="#DCCFBE" stroke-width="{13*s:.0f}" stroke-linecap="round"/>
{seg('rts', g['rts'], 'jr-rts')}
{walk}
{seg('bridge', g['bridge'], 'jr-bridge')}
{seg('mall', g['mall'], 'jr-mall')}
<text x="{g['bridge_lbl'][0]}" y="{g['bridge_lbl'][1]}" class="jt-m jb-lbl" font-size="{10.5*s:.1f}" fill="#8A5F40"{blbl_op}>650 m covered link bridge</text>
{''.join(pin(k) for k in ('wn', 'bc', 'ciq', 'mall', 'home'))}
</svg>'''
    return re.sub(r'\n', '', out)


def main():
    tpl, assets, out = map(pathlib.Path, sys.argv[1:4])
    s = tpl.read_text(encoding='utf-8')
    s = re.sub(r'\{\{SVG:(desk|phone):(anim|f\d)\}\}', lambda m: svg(m.group(1), m.group(2)), s)
    s = re.sub(r'\{\{([A-Za-z0-9_]+)\}\}',
               lambda m: 'data:image/webp;base64,' + base64.b64encode((assets / (m.group(1) + '.webp')).read_bytes()).decode(), s)
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(s, encoding='utf-8')
    print(out, len(s), 'leftover placeholders:', s.count('{{'))


if __name__ == '__main__':
    main()
