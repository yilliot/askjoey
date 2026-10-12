// New Casa Suites @ Mercu 3, R&F Princess Cove — Phase 3.
// Source: R&F's Phase 3 brochure, simplified floor-plan brochure and rfmalaysia.com
// (materials/rf-princess-cove-phase-3/FACTS.md). Layout texts are R&F's own, from the plans.
import type { ImageMetadata } from 'astro';

import hero from '../assets/img/rf/hero.jpg';
import heroPortrait from '../assets/img/rf/hero-portrait.jpg';
import aerial from '../assets/img/rf/aerial.jpg';
import night from '../assets/img/rf/night.jpg';
import day from '../assets/img/rf/day.jpg';
import pool from '../assets/img/rf/pool.jpg';
import skypark from '../assets/img/rf/skypark.jpg';
import rts from '../assets/img/rf/rts.jpg';
import family from '../assets/img/rf/family.jpg';
import tennis from '../assets/img/rf/tennis.jpg';
import gym from '../assets/img/rf/gym.jpg';
import yoga from '../assets/img/rf/yoga.jpg';
import childcare from '../assets/img/rf/childcare.jpg';
import badminton from '../assets/img/rf/badminton.jpg';
import bridgeMall from '../assets/img/rf/bridge-mall.jpg';
import logo from '../assets/img/rf/logo.png';

const plans = import.meta.glob<{ default: ImageMetadata }>('../assets/img/rf/plans/*.jpg', { eager: true });
const plan = (t: string) => plans[`../assets/img/rf/plans/${t}.jpg`].default;

export type Layout = {
  type: string; // as R&F labels it, e.g. "C / C(M)"
  key: string; // plan file / anchor
  name: string;
  beds: string;
  baths: number;
  sqft: number;
  m2: number;
  text: string;
  plan: ImageMetadata;
};

const L = (type: string, key: string, name: string, beds: string, baths: number, sqft: number, m2: number, text: string): Layout =>
  ({ type, key, name, beds, baths, sqft, m2, text, plan: plan(key) });

