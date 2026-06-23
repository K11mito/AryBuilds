/* ============================================================
   BOOK ENGINE — generic 3D page-flip
   Knows nothing about turrets. You hand it:
     total       — page count
     renderPage(i) -> HTMLElement (the page's front content)
     backing(i)    -> html string for the reverse of sheet i
     onChange(i)   -> progress callback
   It owns the geometry: two-sided sheets hinged on the left
   spine, rotateY turn, curl shadow, drag + tap + keys.
   Works for any future build's guide.
   ============================================================ */
(function () {
  const TURN = 0.92;          // seconds for a full programmatic turn
  const EASE = 'power2.inOut';
  const el = (cls, html) => { const d = document.createElement('div'); if (cls) d.className = cls; if (html != null) d.innerHTML = html; return d; };

  function create(opts) {
    const { stage, total, renderPage, backing, onChange } = opts;
    let index = 0;
    let locked = false;
    let drag = null;            // active drag session

    const book = el('book');
    book.setAttribute('role', 'group');
    book.setAttribute('aria-label', 'Flip-book guide');
    const edgeL = el('book__edge-stack book__edge-left');
    const edgeR = el('book__edge-stack book__edge-right');
    stage.innerHTML = '';
    stage.append(edgeL, edgeR, book);

    /* ---- sheet factory ---- */
    function buildSheet(i, rot, z) {
      const sheet = el('sheet');
      sheet.style.zIndex = z;
      sheet.style.transform = 'rotateY(' + rot + 'deg)';

      const front = el('sheet__face sheet__front');
      const content = renderPage(i);
      if (typeof content === 'string') front.innerHTML = content; else front.appendChild(content);
      const curlF = el('sheet__curl'); front.appendChild(curlF);

      const back = el('sheet__face sheet__back');
      back.innerHTML = '<div class="sheet__backing">' + (backing ? backing(i) : '') + '</div>';
      const curlB = el('sheet__curl'); back.appendChild(curlB);

      sheet.append(front, back);
      return { sheet, front, back, curl: [curlF, curlB] };
    }

    /* ---- decorative spine-thickness edges ---- */
    function updateEdges() {
      const left = Math.min(index, 12);
      const right = Math.min(total - 1 - index, 12);
      edgeL.innerHTML = ''; edgeR.innerHTML = '';
      for (let k = 0; k < left; k++) { const s = el(); s.style.left = (-2 - k * 1.4) + 'px'; edgeL.appendChild(s); }
      for (let k = 0; k < right; k++) { const s = el(); s.style.right = (-2 - k * 1.4) + 'px'; edgeR.appendChild(s); }
    }

    /* ---- show one resting page ---- */
    function renderStatic() {
      [...book.querySelectorAll('.sheet')].forEach(s => s.remove());
      const cur = buildSheet(index, 0, 20);
      book.appendChild(cur.sheet);
      updateEdges();
      onChange && onChange(index);
    }

    /* ---- apply a rotation to the active flipper + drive curl ---- */
    function applyRot(flip, deg) {
      flip.sheet.style.transform = 'rotateY(' + deg + 'deg)';
      const p = Math.min(1, Math.abs(deg) / 180);
      const shade = Math.sin(p * Math.PI);
      flip.curl[0].style.opacity = shade;
      flip.curl[1].style.opacity = shade;
    }

    /* ---- build the pair of sheets for a turn ---- */
    function beginTurn(dir) {
      // remove the resting sheet first — otherwise it sits ABOVE the page being
      // revealed and you'd just see the same page until the turn completes.
      [...book.querySelectorAll('.sheet')].forEach(s => s.remove());
      if (dir === 'fwd') {
        const under = buildSheet(index + 1, 0, 10);      // the NEXT page, revealed as the leaf lifts
        const flip = buildSheet(index, 0, 30);           // current page, lifting away
        book.append(under.sheet, flip.sheet);
        return { flip, under, dir, from: 0, to: -180, target: index + 1 };
      } else {
        const under = buildSheet(index, 0, 10);          // current page, being covered
        const flip = buildSheet(index - 1, -180, 30);    // previous page, sweeping in from the left
        book.append(under.sheet, flip.sheet);
        return { flip, under, dir, from: -180, to: 0, target: index - 1 };
      }
    }

    function settle(turn, complete) {
      if (complete) { index = turn.target; }
      renderStatic();
      locked = false;
    }

    /* ---- programmatic full turn (buttons / keys / corner) ---- */
    function go(dir) {
      if (locked || !document.body.contains(book)) return;
      if (dir === 'fwd' && index >= total - 1) return;
      if (dir === 'back' && index <= 0) return;
      locked = true;
      const turn = beginTurn(dir);
      const proxy = { r: turn.from };
      let settled = false;
      const finish = () => { if (settled) return; settled = true; settle(turn, true); };
      gsap.to(proxy, {
        r: turn.to, duration: TURN, ease: EASE,
        onUpdate: () => applyRot(turn.flip, proxy.r),
        onComplete: finish,
      });
      // watchdog: timer-based, so an interrupted/paused tween can never lock the book
      setTimeout(finish, TURN * 1000 + 500);
    }

    /* ---- drag to turn ---- */
    function pageWidth() { return book.getBoundingClientRect().width; }

    function onDown(e) {
      if (locked) return;
      // ignore drags that start on interactive/scrolling content
      if (e.target.closest('a, button, .page__body, pre, .book-controls')) return;
      const rect = book.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const dir = (x > rect.width * 0.5) ? 'fwd' : 'back';
      if (dir === 'fwd' && index >= total - 1) return;
      if (dir === 'back' && index <= 0) return;
      locked = true;
      const turn = beginTurn(dir);
      drag = { turn, startX: e.clientX, w: rect.width, last: e.clientX, lastT: performance.now(), v: 0, deg: turn.from };
      book.setPointerCapture && book.setPointerCapture(e.pointerId);
      stage.classList.add('is-dragging');
    }

    function onMove(e) {
      if (!drag) return;
      const dx = e.clientX - drag.startX;
      const frac = Math.max(0, Math.min(1, (drag.turn.dir === 'fwd' ? -dx : dx) / drag.w));
      const deg = drag.turn.dir === 'fwd' ? -180 * frac : -180 + 180 * frac;
      drag.deg = deg;
      applyRot(drag.turn.flip, deg);
      const now = performance.now();
      drag.v = (e.clientX - drag.last) / Math.max(1, now - drag.lastT);
      drag.last = e.clientX; drag.lastT = now;
    }

    function onUp() {
      if (!drag) return;
      const { turn } = drag;
      const progressed = Math.abs(drag.deg - turn.from) / 180;
      // complete if dragged past 40% OR flicked in the turn direction
      const flick = turn.dir === 'fwd' ? drag.v < -0.45 : drag.v > 0.45;
      const complete = progressed > 0.4 || flick;
      const d = drag; drag = null;
      stage.classList.remove('is-dragging');
      const proxy = { r: d.deg };
      let settled = false;
      const finish = () => { if (settled) return; settled = true; settle(turn, complete); };
      gsap.to(proxy, {
        r: complete ? turn.to : turn.from, duration: 0.45, ease: 'power2.out',
        onUpdate: () => applyRot(turn.flip, proxy.r),
        onComplete: finish,
      });
      setTimeout(finish, 950);
    }

    /* ---- wire events ---- */
    book.addEventListener('pointerdown', onDown);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);

    // corner tap = forward (delegated, survives re-renders)
    book.addEventListener('click', (e) => {
      if (e.target.closest('.sheet__corner')) go('fwd');
    });

    const keyHandler = (e) => {
      if (e.key === 'ArrowRight') { e.preventDefault(); go('fwd'); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); go('back'); }
    };
    window.addEventListener('keydown', keyHandler);

    renderStatic();

    /* ---- public API ---- */
    return {
      next: () => go('fwd'),
      prev: () => go('back'),
      get index() { return index; },
      get total() { return total; },
      jump(i) {
        if (locked || i === index || i < 0 || i >= total) return;
        locked = true;
        // quick cross-fade riffle for multi-page jumps (content renders synchronously first)
        const dir = i > index ? 1 : -1;
        index = i;
        renderStatic();
        const cur = book.querySelector('.sheet');
        let done = false;
        const fin = () => { if (done) return; done = true; if (cur) { cur.style.transform = ''; cur.style.opacity = ''; } locked = false; };
        gsap.fromTo(cur, { rotateY: -22 * dir, opacity: 0.2, transformOrigin: 'left center' },
          { rotateY: 0, opacity: 1, duration: 0.5, ease: 'power2.out', onComplete: fin });
        setTimeout(fin, 700);
      },
      destroy() {
        window.removeEventListener('pointermove', onMove);
        window.removeEventListener('pointerup', onUp);
        window.removeEventListener('pointercancel', onUp);
        window.removeEventListener('keydown', keyHandler);
      },
    };
  }

  window.Book = { create };
})();
