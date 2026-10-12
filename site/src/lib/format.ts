import fx from '../data/fx.json';
import { agent } from '../data/agent';

const nf = new Intl.NumberFormat('en-MY');

export const rm = (n: number) => 'RM' + nf.format(n);
export const num = (n: number) => nf.format(n);

/** ≈ S$ at the build-day rate, rounded to the nearest thousand. */
export const sgd = (myr: number) => 'S$' + nf.format(Math.round((myr * fx.sgdPerMyr) / 1000) * 1000);

export const fxNote = () => {
  const d = new Date(fx.date + 'T00:00:00Z').toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
  return `S$ at RM1 = S$${fx.sgdPerMyr.toFixed(4)}, ${d}`;
};

/** WhatsApp link that opens Joey's chat with the message already written. */
export const wa = (text: string) =>
  `https://wa.me/${agent.whatsapp}?text=${encodeURIComponent(text + ' (via website)')}`;

export const tel = () => `tel:${agent.tel}`;
