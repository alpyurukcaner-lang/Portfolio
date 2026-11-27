{
const d = document;
const root = d.documentElement;
const calm = matchMedia('(prefers-reduced-motion: reduce)');
const fine = matchMedia('(hover: hover) and (pointer: fine)');
const conn = navigator.connection;
/* version légère : mouvement réduit, économie de données ou petit processeur */
const lite = calm.matches || !!(conn && conn.saveData) || (navigator.hardwareConcurrency || 8) < 4;
const $ = (s, c = d) => c.querySelector(s);
const $$ = (s, c = d) => [...c.querySelectorAll(s)];
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

/* ---------- anciennes adresses de la page unique : #ac-…, #bc1, #annee2… ---------- */
const old = $('#old-anchors');
if (old) {
  const go = () => {
    if (location.hash.length < 2) return;
    const to = JSON.parse(old.textContent)[decodeURIComponent(location.hash.slice(1))];
    if (to) location.replace(to);
  };
  go();
  addEventListener('hashchange', go);
}

/* ---------- en-tête, menu mobile ---------- */
const topBar = $('.top');
const menu = $('.menu');
const sheet = $('#sheet');
const onScroll = () => topBar.classList.toggle('solid', scrollY > 8);
addEventListener('scroll', onScroll, {passive: true});
onScroll();
const setMenu = open => {
  d.body.classList.toggle('open', open);
  menu.setAttribute('aria-expanded', String(open));
  menu.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
  sheet.hidden = !open;
  for (const el of $$('main, .foot')) el.inert = open;
  if (open) $('a', sheet).focus();
};
menu.addEventListener('click', () => setMenu(!d.body.classList.contains('open')));
sheet.addEventListener('click', e => { if (e.target.closest('a')) setMenu(false); });
addEventListener('keydown', e => {
  if (e.key === 'Escape' && d.body.classList.contains('open')) { setMenu(false); menu.focus(); }
});
matchMedia('(min-width: 981px)').addEventListener('change', e => { if (e.matches) setMenu(false); });

/* ---------- stories à la une (accueil), comme sur Instagram ---------- */
{
const dlg = $('#story');
if (dlg && typeof dlg.showModal === 'function') {
  const DUR = 6500;
  const auto = !calm.matches;
  const bars = $('.st-bars', dlg), box = $('.st-slides', dlg), title = $('#st-title'), live = $('.st-live', dlg);
  const pauseBtn = $('.st-pause', dlg), frame = $('.st-frame', dlg);
  let slides = [], i = 0, t0 = 0, elapsed = 0, raf = 0, paused = false, held = false, downT = 0, longPress = false;
  const KEY = 'ca-stories-vues';
  const seen = (() => { try { return new Set(JSON.parse(localStorage.getItem(KEY) || '[]')); } catch (e) { return new Set(); } })();
  const markSeen = id => {
    seen.add(id);
    try { localStorage.setItem(KEY, JSON.stringify([...seen])); } catch (e) { /* stockage indisponible : sans effet */ }
    for (const a of $$(`.igl[data-story="${id}"]`)) a.classList.add('seen');
  };
  for (const a of $$('.igl[data-story]')) if (seen.has(a.dataset.story)) a.classList.add('seen');
  const fill = (k, f) => { const b = bars.children[k]; if (b) b.firstElementChild.style.transform = `scaleX(${f})`; };
  const show = k => {
    i = clamp(k, 0, slides.length - 1);
    slides.forEach((sl, n) => { sl.hidden = n !== i; fill(n, n < i ? 1 : 0); });
    if (!auto) fill(i, 1);
    live.textContent = `Diapositive ${i + 1} sur ${slides.length}`;
    elapsed = 0;
    t0 = performance.now();
  };
  const next = () => { if (i < slides.length - 1) show(i + 1); else dlg.close(); };
  const prev = () => show(i - 1);
  const tick = now => {
    if (!dlg.open) return;
    if (auto && !paused && !held && !d.hidden) {
      elapsed += now - t0;
      fill(i, Math.min(1, elapsed / DUR));
      if (elapsed >= DUR) next();
    }
    t0 = now;
    raf = requestAnimationFrame(tick);
  };
  const setPause = p => {
    paused = p;
    pauseBtn.setAttribute('aria-pressed', String(p));
    pauseBtn.setAttribute('aria-label', p ? 'Reprendre' : 'Mettre en pause');
  };
  const open = id => {
    const tpl = $(`#st-${id}`);
    if (!tpl) return false;
    box.replaceChildren(tpl.content.cloneNode(true));
    slides = $$('.sty', box);
    bars.replaceChildren(...slides.map(() => { const b = d.createElement('span'); b.append(d.createElement('i')); return b; }));
    title.textContent = tpl.dataset.label;
    dlg.dataset.k = id;
    setPause(false);
    root.classList.add('st-open');
    dlg.showModal();
    show(0);
    cancelAnimationFrame(raf);
    t0 = performance.now();
    raf = requestAnimationFrame(tick);
    markSeen(id);
    return true;
  };
  for (const a of $$('.igl[data-story]')) {
    a.setAttribute('aria-haspopup', 'dialog');
    a.addEventListener('click', e => {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button) return;
      if (open(a.dataset.story)) e.preventDefault();
    });
  }
  /* appui long : pause, comme sur Instagram ; un simple toucher passe à la suite */
  frame.addEventListener('pointerdown', e => { if (!e.target.closest('a, .st-head button')) { held = true; downT = performance.now(); } });
  const release = () => { if (held) longPress = performance.now() - downT > 350; held = false; };
  addEventListener('pointerup', release);
  addEventListener('pointercancel', release);
  const nav = f => () => { if (longPress) { longPress = false; return; } f(); };
  $('.st-next', dlg).addEventListener('click', nav(next));
  $('.st-prev', dlg).addEventListener('click', nav(prev));
  $('.st-close', dlg).addEventListener('click', () => dlg.close());
  pauseBtn.addEventListener('click', () => setPause(!paused));
  dlg.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') { e.preventDefault(); next(); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); prev(); }
  });
  dlg.addEventListener('click', e => { if (e.target === dlg) dlg.close(); });
  dlg.addEventListener('close', () => { cancelAnimationFrame(raf); root.classList.remove('st-open'); box.replaceChildren(); });
}
}

