/* ============================================================
   APP — router + views + GSAP transitions
   ============================================================ */
(function () {
  const app = document.getElementById('app');
  const crumbsEl = document.getElementById('crumbs');
  const REDUCE = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (window.gsap) { try { gsap.registerPlugin(ScrollTrigger, Flip); } catch (e) { } }

  const node = (html) => { const t = document.createElement('div'); t.innerHTML = html.trim(); return t.firstElementChild; };
  const getBuild = (id) => BUILDS.find(b => b.id === id) || BUILDS[0];
  const statusClass = (k) => ({ active: 'active', done: 'done', current: 'current', planned: 'planned' }[k] || 'planned');
  // real photos: fill mode (cards/hero/models) and inline mode (guide pages)
  const imgFill = (src, alt) => `<div class="photo-fill"><img src="${encodeURI(src)}" alt="${(alt || '').replace(/"/g, '&quot;')}" decoding="async"></div>`;
  const imgInline = (src, alt) => `<div class="photo-inline"><img src="${encodeURI(src)}" alt="${(alt || '').replace(/"/g, '&quot;')}" decoding="async"></div>`;

  /* ---------------- ROUTER ---------------- */
  function parseRoute() {
    const raw = location.hash.replace(/^#\/?/, '').split('/').filter(Boolean);
    if (raw[0] !== 'build') return { view: 'landing' };
    return { view: raw[2] || 'hub', id: raw[1] };
  }

  let pendingFlip = null; // {rect, build} captured on a card click

  window.addEventListener('hashchange', render);
  window.addEventListener('DOMContentLoaded', render);

  function render() {
    const r = parseRoute();
    if (activeBook) { activeBook.destroy && activeBook.destroy(); activeBook = null; }
    if (window.ScrollTrigger) ScrollTrigger.getAll().forEach(s => s.kill());
    setCrumbs(r);
    if (r.view === 'landing') return renderLanding();
    const build = getBuild(r.id);
    if (r.view === 'guide') return renderGuide(build);
    if (r.view === 'parts') return swapSubpage(() => renderParts(build));
    if (r.view === 'models') return swapSubpage(() => renderModels(build));
    if (r.view === 'software') return swapSubpage(() => renderSoftware(build));
    return renderHub(build);
  }

  function setCrumbs(r) {
    if (r.view === 'landing') { crumbsEl.innerHTML = ''; return; }
    const b = getBuild(r.id);
    let html = '<a href="#/" data-link>Home</a><span class="sep">/</span>';
    if (r.view === 'hub') html += '<span class="here">' + b.name + '</span>';
    else html += '<a href="#/build/' + b.id + '" data-link>' + b.name + '</a><span class="sep">/</span><span class="here">' + r.view + '</span>';
    crumbsEl.innerHTML = html;
  }

  /* generic subpage swap with a soft fade — MUST run entrance() so the
     .reveal elements (cost bar, parts rows, cards) actually become visible.
     Mount is also guarded by a timer so a paused rAF can never leave it blank. */
  function swapSubpage(build) {
    const out = app.firstElementChild;
    let mounted = false;
    const mountNew = () => { if (mounted) return; mounted = true; app.innerHTML = ''; const v = build(); app.appendChild(v); window.scrollTo(0, 0); entrance(v); };
    if (REDUCE || !window.gsap || !out) { mountNew(); return; }
    gsap.to(out, { opacity: 0, y: 10, duration: 0.18, onComplete: mountNew });
    setTimeout(mountNew, 260);
  }

  /* ============================================================
     LANDING
     ============================================================ */
  function renderLanding() {
    const cards = BUILDS.map((b, i) => `
      <button class="card reveal" data-build="${b.id}" style="--i:${i}">
        <div class="card__media">
          ${b.heroImage ? imgFill(b.heroImage, b.name) : DIAGRAMS.placeholder(b.heroPlaceholder.tag, b.heroPlaceholder.sub)}
          ${traceOverlay()}
          <span class="badge badge--${statusClass(b.statusKind)} card__badge">${b.status}</span>
        </div>
        <div class="card__body">
          <h3 class="card__name">${b.name}</h3>
          <p class="card__tag">${b.tagline}</p>
          <div class="card__foot">
            <span>${b.year} · ${b.location}</span>
            <span class="card__go">Open build ${UI.arrowR}</span>
          </div>
        </div>
      </button>`).join('');

    const ghost = `
      <div class="card card--ghost reveal" style="--i:${BUILDS.length}">
        <div>
          <div class="ghost__plus">+</div>
          <p>Build 0${BUILDS.length + 1}</p>
          <small>Slot's ready — a new build is just another data block.</small>
        </div>
      </div>`;

    const view = node(`
      <div class="view landing">
        <div class="wrap">
          <div class="landing__hero">
            <div class="hero-credo reveal">
              <span class="hero-credo__tag">Rule #1</span>
              <span>Optimize for one thing — <em>finishing the project.</em></span>
            </div>
            <span class="eyebrow reveal">Easy Robotics, documented step by step</span>
            <h1 class="reveal"> My <em>Builds.</em></h1>
            <p class="landing__lede reveal">A logbook/guide for anyone trying to do something cool for the weekend. Made it super easy and basic so that anyone can build it, just like Lego :P.</p>
            <div class="landing__stats reveal">
              <span class="landing__stat"><strong>${BUILDS.length}</strong>live build${BUILDS.length > 1 ? 's' : ''}</span>
              <span class="landing__stat"><strong>${guideStepCount(BUILDS[0])}</strong>guide steps</span>
              <span class="landing__stat"><strong>${BUILDS[0].models.length}</strong>build parts</span>
            </div>
          </div>
          <div class="section-label reveal">The builds</div>
          <div class="builds-grid">${cards}${ghost}</div>
        </div>
        ${manifesto()}
        ${footer()}
      </div>`);

    mount(view);

    view.querySelectorAll('.card[data-build]').forEach(card => {
      card.addEventListener('click', () => openBuildFromCard(card));
    });

    entrance(view);
  }

  function openBuildFromCard(card) {
    const id = card.dataset.build;
    const media = card.querySelector('.card__media');
    if (REDUCE || !window.gsap || !media) { location.hash = '#/build/' + id; return; }
    const first = media.getBoundingClientRect();
    const clone = media.cloneNode(true);
    Object.assign(clone.style, {
      position: 'fixed', left: first.left + 'px', top: first.top + 'px',
      width: first.width + 'px', height: first.height + 'px', margin: 0, zIndex: 90,
      borderRadius: '6px', overflow: 'hidden', boxShadow: 'var(--shadow-lift)',
    });
    document.body.appendChild(clone);
    pendingFlip = { clone, first, id };
    location.hash = '#/build/' + id; // triggers renderHub, which finishes the morph
  }

  /* ============================================================
     BUILD HUB
     ============================================================ */
  function renderHub(b) {
    const tiles = [
      { k: 'guide', num: '01', name: 'Guide', desc: 'The page-flip field manual — every step.' },
      { k: 'parts', num: '02', name: 'Parts List', desc: 'Full BOM, grouped, with running cost.' },
      { k: 'models', num: '03', name: 'The Rig', desc: 'The real parts up close — base, face, full build.' },
      { k: 'software', num: '04', name: 'Software', desc: 'Repo, file map, and current focus.' },
    ].map(t => `
      <a class="tile reveal" href="#/build/${b.id}/${t.k}" data-link>
        <div class="tile__pins">${'<span></span>'.repeat(8)}</div>
        <div class="tile__icon">${TILE_ICONS[t.k]}</div>
        <div class="tile__num">ENTRY ${t.num}</div>
        <div class="tile__name">${t.name}</div>
        <div class="tile__desc">${t.desc}</div>
        <span class="tile__corner">${UI.arrowR}</span>
      </a>`).join('');

    const chain = b.systemChain.map((n, i) =>
      `<span class="chain__node">${n}</span>` + (i < b.systemChain.length - 1 ? '<span class="chain__arrow">→</span>' : '')
    ).join('');

    const view = node(`
      <div class="view hub">
        <div class="wrap">
          <div class="hub__hero">
            <div class="hub__hero-grid">
              <div class="hub__hero-text">
                <span class="badge badge--${statusClass(b.statusKind)}" style="align-self:flex-start">${b.status}</span>
                <h1>${b.name}</h1>
                <p class="hub__tagline">${b.lede}</p>
                <div class="chain">${chain}</div>
                <div class="hub__specs">
                  ${b.specs.map(s => `<span class="hub__spec"><strong>${s.k}:</strong> ${s.v}</span>`).join('')}
                </div>
              </div>
              <div class="hub__hero-media" data-hero-media>
                ${b.heroImage ? imgFill(b.heroImage, b.name) : DIAGRAMS.placeholder(b.heroPlaceholder.tag, b.heroPlaceholder.sub)}
                ${traceOverlay()}
              </div>
            </div>
          </div>
          <div class="section-label reveal">Jump in</div>
          <div class="tiles">${tiles}</div>
        </div>
        ${footer()}
      </div>`);

    mount(view);

    // finish the shared-element morph if we arrived from a card
    if (pendingFlip && pendingFlip.id === b.id) {
      const heroMedia = view.querySelector('[data-hero-media]');
      finishFlip(heroMedia);
    } else {
      entrance(view);
    }
  }

  function finishFlip(heroMedia) {
    const { clone, first } = pendingFlip;
    pendingFlip = null;
    heroMedia.style.opacity = '0';
    const last = heroMedia.getBoundingClientRect();
    const dx = last.left - first.left, dy = last.top - first.top;
    const sx = last.width / first.width, sy = last.height / first.height;
    let morphed = false;
    const endMorph = () => { if (morphed) return; morphed = true; heroMedia.style.opacity = '1'; clone.remove(); };
    gsap.to(clone, {
      x: dx, y: dy, scaleX: sx, scaleY: sy, transformOrigin: 'top left',
      borderRadius: '0px', duration: 0.62, ease: 'power3.inOut', onComplete: endMorph,
    });
    setTimeout(endMorph, 950); // safety: reveal hero + drop the clone even if rAF stalls
    // reveal the rest of the hub around the morph. Tiles + section label carry
    // the .reveal class (opacity:0), so animate TO visible, not FROM.
    const rest = app.querySelectorAll('.hub__hero-text > *, .tiles .tile, .section-label');
    if (rest.length) gsap.fromTo(rest, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out', stagger: 0.04, delay: 0.15 });
    // safety net (timer-based): never leave the tabs hidden if a tween stalls
    setTimeout(() => rest.forEach(n => { if (getComputedStyle(n).opacity === '0') { n.style.opacity = '1'; n.style.transform = 'none'; } }), 900);
  }

  /* ============================================================
     GUIDE  (the book)
     ============================================================ */
  let activeBook = null;

  function renderGuide(b) {
    const pages = b.guide.pages;
    const chapters = pages.map((p, i) => ({ i, p })).filter(x => x.p.type === 'chapter')
      .map(x => ({ index: x.i, label: x.p.short, kind: x.p.kind, phase: x.p.phase }));

    const view = node(`
      <div class="view guide">
        <div class="wrap">
          <div class="guide__bar">
            <div>
              <span class="eyebrow">${b.name}</span>
              <div class="guide__title">${b.guide.title.replace(/—.*/, '')}<em>${(b.guide.title.match(/—(.*)/) || [, ''])[1]}</em></div>
            </div>
            <a class="btn btn--ghost" href="#/build/${b.id}" data-link>${UI.arrowL} Build hub</a>
          </div>

          <div class="book-stage" id="book-stage"></div>

          <div class="book-controls">
            <button class="book-btn" id="prev" aria-label="Previous page">${UI.arrowL}</button>
            <div class="book-progress">
              <div class="book-count"><b id="pg-cur">1</b> / ${pages.length}</div>
              <div class="book-track"><div class="book-fill" id="pg-fill"></div></div>
            </div>
            <button class="book-btn" id="next" aria-label="Next page">${UI.arrowR}</button>
          </div>

          <div class="book-hint"><span class="keys">drag a corner · tap the curl · </span><kbd>←</kbd> <kbd>→</kbd> to turn</div>

          <div class="chapter-nav" id="chapter-nav">
            ${chapters.map(c => `<button data-jump="${c.index}" class="kind-${c.kind}">${c.phase}</button>`).join('')}
          </div>
        </div>
      </div>`);

    mount(view);

    const stage = view.querySelector('#book-stage');
    const curEl = view.querySelector('#pg-cur');
    const fillEl = view.querySelector('#pg-fill');
    const prevBtn = view.querySelector('#prev');
    const nextBtn = view.querySelector('#next');
    const navBtns = [...view.querySelectorAll('[data-jump]')];

    const book = window.Book.create({
      stage,
      total: pages.length,
      renderPage: (i) => renderBookPage(pages[i], pages.length),
      backing: (i) => backingArt(i, pages.length),
      onChange: (i) => {
        curEl.textContent = i + 1;
        fillEl.style.width = ((i + 1) / pages.length * 100) + '%';
        prevBtn.disabled = i === 0;
        nextBtn.disabled = i === pages.length - 1;
        // active chapter = last divider at or before i
        let act = -1;
        chapters.forEach(c => { if (c.index <= i) act = c.index; });
        navBtns.forEach(btn => btn.classList.toggle('active', +btn.dataset.jump === act));
      },
    });
    activeBook = book;

    prevBtn.addEventListener('click', () => book.prev());
    nextBtn.addEventListener('click', () => book.next());
    navBtns.forEach(btn => btn.addEventListener('click', () => book.jump(+btn.dataset.jump)));

    if (!REDUCE && window.gsap) {
      gsap.from(stage, { opacity: 0, y: 24, scale: 0.97, duration: 0.6, ease: 'power3.out' });
      const ctrls = view.querySelectorAll('.book-controls, .chapter-nav, .guide__bar');
      if (ctrls.length) gsap.from(ctrls, { opacity: 0, y: 12, duration: 0.5, stagger: 0.08, delay: 0.2 });
    }
  }

  /* ----- render a single book page from data ----- */
  function renderBookPage(p, total) {
    if (p.type === 'cover') return node(coverPage(p));
    if (p.type === 'chapter') return node(chapterPage(p));
    if (p.type === 'check') return node(checkPage(p));
    return node(stepPage(p));
  }

  function coverPage(p) {
    if (p.back) {
      return `<div class="page page--cover"><div class="cover-art">
        <div class="c-meta"><span>${p.meta}</span><span><span class="dot">●</span> ${p.metaR}</span></div>
        ${emblem()}
        <div class="c-mid"><h2>End of <em>manual.</em></h2><p>${p.kicker}</p></div>
        <div class="c-foot">${p.foot}</div>
      </div></div>`;
    }
    return `<div class="page page--cover"><div class="cover-art">
      <div class="c-meta"><span>${p.meta}</span><span><span class="dot">●</span> ${p.metaR}</span></div>
      ${emblem()}
      <div class="c-mid"><h2>${p.title || 'Build'} <em>manual.</em></h2><p>${p.kicker}</p></div>
      <div class="c-foot">${p.foot}</div>
    </div></div>`;
  }

  function chapterPage(p) {
    return `<div class="page page--chapter kind-${p.kind}">
      ${pcbDecor()}
      <span class="ch__phase">${p.phase}</span>
      <div class="ch__n">${p.n.includes('.') || p.n.length > 2 || isNaN(+p.n) ? p.n : '<em>' + p.n + '</em>'}</div>
      <h2 class="ch__title">${p.title}</h2>
      <p class="ch__goal">${p.goal}</p>
      <div class="ch__meta">${p.meta.map(m => '<span>' + m + '</span>').join('')}</div>
    </div>`;
  }

  function stepPage(p) {
    const tray = (p.parts && p.parts.length) ? `
      <div class="page__tray">
        <div class="page__tray-label">Parts for this step</div>
        <div class="page__tray-row">${p.parts.map(trayChip).join('')}</div>
      </div>` : '';
    return `<div class="page">
      <div class="page__rail"><span class="phase-tag">${p.phase}</span><span>Step ${p.n}</span></div>
      <div class="page__head">
        <div class="page__num">${p.n}</div>
        <h2 class="page__title">${p.title}</h2>
      </div>
      ${tray}
      <div class="page__body">
        ${resolveMedia(p.media)}
        ${p.instruction || ''}
      </div>
    </div>`;
  }

  function checkPage(p) {
    return `<div class="page page--check">
      <div class="page__rail"><span class="phase-tag">${p.phase}</span><span>checkpoint</span></div>
      <div class="page__head"><div class="page__num" style="border-color:var(--ok);color:var(--ok)">✓</div>
        <h2 class="page__title">${p.title}</h2></div>
      <div class="page__body">
        ${resolveMedia(p.media)}
        <div class="checkpoint"><h4>Confirm before moving on</h4>
        <ul>${p.items.map(it => '<li>' + it + '</li>').join('')}</ul></div></div>
    </div>`;
  }

  function trayChip(id) {
    const m = PART_META[id] || { name: id, qty: '' };
    return `<span class="tray-chip">${ICONS[id] || ''}<span>${m.name}${m.qty ? ' <small>' + m.qty + '</small>' : ''}</span></span>`;
  }

  function resolveMedia(m) {
    if (!m) return '';
    if (m.kind === 'wiring') return `<div class="page__media">${DIAGRAMS.wiring(m.stage)}<div class="media-cap">${m.cap || 'newest connection highlighted'}</div></div>`;
    if (m.kind === 'svg') return `<div class="page__media">${DIAGRAMS[m.name]()}<div class="media-cap">${m.cap || ''}</div></div>`;
    if (m.kind === 'placeholder') return `<div class="page__media">${DIAGRAMS.placeholder(m.tag, m.sub)}</div>`;
    if (m.kind === 'image') return `<div class="page__media">${imgInline(m.src, m.alt)}</div>`;
    if (m.kind === 'html') return `<div class="page__media">${m.html}</div>`;
    return '';
  }

  function backingArt(i, total) {
    return `${pcbWatermark()}<span class="bk-num">Random Builds · pg ${i + 1} / ${total}</span>`;
  }

  /* ============================================================
     PARTS — interactive personal checklist (toggles persist
     per visitor in localStorage; cost total updates live)
     ============================================================ */
  function loadHave(id) {
    try { return new Set(JSON.parse(localStorage.getItem('mybuilds:have:' + id) || '[]')); }
    catch (e) { return new Set(); }
  }
  function saveHave(id, set) {
    try { localStorage.setItem('mybuilds:have:' + id, JSON.stringify([...set])); } catch (e) { }
  }

  function renderParts(b) {
    const cur = b.parts.currency;
    let total = 0, partCount = 0;
    b.parts.groups.forEach(g => g.items.forEach(it => {
      if (typeof it.cost === 'number') total += it.cost;
      partCount++;
    }));

    const have = loadHave(b.id);

    const groups = b.parts.groups.map(g => `
      <div class="parts-group reveal">
        <table class="parts-table">
          <colgroup><col class="c-icon"><col class="c-name"><col class="c-qty"><col class="c-have"><col class="c-cost"></colgroup>
          <thead><tr><th colspan="2">${g.name}</th><th>Qty</th><th>Have it?</th><th style="text-align:right">Cost</th></tr></thead>
          <tbody>
            ${g.items.map(it => {
              const key = it.name;
              const has = have.has(key);
              const nameHtml = it.url
                ? `<a class="pt-link" href="${it.url}" target="_blank" rel="noopener">${it.name} <span class="pt-ext">${UI.external}</span></a>`
                : it.name;
              return `
              <tr data-part="${key.replace(/"/g, '&quot;')}" data-cost="${typeof it.cost === 'number' ? it.cost : 0}" class="${has ? 'is-have' : ''}">
                <td class="pt-icon">${ICONS[it.icon] || ''}</td>
                <td class="pt-name">${nameHtml}${it.optional ? ' <em class="pt-opt">opt</em>' : ''}<small>${it.sub}${it.notes ? ' — ' + it.notes : ''}</small></td>
                <td class="pt-qty">${it.qty}</td>
                <td class="pt-have"><button class="have-toggle" aria-pressed="${has}" aria-label="Toggle whether you have ${it.name}">
                  <span class="have-box"></span><span class="have-label">${has ? 'Got it' : 'Need it'}</span></button></td>
                <td class="pt-cost">${cur}${it.cost}</td>
              </tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>`).join('');

    const view = node(`
      <div class="view subpage">
        <div class="wrap">
          <div class="subpage__head">
            <span class="eyebrow">${b.name} · BOM</span>
            <h1>Parts List</h1>
            <p>Everything you need to build it, each linked to where I bought it. <strong>Tick off what you already have</strong> — your remaining cost updates as you go, and it's saved in your browser.</p>
          </div>
          <div class="cost-bar reveal">
            <div class="cost-bar__item">Full build<strong>${cur}${total}</strong></div>
            <div class="cost-bar__item">You still need<strong class="accent" data-stat="remaining">${cur}${total}</strong></div>
            <div class="cost-bar__item">You have<strong data-stat="have">0 / ${partCount}</strong></div>
            <div class="cost-bar__spacer"></div>
            <button class="cost-reset" data-reset>Reset</button>
          </div>
          ${groups}
        </div>
        ${footer()}
      </div>`);

    wireParts(view, b.id, cur, partCount, have);
    return view;
  }

  function wireParts(view, buildId, cur, partCount, have) {
    const remainEl = view.querySelector('[data-stat="remaining"]');
    const haveEl = view.querySelector('[data-stat="have"]');
    const recompute = () => {
      let remaining = 0, count = 0;
      view.querySelectorAll('tr[data-part]').forEach(tr => {
        if (tr.classList.contains('is-have')) count++; else remaining += +tr.dataset.cost || 0;
      });
      remainEl.textContent = cur + remaining;
      haveEl.textContent = count + ' / ' + partCount;
    };
    view.querySelectorAll('.have-toggle').forEach(btn => {
      btn.addEventListener('click', () => {
        const tr = btn.closest('tr');
        const nowHave = tr.classList.toggle('is-have');
        btn.setAttribute('aria-pressed', nowHave);
        btn.querySelector('.have-label').textContent = nowHave ? 'Got it' : 'Need it';
        if (nowHave) have.add(tr.dataset.part); else have.delete(tr.dataset.part);
        saveHave(buildId, have);
        recompute();
      });
    });
    const reset = view.querySelector('[data-reset]');
    if (reset) reset.addEventListener('click', () => {
      have.clear(); saveHave(buildId, have);
      view.querySelectorAll('tr[data-part]').forEach(tr => tr.classList.remove('is-have'));
      view.querySelectorAll('.have-toggle').forEach(btn => {
        btn.setAttribute('aria-pressed', 'false');
        btn.querySelector('.have-label').textContent = 'Need it';
      });
      recompute();
    });
    recompute();
  }

  /* ============================================================
     3D MODELS
     ============================================================ */
  function renderModels(b) {
    const cards = b.models.map(m => `
      <div class="model-card reveal">
        <div class="model-card__media">${m.image ? imgFill(m.image, m.name) : DIAGRAMS.placeholder(m.photo.tag, m.photo.sub)}</div>
        <div class="model-card__body">
          <div class="model-card__top">
            <h3 class="model-card__name">${m.name}</h3>
            <span class="badge badge--${m.status === 'wip' ? 'active' : m.status === 'done' ? 'done' : 'planned'}">${m.statusLabel}</span>
          </div>
          <div class="model-card__settings">
            ${Object.entries(m.settings).map(([k, v]) => `<div class="spec-cell">${k}<strong>${v}</strong></div>`).join('')}
          </div>
          <p class="model-card__notes">${m.notes}</p>
          ${(m.buyUrl || !m.noStl) ? `<div class="model-card__dl">
            ${m.buyUrl ? `<a class="btn" href="${m.buyUrl}" target="_blank" rel="noopener">${UI.external} Buy on Shopee</a>` : ''}
            ${!m.noStl ? `<a class="btn ${m.stl ? '' : 'dl-disabled'}" ${m.stl ? '' : 'aria-disabled="true"'}>${UI.download} ${m.stl ? 'STL' : 'STL pending'}</a>` : ''}
          </div>` : ''}
        </div>
      </div>`).join('');

    return node(`
      <div class="view subpage">
        <div class="wrap">
          <div class="subpage__head">
            <span class="eyebrow">${b.name} · the build</span>
            <h1>The Rig</h1>
            <p>The actual ODTS v0.5: an off-the-shelf SG90 pan-tilt base, a cardboard camera face strapped on with a rubber band, all on a parcel box. A proper printed camera bracket is still on the way.</p>
          </div>
          <div class="models-grid">${cards}</div>
        </div>
        ${footer()}
      </div>`);
  }

  /* ============================================================
     SOFTWARE
     ============================================================ */
  function renderSoftware(b) {
    const s = b.software;
    const badgeLabel = { py: 'python', fw: 'arduino', js: 'electron', model: 'weights' };
    const files = s.files.map(f => `
      <div class="ft-row">
        <span class="ft-file"><span class="twig">└</span> ${f.path}<span class="ft-badge ${f.kind}">${badgeLabel[f.kind] || f.kind}</span></span>
        <span class="ft-desc">${f.desc}</span>
      </div>`).join('');

    return node(`
      <div class="view subpage">
        <div class="wrap">
          <div class="subpage__head">
            <span class="eyebrow">${b.name} · code</span>
            <h1>Software</h1>
            <p>${s.intro}</p>
          </div>

          <div class="sw-layout">
            <div class="sw-panel reveal">
              <h3>Repository</h3>
              <div class="sw-repo">
                <div class="repo-row">${UI.github}<span>${s.repoLabel}${s.repoPlaceholder ? '  <em style="color:var(--ink-3)">(link placeholder)</em>' : ''}</span></div>
                <div class="sw-actions">
                  <a class="btn btn--laser" href="${s.zipUrl}">${UI.download} Download .zip</a>
                  <a class="btn btn--ghost" href="${s.repoUrl}" target="_blank" rel="noopener">${UI.external} View on GitHub</a>
                </div>
                ${s.arduinoUrl ? `<div class="repo-row"><span style="flex:1">Flashing the Arduino? Grab the IDE.</span><a class="btn btn--ghost" href="${s.arduinoUrl}" target="_blank" rel="noopener" style="padding:9px 14px">${UI.download} Arduino IDE</a></div>` : ''}
                <div class="callout callout--tip" style="margin-top:6px"><strong>${s.whyTitle || 'Design notes'}</strong>${s.why}</div>
              </div>
            </div>

            <div class="sw-panel reveal">
              <h3>File structure</h3>
              <div class="file-tree">
                <div class="ft-root">ODTS/ <span style="color:var(--ink-4);font-weight:400">· main</span></div>
                ${files}
              </div>
              <pre class="code" style="margin-top:18px">${s.codePeek}</pre>
            </div>
          </div>

          <div class="sw-status">
            <div class="section-label reveal">Status — done vs in progress</div>
            <div class="sw-layout">
              <div class="status-card reveal">
                <h4>${'✓'} Working</h4>
                <ul>${s.status.done.map(x => '<li style="--c:var(--ok)">' + x + '</li>').join('')}</ul>
              </div>
              <div class="status-card status-card--wip reveal">
                <h4>In progress <span class="live-tag">LIVE</span></h4>
                <ul>${s.status.wip.map(x => '<li>' + x + '</li>').join('')}</ul>
              </div>
            </div>
          </div>
        </div>
        ${footer()}
      </div>`);
  }

  /* ============================================================
     SHARED BITS
     ============================================================ */
  function manifesto() {
    return `<section class="manifesto reveal">
      <svg class="manifesto__bg" viewBox="0 0 620 320" preserveAspectRatio="xMaxYMid slice" aria-hidden="true">
        <g fill="none" stroke="var(--copper)" stroke-width="1.4" opacity="0.55">
          <path d="M0 70 H360 L420 130 H520"/>
          <path d="M0 165 H300 L360 165 H520"/>
          <path d="M0 255 H400 L450 195 H520"/>
          <circle cx="420" cy="130" r="4" fill="var(--copper)"/>
          <circle cx="450" cy="195" r="4" fill="var(--copper)"/>
        </g>
        <circle cx="520" cy="165" r="30" fill="none" stroke="var(--laser)" stroke-width="1.4" opacity="0.5"/>
        <circle cx="520" cy="165" r="11" fill="var(--laser)" opacity="0.85"/>
      </svg>
      <div class="manifesto__inner">
        <span class="manifesto__kicker">The one rule</span>
        <h2 class="manifesto__quote">For a personal project, optimize for one thing — <em>finishing the project.</em></h2>
        <p class="manifesto__sub">Fuck trying to perfect it, it will never happen. Personal Projects have a unique requirment, FINISHING THE DAMN THING, everything else is secondary. You are not optimizing for cost, telemetry, or quality, you are optimizing for finishing the project. So set requiremnts and reach them no matter what.</p>
        <div class="manifesto__ship">
          <div class="manifesto__track"><span></span></div>
          <span class="manifesto__shiplabel">✓ finished &gt; perfect</span>
        </div>
      </div>
    </section>`;
  }

  function footer() {
    return `<footer class="foot"><div class="wrap">
      Random Builds · Bangkok · built static, no framework · animation by <a href="https://gsap.com" target="_blank" rel="noopener">GSAP</a>
    </div></footer>`;
  }
  function traceOverlay() {
    return `<svg class="card__trace" viewBox="0 0 400 280" preserveAspectRatio="none" aria-hidden="true">
      <g fill="none" stroke="var(--trace)" stroke-width="1.2">
        <path pathLength="1" d="M0 40 H120 L150 70 H260"/><path pathLength="1" d="M0 230 H90 L120 200 H300 L330 230 H400"/>
        <path pathLength="1" d="M340 0 V60 L310 90 V160"/><circle class="trace-dot" cx="150" cy="70" r="3" fill="var(--trace)"/>
        <circle class="trace-dot" cx="120" cy="200" r="3" fill="var(--trace)"/><circle class="trace-dot" cx="310" cy="90" r="3" fill="var(--trace)"/>
      </g></svg>`;
  }
  function emblem() {
    return `<svg class="c-emblem" viewBox="0 0 200 200" aria-hidden="true">
      <circle cx="100" cy="100" r="84" fill="none" stroke="var(--ink)" stroke-width="2"/>
      <circle cx="100" cy="100" r="60" fill="none" stroke="var(--ink)" stroke-width="1" stroke-dasharray="4 6"/>
      <circle cx="100" cy="100" r="14" fill="var(--laser)"/>
      <line x1="100" y1="0" x2="100" y2="40" stroke="var(--ink)" stroke-width="2"/>
      <line x1="100" y1="160" x2="100" y2="200" stroke="var(--ink)" stroke-width="2"/>
      <line x1="0" y1="100" x2="40" y2="100" stroke="var(--ink)" stroke-width="2"/>
      <line x1="160" y1="100" x2="200" y2="100" stroke="var(--ink)" stroke-width="2"/>
    </svg>`;
  }
  function pcbDecor() {
    return `<svg class="ch__decor" viewBox="0 0 400 600" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <g fill="none" stroke="var(--trace)" stroke-width="1.4">
        <path d="M-10 120 H140 L180 160 H420"/><path d="M-10 470 H100 L150 420 H420"/>
        <path d="M360 -10 V120 L320 160 V300 L360 340 V610"/>
        <circle cx="180" cy="160" r="4" fill="var(--trace)"/><circle cx="150" cy="420" r="4" fill="var(--trace)"/>
      </g></svg>`;
  }
  function pcbWatermark() {
    return `<svg viewBox="0 0 120 160" aria-hidden="true"><g fill="none" stroke="var(--ink-3)" stroke-width="1.4" opacity=".5">
      <path d="M10 30 H50 L66 46 H110"/><path d="M10 120 H46 L62 104 H110"/><path d="M90 10 V40 L74 56 V110"/>
      <circle cx="66" cy="46" r="3.4" fill="var(--ink-3)"/><circle cx="62" cy="104" r="3.4" fill="var(--ink-3)"/>
      <circle cx="74" cy="56" r="3.4" fill="var(--ink-3)"/></g></svg>`;
  }
  function guideStepCount(b) {
    return b.guide.pages.filter(p => p.type === 'step').length;
  }

  /* mount + entrance helpers */
  function mount(view) {
    if (activeBook) { activeBook.destroy && activeBook.destroy(); activeBook = null; }
    app.innerHTML = '';
    app.appendChild(view);
    window.scrollTo(0, 0);
    // intercept internal links
    view.querySelectorAll('[data-link]').forEach(a => a.addEventListener('click', (e) => {
      // allow default hash nav; just smooth-scroll top
    }));
  }

  const pick = (view, sel) => { const e = [...view.querySelectorAll(sel)]; return e.length ? e : null; };

  function entrance(view) {
    const all = [...view.querySelectorAll('.reveal')];
    if (REDUCE || !window.gsap) { all.forEach(n => n.style.opacity = 1); return; }
    if (!all.length) return;
    gsap.set(all, { opacity: 0, y: 18 });
    const heroBits = pick(view, '.landing__hero .reveal, .subpage__head, .cost-bar');
    if (heroBits) gsap.to(heroBits, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', stagger: 0.07 });
    const rest = pick(view, '.reveal:not(.landing__hero .reveal):not(.subpage__head):not(.cost-bar)');
    if (rest && window.ScrollTrigger) {
      ScrollTrigger.batch(rest, {
        start: 'top 92%',
        onEnter: (els) => gsap.to(els, { opacity: 1, y: 0, duration: 0.55, ease: 'power2.out', stagger: 0.08, overwrite: true }),
        once: true,
      });
      requestAnimationFrame(() => ScrollTrigger.refresh());
    } else if (rest) {
      gsap.to(rest, { opacity: 1, y: 0, duration: 0.5 });
    }
    // safety net (timer-based, survives a paused rAF): force-show any in-view
    // item still hidden, via a direct style write rather than another tween.
    setTimeout(() => all.forEach(n => {
      const r = n.getBoundingClientRect();
      if (r.top < innerHeight && r.bottom > 0 && getComputedStyle(n).opacity === '0') {
        n.style.opacity = '1'; n.style.transform = 'none';
      }
    }), 800);
  }
})();