export const layouts = {
  studio: [
    L('A / A(M)', 'A', 'Compact Elegance', 'Studio', 1, 313, 29.16, 'A space-efficient layout crafted for modern city living. The design integrates essential zones into one seamless flow, offering a cozy retreat with all the right functions in a bright, open environment.'),
  ],
  one: [
    L('B1b / B1b(M)', 'B1b', 'Balcony Bliss', '1', 1, 555, 51.64, 'An airy interior welcomes with abundant natural light, extending seamlessly toward a spacious balcony that opens the home to the outdoors. Perfect for those who value a refreshing, breezy living experience.'),
    L('B2 / B2(M)', 'B2', 'Urban Retreat', '1', 1, 558, 51.89, 'An elongated layout that makes the most of every corner. With a functional arrangement of living, dining, and rest areas, this home is tailored for comfort and efficient day-to-day living.'),
    L('B1 / B1(M)', 'B1', 'Sleek and Modern', '1', 1, 577, 53.67, 'A clean, well-structured layout enhances everyday living, ideal for those who value simplicity, function, and modern efficiency. Comfortable and easy, for individuals or couples seeking a practical yet stylish urban home.'),
    L('B3 / B3(M)', 'B3', 'Scenic and Spacious', '1', 1, 593, 55.14, 'Designed for easy living, a practical layout thoughtfully integrates a dedicated dry yard that enhances practicality while maintaining a spacious interior flow. Its open layout encourages relaxation and personal expression.'),
    L('B3b / B3b(M)', 'B3b', 'Masterful Design', '1', 1, 593, 55.14, 'A well-zoned layout with smooth circulation from entrance to living area. Designed with modern routines in mind, the space offers both openness and clarity — ideal for balanced and comfortable living.'),
    L('B3c', 'B3c', 'Elegance Unfolded', '1', 1, 593, 55.14, 'Spacious interiors are thoughtfully arranged to distinguish communal living areas from more private quarters — balancing openness with personal retreat. Comfort, flow and contemporary style in one cohesive space.'),
    L('B3a / B3a(M)', 'B3a', 'Streamlined Elegance', '1', 1, 595, 55.35, 'A design focused on simplicity and practicality ensures a smooth transition from the entryway to the heart of the home. The open space feels bright and well-balanced, perfect for a calm, uncluttered lifestyle.'),
  ],
  two: [
    L('C / C(M)', 'C', 'Cozy Haven', '2', 2, 781, 72.56, 'Thoughtful zoning balances intimate privacy with open connectivity, delivering a living space that adapts to diverse needs. Ideal for compact modern living with thoughtfully positioned essentials throughout.'),
    L('C1 / C1(M)', 'C1', 'Modern Comfort', '2', 2, 820, 76.19, 'An open-concept living and dining area extends seamlessly to a balcony, enhancing both comfort and everyday usability. The spatial flow is intuitive — easy everyday living and occasional entertaining.'),
    L('C4a', 'C4a', 'Serene Outlook', '2', 2, 840, 78.06, 'Crafted for peaceful living, this layout creates a private escape with clear flow from entrance to balcony. The design encourages openness while still offering distinct areas for unwinding and everyday function.'),
    L('C4', 'C4', 'Refined Spaces', '2', 2, 852, 79.18, 'Cleanly structured around a generous central living area, the design evokes an elevated sense of spaciousness. Its arrangement supports both relaxation and interaction with subtle separation between zones.'),
    L('C4c', 'C4c', 'Sleek Sanctuary', '2', 2, 852, 79.18, 'Defined by contemporary lines and an airy balcony extension, the space brings together refined interior living and subtle outdoor moments. Ideal for those who enjoy simplicity paired with space to recharge.'),
    L('C4b', 'C4b', 'Symmetrical Sophistication', '2', 2, 859, 79.88, 'Balanced in every way, the design places equal-sized private suites on opposite sides of the home — offering symmetry, privacy and flexibility. The central living area anchors the home with calm continuity.'),
    L('C5', 'C5', 'Peak Sophistication', '2', 2, 876, 81.41, 'A premium layout designed for modern lifestyles, offering generous proportions, a central living core and a refined overall aesthetic. Each zone feels intentional and comfortably expansive.'),
    L('C2 / C2(M)', 'C2', 'Functional Harmony', '2', 2, 877, 81.54, 'Crafted for practical living, the design combines everyday comfort and personal privacy within a well-zoned, intuitive flow. Each space supports day-to-day ease in a welcoming, balanced home.'),
    L('C3 / C3(M)', 'C3', 'Spacious Living', '2', 2, 894, 83.09, 'Spacious communal areas pair seamlessly with well-separated private rooms, making it a perfect choice for growing households — a thoughtful balance between openness and comfort for modern family life.'),
  ],
  three: [
    L('D1 / D1(M)', 'D1', 'Deluxe Family', '3', 2, 1156, 107.45, 'Spacious and inviting, the open-plan layout encourages connection — perfect for hosting guests or enjoying time with family. Every corner is planned to enhance togetherness and easy everyday living.'),
    L('D3 / D3(M)', 'D3', 'Contemporary Luxury', '3 + study', 2, 1161, 107.94, 'Built with a modern lifestyle in mind, the space integrates expansive common areas, ample resting zones and a private study corner — ideal for those blending work and personal life in one seamless space.'),
    L('D2 / D2(M)', 'D2', 'Expansive Elegance', '3', 3, 1275, 118.47, 'A premier layout offering maximum space and flexibility. With well-defined zones and a subtle sense of luxury throughout, it supports sophisticated living with ample room for everyone to thrive.'),
  ],
  four: [
    L('E / E(M)', 'E', 'Grand Family Estate', '4', 3, 1555, 144.55, 'Spacious communal zones are paired with distinct private areas, so several generations can live together comfortably. The open-plan core connects to a wide balcony, where everyday life, family time and quiet moments unfold.'),
  ],
};