/* ---------- apparitions au défilement ---------- */
const revealer = new IntersectionObserver(entries => {
  for (const e of entries) {
    if (!e.isIntersecting) continue;
    e.target.classList.remove('pre');
    e.target.classList.add('in');
    revealer.unobserve(e.target);
  }
}, {rootMargin: '0px 0px -8% 0px'});
{
  const els = $$('[data-r]');
  if (calm.matches) for (const el of els) el.classList.add('in');
  else {
    const below = els.map(el => el.getBoundingClientRect().top > innerHeight * 0.92);
    els.forEach((el, i) => { if (below[i]) el.classList.add('rv', 'pre'); revealer.observe(el); });
  }
}

/* ---------- boutons magnétiques ---------- */
if (fine.matches && !lite) {
  for (const b of $$('.mag')) {
    b.addEventListener('pointermove', e => {
      const r = b.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top - r.height / 2;
      b.style.transform = `translate(${(x * 0.16).toFixed(1)}px,${(y * 0.26).toFixed(1)}px)`;
    });
    b.addEventListener('pointerleave', () => { b.style.transform = ''; });
  }
}

/* ---------- surbrillance d'un apprentissage visé par l'adresse ---------- */
let hitTimer = 0;
const flash = el => {
  for (const x of $$('.acs li.hit')) x.classList.remove('hit');
  void el.offsetWidth;
  el.classList.add('hit');
  clearTimeout(hitTimer);
  hitTimer = setTimeout(() => el.classList.remove('hit'), 2600);
};
if (location.hash.startsWith('#ac-')) {
  const el = d.getElementById(location.hash.slice(1));
  if (el) addEventListener('load', () => flash(el));
}

