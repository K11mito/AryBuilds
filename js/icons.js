/* ============================================================
   ICONS + DIAGRAMS
   - ICONS[id]      : compact part SVG (trays, BOM rows)
   - PART_META[id]  : { name, qty } label data for trays
   - TILE_ICONS[id] : hub nav-tile icons
   - UI[id]         : small interface glyphs (arrows, github…)
   - DIAGRAMS.x()   : larger step diagrams (cumulative wiring, pinouts)
   Everything is plain SVG strings so it works with no build step.
   ============================================================ */
(function () {
  const S = (vb, inner) =>
    `<svg viewBox="${vb}" xmlns="http://www.w3.org/2000/svg" role="img">${inner}</svg>`;
  // small SVG helpers
  const rng = (a, b, s) => { const o = []; for (let x = a; x <= b + 0.001; x += s) o.push(+x.toFixed(2)); return o; };
  const dots = (xs, y, r = 0.85, fill = '#ecc94b') => xs.map(x => `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}"/>`).join('');
  const PCB = '#1f6fb0', PCB_EDGE = '#103f66', PAD = '#ecc94b', CHIP = '#15171a', USB = '#cdd1d6';
  const PCB_PCA = '#1a3e7c', PCB_PCA_EDGE = '#0e2450'; // PCA9685 — deeper navy than the Nano

  /* ---------------- PART ICONS (viewBox 0 0 64 44) ---------------- */
  const ICONS = {
    // Arduino Nano — blue PCB, mini-USB, ATmega chip, ICSP header, reset button
    nano: S('0 0 64 44', `
      <rect x="6" y="7" width="55" height="30" rx="4" fill="#fff"/>
      <rect x="1.5" y="15" width="9" height="14" rx="1.5" fill="${USB}" stroke="#9098a1" stroke-width=".6"/>
      <rect x="3" y="18" width="6" height="8" rx="1" fill="#a7adb5"/>
      <rect x="9" y="9" width="50" height="26" rx="2.5" fill="${PCB}" stroke="${PCB_EDGE}" stroke-width=".8"/>
      ${dots(rng(14, 56, 3.6), 11, .85)}${dots(rng(14, 56, 3.6), 33, .85)}
      <rect x="25" y="17" width="13" height="12" rx="1.2" fill="${CHIP}"/>
      ${rng(26, 37, 2.2).map(x => `<rect x="${x}" y="15.6" width="1" height="1.3" fill="#3a3d42"/><rect x="${x}" y="29.1" width="1" height="1.3" fill="#3a3d42"/>`).join('')}
      <rect x="43" y="16" width="6.5" height="6.5" rx="1" fill="#dfe2e5" stroke="#9098a1" stroke-width=".5"/>
      <circle cx="46.2" cy="19.2" r="1.5" fill="#b9bdc2"/>
      <rect x="52" y="11" width="7.2" height="5.4" rx=".5" fill="${CHIP}"/>
      ${dots([53.4, 55.4, 57.4], 12.2, .65, PAD)}${dots([53.4, 55.4, 57.4], 14.6, .65, PAD)}
      <rect x="42.5" y="25" width="2.1" height="2.1" rx=".3" fill="#3fc45e"/>
      <rect x="46" y="25" width="2.1" height="2.1" rx=".3" fill="${PAD}"/>`),
    // PCA9685 — blue PCB, green screw terminal, driver chip, capacitor, 16× 3-pin PWM headers
    pca: S('0 0 64 44', `
      <rect x="3" y="6" width="58" height="32" rx="4" fill="#fff"/>
      <rect x="5" y="8" width="54" height="28" rx="2.5" fill="${PCB_PCA}" stroke="${PCB_PCA_EDGE}" stroke-width=".8"/>
      <rect x="25" y="4.5" width="14" height="8" rx="1" fill="#3fae54" stroke="#2c7d3c" stroke-width=".6"/>
      <circle cx="29" cy="8.5" r="1.5" fill="#dfe2e5"/><circle cx="35" cy="8.5" r="1.5" fill="#dfe2e5"/>
      <circle cx="12" cy="16" r="4.2" fill="#16181b"/><circle cx="12" cy="16" r="1.5" fill="#3a3a3a"/>
      <rect x="21" y="14.5" width="24" height="8" rx=".8" fill="${CHIP}"/>
      ${[13, 16.5, 20, 23.5, 27, 30.5].map(y => `<circle cx="7.3" cy="${y}" r=".8" fill="${PAD}"/>`).join('')}
      ${[18, 28, 38, 48].map(x => `<rect x="${x}" y="26" width="9" height="2.3" fill="${PAD}"/><rect x="${x}" y="28.8" width="9" height="2.3" fill="#e23b2e"/><rect x="${x}" y="31.6" width="9" height="2.3" fill="#16181b"/>`).join('')}`),
    servo: S('0 0 64 44', `
      <rect x="16" y="11" width="26" height="22" rx="1" fill="#1d6fb8" stroke="var(--ink)" stroke-width=".55"/>
      <rect x="9" y="15" width="7" height="14" fill="#1d6fb8" stroke="var(--ink)" stroke-width=".4"/>
      <rect x="42" y="15" width="7" height="14" fill="#1d6fb8" stroke="var(--ink)" stroke-width=".4"/>
      <circle cx="29" cy="14" r="4.2" fill="#f0ebe0" stroke="var(--ink)" stroke-width=".5"/>
      <circle cx="29" cy="14" r="1.5" fill="var(--ink)"/>
      <line x1="49" y1="20" x2="58" y2="20" stroke="var(--wire-orange)" stroke-width="1.1"/>
      <line x1="49" y1="22.5" x2="58" y2="22.5" stroke="var(--wire-red)" stroke-width="1.1"/>
      <line x1="49" y1="25" x2="58" y2="25" stroke="var(--wire-brown)" stroke-width="1.1"/>`),
    battery: S('0 0 64 44', `
      <rect x="7" y="11" width="44" height="22" rx="2" fill="#4a4a2e" stroke="var(--ink)" stroke-width=".55"/>
      <g fill="#e8e4d8" stroke="var(--ink)" stroke-width=".35">
        <rect x="11" y="14.5" width="9" height="15" rx="1"/><rect x="22" y="14.5" width="9" height="15" rx="1"/>
        <rect x="33" y="14.5" width="9" height="15" rx="1"/></g>
      <line x1="51" y1="18" x2="59" y2="18" stroke="var(--wire-red)" stroke-width="1.4"/>
      <line x1="51" y1="24" x2="59" y2="24" stroke="var(--ink)" stroke-width="1.4"/>
      <text x="29" y="40" text-anchor="middle" font-family="JetBrains Mono" font-size="4.6" fill="var(--ink-3)">4×AA · 6V</text>`),
    jumperFF: S('0 0 64 44', `
      <rect x="3" y="16" width="6" height="11" fill="#333" rx="1"/><rect x="55" y="16" width="6" height="11" fill="#333" rx="1"/>
      <path d="M9,19 Q24,9 32,21 T55,18" stroke="var(--wire-yellow)" stroke-width="1.5" fill="none"/>
      <path d="M9,22 Q24,14 32,25 T55,21" stroke="var(--wire-green)" stroke-width="1.5" fill="none"/>
      <path d="M9,25 Q24,18 32,28 T55,24" stroke="var(--wire-red)" stroke-width="1.5" fill="none"/>
      <path d="M9,28 Q24,22 32,31 T55,27" stroke="#333" stroke-width="1.5" fill="none"/>
      <text x="32" y="40" text-anchor="middle" font-family="JetBrains Mono" font-size="5" fill="var(--ink)" font-weight="700">F —— F</text>`),
    jumperMF: S('0 0 64 44', `
      <rect x="3" y="17" width="6" height="10" fill="#333" rx="1"/><rect x="56" y="18" width="5" height="8" fill="#222"/>
      <path d="M9,21 Q28,12 40,25 T56,20" stroke="var(--wire-red)" stroke-width="1.6" fill="none"/>
      <path d="M9,25 Q28,17 40,30 T56,24" stroke="var(--ink)" stroke-width="1.6" fill="none"/>
      <text x="32" y="40" text-anchor="middle" font-family="JetBrains Mono" font-size="5" fill="var(--ink)" font-weight="700">F —— M</text>`),
    blutack: S('0 0 64 44', `
      <ellipse cx="32" cy="22" rx="20" ry="11" fill="#5a9bc4" stroke="var(--ink)" stroke-width=".5"/>
      <ellipse cx="25" cy="18" rx="5" ry="3" fill="#6fb0d8" opacity=".6"/>
      <text x="32" y="24.5" text-anchor="middle" font-family="JetBrains Mono" font-size="6" fill="#fff" font-weight="700">BLU</text>`),
    laser: S('0 0 64 44', `
      <circle cx="32" cy="19" r="12" fill="#b04030" stroke="var(--ink)" stroke-width=".6"/>
      <circle cx="32" cy="19" r="5.5" fill="var(--laser)"/><circle cx="29" cy="16" r="1.4" fill="#fff" opacity=".5"/>
      <line x1="26" y1="31" x2="26" y2="37" stroke="#888" stroke-width="1.1"/>
      <line x1="32" y1="31" x2="32" y2="37" stroke="#888" stroke-width="1.1"/>
      <line x1="38" y1="31" x2="38" y2="37" stroke="#888" stroke-width="1.1"/>
      <text x="26" y="42" text-anchor="middle" font-family="JetBrains Mono" font-size="4.6" fill="var(--ink)">−</text>
      <text x="32" y="42" text-anchor="middle" font-family="JetBrains Mono" font-size="4.6" fill="var(--ink)">+</text>
      <text x="38" y="42" text-anchor="middle" font-family="JetBrains Mono" font-size="4.6" fill="var(--ink-3)">S</text>`),
    target: S('0 0 64 44', `
      <rect x="12" y="8" width="16" height="28" fill="#fff" stroke="var(--ink)" stroke-width=".55"/>
      <line x1="12" y1="14" x2="28" y2="14" stroke="var(--ink-3)" stroke-width=".4"/>
      <line x1="12" y1="22" x2="28" y2="22" stroke="var(--ink-3)" stroke-width=".4"/>
      <line x1="12" y1="30" x2="28" y2="30" stroke="var(--ink-3)" stroke-width=".4"/>
      <circle cx="44" cy="22" r="6" fill="none" stroke="var(--laser)" stroke-width="1"/>
      <circle cx="44" cy="22" r="2.4" fill="var(--laser)"/>`),
    webcam: S('0 0 64 44', `
      <rect x="14" y="12" width="36" height="20" rx="3" fill="#2a2a2a" stroke="var(--ink)" stroke-width=".55"/>
      <circle cx="32" cy="22" r="7.5" fill="#11171f" stroke="#444" stroke-width=".8"/>
      <circle cx="32" cy="22" r="4" fill="#1d2b3a"/><circle cx="30" cy="20" r="1.3" fill="#6ea8e0" opacity=".7"/>
      <rect x="44" y="20" width="3" height="3" rx="1" fill="var(--ok)"/>
      <text x="32" y="40" text-anchor="middle" font-family="JetBrains Mono" font-size="4.6" fill="var(--ink-3)">1080p UVC</text>`),
    usb: S('0 0 64 44', `
      <rect x="6" y="17" width="16" height="10" rx="1.5" fill="#cfcabb" stroke="var(--ink)" stroke-width=".5"/>
      <rect x="3" y="19" width="3" height="6" fill="#9a958a"/>
      <path d="M22,22 H42" stroke="var(--ink)" stroke-width="1.6"/>
      <path d="M42,22 q8,0 8,-6" fill="none" stroke="var(--ink)" stroke-width="1.6"/>
      <rect x="46" y="9" width="8" height="8" rx="1" fill="#222" stroke="var(--ink)" stroke-width=".5"/>
      <text x="32" y="38" text-anchor="middle" font-family="JetBrains Mono" font-size="4.6" fill="var(--ink-3)">mini-USB</text>`),
    screwdriver: S('0 0 64 44', `
      <rect x="10" y="19" width="20" height="6" rx="3" fill="var(--wire-red)" stroke="var(--ink)" stroke-width=".5"/>
      <rect x="30" y="20.5" width="18" height="3" fill="#b8b8b8" stroke="var(--ink)" stroke-width=".4"/>
      <rect x="48" y="20" width="5" height="4" fill="#888"/>
      <text x="32" y="38" text-anchor="middle" font-family="JetBrains Mono" font-size="4.6" fill="var(--ink-3)">flathead</text>`),
    multimeter: S('0 0 64 44', `
      <rect x="16" y="8" width="32" height="28" rx="2" fill="#e0a020" stroke="var(--ink)" stroke-width=".55"/>
      <rect x="20" y="12" width="24" height="9" rx="1" fill="#1a2a1a"/>
      <text x="32" y="19" text-anchor="middle" font-family="JetBrains Mono" font-size="5.5" fill="#7fe09a">6.0V</text>
      <circle cx="32" cy="29" r="4.5" fill="#222"/><line x1="32" y1="29" x2="35" y2="26" stroke="#fff" stroke-width=".8"/>`),
    horn: S('0 0 64 44', `
      <circle cx="32" cy="22" r="6" fill="#f0ebe0" stroke="var(--ink)" stroke-width=".55"/>
      <circle cx="32" cy="22" r="2" fill="var(--ink)"/>
      <rect x="30" y="6" width="4" height="16" rx="2" fill="#f0ebe0" stroke="var(--ink)" stroke-width=".5"/>
      <g fill="var(--ink-3)"><circle cx="32" cy="9" r=".8"/><circle cx="32" cy="13" r=".8"/></g>
      <text x="32" y="40" text-anchor="middle" font-family="JetBrains Mono" font-size="4.6" fill="var(--ink-3)">servo horn</text>`),
    screws: S('0 0 64 44', `
      <g stroke="var(--ink)" stroke-width=".5" fill="#b8b8b8">
        <circle cx="20" cy="15" r="4"/><rect x="18.5" y="17" width="3" height="12"/>
        <circle cx="34" cy="15" r="4"/><rect x="32.5" y="17" width="3" height="12"/></g>
      <line x1="18" y1="15" x2="22" y2="15" stroke="var(--ink)" stroke-width=".6"/>
      <line x1="32" y1="15" x2="36" y2="15" stroke="var(--ink)" stroke-width=".6"/>
      <text x="32" y="40" text-anchor="middle" font-family="JetBrains Mono" font-size="4.6" fill="var(--ink-3)">M2 / M3</text>`),
    bracket: S('0 0 64 44', `
      <path d="M14,32 V16 a4,4 0 0 1 4,-4 h12 v6 h-10 v14 z" fill="var(--copper)" stroke="var(--ink)" stroke-width=".55" opacity=".9"/>
      <path d="M36,32 V18 h12 a4,4 0 0 1 4,4 v10 h-6 v-8 h-4 v8 z" fill="var(--copper-2)" stroke="var(--ink)" stroke-width=".55" opacity=".9"/>
      <text x="32" y="40" text-anchor="middle" font-family="JetBrains Mono" font-size="4.6" fill="var(--ink-3)">PLA print</text>`),
    laptop: S('0 0 64 44', `
      <rect x="14" y="10" width="36" height="22" rx="1.5" fill="#cfcabb" stroke="var(--ink)" stroke-width=".55"/>
      <rect x="17" y="13" width="30" height="16" fill="#1a2230"/>
      <path d="M10,34 h44 l-3,-2 h-38 z" fill="#b8b3a6" stroke="var(--ink)" stroke-width=".5"/>
      <circle cx="32" cy="20" r="2" fill="var(--laser)"/>
      <text x="32" y="41" text-anchor="middle" font-family="JetBrains Mono" font-size="4.4" fill="var(--ink-3)">the brain</text>`),
    filament: S('0 0 64 44', `
      <circle cx="32" cy="22" r="13" fill="none" stroke="var(--copper)" stroke-width="5" opacity=".85"/>
      <circle cx="32" cy="22" r="4" fill="var(--paper-2)" stroke="var(--ink)" stroke-width=".5"/>
      <text x="32" y="41" text-anchor="middle" font-family="JetBrains Mono" font-size="4.6" fill="var(--ink-3)">PLA ~100g</text>`),
  };

  const PART_META = {
    nano:       { name: 'Arduino Nano', qty: '×1' },
    pca:        { name: 'PCA9685',      qty: '×1 driver' },
    servo:      { name: 'SG90 servo',   qty: '×2' },
    battery:    { name: '4×AA holder',  qty: '×1' },
    jumperFF:   { name: 'F-F jumpers',  qty: '×4' },
    jumperMF:   { name: 'M-F jumpers',  qty: '×2' },
    blutack:    { name: 'Blu-tack',     qty: '' },
    laser:      { name: 'KY-008 laser', qty: '×1' },
    target:     { name: 'Paper target', qty: '' },
    webcam:     { name: 'USB webcam',   qty: '×1' },
    usb:        { name: 'Mini-USB',     qty: 'cable' },
    screwdriver:{ name: 'Screwdriver',  qty: 'flathead' },
    multimeter: { name: 'Multimeter',   qty: 'optional' },
    horn:       { name: 'Servo horns',  qty: '×2' },
    screws:     { name: 'M2/M3 screws', qty: 'few' },
    bracket:    { name: 'Pan-tilt base', qty: '×1' },
    laptop:     { name: 'Mac laptop',   qty: '×1' },
    filament:   { name: 'PLA filament', qty: '' },
  };

  /* ---------------- HUB TILE ICONS ---------------- */
  const TILE_ICONS = {
    guide: S('0 0 40 40', `
      <path d="M20 9 C16 6 9 6 6 7 V31 C9 30 16 30 20 33 C24 30 31 30 34 31 V7 C31 6 24 6 20 9 Z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>
      <line x1="20" y1="9" x2="20" y2="33" stroke="currentColor" stroke-width="1.4"/>
      <line x1="10" y1="13" x2="16" y2="14" stroke="currentColor" stroke-width="1.2"/>
      <line x1="10" y1="18" x2="16" y2="19" stroke="currentColor" stroke-width="1.2"/>
      <line x1="24" y1="14" x2="30" y2="13" stroke="currentColor" stroke-width="1.2"/>`),
    parts: S('0 0 40 40', `
      <rect x="7" y="11" width="26" height="20" rx="2" fill="none" stroke="currentColor" stroke-width="1.6"/>
      <line x1="7" y1="17" x2="33" y2="17" stroke="currentColor" stroke-width="1.3"/>
      <line x1="13" y1="11" x2="13" y2="31" stroke="currentColor" stroke-width="1.3"/>
      <circle cx="23" cy="24" r="1.4" fill="currentColor"/><circle cx="28" cy="24" r="1.4" fill="currentColor"/>`),
    models: S('0 0 40 40', `
      <path d="M20 7 L32 14 V27 L20 34 L8 27 V14 Z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>
      <path d="M8 14 L20 21 L32 14" fill="none" stroke="currentColor" stroke-width="1.3"/>
      <line x1="20" y1="21" x2="20" y2="34" stroke="currentColor" stroke-width="1.3"/>`),
    software: S('0 0 40 40', `
      <rect x="6" y="9" width="28" height="20" rx="2" fill="none" stroke="currentColor" stroke-width="1.6"/>
      <path d="M14 16 L11 19 L14 22 M26 16 L29 19 L26 22 M21 14 L19 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      <line x1="14" y1="33" x2="26" y2="33" stroke="currentColor" stroke-width="1.5"/>`),
  };

  /* ---------------- UI GLYPHS ---------------- */
  const UI = {
    arrowR: S('0 0 24 24', `<path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`),
    arrowL: S('0 0 24 24', `<path d="M19 12H5M11 6l-6 6 6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`),
    download: S('0 0 24 24', `<path d="M12 3v12M7 11l5 5 5-5M5 21h14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`),
    github: S('0 0 24 24', `<path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.36 1.09 2.94.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.6 9.6 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.69-4.57 4.94.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 12 2Z" fill="currentColor"/>`),
    camera: S('0 0 24 24', `<rect x="3" y="7" width="18" height="13" rx="2" fill="none" stroke="currentColor" stroke-width="1.6"/><circle cx="12" cy="13" r="3.4" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M8 7l1.5-2.5h5L16 7" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>`),
    cube: S('0 0 24 24', `<path d="M12 3l8 4.5v9L12 21l-8-4.5v-9Z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M4 7.5l8 4.5 8-4.5M12 12v9" fill="none" stroke="currentColor" stroke-width="1.4"/>`),
    external: S('0 0 24 24', `<path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>`),
  };

  /* ============================================================
     DIAGRAMS
     ============================================================ */

  // helper: cubic path between two points with a vertical-ish bow
  const wire = (x1,y1,x2,y2,color,w,extra='') => {
    const mx = (x1+x2)/2;
    return `<path d="M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}" fill="none" stroke="${color}" stroke-width="${w}" stroke-linecap="round" ${extra}/>`;
  };
  const vwire = (x1,y1,x2,y2,color,w,extra='') => {
    const my = (y1+y2)/2;
    return `<path d="M ${x1} ${y1} C ${x1} ${my}, ${x2} ${my}, ${x2} ${y2}" fill="none" stroke="${color}" stroke-width="${w}" stroke-linecap="round" ${extra}/>`;
  };

  /* The cumulative wiring board. stage 1..9 reveals one more connection,
     newest one drawn bold with a halo + "NEW" tag — Lego-manual style. */
  function wiringDiagram(stage) {
    // board + part bodies
    const boards = `
      <!-- ===== Arduino Nano (realistic) ===== -->
      <rect x="22" y="114" width="134" height="80" rx="7" fill="#fff"/>
      <rect x="9" y="139" width="15" height="30" rx="2" fill="${USB}" stroke="#9098a1" stroke-width="1"/>
      <rect x="12" y="145" width="10" height="18" rx="1.5" fill="#a7adb5"/>
      <rect x="24" y="116" width="128" height="76" rx="5" fill="${PCB}" stroke="${PCB_EDGE}" stroke-width="1.3"/>
      ${dots(rng(34, 138, 6.2), 122, 1.5)}${dots(rng(34, 138, 6.2), 186, 1.5)}
      <rect x="58" y="142" width="34" height="28" rx="2" fill="${CHIP}"/>
      ${rng(60, 90, 2.6).map(x => `<rect x="${x}" y="139.6" width="1.2" height="2" fill="#34373c"/><rect x="${x}" y="170.4" width="1.2" height="2" fill="#34373c"/>`).join('')}
      <text x="75" y="159" text-anchor="middle" font-family="JetBrains Mono" font-size="5.5" fill="#7b8794">NANO</text>
      <rect x="40" y="124" width="12" height="9" rx="1" fill="${CHIP}"/>
      ${dots([42.5, 46, 49.5], 126.4, 1, PAD)}${dots([42.5, 46, 49.5], 130.4, 1, PAD)}
      <rect x="100" y="150" width="11" height="11" rx="1.5" fill="#dfe2e5" stroke="#9098a1" stroke-width=".7"/>
      <circle cx="105.5" cy="155.5" r="2.6" fill="#b9bdc2"/>
      <rect x="98" y="174" width="3" height="3" rx=".5" fill="#3fc45e"/><rect x="104" y="174" width="3" height="3" rx=".5" fill="${PAD}"/>
      <!-- I2C breakout pins on the right edge -->
      <g font-family="JetBrains Mono" font-size="7.5" fill="#fff" text-anchor="end" font-weight="700">
        <circle cx="146" cy="132" r="3" fill="${PAD}" stroke="#9c7414" stroke-width=".6"/><text x="139" y="134.6">5V</text>
        <circle cx="146" cy="146" r="3" fill="${PAD}" stroke="#9c7414" stroke-width=".6"/><text x="139" y="148.6">GND</text>
        <circle cx="146" cy="168" r="3" fill="${PAD}" stroke="#9c7414" stroke-width=".6"/><text x="139" y="170.6">A4</text>
        <circle cx="146" cy="180" r="3" fill="${PAD}" stroke="#9c7414" stroke-width=".6"/><text x="139" y="182.6">A5</text>
      </g>

      <!-- ===== PCA9685 (realistic) ===== -->
      <rect x="266" y="104" width="132" height="104" rx="7" fill="#fff"/>
      <rect x="268" y="106" width="128" height="100" rx="5" fill="${PCB_PCA}" stroke="${PCB_PCA_EDGE}" stroke-width="1.3"/>
      <circle cx="284" cy="124" r="6" fill="#16181b"/><circle cx="284" cy="124" r="2.2" fill="#3a3a3a"/>
      <rect x="300" y="140" width="60" height="16" rx="1.2" fill="${CHIP}"/>
      <text x="330" y="151" text-anchor="middle" font-family="JetBrains Mono" font-size="6.5" fill="#7b8794">PCA9685</text>
      <text x="330" y="170" text-anchor="middle" font-family="JetBrains Mono" font-size="5.5" fill="#9fb6c8">16 × 12-bit PWM</text>
      <!-- I2C header pins on the left edge -->
      <g font-family="JetBrains Mono" font-size="7.5" fill="#fff" font-weight="700">
        <circle cx="270" cy="132" r="3" fill="${PAD}" stroke="#9c7414" stroke-width=".6"/><text x="278" y="134.6">VCC</text>
        <circle cx="270" cy="146" r="3" fill="${PAD}" stroke="#9c7414" stroke-width=".6"/><text x="278" y="148.6">GND</text>
        <circle cx="270" cy="168" r="3" fill="${PAD}" stroke="#9c7414" stroke-width=".6"/><text x="278" y="170.6">SDA</text>
        <circle cx="270" cy="180" r="3" fill="${PAD}" stroke="#9c7414" stroke-width=".6"/><text x="278" y="182.6">SCL</text>
      </g>
      <!-- PWM channel headers on top (yellow/red/black, CH0 + CH1) -->
      <rect x="299" y="106" width="16" height="11" rx="1" fill="${CHIP}"/>
      <rect x="319" y="106" width="16" height="11" rx="1" fill="${CHIP}"/>
      <circle cx="303.5" cy="112" r="1.5" fill="${PAD}"/><circle cx="307" cy="112" r="1.5" fill="#e23b2e"/><circle cx="310.5" cy="112" r="1.5" fill="#cfcabb"/>
      <circle cx="323.5" cy="112" r="1.5" fill="${PAD}"/><circle cx="327" cy="112" r="1.5" fill="#e23b2e"/><circle cx="330.5" cy="112" r="1.5" fill="#cfcabb"/>
      <text x="307" y="102" text-anchor="middle" font-family="JetBrains Mono" font-size="6.5" fill="var(--ink)" font-weight="700">CH0</text>
      <text x="327" y="102" text-anchor="middle" font-family="JetBrains Mono" font-size="6.5" fill="var(--ink)" font-weight="700">CH1</text>
      <!-- green 2-pin screw terminal (bottom) -->
      <rect x="296" y="190" width="48" height="16" rx="1.5" fill="#3fae54" stroke="#2c7d3c" stroke-width=".8"/>
      <circle cx="308" cy="198" r="3.4" fill="#dfe2e5" stroke="#2c7d3c" stroke-width=".5"/><rect x="305.5" y="197.4" width="5" height="1.2" fill="#7b8794"/>
      <circle cx="332" cy="198" r="3.4" fill="#dfe2e5" stroke="#2c7d3c" stroke-width=".5"/><rect x="329.5" y="197.4" width="5" height="1.2" fill="#7b8794"/>
      <text x="308" y="186" text-anchor="middle" font-family="JetBrains Mono" font-size="6" fill="var(--ink)" font-weight="700">V+</text>
      <text x="332" y="186" text-anchor="middle" font-family="JetBrains Mono" font-size="6" fill="var(--ink)" font-weight="700">GND</text>

      <!-- ===== SG90 servos (top) ===== -->
      ${[['276', 'PAN'], ['336', 'TILT']].map(([x, n]) => `
      <g transform="translate(${x},28)">
        <rect x="0" y="2" width="46" height="26" rx="1.5" fill="#1d6fb8" stroke="${PCB_EDGE}" stroke-width=".7"/>
        <rect x="-7" y="8" width="7" height="14" fill="#1d6fb8" stroke="${PCB_EDGE}" stroke-width=".5"/>
        <rect x="46" y="8" width="7" height="14" fill="#1d6fb8" stroke="${PCB_EDGE}" stroke-width=".5"/>
        <circle cx="23" cy="8" r="5" fill="#f0ebe0" stroke="${PCB_EDGE}" stroke-width=".6"/><circle cx="23" cy="8" r="1.6" fill="#444"/>
        <text x="23" y="22" text-anchor="middle" font-family="JetBrains Mono" font-size="6" fill="#fff" font-weight="700">${n}</text>
      </g>`).join('')}

      <!-- ===== 4×AA battery pack (bottom-left) ===== -->
      <g transform="translate(26,236)">
        <rect x="0" y="0" width="100" height="40" rx="3" fill="#3a3a24" stroke="var(--ink)" stroke-width=".8"/>
        ${[6, 28, 50, 72].map(x => `<rect x="${x}" y="6" width="18" height="28" rx="2" fill="#e8e4d8" stroke="var(--ink)" stroke-width=".35"/><rect x="${x + 6}" y="3.5" width="6" height="3" fill="#b8b39c"/>`).join('')}
        <text x="50" y="52" text-anchor="middle" font-family="JetBrains Mono" font-size="7" fill="var(--ink)" font-weight="700">4 × AA = 6V</text>
      </g>
    `;

    // wire definitions, in build order. each turns on at its stage number.
    const W = [
      // 2: pan servo -> ch0  (orange/red/brown bundle, drawn as 3 thin lines)
      { s:2, draw:(bold)=>{
          const w = bold?3.2:2.2; const o = bold?'filter="url(#glow)"':'';
          return vwire(286,56,303.5,108,'var(--wire-orange)',w,o)+
                 vwire(290,56,307,108,'var(--wire-red)',w,o)+
                 vwire(294,56,310.5,108,'var(--wire-brown)',w,o); },
        tag:[298,84,'PAN → CH0'] },
      // 3: tilt servo -> ch1
      { s:3, draw:(bold)=>{
          const w = bold?3.2:2.2; const o = bold?'filter="url(#glow)"':'';
          return vwire(346,56,323.5,108,'var(--wire-orange)',w,o)+
                 vwire(350,56,327,108,'var(--wire-red)',w,o)+
                 vwire(354,56,330.5,108,'var(--wire-brown)',w,o); },
        tag:[360,84,'TILT → CH1'] },
      // 4: 5V -> VCC (red)
      { s:4, color:'var(--wire-red)',   from:[146,132], to:[270,132], tag:[208,116,'5V → VCC'] },
      // 5: GND -> GND (black) — the critical one
      { s:5, color:'var(--wire-black)', from:[146,146], to:[270,146], tag:[208,160,'GND → GND ★'] },
      // 6: A4 -> SDA (yellow)
      { s:6, color:'var(--wire-yellow)',from:[146,168], to:[270,168], tag:[208,192,'A4 → SDA'] },
      // 7: A5 -> SCL (green)
      { s:7, color:'var(--wire-green)', from:[146,180], to:[270,180], tag:[208,206,'A5 → SCL'] },
      // 8: battery + -> V+
      { s:8, color:'var(--wire-red)',   from:[126,250], to:[308,200], tag:[200,258,'BATT + → V+'] },
      // 9: battery - -> GND term
      { s:9, color:'var(--wire-black)', from:[126,262], to:[332,202], tag:[210,276,'BATT − → GND'] },
    ];

    let body = '';
    let tags = '';
    W.forEach(d => {
      if (stage < d.s) return;
      const bold = stage === d.s;
      if (d.draw) {
        body += d.draw(bold);
      } else {
        const w = bold ? 4 : 2.6;
        if (bold) body += wire(d.from[0],d.from[1],d.to[0],d.to[1], d.color, 8, 'opacity=".22"'); // halo
        body += wire(d.from[0],d.from[1],d.to[0],d.to[1], d.color, w, bold?'filter="url(#glow)"':'');
      }
      if (bold && d.tag) {
        tags += `<g transform="translate(${d.tag[0]},${d.tag[1]})">
          <rect x="-2" y="-9" width="${d.tag[2].length*5.4+8}" height="14" rx="7" fill="var(--ink)"/>
          <text x="${(d.tag[2].length*5.4)/2+2}" y="1" text-anchor="middle" font-family="JetBrains Mono" font-size="7.5" fill="var(--paper)" font-weight="700">${d.tag[2]}</text>
        </g>`;
      }
    });

    const defs = `<defs><filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
        <feDropShadow dx="0" dy="0" stdDeviation="2.4" flood-color="var(--laser)" flood-opacity=".5"/></filter></defs>`;

    return S('0 0 420 290', defs + boards + body + tags);
  }

  /* KY-008 laser pinout (Phase 2) */
  function laserPinout() {
    return S('0 0 360 150', `
      <circle cx="90" cy="60" r="34" fill="#b04030" stroke="var(--ink)" stroke-width="1"/>
      <circle cx="90" cy="60" r="15" fill="var(--laser)"/><circle cx="84" cy="54" r="3.5" fill="#fff" opacity=".5"/>
      <line x1="74" y1="94" x2="74" y2="116" stroke="#888" stroke-width="2.2"/>
      <line x1="90" y1="94" x2="90" y2="116" stroke="#888" stroke-width="2.2"/>
      <line x1="106" y1="94" x2="106" y2="116" stroke="#888" stroke-width="2.2"/>
      <text x="74" y="130" text-anchor="middle" font-family="JetBrains Mono" font-size="11" fill="var(--ink)" font-weight="700">−</text>
      <text x="90" y="130" text-anchor="middle" font-family="JetBrains Mono" font-size="11" fill="var(--ink)" font-weight="700">+</text>
      <text x="106" y="130" text-anchor="middle" font-family="JetBrains Mono" font-size="11" fill="var(--ink-3)" font-weight="700">S</text>
      <text x="106" y="144" text-anchor="middle" font-family="JetBrains Mono" font-size="7.5" fill="var(--ink-3)">(free)</text>
      <!-- arduino -->
      <rect x="230" y="36" width="110" height="56" rx="2" fill="var(--board-blue)" stroke="var(--ink)" stroke-width="1"/>
      <text x="285" y="68" text-anchor="middle" font-family="JetBrains Mono" font-size="9" fill="#fff" font-weight="700">NANO</text>
      <circle cx="230" cy="52" r="2.4" fill="var(--gold)"/><text x="222" y="55" text-anchor="end" font-family="JetBrains Mono" font-size="7.5" fill="var(--ink)">5V</text>
      <circle cx="230" cy="72" r="2.4" fill="var(--gold)"/><text x="222" y="75" text-anchor="end" font-family="JetBrains Mono" font-size="7.5" fill="var(--ink)">GND</text>
      <path d="M 90 94 C 90 70, 150 40, 230 52" fill="none" stroke="var(--wire-red)" stroke-width="3" stroke-linecap="round"/>
      <path d="M 74 94 C 60 120, 150 110, 230 72" fill="none" stroke="var(--ink)" stroke-width="3" stroke-linecap="round"/>
    `);
  }

  /* PCA9685 single-channel S/V/G detail (Phase 1) */
  function channelDetail() {
    return S('0 0 320 150', `
      <rect x="40" y="20" width="44" height="110" fill="#1d1b18" stroke="var(--ink)" stroke-width=".8"/>
      <g>
        <circle cx="62" cy="40" r="5" fill="var(--gold)"/><text x="98" y="44" font-family="JetBrains Mono" font-size="11" fill="var(--ink)" font-weight="700">S</text><text x="118" y="44" font-family="JetBrains Mono" font-size="9" fill="var(--wire-orange)">orange · signal</text>
        <circle cx="62" cy="75" r="5" fill="var(--gold)"/><text x="98" y="79" font-family="JetBrains Mono" font-size="11" fill="var(--ink)" font-weight="700">V</text><text x="118" y="79" font-family="JetBrains Mono" font-size="9" fill="var(--wire-red)">red · +5V</text>
        <circle cx="62" cy="110" r="5" fill="var(--gold)"/><text x="98" y="114" font-family="JetBrains Mono" font-size="11" fill="var(--ink)" font-weight="700">G</text><text x="118" y="114" font-family="JetBrains Mono" font-size="9" fill="var(--wire-brown)">brown · GND</text>
      </g>
      <text x="62" y="14" text-anchor="middle" font-family="JetBrains Mono" font-size="8" fill="var(--ink-3)">one channel column</text>
    `);
  }

  /* Assembly stack (Phase 3) — bottom-up bracket order */
  function assemblyStack() {
    return S('0 0 320 220', `
      <g font-family="JetBrains Mono" font-size="8.5" fill="var(--ink)">
        <rect x="90" y="180" width="140" height="26" rx="3" fill="var(--copper)" stroke="var(--ink)" stroke-width=".8" opacity=".9"/>
        <text x="160" y="196" text-anchor="middle" fill="#fff" font-weight="700">PAN BASE BRACKET</text>
        <rect x="120" y="150" width="80" height="26" rx="2" fill="#1d6fb8" stroke="var(--ink)" stroke-width=".8"/>
        <text x="160" y="166" text-anchor="middle" fill="#fff">pan servo</text>
        <rect x="110" y="104" width="100" height="42" rx="3" fill="var(--copper-2)" stroke="var(--ink)" stroke-width=".8" opacity=".92"/>
        <text x="160" y="129" text-anchor="middle" fill="#fff" font-weight="700">TILT YOKE</text>
        <rect x="124" y="74" width="72" height="26" rx="2" fill="#1d6fb8" stroke="var(--ink)" stroke-width=".8"/>
        <text x="160" y="90" text-anchor="middle" fill="#fff">tilt servo</text>
        <rect x="96" y="34" width="128" height="34" rx="3" fill="var(--copper)" stroke="var(--ink)" stroke-width=".8" opacity=".92"/>
        <text x="160" y="50" text-anchor="middle" fill="#fff" font-weight="700">CAMERA + LASER</text>
        <text x="160" y="61" text-anchor="middle" fill="#fff" font-size="7">moves as one block</text>
        <circle cx="250" cy="48" r="4" fill="var(--laser)"/><line x1="254" y1="48" x2="278" y2="44" stroke="var(--laser)" stroke-width="1.5"/>
        <path d="M160 180 V34" stroke="var(--ink)" stroke-width=".6" stroke-dasharray="3 3" opacity=".4"/>
      </g>
      <text x="160" y="218" text-anchor="middle" font-family="JetBrains Mono" font-size="8" fill="var(--ink-3)">stack bottom-up · everything above the tilt horn moves together</text>
    `);
  }

  /* ---------- scene illustrations (so every step has a picture) ---------- */

  // a generic on-screen window (terminal / IDE / serial monitor)
  function deviceScreen(header, lines) {
    const body = lines.map((ln, i) =>
      `<text x="26" y="${74 + i * 20}" font-family="JetBrains Mono" font-size="11" fill="${ln.c || '#d2d8df'}">${ln.t}</text>`).join('');
    return S('0 0 360 214', `
      <rect x="14" y="18" width="332" height="166" rx="8" fill="#1b2330" stroke="var(--ink)" stroke-width="1.4"/>
      <path d="M14 26 a8 8 0 0 1 8 -8 h316 a8 8 0 0 1 8 8 v18 h-332 z" fill="#2a3547"/>
      <circle cx="32" cy="31" r="3.6" fill="#e25b4e"/><circle cx="46" cy="31" r="3.6" fill="#e8b62b"/><circle cx="60" cy="31" r="3.6" fill="#3fc45e"/>
      <text x="180" y="35" text-anchor="middle" font-family="JetBrains Mono" font-size="9.5" fill="#8794a4">${header}</text>
      ${body}
      <rect x="158" y="184" width="44" height="14" fill="#2a3547"/>
      <rect x="126" y="198" width="108" height="9" rx="3" fill="#2a3547" stroke="var(--ink)" stroke-width="1"/>`);
  }

  const ideUpload = () => deviceScreen('Arduino IDE — Nano · ATmega328P', [
    { t: 'Sketch uses 2,914 bytes (9%) of flash.', c: '#8794a4' },
    { t: 'Uploading…', c: '#d2d8df' },
    { t: '✓ Done uploading.', c: '#3fc45e' },
    { t: '', c: '#d2d8df' },
    { t: '→ click the arrow to flash', c: '#e8b62b' },
  ]);
  const serialTest = () => deviceScreen('Serial Monitor · 115200 · Newline', [
    { t: '> <0,90,0>   pan left', c: '#d2d8df' },
    { t: '> <180,90,0> pan right', c: '#d2d8df' },
    { t: '> <90,90,0>  centre', c: '#d2d8df' },
    { t: 'servo follows every frame ✓', c: '#3fc45e' },
  ]);
  const pythonSend = () => deviceScreen('Terminal — python', [
    { t: '$ python send_test.py', c: '#7fb8e8' },
    { t: 'opening /dev/cu.wchusbserial…', c: '#8794a4' },
    { t: '→ 30°  pause  → 150°  → centre', c: '#d2d8df' },
    { t: 'pan snaps on cue ✓', c: '#3fc45e' },
  ]);
  const findPort = () => deviceScreen('Terminal — find the port', [
    { t: '$ ls /dev/cu.*', c: '#7fb8e8' },
    { t: '/dev/cu.wchusbserial14410', c: '#3fc45e' },
    { t: '', c: '#d2d8df' },
    { t: 'copy that into config.py', c: '#e8b62b' },
  ]);

  // Nano plugged into the Mac over mini-USB
  function usbLink() {
    return S('0 0 360 150', `
      <g transform="translate(18,26)">
        <rect x="0" y="0" width="122" height="74" rx="5" fill="#cdd1d6" stroke="var(--ink)" stroke-width="1.2"/>
        <rect x="8" y="8" width="106" height="58" rx="2" fill="#1b2330"/>
        <circle cx="61" cy="37" r="11" fill="none" stroke="var(--laser)" stroke-width="2"/><circle cx="61" cy="37" r="3.4" fill="var(--laser)"/>
        <path d="M-14 82 h150 l-10 -8 h-130 z" fill="#b6bac0" stroke="var(--ink)" stroke-width="1"/>
      </g>
      <path d="M 150 70 C 196 70, 206 96, 244 96" fill="none" stroke="var(--ink)" stroke-width="3.2" stroke-linecap="round"/>
      <text x="196" y="64" text-anchor="middle" font-family="JetBrains Mono" font-size="8.5" fill="var(--ink-3)">mini-USB</text>
      <g transform="translate(244,74)">
        <rect x="0" y="0" width="92" height="44" rx="4" fill="#fff"/>
        <rect x="-6" y="14" width="8" height="16" rx="1.5" fill="${USB}" stroke="#9098a1" stroke-width=".6"/>
        <rect x="2" y="2" width="88" height="40" rx="3" fill="${PCB}" stroke="${PCB_EDGE}" stroke-width="1"/>
        <rect x="38" y="14" width="18" height="16" rx="1.5" fill="${CHIP}"/>
        ${dots(rng(8, 84, 5), 6, 1.1)}${dots(rng(8, 84, 5), 38, 1.1)}
        <text x="46" y="54" text-anchor="middle" font-family="JetBrains Mono" font-size="8" fill="var(--ink-3)" font-weight="700">Arduino Nano</text>
      </g>
      <text x="180" y="138" text-anchor="middle" font-family="JetBrains Mono" font-size="8.5" fill="var(--ink-3)">power LED lights the instant it connects</text>`);
  }

  // two servos sweeping
  function servoSweep() {
    const servo = (x, label) => `
      <g transform="translate(${x},66)">
        <rect x="0" y="22" width="50" height="32" rx="2" fill="#1d6fb8" stroke="${PCB_EDGE}" stroke-width=".8"/>
        <rect x="-8" y="28" width="8" height="18" fill="#1d6fb8" stroke="${PCB_EDGE}" stroke-width=".5"/>
        <rect x="50" y="28" width="8" height="18" fill="#1d6fb8" stroke="${PCB_EDGE}" stroke-width=".5"/>
        <circle cx="25" cy="22" r="8" fill="#f0ebe0" stroke="${PCB_EDGE}" stroke-width=".7"/><circle cx="25" cy="22" r="2.4" fill="#444"/>
        <rect x="22.5" y="-2" width="5" height="24" rx="2.5" fill="#f0ebe0" stroke="#9098a1" stroke-width=".6"/>
        <text x="25" y="44" text-anchor="middle" font-family="JetBrains Mono" font-size="7" fill="#fff" font-weight="700">${label}</text>
      </g>`;
    return S('0 0 360 168', `
      ${servo(74, 'PAN')}${servo(236, 'TILT')}
      <path d="M 60 58 A 52 52 0 0 1 158 58" fill="none" stroke="var(--copper)" stroke-width="2.2" stroke-dasharray="5 4"/>
      <path d="M 222 58 A 52 52 0 0 1 320 58" fill="none" stroke="var(--copper)" stroke-width="2.2" stroke-dasharray="5 4"/>
      <path d="M60 58 l5 -6 m-5 6 l6 4" stroke="var(--copper)" stroke-width="2" fill="none" stroke-linecap="round"/>
      <path d="M320 58 l-6 -4 m6 4 l-5 6" stroke="var(--copper)" stroke-width="2" fill="none" stroke-linecap="round"/>
      <text x="180" y="150" text-anchor="middle" font-family="JetBrains Mono" font-size="9" fill="var(--ink-2)" font-weight="700">both sweep 0° ↔ 180°, smooth and in sync</text>`);
  }

  // turret aiming a laser at a paper target on the wall
  function laserAim() {
    return S('0 0 360 180', `
      <g transform="translate(20,86)">
        <rect x="0" y="0" width="44" height="40" rx="3" fill="var(--copper)" stroke="var(--ink)" stroke-width="1"/>
        <rect x="10" y="40" width="24" height="8" fill="var(--copper-2)" stroke="var(--ink)" stroke-width=".6"/>
        <circle cx="50" cy="12" r="6" fill="#b04030" stroke="var(--ink)" stroke-width=".6"/><circle cx="50" cy="12" r="2.6" fill="var(--laser)"/>
      </g>
      <line x1="72" y1="98" x2="296" y2="62" stroke="var(--laser)" stroke-width="2.2" stroke-dasharray="7 5"/>
      <rect x="300" y="16" width="16" height="148" fill="#d9d3c5" stroke="var(--ink)" stroke-width=".6"/>
      <rect x="266" y="40" width="36" height="46" fill="#fff" stroke="var(--ink)" stroke-width=".9"/>
      <line x1="270" y1="52" x2="298" y2="52" stroke="var(--ink-3)" stroke-width=".5"/><line x1="270" y1="64" x2="298" y2="64" stroke="var(--ink-3)" stroke-width=".5"/>
      <circle cx="284" cy="62" r="8" fill="none" stroke="var(--laser)" stroke-width="1.5"/><circle cx="284" cy="62" r="3" fill="var(--laser)"/>
      <g transform="translate(40,150)"><rect x="-6" y="-12" width="150" height="20" rx="5" fill="rgba(230,51,34,.1)" stroke="var(--laser)" stroke-width="1"/>
      <text x="69" y="2" text-anchor="middle" font-family="JetBrains Mono" font-size="8.5" fill="var(--laser)" font-weight="700">⚠ aim at paper, never eyes</text></g>`);
  }

  // close-up: the dot has appeared
  function laserDot() {
    return S('0 0 320 160', `
      <rect x="40" y="20" width="240" height="120" rx="4" fill="#fff" stroke="var(--ink)" stroke-width="1"/>
      ${rng(60, 260, 26).map(x => `<line x1="${x}" y1="24" x2="${x}" y2="136" stroke="#efe9dc" stroke-width="1"/>`).join('')}
      <circle cx="170" cy="80" r="22" fill="rgba(230,51,34,.16)"/>
      <circle cx="170" cy="80" r="9" fill="var(--laser)"/><circle cx="165" cy="75" r="3" fill="#fff" opacity=".6"/>
      <text x="170" y="150" text-anchor="middle" font-family="JetBrains Mono" font-size="9" fill="var(--ink-2)" font-weight="700">bright focused dot the instant USB is in</text>`);
  }

  // servo centred at 90° before the horn goes on
  function centerHorn() {
    return S('0 0 320 170', `
      <line x1="160" y1="6" x2="160" y2="150" stroke="var(--copper)" stroke-width="1.4" stroke-dasharray="5 5"/>
      <g transform="translate(125,54)">
        <rect x="0" y="22" width="70" height="46" rx="3" fill="#1d6fb8" stroke="${PCB_EDGE}" stroke-width=".9"/>
        <circle cx="35" cy="22" r="11" fill="#f0ebe0" stroke="${PCB_EDGE}" stroke-width=".8"/><circle cx="35" cy="22" r="3.2" fill="#444"/>
        <rect x="31.5" y="-18" width="7" height="40" rx="3.5" fill="#f0ebe0" stroke="#9098a1" stroke-width=".7"/>
        <circle cx="35" cy="-12" r="1.6" fill="#9aa0a8"/><circle cx="35" cy="-4" r="1.6" fill="#9aa0a8"/><circle cx="35" cy="4" r="1.6" fill="#9aa0a8"/>
      </g>
      <text x="160" y="162" text-anchor="middle" font-family="JetBrains Mono" font-size="8.5" fill="var(--ink-2)" font-weight="700">centre at 90° BEFORE pressing the horn on</text>`);
  }

  // the tracker view: face + bounding box + laser dot
  function cameraView() {
    return S('0 0 360 214', `
      <rect x="14" y="18" width="332" height="166" rx="8" fill="#10151d" stroke="var(--ink)" stroke-width="1.4"/>
      <path d="M14 26 a8 8 0 0 1 8 -8 h316 a8 8 0 0 1 8 8 v16 h-332 z" fill="#2a3547"/>
      <circle cx="32" cy="30" r="3.4" fill="#e25b4e"/><circle cx="45" cy="30" r="3.4" fill="#e8b62b"/><circle cx="58" cy="30" r="3.4" fill="#3fc45e"/>
      <text x="184" y="34" text-anchor="middle" font-family="JetBrains Mono" font-size="9" fill="#8794a4">tracker.py — YOLOv8n-face · live</text>
      <g transform="translate(150,66)">
        <path d="M2 34 q28 -32 56 0 v6 q0 34 -28 40 q-28 -6 -28 -40 z" fill="#e7b289"/>
        <path d="M2 36 q28 -34 56 0 q-6 -22 -28 -22 q-22 0 -28 22 z" fill="#4f3d2a"/>
        <circle cx="20" cy="44" r="3.4" fill="#241d18"/><circle cx="40" cy="44" r="3.4" fill="#241d18"/>
        <path d="M22 62 q8 6 16 0" fill="none" stroke="#9c6b4a" stroke-width="2"/>
      </g>
      <rect x="140" y="58" width="84" height="104" fill="none" stroke="#3fc45e" stroke-width="2"/>
      <rect x="140" y="48" width="58" height="10" fill="#3fc45e"/><text x="146" y="56" font-family="JetBrains Mono" font-size="7.5" fill="#10151d" font-weight="700">face 0.94</text>
      <line x1="182" y1="98" x2="182" y2="122" stroke="#fff" stroke-width="1" opacity=".5"/><line x1="170" y1="110" x2="194" y2="110" stroke="#fff" stroke-width="1" opacity=".5"/>
      <circle cx="188" cy="104" r="4.2" fill="var(--laser)"/>
      <text x="26" y="176" font-family="JetBrains Mono" font-size="9" fill="#8794a4">FPS 18 · error (4,-6)px → serial</text>`);
  }

  // tuning: turret + face + error vector (used for PD pages)
  function controlScene(label) {
    return S('0 0 360 168', `
      <g transform="translate(24,70)"><rect x="0" y="0" width="46" height="42" rx="3" fill="var(--copper)" stroke="var(--ink)" stroke-width="1"/>
      <circle cx="52" cy="12" r="5" fill="#b04030"/><circle cx="52" cy="12" r="2.4" fill="var(--laser)"/></g>
      <circle cx="250" cy="60" r="26" fill="#e7b289" stroke="var(--ink)" stroke-width=".6"/>
      <circle cx="242" cy="56" r="3" fill="#241d18"/><circle cx="258" cy="56" r="3" fill="#241d18"/><path d="M242 68 q8 5 16 0" fill="none" stroke="#9c6b4a" stroke-width="1.6"/>
      <line x1="200" y1="92" x2="244" y2="66" stroke="var(--laser)" stroke-width="2" stroke-dasharray="6 4"/>
      <circle cx="244" cy="66" r="3.4" fill="var(--laser)"/>
      <path d="M214 86 L236 70" stroke="var(--solder-2)" stroke-width="2.4" marker-end="url(#ar)"/>
      <defs><marker id="ar" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0 0 L8 4 L0 8 z" fill="var(--solder-2)"/></marker></defs>
      <text x="180" y="150" text-anchor="middle" font-family="JetBrains Mono" font-size="9" fill="var(--ink-2)" font-weight="700">${label || 'error → PD controller → servo angle'}</text>`);
  }

  // dead-zone ring around the target centre
  function deadzone() {
    return S('0 0 320 160', `
      <line x1="60" y1="78" x2="260" y2="78" stroke="var(--line)" stroke-width="1"/><line x1="160" y1="20" x2="160" y2="136" stroke="var(--line)" stroke-width="1"/>
      <circle cx="160" cy="78" r="44" fill="rgba(184,115,51,.10)" stroke="var(--copper)" stroke-width="1.6" stroke-dasharray="5 4"/>
      <circle cx="160" cy="78" r="4" fill="var(--ink-3)"/>
      <circle cx="150" cy="70" r="4.6" fill="var(--laser)"/>
      <text x="160" y="150" text-anchor="middle" font-family="JetBrains Mono" font-size="9" fill="var(--ink-2)" font-weight="700">inside the ring = on target, stop correcting</text>`);
  }

  function placeholder(tag, sub) {
    return `<div class="slot slot--render"><div class="slot__inner">${UI.camera}
      <span class="slot__tag">${tag || 'Photo pending'}</span>
      <span class="slot__sub">${sub || 'real build shot drops in here'}</span></div></div>`;
  }

  window.ICONS = ICONS;
  window.PART_META = PART_META;
  window.TILE_ICONS = TILE_ICONS;
  window.UI = UI;
  window.DIAGRAMS = {
    wiring: wiringDiagram,
    laserPinout,
    channelDetail,
    assemblyStack,
    placeholder,
    // scenes
    ideUpload, serialTest, pythonSend, findPort,
    usbLink, servoSweep, laserAim, laserDot, centerHorn, cameraView,
    controlScene, deadzone,
  };
})();
