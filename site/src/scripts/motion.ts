// Motion: Lenis smooth wheel (desktop only) + GSAP ScrollTrigger.
// Everything here is decoration: with reduced motion (or no JS) the page is complete and still.
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CustomEase } from 'gsap/CustomEase';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger, CustomEase);
CustomEase.create('silk', 'M0,0 C0.22,1 0.36,1 1,1'); // entrances
CustomEase.create('glide', 'M0,0 C0.65,0 0.35,1 1,1'); // cross-fades, sheet moves

export const motionOn = document.documentElement.classList.contains('motion');
export let lenis: Lenis | null = null;

const PHONE = '(max-width: 760px)';
const nf = new Intl.NumberFormat('en-MY');

export function initMotion() {
  if (!motionOn) return;
  ScrollTrigger.config({ ignoreMobileResize: true });

  if (matchMedia('(pointer: fine)').matches) {
    lenis = new Lenis({ lerp: 0.085, anchors: { offset: -72 } });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((t) => lenis!.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  journey();
  pageHero();
  reveals();
  curtains();
  parallax();
  morph();
  counters();
  // fonts and lazy images change heights: re-measure once everything has settled
  document.fonts?.ready.then(() => ScrollTrigger.refresh());
  addEventListener('load', () => ScrollTrigger.refresh());
}

/** J1 · the route: pinned for ~3 screens; one timeline of 100 units, scrubbed by the scroll. */
function journey() {
  const j = document.querySelector<HTMLElement>('.j');
  if (!j) return;
  const nav = document.getElementById('nav')!;
  const mm = gsap.matchMedia();
  mm.add({ phone: PHONE, desk: '(min-width: 761px)' }, (ctx) => {
    const phone = !!ctx.conditions?.phone;
    const q = gsap.utils.selector(j);
    const map = q(phone ? '.m-p' : '.m-d')[0] as HTMLElement;
    const m = gsap.utils.selector(map);
    const full = 'inset(0% 0% 0% 0% round 0px)';
    // the photo window, top-right: inset t r b l (%). The whole photo scales into it, so the tower stays in view.
    const [t, r, b, l] = phone ? [7, 5, 69, 46] : [5, 3, 70, 76];
    const win = `inset(${t}% ${r}% ${b}% ${l}% round ${phone ? 14 : 16}px)`;
    const sc = Math.max((100 - r - l) / 100, (100 - t - b) / 100);
    const cx = (l + 100 - r) / 200, cy = (t + 100 - b) / 200;
    const stage = q('.j-stage')[0] as HTMLElement;
    const pic = q('.j-photo picture')[0] as HTMLElement;
    gsap.set(pic, { transformOrigin: '0 0' });

    gsap.set(m('.jr'), { strokeDashoffset: 1 });
    gsap.set(m('.jr-walk, .jb-lbl'), { opacity: 0 });
    gsap.set(m('.jp'), { opacity: 0, scale: 0.55 });
    gsap.set(q('.j-cap'), { autoAlpha: 0, y: 16 });
    gsap.set(q('.j-plan'), { autoAlpha: 0, x: 28, clipPath: 'inset(0% 0% 0% 100% round 18px)' });
    gsap.set(nav, { '--nav-fg': '#FFFFFF' });
    gsap.set(j, { '--nav-fg-skip': '#FFFFFF' });
    const count = q('.j-count span')[0] as HTMLElement;
    const n = { v: 0 };

    const tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: j,
        start: 'top top',
        end: () => '+=' + Math.round(innerHeight * (phone ? 3.4 : 3.2)),
        pin: true,
        scrub: 0.5,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    });
    tl.set({}, {}, 100); // the film is 100 units long; positions below are % of the pinned scroll

    // act 1 · lift off: title leaves, photo shrinks to a window, the map comes up
    tl.to(q('.j-title, .j-coord'), { autoAlpha: 0, y: -36, filter: 'blur(8px)', duration: 9 }, 3);
    tl.fromTo(q('.j-photo img'), { scale: 1.08 }, { scale: 1, duration: 9 }, 0);
    tl.fromTo(q('.j-photo'), { clipPath: full }, { clipPath: win, duration: 12, ease: 'glide' }, 8);
    tl.fromTo(pic, { scale: 1, x: 0, y: 0 }, {
      scale: sc, x: () => cx * innerWidth - (sc * innerWidth) / 2, y: () => cy * stage.clientHeight - (sc * stage.clientHeight) / 2,
      duration: 12, ease: 'glide',
    }, 8);
    tl.to(nav, { '--nav-fg': '#2A2826', duration: 10 }, 8);
    tl.to(j, { '--nav-fg-skip': '#2A2826', duration: 10 }, 8);
    tl.fromTo(q('.j-map'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 8 }, 10);
    tl.fromTo(q('.j-rail'), { opacity: 0 }, { opacity: 1, duration: 3 }, 12);
    tl.fromTo(q('.j-rail i'), { scaleY: 0 }, { scaleY: 1, duration: 58 }, 14);

    // act 2 · the crossing
    pin(tl, m('.jp-wn'), 16);
    cap(tl, q('.j-cap.c1'), 17, 29);
    cap(tl, q('.j-cap.c2'), 31, 42);
    tl.to(m('.jr-rts'), { strokeDashoffset: 0, duration: 20 }, 22);
    pin(tl, m('.jp-bc'), 41);
    cap(tl, q('.j-cap.c3'), 44, 50);
    tl.to(m('.jr-walk'), { opacity: 1, duration: 4 }, 44);
    pin(tl, m('.jp-ciq'), 46);

    // act 3 · the last 650 m, counted by the scroll
    tl.to(m('.jr-bridge'), { strokeDashoffset: 0, duration: 14 }, 50);
    tl.to(m('.jb-lbl'), { opacity: 1, duration: 4 }, 50);
    cap(tl, q('.j-cap.c4'), 51, 64);
    tl.fromTo(n, { v: 0 }, { v: 650, duration: 13, onUpdate: () => { count.textContent = String(Math.round(n.v)); } }, 51);

    // act 4 · home
    pin(tl, m('.jp-mall'), 63);
    tl.to(m('.jr-mall'), { strokeDashoffset: 0, duration: 4 }, 66);
    cap(tl, q('.j-cap.c5'), 66, 75);
    pin(tl, m('.jp-home'), 69);

    // act 5 · your home: the photo opens again, the plan card wipes in
    tl.to(q('.j-map'), { autoAlpha: 0, duration: 10 }, 76);
    tl.to(q('.j-rail'), { opacity: 0, duration: 4 }, 74);
    tl.to(q('.j-photo'), { clipPath: full, duration: 13, ease: 'glide' }, 73);
    tl.to(pic, { scale: 1, x: 0, y: 0, duration: 13, ease: 'glide' }, 73);
    tl.to(q('.j-photo img'), { scale: 1.06, duration: 14 }, 86);
    tl.to(nav, { '--nav-fg': '#FFFFFF', duration: 10 }, 74);
    tl.to(j, { '--nav-fg-skip': '#FFFFFF', duration: 10 }, 74);
    tl.to(q('.j-plan'), { autoAlpha: 1, x: 0, clipPath: 'inset(0% 0% 0% 0% round 18px)', duration: 10, ease: 'silk' }, 86);

    return () => {
      gsap.set([nav], { clearProps: '--nav-fg' });
      count.textContent = '650';
    };
  });
}