/* ---------- référentiel : filtre, recherche, accès direct ---------- */
const q = $('#q');
if (q) {
  const norm = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const items = $$('.reflist .acs li').map(li => ({li, y: li.dataset.y, t: null, ok: true}));
  const byId = new Map(items.map(o => [o.li.id, o]));
  const tiles = $$('.mx .t');
  const lvls = $$('.reflist .lvl');
  const none = $('.reflist .none');
  const btns = $$('.fl .seg button');
  const count = $('#count');
  let year = 'all';
  const apply = () => {
    const term = norm(q.value.trim());
    let n = 0;
    for (const o of items) {
      if (term && o.t === null) o.t = norm(o.li.textContent);
      o.ok = (year === 'all' || o.y === year) && (!term || o.t.includes(term));
      o.li.hidden = !o.ok;
      if (o.ok) n++;
    }
    for (const t of tiles) { const o = byId.get(t.dataset.ac); t.classList.toggle('dim', !o || !o.ok); }
    for (const l of lvls) l.hidden = !l.querySelector('li:not([hidden])');
    none.hidden = n > 0;
    count.textContent = n === items.length ? 'Les 64 apprentissages sont affichés.' : `${n} sur ${items.length} apprentissages affichés.`;
  };
  const setYear = y => { year = y; for (const b of btns) b.setAttribute('aria-pressed', String(b.dataset.y === y)); };
  for (const b of btns) b.addEventListener('click', () => { setYear(b.dataset.y); apply(); });
  q.addEventListener('input', apply);
  const goTo = id => {
    const o = byId.get(id);
    if (!o) return;
    if (!o.ok) { setYear('all'); q.value = ''; apply(); }
    flash(o.li);
    o.li.scrollIntoView({behavior: calm.matches ? 'auto' : 'smooth', block: 'center'});
    try { history.replaceState(null, '', '#' + id); } catch (err) { /* cadre sans historique */ }
  };
  for (const t of tiles) t.addEventListener('click', () => goTo(t.dataset.ac));
}

/* ---------- projets : filtres par année et par domaine ---------- */
const pfl = $('.pfl');
if (pfl) {
  const cards = $$('.pcard, .ocard');
  const ys = $$('[data-f=year]', pfl);
  const ds = $$('[data-f=dom]', pfl);
  const count = $('#pcount');
  const none = $('main .none');
  let year = 'all';
  const doms = new Set();
  const apply = () => {
    let n = 0;
    for (const c of cards) {
      const okY = year === 'all' || c.dataset.year === year;
      const okD = !doms.size || c.dataset.dom.split(' ').some(x => doms.has(x));
      const was = c.hidden;
      c.hidden = !(okY && okD);
      if (!c.hidden) {
        n++;
        if (was && !calm.matches && c.animate) c.animate([{opacity: 0, transform: 'translateY(10px)'}, {opacity: 1, transform: 'none'}], {duration: 420, easing: 'cubic-bezier(.2,.7,.1,1)'});
      }
    }
    for (const h of $$('main .h2s')) {
      const grid = h.nextElementSibling;
      if (grid) h.hidden = !grid.querySelector(':scope > :not([hidden])');
    }
    none.hidden = n > 0;
    count.textContent = n === cards.length ? `Les ${cards.length} projets sont affichés.` : `${n} sur ${cards.length} projets affichés.`;
  };
  for (const b of ys) b.addEventListener('click', () => {
    year = b.dataset.v;
    for (const x of ys) x.setAttribute('aria-pressed', String(x === b));
    apply();
  });
  for (const b of ds) b.addEventListener('click', () => {
    const on = b.getAttribute('aria-pressed') !== 'true';
    b.setAttribute('aria-pressed', String(on));
    if (on) doms.add(b.dataset.v); else doms.delete(b.dataset.v);
    apply();
  });
}

/* ---------- chronologie : un trait qui se remplit au défilement ---------- */
for (const chrono of $$('.chrono, .xwrap')) {
  const bar = $('.cline i', chrono);
  const steps = $$('.cstep, .xstep', chrono);
  const upd = () => {
    const r = chrono.getBoundingClientRect();
    const mark = innerHeight * 0.62;
    bar.style.transform = `scaleY(${clamp((mark - r.top) / r.height, 0, 1).toFixed(4)})`;
    for (const s of steps) s.classList.toggle('on', s.getBoundingClientRect().top < mark);
  };
  addEventListener('scroll', upd, {passive: true});
  addEventListener('resize', upd);
  upd();
}