export const groups = [
  { id: 'studio', label: 'Studio', range: '313 sf', items: layouts.studio, note: 'Type A · 313 sq ft · 1 bath' },
  { id: 'one', label: '1 Bed', range: '555–595 sf', items: layouts.one, note: '7 layouts · 555–595 sq ft · 1 bath' },
  { id: 'two', label: '2 Bed', range: '781–894 sf', items: layouts.two, note: '9 layouts · 781–894 sq ft · 2 bath' },
  { id: 'three', label: '3 Bed', range: '1,156–1,275 sf', items: layouts.three, note: '3 layouts · 1,156–1,275 sq ft · 2–3 bath' },
  { id: 'four', label: '4 Bed', range: '1,555 sf', items: layouts.four, note: 'Type E · 1,555 sq ft · 3 bath' },
] as const;

export const project = {
  slug: 'new-casa-suites',
  name: 'New Casa Suites',
  place: 'R&F Princess Cove · Phase 3',
  developer: 'R&F Development',
  area: 'Johor Bahru · Tanjung Puteri',
  intro: 'Freehold homes linked to R&F Mall, a covered walk from the JB CIQ and the RTS Link to Woodlands.',
  priceFrom: 640178,
  foreignFrom: 1000000,
  beds: 'Studio – 4',
  baths: '1 – 3',
  size: '313 – 1,555',
  tenure: 'Freehold',
  ready: 'Nov 2029',
  coord: '1.46° N · 103.77° E',
  img: { hero, heroPortrait, aerial, night, day, pool, skypark, rts, family, tennis, gym, yoga, childcare, badminton, bridgeMall, logo },
  heroLayout: { key: 'C', block: 'C1' },
  facilities: {
    l6: ['Swimming pool', 'Jacuzzi', "Kids' pool", 'Covered BBQ area', 'Leisure lawn', "Children's playground", 'Sauna & changing room', 'Gym', 'Yoga room', 'Childcare centre', 'Multipurpose room', 'Public lobby', 'Tennis court', 'Basketball court', 'Leisure track', 'Recreation area', 'Outdoor gym'],
    l4: ['Table tennis room', 'Snooker room', 'Changing room', 'Link bridge to R&F Mall', 'Badminton hall'],
  },
  specs: [
    ['Digital lockset', 'all homes'],
    ['Built-in high & low kitchen cabinets, hood & hob', 'all homes'],
    ['Water heater + storage water heater', 'all homes'],
    ['Air-conditioner points', '1 (studio) – 5 (Type E)'],
    ['Tiled floors throughout, glass-railed balconies', 'per layout'],
    ['Oven', '3- & 4-bed (D, E)'],
  ],
  galleries: {
    jb: 'L2-086-A5, Mercu 1, Jalan Tanjung Puteri 1, R&F Tanjung Puteri, 80300 Johor Bahru',
    sg: '60 Paya Lebar Road #13-30, Paya Lebar Square, Singapore 409051',
  },
  legal: {
    developer: 'R&F Development Sdn Bhd (1069248-H)',
    address: 'L2-086-A5, Mercu 1, Jalan Tanjung Puteri 1, R&F Tanjung Puteri, 80300 Johor Bahru',
    licence: "Developer's Licence 13578/05-2027/0392(A), valid 26/04/2022–05/05/2027",
    authority: 'Majlis Bandaraya Johor Bahru',
    tenure: 'Freehold',
    encumbrance: 'Nil',
    completion: '30/11/2029',
    blocks: [
      { name: 'Block C1', permit: '13578-8/07-2028/0621(N)-(S)', bp: 'MBJB/U/2024/14/BGN/178/KOM(16)', units: 422, min: 846905, max: 1275259, sf: '593 – 781' },
      { name: 'Block C2', permit: '13578-7/07-2028/0622(N)-(S)', bp: 'MBJB/U/2024/14/BGN/179/KOM(16)', units: 1137, min: 640178, max: 2116680, sf: '313 – 1,275' },
      { name: 'Block C3', permit: '13578-6/07-2028/0623(N)-(S)', bp: 'MBJB/U/2024/14/BGN/180/KOM(16)', units: 700, min: 761168, max: 3567158, sf: '555 – 1,555' },
    ],
    permitValid: '31/07/2025–30/07/2028',
    notes: 'Bumiputera discount 15%. Restrictions in interest: no sale to a non-citizen or foreign company without State Authority consent; Bumiputera lots may not be transferred to non-Bumiputera without consent.',
  },
};
