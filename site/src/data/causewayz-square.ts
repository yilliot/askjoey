// Causewayz Square @ JBCC (EXSIM), Johor Bahru City Centre.
// Source: EXSIM's brochures (Axis Tower; Brixton & Dover), causewayz.com.my and exsim.com.my
// (materials/exsim-causewayz-square/FACTS.md). Distances and times are EXSIM's own wording.
import type { ImageMetadata } from 'astro';

import hero from '../assets/img/exsim/hero.jpg';
import heroPortrait from '../assets/img/exsim/hero-portrait.jpg';
import card from '../assets/img/exsim/card.jpg';
import axis from '../assets/img/exsim/axis.jpg';
import brixton from '../assets/img/exsim/brixton.jpg';
import dover from '../assets/img/exsim/dover.jpg';
import aerial from '../assets/img/exsim/aerial.jpg';
import rooftop from '../assets/img/exsim/rooftop.jpg';
import bridge from '../assets/img/exsim/bridge.jpg';
import retailStreet from '../assets/img/exsim/retail-street.jpg';
import retail from '../assets/img/exsim/retail.jpg';
import lobby from '../assets/img/exsim/lobby.jpg';
import infinity from '../assets/img/exsim/infinity.jpg';
import jacuzzi from '../assets/img/exsim/jacuzzi.jpg';
import skyGym from '../assets/img/exsim/sky-gym.jpg';
import gym from '../assets/img/exsim/gym.jpg';
import skyBbq from '../assets/img/exsim/sky-bbq.jpg';
import coralPool from '../assets/img/exsim/coral-pool.jpg';
import kids from '../assets/img/exsim/kids.jpg';
import forest from '../assets/img/exsim/forest.jpg';
import logo from '../assets/img/exsim/logo-causewayz.png';
import logoExsim from '../assets/img/exsim/logo-exsim.png';

const plans = import.meta.glob<{ default: ImageMetadata }>('../assets/img/exsim/plans/*.jpg', { eager: true });
const plan = (t: string) => plans[`../assets/img/exsim/plans/${t}.jpg`].default;

const L = (type: string, key: string, name: string, beds: string, baths: number, sqft: number, m2: number, text: string, note?: string) =>
  ({ type, key, name, beds, baths, sqft, m2, text, note, plan: plan(key) });

const BD = 'Brixton & Dover';
export const layouts = {
  studio: [
    L('A · Axis Tower', 'A', 'Studio', 'Studio', 1, 366, 34, 'An efficient studio, ideal for young professionals or first-time investors. Axis homes are professionally managed by Mana Mana Hospitality, and the layout is marked short-term-rental friendly.', 'Axis Tower · 7 per floor'),
  ],
  one: [
    L(`C · ${BD}`, 'C', 'One bedroom', '1', 1, 474, 44, 'A one-bedroom home with living, dining and kitchen in one line, a separate bedroom and a yard.', `${BD} towers`),
  ],
  two: [
    L('B · Axis Tower', 'B', 'Dual key', '2', 2, 592, 55, 'Two bedrooms and two bathrooms in a dual-key configuration: two keyed halves, each with its own kitchen and bathroom, for families, multigenerational living or letting one half.', 'Axis Tower · dual key · 13 per floor'),
    L(`D1 · ${BD}`, 'D1', 'Two bedroom', '2', 2, 667, 62, 'Two bedrooms and two bathrooms; the master bedroom has its own bathroom, and a yard sits by the kitchen.', `${BD} towers`),
    L(`D2 · ${BD}`, 'D2', 'Two bedroom', '2', 2, 667, 62, 'Two bedrooms either side of the living room, two bathrooms and a yard.', `${BD} towers`),
  ],
  three: [
    L(`E1 · ${BD}`, 'E1', 'Three bedroom, balcony', '3', 2, 850, 79, 'Three bedrooms and two bathrooms with a balcony off the living room.', `${BD} towers · balcony`),
    L(`E2 · ${BD}`, 'E2', 'Three bedroom', '3', 2, 850, 79, 'Three bedrooms and two bathrooms, without a balcony.', `${BD} towers · no balcony`),
    L(`F1 · ${BD}`, 'F1', 'Dual key, balcony', '3', 2, 850, 79, 'Three bedrooms in a dual-key configuration with a balcony: live in one part and let the other.', `${BD} towers · dual key · balcony`),
    L(`F2 · ${BD}`, 'F2', 'Dual key', '3', 2, 850, 79, 'Three bedrooms in a dual-key configuration, without a balcony.', `${BD} towers · dual key · no balcony`),
  ],
};

export const groups = [
  { id: 'studio', label: 'Studio', range: '366 sf', items: layouts.studio, note: 'Type A · Axis · 366 sq ft' },
  { id: 'one', label: '1 Bed', range: '474 sf', items: layouts.one, note: 'Type C · 474 sq ft · 1 bath' },
  { id: 'two', label: '2 Bed', range: '592–667 sf', items: layouts.two, note: '3 layouts · 592–667 sq ft · 2 bath' },
  { id: 'three', label: '3 Bed', range: '850 sf', items: layouts.three, note: '4 layouts · 850 sq ft · 2 bath' },
] as const;

