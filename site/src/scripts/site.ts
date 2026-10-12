// Page behaviour: nav, menu, layouts, plan sheet, contact bar. Motion lives in ./motion.
import { initMotion, motionOn, lenis, gsap } from './motion';

const $ = <T extends Element = HTMLElement>(s: string, r: ParentNode = document) => r.querySelector<T>(s);
const $$ = <T extends Element = HTMLElement>(s: string, r: ParentNode = document) => [...r.querySelectorAll<T>(s)];

/* ── nav: white over the hero photo, ivory once past it; hides while scrolling down ── */
function nav() {
  const el = $('#nav')!;
  const over = el.classList.contains('over');
  const fab = $('.fab');
  const hero = () => $('main')!.firstElementChild as HTMLElement | null;
  let lastY = scrollY;
  let ticking = false;
  const update = () => {
    ticking = false;
    const h = hero();
    const past = h ? h.getBoundingClientRect().bottom <= el.offsetHeight : true;
    if (over) {
      el.classList.toggle('solid', past);
      el.classList.toggle('over', !past);
    } else {
      el.classList.add('solid');
    }
    const y = scrollY;
    const down = y > lastY + 4;
    const up = y < lastY - 4;
    if (past && down && !document.body.classList.contains('menu-open')) el.classList.add('away');
    else if (up || !past) el.classList.remove('away');
    if (down || up) lastY = y;
    fab?.classList.toggle('show', past);
  };
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  addEventListener('resize', update);
  update();
}

/* ── phone menu ── */
function menu() {
  const m = $('#menu');
  const btn = $<HTMLButtonElement>('.menu-btn');
  if (!m || !btn) return;
  const set = (open: boolean) => {
    m.classList.toggle('open', open);
    document.body.classList.toggle('menu-open', open);
    btn.setAttribute('aria-expanded', String(open));
    if (open) { lenis?.stop(); ($('.close', m) as HTMLElement).focus(); } else { lenis?.start(); }
  };
  btn.addEventListener('click', () => set(true));
  $('.close', m)!.addEventListener('click', () => { set(false); btn.focus(); });
  $$('a', m).forEach((a) => a.addEventListener('click', () => set(false)));
  addEventListener('keydown', (e) => { if (e.key === 'Escape' && m.classList.contains('open')) set(false); });
}

/* ── layouts: bedroom tabs, layout chips, plan sheet ── */
function residences() {
  for (const res of $$('[data-res]')) {
    const tabs = $$<HTMLButtonElement>('[role=tab]', res);
    const panels = $$('[data-panel]', res);
    const sheet = $<HTMLDialogElement>('[data-sheet]', res)!;
    let inView = false;
    const enter = (el: HTMLElement) => {
      if (motionOn) gsap.fromTo(el, { autoAlpha: 0, x: 12 }, { autoAlpha: 1, x: 0, duration: 0.45, ease: 'glide' });
    };
    const showUnit = (panel: HTMLElement, key?: string) => {
      const units = $$('.unit', panel);
      const target = units.find((u) => u.dataset.key === key) ?? units.find((u) => !u.hidden) ?? units[0];
      units.forEach((u) => (u.hidden = u !== target));
      enter(target);
      if (inView) contextBar(target);
      return target;
    };
    const selectGroup = (id: string, key?: string, focus = false) => {
      tabs.forEach((t) => {
        const on = t.dataset.group === id;
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
        if (on && focus) t.focus();
      });
      panels.forEach((p) => (p.hidden = p.dataset.panel !== id));
      const panel = panels.find((p) => p.dataset.panel === id)!;
      showUnit(panel, key);
    };
    tabs.forEach((t, i) => {
      t.tabIndex = t.getAttribute('aria-selected') === 'true' ? 0 : -1;
      t.addEventListener('click', () => selectGroup(t.dataset.group!));
      t.addEventListener('keydown', (e) => {
        const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
        if (!d) return;
        e.preventDefault();
        selectGroup(tabs[(i + d + tabs.length) % tabs.length].dataset.group!, undefined, true);
      });
    });
    res.addEventListener('click', (e) => {
      const pick = (e.target as HTMLElement).closest<HTMLButtonElement>('[data-pick]');
      if (pick) {
        const panel = pick.closest<HTMLElement>('[data-panel]')!;
        const u = showUnit(panel, pick.dataset.pick);
        $<HTMLButtonElement>(`[data-pick="${pick.dataset.pick}"]`, u)?.focus({ preventScroll: true });
        return;
      }
      const zoom = (e.target as HTMLElement).closest('[data-zoom]');
      if (zoom) {
        const unit = zoom.closest<HTMLElement>('.unit')!;
        const tpl = $<HTMLTemplateElement>('template[data-large]', unit)!;
        $('[data-pv]', sheet)!.replaceChildren(tpl.content.cloneNode(true));
        const info = $('.info', unit)!.cloneNode(true) as HTMLElement;
        $$('.alts, .alts-l', info).forEach((n) => n.remove());
        $('[data-tx]', sheet)!.replaceChildren(...info.childNodes);
        lenis?.stop();
        sheet.showModal();
      }
    });
    $('[data-close]', sheet)!.addEventListener('click', () => sheet.close());
    sheet.addEventListener('click', (e) => { if (e.target === sheet) sheet.close(); });
    sheet.addEventListener('close', () => lenis?.start());

    // /new-casa-suites/#type-d1 opens that layout
    const deep = /^#type-[\w-]+$/.test(location.hash) ? $<HTMLElement>(location.hash, res) : null;
    if (deep?.classList.contains('unit')) selectGroup(deep.closest<HTMLElement>('[data-panel]')!.dataset.panel!, deep.dataset.key);

    // while the layouts are on screen, the phone bar asks about the layout in view
    new IntersectionObserver(([en]) => {
      inView = en.isIntersecting;
      contextBar(inView ? $$('.unit', res).find((u) => !u.hidden && !u.closest('[hidden]')) : undefined);
    }, { threshold: 0.25 }).observe(res);
  }
}

/* ── phone contact bar: "WhatsApp Joey", or "Ask about Type C" while a layout is in view ── */
const bar = $<HTMLAnchorElement>('[data-wa-ctx]');
const barDefault = bar && { href: bar.href, label: $('.wa-l', bar)!.textContent! };
function contextBar(unit?: HTMLElement) {
  if (!bar || !barDefault) return;
  if (!unit) {
    bar.href = barDefault.href;
    $('.wa-l', bar)!.textContent = barDefault.label;
    return;
  }
  bar.href = `${barDefault.href.split('?')[0]}?text=${encodeURIComponent(unit.dataset.ask + ' (via website)')}`;
  $('.wa-l', bar)!.textContent = unit.dataset.label!;
}

/* ── in-page links: let Lenis glide there on desktop, native smooth scroll elsewhere ── */
function anchors() {
  if (lenis) return; // Lenis handles anchors itself
  document.addEventListener('click', (e) => {
    const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
    if (!a || a.getAttribute('href') === '#') return;
    const t = document.querySelector(a.getAttribute('href')!);
    if (!t) return;
    e.preventDefault();
    t.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    history.replaceState(null, '', a.getAttribute('href'));
  });
}

initMotion();
nav();
menu();
residences();
anchors();