/* ---------- la maquette en volume (version vectorielle, remplacée par la 3D quand elle est disponible) ---------- */
const svg = $('#maquette');
const dataEl = $('#mq-data');
if (svg && dataEl) {
  const D = JSON.parse(dataEl.textContent);
  const fig = svg.closest('.scene');
  const box = $('.mbox', fig);
  const hero = $('.hero');
  const tip = $('#tip');
  const groups = $$('.m', svg);
  const slabEls = $$('.slab', svg).map(g => ({t: $('.slab-t', g), f: $('.slab-f', g), s: $('.slab-s', g)}));
  const lotEls = $$('.lot', svg);
  const lblEls = $$('.lbl', box);
  const layer = $('.mods', svg);
  const intro = !lite;
  const mods = D.mods.map((m, k) => ({...m, k, g: groups[k], top: $('.rf', groups[k]), front: $('.fw', groups[k]), side: $('.sw', groups[k]),
    grow: intro ? 0 : 1, lift: 0, liftTo: 0, delay: (m.y - 1) * 0.28 + m.slot * 0.035 + m.row * 0.025}));
  const [vx, vy, vw, vh] = D.vb;
  let th = D.th, ph = D.ph, thTo = D.th, phTo = D.ph, scrollTh = 0;
  let t0 = 0, running = false, visible = true, hovered = null, order = '', off = false;
  const ease = x => 1 - (1 - x) ** 3;
  const pts = arr => arr.map(p => p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' ');
  const toBox = p => [((p[0] - vx) / vw) * 100, ((p[1] - vy) / vh) * 100];
  const render = () => {
    const a = clamp(th + scrollTh, D.th + D.thr[0], D.th + D.thr[1]);
    const ct = Math.cos(a), st = Math.sin(a), cp = Math.cos(ph), sp = Math.sin(ph);
    const P = (x, y, z) => {
      const dx = x - D.cx, dz = z - D.cz;
      const xr = dx * ct - dz * st, zr = dx * st + dz * ct;
      return [xr * D.S, (zr * sp - y * cp) * D.S, zr];
    };
    const right = st >= 0;
    D.slabs.forEach((s, k) => {
      const e = slabEls[k], b = -D.slabT, sx = right ? s.x1 : s.x0;
      e.t.setAttribute('points', pts([P(s.x0, 0, s.z0), P(s.x1, 0, s.z0), P(s.x1, 0, s.z1), P(s.x0, 0, s.z1)]));
      e.f.setAttribute('points', pts([P(s.x0, b, s.z1), P(s.x1, b, s.z1), P(s.x1, 0, s.z1), P(s.x0, 0, s.z1)]));
      e.s.setAttribute('points', pts([P(sx, b, s.z0), P(sx, b, s.z1), P(sx, 0, s.z1), P(sx, 0, s.z0)]));
    });
    D.lots.forEach((l, k) => {
      lotEls[k].setAttribute('points', pts([P(l.x0, 0, l.z0), P(l.x1, 0, l.z0), P(l.x1, 0, l.z1), P(l.x0, 0, l.z1)]));
    });
    const w = D.w;
    for (const m of mods) {
      const b = m.lift, t = b + Math.max(0.002, m.h * ease(clamp(m.grow, 0, 1)));
      const x0 = m.x, z0 = m.z, x1 = x0 + w, z1 = z0 + w, sx = right ? x1 : x0;
      m.top.setAttribute('points', pts([P(x0, t, z0), P(x1, t, z0), P(x1, t, z1), P(x0, t, z1)]));
      m.front.setAttribute('points', pts([P(x0, b, z1), P(x1, b, z1), P(x1, t, z1), P(x0, t, z1)]));
      m.side.setAttribute('points', pts([P(sx, b, z0), P(sx, b, z1), P(sx, t, z1), P(sx, t, z0)]));
      m.depth = P(x0 + w / 2, 0, z0 + w / 2)[2];
    }
    const sorted = [...mods].sort((p, r) => p.depth - r.depth);
    const key = sorted.map(m => m.k).join(',');
    if (key !== order) { order = key; for (const m of sorted) layer.appendChild(m.g); }
    D.labels.forEach((l, k) => {
      const [lx, ly] = toBox(P(l.x, 0, l.z));
      lblEls[k].style.left = lx.toFixed(2) + '%';
      lblEls[k].style.top = ly.toFixed(2) + '%';
    });
    if (hovered) {
      const m = hovered, [tx, ty] = toBox(P(m.x + w / 2, m.h + m.lift, m.z + w / 2));
      tip.style.left = tx.toFixed(2) + '%';
      tip.style.top = ty.toFixed(2) + '%';
    }
  };
  const step = now => {
    if (!t0) t0 = now;
    const el = (now - t0) / 1000;
    let busy = false;
    th += (thTo - th) * 0.08;
    ph += (phTo - ph) * 0.08;
    if (Math.abs(thTo - th) > 0.0005 || Math.abs(phTo - ph) > 0.0005) busy = true;
    for (const m of mods) {
      if (m.grow < 1) { m.grow = clamp((el - m.delay) / 0.65, 0, 1); busy = true; }
      if (Math.abs(m.liftTo - m.lift) > 0.002) { m.lift += (m.liftTo - m.lift) * 0.2; busy = true; } else m.lift = m.liftTo;
    }
    render();
    if (busy && visible && !off) requestAnimationFrame(step); else running = false;
  };
  const kick = () => { if (!running && visible && !off) { running = true; requestAnimationFrame(step); } };
  new IntersectionObserver(es => { visible = es[0].isIntersecting; if (visible) kick(); }).observe(box);
  if (!lite && fine.matches) {
    hero.addEventListener('pointermove', e => {
      const r = hero.getBoundingClientRect();
      const u = clamp((e.clientX - r.left) / r.width, 0, 1), v = clamp((e.clientY - r.top) / r.height, 0, 1);
      thTo = D.th + D.thr[0] / 2 + u * (D.thr[1] - D.thr[0] / 2);
      phTo = D.ph + D.phr[0] + (1 - v) * (D.phr[1] - D.phr[0]);
      kick();
    });
    hero.addEventListener('pointerleave', () => { thTo = D.th; phTo = D.ph; kick(); });
  }
  if (!lite) {
    addEventListener('scroll', () => {
      if (!visible || off) return;
      const r = hero.getBoundingClientRect();
      scrollTh = clamp(-r.top / r.height, 0, 1) * D.thr[0] / 2;
      kick();
    }, {passive: true});
  }
  const show = m => {
    if (off) return;
    if (hovered && hovered !== m) { hovered.liftTo = 0; hovered.g.classList.remove('on'); }
    hovered = m;
    m.liftTo = lite ? 0 : D.lift;
    m.g.classList.add('on');
    tip.textContent = '';
    const b = d.createElement('b');
    b.textContent = m.code + ', BUT ' + m.y;
    tip.append(b, d.createTextNode(m.label));
    tip.hidden = false;
    render();
    kick();
  };
  const hide = m => {
    if (hovered !== m) return;
    m.liftTo = 0;
    m.g.classList.remove('on');
    hovered = null;
    tip.hidden = true;
    kick();
  };
  for (const m of mods) {
    m.g.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse') show(m); });
    m.g.addEventListener('pointerleave', () => hide(m));
    m.g.addEventListener('click', () => { if (!off && m.url) location.href = m.url; });
  }
  /* la scène 3D prend le relais : la version vectorielle s'arrête */
  fig.addEventListener('scene-live', () => { off = true; if (hovered) hide(hovered); });
  render();
  if (intro) kick();
}
root.classList.add('ready');