export const towers = [
  { name: 'Axis', img: axis, alt: "Axis Tower at dusk, artist's impression", units: 908, line: 'Modern city suites: studios and dual-key two-bedroom homes, managed by Mana Mana Hospitality for long or short stays.', from: 593600, sf: '366 – 592' },
  { name: 'Brixton', img: brixton, alt: "Brixton Tower and its drop-off, artist's impression", units: 1257, line: 'Spaces designed for modern living: one to three bedrooms, with the Level 12 podium park.', from: 691000, sf: '474 – 850' },
  { name: 'Dover', img: dover, alt: "Dover Tower beside the rail viaduct, artist's impression", units: 1527, line: 'Functional elegance for every lifestyle: one to three bedrooms, sharing the podium with Brixton.', from: 701000, sf: '474 – 850' },
];

export const project = {
  slug: 'causewayz-square',
  name: 'Causewayz Square',
  place: '@ JBCC · EXSIM',
  developer: 'EXSIM',
  area: 'Johor Bahru City Centre · Jalan Lumba Kuda',
  intro: 'Freehold homes in four towers over a retail podium, about 600 m from the JB CIQ by an approved link bridge, and 900 m from the RTS Link.',
  blurb: "EXSIM's freehold towers in JB City Centre: a retail podium, a park on Level 12 and a link bridge to the CIQ, about 600 m away.",
  near: '≈ 600 m',
  priceFrom: 593600,
  foreignFrom: 1000000,
  beds: 'Studio – 3',
  baths: '1 – 2',
  size: '366 – 850',
  tenure: 'Freehold',
  ready: 'Dec 2030',
  dist: { label: 'To JB CIQ', value: '≈ 600 m, link bridge' },
  img: {
    hero, heroPortrait, card, cardAlt: "Causewayz Square's podium at dusk, artist's impression",
    aerial, rooftop, bridge, retailStreet, retail, lobby, infinity, jacuzzi, skyGym, gym, skyBbq, coralPool, kids, forest, logo, logoExsim,
  },
  facilities: {
    axis: ['Social Lounge', 'Entertainment Lounge', 'Sky BBQ Deck', 'Power Studio', 'Seascape Wading Pool', 'Wavescape Infinity Pool', 'Jacuzzi Lounge', 'Coworking Lounge'],
    l12: ['Pulse Garden', 'Garden Dining', 'Gourmet Kitchen', 'Karaoke Lounge', "Kids' Playroom", 'Reading Lounge', 'Fitness Studio', 'Cardio Garden', 'Hoops Court', 'Multipurpose Hall (pickleball & badminton)', 'Outdoor Gym', 'Chill Lawn', 'Ripple Swing', 'Open Lawn', 'Green Mount', 'Star Trampoline', 'Ocean Playground', 'Forest Walk', "Kids' Water Play", 'Garden Walk', 'Games Room', 'Infinity Pool', 'Floating Walk', 'Moon Bridge', 'Pearl Pavilion', 'Ocean Pool', 'Shallow Pool', 'Jogging Loop', 'Yoga Deck', 'Sprint Track', 'Spa in Nature', 'Swing Rest'],
    l57: ['Glowing Sky BBQ', 'Herbs Garden', 'Hammock Garden'],
  },
  gallery: {
    jb: 'EXSIM Johor Sales Gallery, Suite 1.1 & 1.3, Level 1, Menara Pelangi, No. 2 Jalan Kuning, Taman Pelangi, 80400 Johor Bahru',
  },
  legal: {
    developer: 'EXSIM Lumba Kuda Sdn Bhd [202401010179 (1556029-T)]',
    address: 'D-35-01, Level 35, EXSIM Tower, Millerz Square @ Old Klang Road, Megan Legasi, No. 357, Jalan Kelang Lama, 58000 Kuala Lumpur',
    licence: "Developer's Licence 31100/07-2030/0156(A), valid 10/07/2025–09/07/2030",
    authority: 'Majlis Bandaraya Johor Bahru',
    tenure: 'Freehold',
    encumbrance: 'AmBank (M) Berhad',
    completion: 'December 2030',
    blocks: [
      { name: 'Axis (Tower A)', permit: '31100-3/11-2028/0931(N)-(S)', bp: 'MBJB/U/2024/14/BGN/174/KOM', units: 908, min: 593600, max: 1003941, sf: '366 – 592' },
      { name: 'Brixton (Tower B)', permit: '31100-2/11-2028/0929(N)-(S)', bp: 'MBJB/U/2024/14/BGN/175/KOM', units: 1257, min: 691000, max: 1274110, sf: '474 – 850' },
      { name: 'Dover (Tower D)', permit: '31100-1/11-2028/0930(N)-(S)', bp: 'MBJB/U/2024/14/BGN/177/KOM', units: 1527, min: 701000, max: 1291363, sf: '474 – 850' },
    ],
    permitValid: '05/11/2025–04/11/2028',
    notes: 'Serviced apartments. Bumiputera discount 15%. Restriction in interest: the land may not be sold or transferred to a non-citizen or foreign company without the consent of the State Authority. Coven (Tower C) is a future phase and is not on sale.',
  },
};
