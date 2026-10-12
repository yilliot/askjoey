// The schematic Woodlands North → front door map for the route hero, drawn in the site palette.
// Follows the developer's own journey diagram; not to scale. Two shapes: landscape (desktop)
// and portrait (phone). Motion targets carry classes: .jr-<leg> (drawn), .jp-<pin> (popped in).

type Pin = { at: [number, number]; lbl: [number, number]; anchor: 'start' | 'middle' | 'end'; name: string; sub?: string };
type Geo = {
  vb: [number, number];
  jbCoast: string; sgCoast: string; roads: string[];
  causeway: [[number, number], [number, number]]; causewayLbl: [number, number];
  straitLbl: [number, number]; jbLbl: [number, number]; sgLbl: [number, number];
  tel: string; rts: string; walk: string; bridge: string; mall: string; bridgeLbl: [number, number];
  pins: Record<'wn' | 'bc' | 'ciq' | 'mall' | 'home', Pin>;
  fs: number;
};

const desk: Geo = {
  vb: [1200, 720],
  jbCoast: 'M0,318 C120,296 230,334 360,316 S560,292 640,312 S820,326 940,300 S1110,292 1200,306',
  sgCoast: 'M0,486 C140,500 250,468 380,484 S600,500 700,478 S900,470 1010,492 S1140,500 1200,486',
  roads: ['M0,200 C200,222 400,176 600,206 S1000,186 1200,214', 'M760,0 C772,120 748,200 782,300',
    'M0,640 C300,612 520,650 800,616 S1100,640 1200,606', 'M300,486 C320,560 280,640 330,720'],
  causeway: [[600, 314], [608, 478]], causewayLbl: [618, 404],
  straitLbl: [92, 410], jbLbl: [430, 92], sgLbl: [60, 568],
  tel: 'M470,530 C486,600 500,660 520,720',
  rts: 'M470,530 C468,460 520,420 512,360 S500,280 505,252',
  walk: 'M505,252 C530,262 560,276 585,286',
  bridge: 'M585,286 C650,300 720,306 790,298 S830,290 845,286',
  mall: 'M845,286 L905,236',
  bridgeLbl: [706, 334],
  pins: {
    wn: { at: [470, 530], lbl: [486, 534], anchor: 'start', name: 'Woodlands North', sub: 'RTS Link · TEL' },
    bc: { at: [505, 252], lbl: [492, 248], anchor: 'end', name: 'Bukit Chagar', sub: 'RTS terminus' },
    ciq: { at: [585, 286], lbl: [585, 266], anchor: 'middle', name: 'JB CIQ' },
    mall: { at: [845, 286], lbl: [845, 314], anchor: 'middle', name: 'R&amp;F Mall' },
    home: { at: [905, 236], lbl: [924, 262], anchor: 'start', name: 'New Casa Suites', sub: 'R&amp;F Princess Cove · Phase 3' },
  },
  fs: 1,
};

const phone: Geo = {
  vb: [390, 740],
  jbCoast: 'M0,332 C60,318 110,342 170,330 S260,316 300,328 S360,334 390,322',
  sgCoast: 'M0,458 C70,470 120,446 190,460 S300,472 330,454 S370,450 390,460',
  roads: ['M0,236 C90,250 200,214 390,240', 'M352,0 C356,100 346,200 360,326', 'M0,640 C120,620 260,660 390,630'],
  causeway: [[190, 334], [196, 456]], causewayLbl: [202, 402],
  straitLbl: [232, 446], jbLbl: [44, 284], sgLbl: [44, 566],
  tel: 'M110,505 C122,560 136,600 150,650',
  rts: 'M110,505 C108,450 140,410 133,360 S124,300 128,282',
  walk: 'M128,282 C145,292 160,304 175,312',
  bridge: 'M175,312 C200,318 225,312 250,300',
  mall: 'M250,300 L300,250',
  bridgeLbl: [205, 362],
  pins: {
    wn: { at: [110, 505], lbl: [122, 509], anchor: 'start', name: 'Woodlands North', sub: 'RTS Link · TEL' },
    bc: { at: [128, 282], lbl: [116, 278], anchor: 'end', name: 'Bukit Chagar' },
    ciq: { at: [175, 312], lbl: [175, 338], anchor: 'middle', name: 'JB CIQ' },
    mall: { at: [250, 300], lbl: [258, 322], anchor: 'start', name: 'R&amp;F Mall' },
    home: { at: [300, 250], lbl: [288, 254], anchor: 'end', name: 'New Casa Suites' },
  },
  fs: 0.86,
};

const f = (n: number) => (Math.round(n * 10) / 10).toString();