/* ---------- scènes 3D : chargées seulement si utiles, quand elles approchent de l'écran ---------- */
const scenes = $$('.scene[data-scene]');
const webgl = () => {
  try { const c = d.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')); } catch (err) { return false; }
};
/* ?3d ou ?poster forcent les scènes, pour les tests et pour produire les images de repli */
const force = /[?&](3d|poster)\b/.test(location.search);
if (scenes.length && (force || !lite) && webgl()) {
  const src = scenes[0].dataset.js;
  let started = false;
  const start = () => {
    if (started) return;
    started = true;
    import(new URL(src, d.baseURI).href).then(m => m.boot(scenes, {fine: fine.matches})).catch(err => { console.warn('Scènes 3D indisponibles', err); });
  };
  const whenIdle = fn => {
    const go = () => ('requestIdleCallback' in window ? requestIdleCallback(fn, {timeout: 1200}) : setTimeout(fn, 300));
    if (d.readyState === 'complete') go(); else addEventListener('load', go, {once: true});
  };
  const io = new IntersectionObserver(es => {
    if (es.some(e => e.isIntersecting)) { io.disconnect(); whenIdle(start); }
  }, {rootMargin: '300px 0px'});
  for (const s of scenes) io.observe(s);
}

/* ---------- maquette : changer de disposition ---------- */
const morph = $$('[data-morph]');
for (const b of morph) b.addEventListener('click', () => {
  for (const x of morph) x.setAttribute('aria-pressed', String(x === b));
  const fig = $('.scene-model');
  if (fig) fig.dispatchEvent(new CustomEvent('morph', {detail: Number(b.dataset.morph)}));
});

/* ---------- visionneuse des captures ---------- */
const lbx = $('#lbx');
if (lbx && typeof lbx.showModal === 'function') {
  const img = $('img', lbx);
  const cap = $('figcaption', lbx);
  d.addEventListener('click', e => {
    const a = e.target.closest('.shot a, a.zoom');
    if (!a) return;
    e.preventDefault();
    const pic = $('img', a);
    img.src = a.getAttribute('href');
    img.alt = pic ? pic.alt : '';
    const fig = a.closest('figure');
    cap.textContent = a.dataset.cap || (fig && $('figcaption', fig) ? $('figcaption', fig).textContent : img.alt);
    lbx.showModal();
  });
  $('.x', lbx).addEventListener('click', () => lbx.close());
  lbx.addEventListener('click', e => { if (e.target === lbx) lbx.close(); });
  lbx.addEventListener('close', () => { img.removeAttribute('src'); });
}

/* ---------- contact ---------- */
const mailLink = $('.mailto');
const user = mailLink && mailLink.dataset.u, host = mailLink && mailLink.dataset.h;
const to = user && host ? user + '@' + host : '';
if (to) { mailLink.href = 'mailto:' + to; mailLink.textContent = to; }
const cf = $('#cf');
if (cf) {
  const started = Date.now();
  const done = $('#cf-done');
  const fields = ['cf-nom', 'cf-mail', 'cf-msg'].map(id => $('#' + id));
  const errs = {
    'cf-nom': 'Indiquez votre nom.',
    'cf-mail': 'Indiquez une adresse e-mail valide, par exemple prenom.nom@exemple.fr.',
    'cf-msg': 'Écrivez votre message.'
  };
  let last = '';
  /* la place des messages d'erreur est réservée : rien ne bouge sous le pointeur pendant un clic */
  const check = f => {
    const v = f.value.trim();
    const ok = f.id === 'cf-mail' ? /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) : v.length > 1;
    f.setAttribute('aria-invalid', String(!ok));
    $('#' + f.id + '-e').textContent = ok ? '' : errs[f.id];
    return ok;
  };
  for (const f of fields) {
    f.addEventListener('input', () => { if (f.getAttribute('aria-invalid') === 'true') check(f); });
    f.addEventListener('blur', () => { if (f.value) check(f); });
  }
  cf.addEventListener('submit', e => {
    e.preventDefault();
    if ($('#cf-site').value || Date.now() - started < 2500) return;
    const bad = fields.filter(f => !check(f));
    if (bad.length) { bad[0].focus(); return; }
    const [nom, mail, msg] = fields.map(f => f.value.trim());
    last = msg + '\n\n' + nom + ' (' + mail + ')';
    if (to) location.href = 'mailto:' + to + '?subject=' + encodeURIComponent('Contact depuis le portfolio : ' + nom) + '&body=' + encodeURIComponent(last);
    done.hidden = false;
    done.focus();
  });
  const copy = $('#cf-copy');
  if (copy) copy.addEventListener('click', () => {
    if (!navigator.clipboard) { copy.textContent = 'Copie impossible ici'; return; }
    navigator.clipboard.writeText(last).then(() => { copy.textContent = 'Message copié'; }, () => { copy.textContent = 'Copie impossible ici'; });
  });
}
}