function pin(tl: gsap.core.Timeline, el: Element[], at: number) {
  tl.to(el, { opacity: 1, scale: 1, duration: 4, ease: 'back.out(1.7)' }, at);
}
function cap(tl: gsap.core.Timeline, el: Element[], inAt: number, outAt: number) {
  tl.to(el, { autoAlpha: 1, y: 0, duration: 4, ease: 'silk' }, inAt);
  tl.to(el, { autoAlpha: 0, y: -12, duration: 3 }, outAt);
}

/** Photo heroes (home, Causewayz Square): the title rises away and the photo drifts slower than the page. */
function pageHero() {
  const h = document.querySelector<HTMLElement>('.phero');
  if (!h) return;
  const q = gsap.utils.selector(h);
  gsap.from(q('.in > *'), { autoAlpha: 0, y: 30, filter: 'blur(6px)', duration: 1.4, ease: 'silk', stagger: 0.09, delay: 0.15 });
  gsap.from(q('.facts, .j-mfacts'), { autoAlpha: 0, y: 24, duration: 1.2, ease: 'silk', delay: 0.5 });
  gsap.fromTo(q('.bg'), { yPercent: 0, scale: 1.04 }, { yPercent: 12, scale: 1, ease: 'none', scrollTrigger: { trigger: h, start: 'top top', end: 'bottom top', scrub: true } });
  gsap.to(q('.in'), { y: -60, autoAlpha: 0, ease: 'none', scrollTrigger: { trigger: h, start: 'top top', end: '55% top', scrub: true } });
}

function reveals() {
  for (const el of gsap.utils.toArray<HTMLElement>('.rv')) {
    gsap.from(el, { autoAlpha: 0, y: 26, filter: 'blur(6px)', duration: 1.2, ease: 'silk', scrollTrigger: { trigger: el, start: 'top 88%', once: true } });
  }
}

/** Images open like a curtain and settle from 108 % to 100 %. */
function curtains() {
  for (const el of gsap.utils.toArray<HTMLElement>('.rv-img')) {
    const img = el.querySelector('img');
    const st = { trigger: el, start: 'top 90%', once: true };
    gsap.fromTo(el, { clipPath: 'inset(12% 8% 12% 8% round 18px)' }, { clipPath: 'inset(0% 0% 0% 0% round 14px)', duration: 1.5, ease: 'silk', scrollTrigger: st });
    if (img) gsap.fromTo(img, { scale: 1.12 }, { scale: 1, duration: 1.8, ease: 'silk', scrollTrigger: st });
  }
}

/** Full-bleed bands: the photo moves at ~85 % of the scroll (half that on phones). */
function parallax() {
  const amp = matchMedia(PHONE).matches ? 4 : 8;
  for (const el of gsap.utils.toArray<HTMLElement>('.px')) {
    const layer = el.querySelector('.layer');
    if (!layer) continue;
    gsap.fromTo(layer, { yPercent: -amp }, { yPercent: amp, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } });
  }
}

/** Location melts from ivory to black as it scrolls in, instead of a hard edge. */
function morph() {
  for (const el of gsap.utils.toArray<HTMLElement>('.morph')) {
    gsap.fromTo(el, { backgroundColor: '#F6F1E9', color: '#2A2826' }, { backgroundColor: '#141312', color: '#F3EEE6', ease: 'none', scrollTrigger: { trigger: el, start: 'top 95%', end: 'top 35%', scrub: true } });
  }
}

/** Figures count up once, in the silk easing. */
function counters() {
  for (const el of gsap.utils.toArray<HTMLElement>('[data-count]')) {
    const to = Number(el.dataset.count);
    const suffix = el.textContent!.replace(/^[\d,.\s]+/, (s) => (s.endsWith(' ') ? ' ' : ''));
    const o = { v: 0 };
    el.textContent = '0' + suffix;
    gsap.to(o, { v: to, duration: 1.8, ease: 'silk', scrollTrigger: { trigger: el, start: 'top 90%', once: true }, onUpdate: () => { el.textContent = nf.format(Math.round(o.v)) + suffix; } });
  }
}

export { gsap, ScrollTrigger };