export function routeMap(kind: 'desk' | 'phone'): string {
  const g = kind === 'desk' ? desk : phone;
  const [W, H] = g.vb;
  const s = g.fs;
  const id = `hatch-${kind}`;
  const pin = (k: keyof Geo['pins']) => {
    const p = g.pins[k];
    const [x, y] = p.at;
    const [lx, ly] = p.lbl;
    const dot = k === 'home'
      ? `<circle cx="${x}" cy="${y}" r="${f(17 * s)}" class="jp-ring"/><circle cx="${x}" cy="${y}" r="${f(9 * s)}" fill="#BC8C68"/>`
      : `<circle cx="${x}" cy="${y}" r="${f(6.5 * s)}" fill="#FBF8F3" stroke="#2A2826" stroke-width="1.6"/>`;
    const cls = k === 'home' ? 'jt-s' : 'jt';
    let t = `<text x="${lx}" y="${ly}" text-anchor="${p.anchor}" class="${cls}" font-size="${f((k === 'home' ? 22 : 12.5) * s)}">${p.name}</text>`;
    if (p.sub) t += `<text x="${lx}" y="${Math.round(ly + 16 * s)}" text-anchor="${p.anchor}" class="jt-m" font-size="${f(10 * s)}">${p.sub}</text>`;
    return `<g class="jp jp-${k}">${dot}${t}</g>`;
  };
  const [[cx1, cy1], [cx2, cy2]] = g.causeway;
  return [
    `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Schematic route: Woodlands North, RTS Link to Bukit Chagar, JB CIQ, the 650 m covered link bridge, R&amp;F Mall, New Casa Suites">`,
    `<defs><pattern id="${id}" width="12" height="12" patternUnits="userSpaceOnUse"><path d="M0,6 H12" stroke="#D8CEBF" stroke-width="1"/></pattern></defs>`,
    `<rect width="${W}" height="${H}" fill="#E8E1D5"/><rect width="${W}" height="${H}" fill="url(#${id})"/>`,
    `<path d="${g.jbCoast} L${W},0 L0,0 Z" fill="#F6F1E9" stroke="#CDC2B2" stroke-width="1"/>`,
    `<path d="${g.sgCoast} L${W},${H} L0,${H} Z" fill="#F6F1E9" stroke="#CDC2B2" stroke-width="1"/>`,
    ...g.roads.map((r) => `<path d="${r}" fill="none" stroke="#E7DFD2" stroke-width="${Math.round(6 * s)}" stroke-linecap="round"/>`),
    `<line x1="${cx1}" y1="${cy1}" x2="${cx2}" y2="${cy2}" stroke="#B9AE9F" stroke-width="${f(4 * s)}"/>`,
    `<text x="${g.causewayLbl[0]}" y="${g.causewayLbl[1]}" class="jt-m jt-faint" font-size="${f(10 * s)}">Causeway · 1,056 m</text>`,
    `<text x="${g.straitLbl[0]}" y="${g.straitLbl[1]}" class="jt-s jt-faint" font-style="italic" font-size="${f(20 * s)}">Straits of Johor</text>`,
    `<text x="${g.jbLbl[0]}" y="${g.jbLbl[1]}" class="jt-cap" font-size="${f(12 * s)}">JOHOR BAHRU</text>`,
    `<text x="${g.jbLbl[0]}" y="${Math.round(g.jbLbl[1] + 17 * s)}" class="jt-m" font-size="${f(10 * s)}">Malaysia · 1.46° N</text>`,
    `<text x="${g.sgLbl[0]}" y="${g.sgLbl[1]}" class="jt-cap" font-size="${f(12 * s)}">SINGAPORE</text>`,
    `<path d="${g.tel}" fill="none" stroke="#B9AE9F" stroke-width="${f(3 * s)}" stroke-dasharray="1 ${Math.round(7 * s)}" stroke-linecap="round"/>`,
    `<path d="${g.bridge}" fill="none" stroke="#DCCFBE" stroke-width="${Math.round(13 * s)}" stroke-linecap="round"/>`,
    `<path class="jr jr-rts" d="${g.rts}" pathLength="1"/>`,
    `<path class="jr-walk" d="${g.walk}"/>`,
    `<path class="jr jr-bridge" d="${g.bridge}" pathLength="1"/>`,
    `<path class="jr jr-mall" d="${g.mall}" pathLength="1"/>`,
    `<text x="${g.bridgeLbl[0]}" y="${g.bridgeLbl[1]}" class="jt-m jb-lbl" font-size="${f(10.5 * s)}">650 m covered link bridge</text>`,
    ...(['wn', 'bc', 'ciq', 'mall', 'home'] as const).map(pin),
    `</svg>`,
  ].join('');
}
