/* ============================================================
   BUILDS DATA
   Add a second build by appending another object to BUILDS —
   every view, the parts table, the model cards and the whole
   page-flip guide engine render straight from this structure.
   ============================================================ */
window.BUILDS = [
{
  id: 'laser-turret',
  name: 'ODTS v.05',
  tagline: 'Object Detection Tracking System, basically a turret that finds a face or object and paints it with a laser dot.',
  status: 'In Progress',
  statusKind: 'active',
  year: '2026',
  location: 'Bangkok',
  lede: 'A two-axis pan-tilt rig: a laptop sees your face with OpenCV + YOLO, does all the maths, and feeds an Arduino tiny serial frames. The Arduino just turns numbers into servo angles. Always-on laser, no switching circuit.',
  summary: 'My first robotics build. Laptop is the brain, the Arduino is a translator, two SG90 servos do the moving, and a 5&nbsp;mW laser rides along on top.',

  specs: [
    { k: 'Axes', v: 'Pan + Tilt' },
    { k: 'Brain', v: 'Laptop · OpenCV · YOLOv8n-face' },
    { k: 'Bridge', v: 'Arduino Nano · serial → PWM' },
    { k: 'Laser', v: 'KY-008 · always-on' },
    { k: 'Power', v: '4×AA servo rail · USB logic' },
  ],

  systemChain: ['Laptop', 'USB serial', 'Arduino Nano', 'PCA9685 (I²C)', 'SG90 ×2 + KY-008'],
  systemNote: 'Wire protocol is one line per frame: <code>&lt;pan,tilt,laser&gt;\\n</code> — e.g. <code>&lt;91.4,46.2,1&gt;</code>. The laptop does all the thinking; the Arduino only translates serial into PWM and one GPIO pin.',

  heroPlaceholder: { tag: 'Hero render pending', sub: 'turret 3/4 view drops in here' },
  heroImage: 'images/hero.png',

  /* ---------------------------------------------------------
     GUIDE — Lego-manual style. One atomic action per page,
     a picture on every page, the wiring diagram building up
     one highlighted wire at a time. Starts at the wiring.
     --------------------------------------------------------- */
  guide: {
    title: 'Laser Turret — Field Manual',
    pages: [

      { type: 'cover',
        title: 'Laser Tracking<br>Turret',
        meta: 'Build 01 · My Builds',
        metaR: 'Bangkok · 2026',
        kicker: 'Field manual · v3',
        foot: 'Laptop → USB → Nano → PCA9685 → 2× SG90 · KY-008 always-on' },

      /* ===================================================== */
      /* PHASE 1 — SERVOS MOVE */
      { type: 'chapter', phase: 'Phase 1', short: '1', kind: 'build',
        n: '01', title: 'Make the servos move',
        goal: 'Wire the Nano to the PCA9685 to the servos, flash a sweep test, and watch <b>both servos swing 0°↔180°</b> on their own.',
        meta: ['~25 min', '11 steps', 'no laptop logic'] },

      { type: 'step', phase: 'Phase 1', short: '1', n: 1,
        title: 'Plug the PAN servo into channel 0.',
        parts: ['servo', 'pca'],
        media: { kind: 'wiring', stage: 2 },
        instruction:
          '<p>Push the <strong>pan</strong> servo onto column <strong>0</strong> — match colours: <strong>orange→S, red→V, brown→G</strong>.</p>' +
          '<div class="callout"><strong>Won\'t sweep later?</strong>It\'s plugged in upside-down. Flip the plug.</div>' },

      { type: 'step', phase: 'Phase 1', short: '1', n: 2,
        title: 'Plug the TILT servo into channel 1.',
        parts: ['servo', 'pca'],
        media: { kind: 'wiring', stage: 3 },
        instruction:
          '<p>The second servo onto column <strong>1</strong>, same colour order. Pan in 0, tilt in 1 — the firmware assumes exactly this.</p>' },

      { type: 'step', phase: 'Phase 1', short: '1', n: 3,
        title: 'Power wire: Nano 5V → PCA VCC.',
        parts: ['jumperFF'],
        media: { kind: 'wiring', stage: 4 },
        instruction:
          '<p>A female-to-female jumper from the Nano\'s <strong>5V</strong> to the PCA9685\'s <strong>VCC</strong>. This powers the chip\'s logic only — not the servos.</p>' },

      { type: 'step', phase: 'Phase 1', short: '1', n: 4,
        title: 'Ground wire: Nano GND → PCA GND.',
        parts: ['jumperFF'],
        media: { kind: 'wiring', stage: 5 },
        instruction:
          '<div class="callout callout--danger"><strong>The one wire that matters most</strong>Batteries power the servos, USB powers the Arduino — two sources that must share one ground, or the Arduino can\'t control anything. Skip this and the servos ignore every command.</div>' },

      { type: 'step', phase: 'Phase 1', short: '1', n: 5,
        title: 'Data wire: Nano A4 → PCA SDA.',
        parts: ['jumperFF'],
        media: { kind: 'wiring', stage: 6 },
        instruction:
          '<p>Nano <strong>A4</strong> → PCA <strong>SDA</strong>, the I²C <strong>data</strong> line — the actual angle commands ride down here.</p>' },

      { type: 'step', phase: 'Phase 1', short: '1', n: 6,
        title: 'Clock wire: Nano A5 → PCA SCL.',
        parts: ['jumperFF'],
        media: { kind: 'wiring', stage: 7 },
        instruction:
          '<p>Nano <strong>A5</strong> → PCA <strong>SCL</strong>, the I²C <strong>clock</strong>. Four jumpers in, the brain-to-driver link is done.</p>' },

      { type: 'step', phase: 'Phase 1', short: '1', n: 7,
        title: 'Battery + into the V+ terminal.',
        parts: ['battery'],
        media: { kind: 'wiring', stage: 8 },
        instruction:
          '<p>Loosen the green screw terminal. The holder\'s <strong>red</strong> wire into <strong>V+</strong>; tighten until it can\'t wiggle. This is the servos\' own 6&nbsp;V rail.</p>' },

      { type: 'step', phase: 'Phase 1', short: '1', n: 8,
        title: 'Battery − into GND. Cells stay out.',
        parts: ['battery'],
        media: { kind: 'wiring', stage: 9 },
        instruction:
          '<p>The <strong>black</strong> wire into the terminal\'s <strong>GND</strong>.</p>' +
          '<div class="callout callout--danger"><strong>Don\'t insert the AA cells yet</strong>Flash the Arduino first (next steps) — power before firmware can slam a servo to a random angle.</div>' },

      { type: 'step', phase: 'Phase 1', short: '1', n: 9,
        title: 'Plug the Nano into your Mac.',
        parts: ['usb', 'laptop'],
        media: { kind: 'svg', name: 'usbLink' },
        instruction:
          '<p>Mini-USB into the Nano, USB-A into the Mac. The power LED lights immediately.</p>' +
          '<div class="callout callout--mac"><strong>Clone Nano = CH340 driver</strong>Grab <em>CH341SER_MAC</em> from wch-ic.com, run it, then System Settings → Privacy &amp; Security → <strong>Allow</strong>, and restart. The port then appears as <span class="inline-code">/dev/cu.wchusbserial…</span></div>' },

      { type: 'step', phase: 'Phase 1', short: '1', n: 10,
        title: 'Flash the sweep test.',
        parts: ['laptop'],
        media: { kind: 'svg', name: 'ideUpload' },
        instruction:
          '<p>Arduino IDE → Board <strong>Nano</strong>, Processor <strong>ATmega328P (Old Bootloader)</strong>, your Port. Paste the sweep sketch and hit upload.</p>' +
          '<pre class="code"><span class="c-key">void</span> <span class="c-fn">loop</span>(){\n  <span class="c-key">for</span>(<span class="c-key">int</span> p=150;p&lt;600;p+=4){pwm.<span class="c-fn">setPWM</span>(0,0,p);pwm.<span class="c-fn">setPWM</span>(1,0,p);<span class="c-fn">delay</span>(15);}\n  <span class="c-key">for</span>(<span class="c-key">int</span> p=600;p&gt;150;p-=4){pwm.<span class="c-fn">setPWM</span>(0,0,p);pwm.<span class="c-fn">setPWM</span>(1,0,p);<span class="c-fn">delay</span>(15);}\n}</pre>' },

      { type: 'step', phase: 'Phase 1', short: '1', n: 11,
        title: 'Drop in 4 AA cells. Watch.',
        parts: ['battery'],
        media: { kind: 'svg', name: 'servoSweep' },
        instruction:
          '<p>Cells in → the rail goes live and the sketch takes over. Both servos sweep end to end, smooth and continuous.</p>' +
          '<div class="callout"><strong>Jitter, not sweep?</strong>Power. Check all four cells seat, and that red→V+ / black→GND are tight.</div>' },

      { type: 'check', phase: 'Phase 1', short: '1',
        title: 'Phase 1 checkpoint',
        media: { kind: 'svg', name: 'servoSweep' },
        items: [
          'Both servos sweep the full range, in sync.',
          'No grinding or buzzing at the ends.',
          'The Nano\'s power LED stays solid.',
        ] },

      /* ===================================================== */
      /* PHASE 1.5 — LAPTOP CONTROL */
      { type: 'chapter', phase: 'Phase 1.5', short: '1.5', kind: 'build',
        n: '1.5', title: 'Hand the wheel to the laptop',
        goal: 'Same wiring, new firmware. The Arduino now waits for serial frames. <b>Type a command, watch a servo move.</b>',
        meta: ['~20 min', '4 steps', 'serial link'] },

      { type: 'step', phase: 'Phase 1.5', short: '1.5', n: 1,
        title: 'Flash the production firmware.',
        parts: ['laptop'],
        media: { kind: 'svg', name: 'ideUpload' },
        instruction:
          '<p>This replaces the sweep test. The Arduino now parses <span class="inline-code">&lt;pan,tilt,laser&gt;</span> frames and centres both servos at 90° on boot. After upload, both snap to centre and hold — "alive, waiting".</p>' },

      { type: 'step', phase: 'Phase 1.5', short: '1.5', n: 2,
        title: 'Test it in the Serial Monitor.',
        parts: ['laptop'],
        media: { kind: 'svg', name: 'serialTest' },
        instruction:
          '<p>Serial Monitor at <strong>115200</strong>, line-ending <strong>Newline</strong>. Send <span class="inline-code">&lt;0,90,0&gt;</span>, <span class="inline-code">&lt;180,90,0&gt;</span>, <span class="inline-code">&lt;90,90,0&gt;</span>.</p>' +
          '<div class="callout callout--tip"><strong>Why here first?</strong>If the monitor drives the servos, the firmware is proven — any later Python issue is Python\'s.</div>' },

      { type: 'step', phase: 'Phase 1.5', short: '1.5', n: 3,
        title: 'Point config.py at your port.',
        parts: ['laptop'],
        media: { kind: 'svg', name: 'findPort' },
        instruction:
          '<p>Close the Serial Monitor (one program owns the port). Run <span class="inline-code">ls /dev/cu.*</span>, paste the exact name into <span class="inline-code">config.py</span>, and set <span class="inline-code">SERIAL_ENABLED = True</span>.</p>' },

      { type: 'step', phase: 'Phase 1.5', short: '1.5', n: 4,
        title: 'Drive it from Python.',
        parts: ['laptop'],
        media: { kind: 'svg', name: 'pythonSend' },
        instruction:
          '<pre class="code"><span class="c-key">import</span> serial, time\ns = serial.<span class="c-fn">Serial</span>(PORT,115200,timeout=1); time.<span class="c-fn">sleep</span>(2)\ns.<span class="c-fn">write</span>(<span class="c-str">b"&lt;30,90,0&gt;\\n"</span>); time.<span class="c-fn">sleep</span>(1)\ns.<span class="c-fn">write</span>(<span class="c-str">b"&lt;150,90,0&gt;\\n"</span>)</pre>' +
          '<p>Pan snaps to 30°, pauses, snaps to 150°. The link works end to end.</p>' },

      { type: 'check', phase: 'Phase 1.5', short: '1.5',
        title: 'Phase 1.5 checkpoint',
        media: { kind: 'svg', name: 'serialTest' },
        items: [
          'Pan snaps 30° → 150° → centre on cue.',
          'No lag, no dropped commands.',
          'Laptop ↔ Arduino link solid.',
        ] },

      /* ===================================================== */
      /* PHASE 2 — LASER */
      { type: 'chapter', phase: 'Phase 2', short: '2', kind: 'done',
        n: '02', title: 'Wire the laser. It just turns on.',
        goal: 'Two wires, no circuit, no MOSFET. <b>A red dot lands on the wall the instant USB power is connected.</b>',
        meta: ['~5 min', '3 steps', 'safety-critical'] },

      { type: 'step', phase: 'Phase 2', short: '2', n: 1,
        title: 'Aim at a paper target first.',
        parts: ['target'],
        media: { kind: 'svg', name: 'laserAim' },
        instruction:
          '<div class="callout callout--danger"><strong>Before any laser wiring</strong>White A4 on the wall, turret pointed at it. The dot goes live the moment USB connects — there is no off switch. Eyes, faces, pets, mirrors: never in that line.</div>' },

      { type: 'step', phase: 'Phase 2', short: '2', n: 2,
        title: 'Two wires: + → 5V, − → GND.',
        parts: ['laser', 'jumperMF'],
        media: { kind: 'svg', name: 'laserPinout' },
        instruction:
          '<p><strong>+</strong> → Nano <strong>5V</strong> (red), <strong>−</strong> → Nano <strong>GND</strong> (black). Leave the <strong>S</strong> pin floating — it\'s only for PWM dimming.</p>' +
          '<div class="callout"><strong>No dot? Polarity.</strong>The KY-008 is directional — swap + and − and it just won\'t light (it won\'t break).</div>' },

      { type: 'step', phase: 'Phase 2', short: '2', n: 3,
        title: 'Plug in USB. The dot appears.',
        parts: ['laser', 'target'],
        media: { kind: 'svg', name: 'laserDot' },
        instruction:
          '<p>USB in → 5&nbsp;V to the laser → a bright focused dot on the target. No sketch, no cells needed for the laser itself.</p>' },

      { type: 'check', phase: 'Phase 2', short: '2',
        title: 'Phase 2 checkpoint',
        media: { kind: 'svg', name: 'laserDot' },
        items: [
          'Sharp red dot the instant USB connects.',
          'Steady — no flicker.',
          'Unplug → off, replug → on.',
        ] },

      /* ===================================================== */
      /* PHASE 3 — CAMERA + TRACKING */
      { type: 'chapter', phase: 'Phase 3', short: '3', kind: 'build',
        n: '03', title: 'Give it eyes',
        goal: 'Mount the brackets, add the camera, run the tracker. <b>The turret physically follows your face.</b>',
        meta: ['~15 min', '4 steps', 'then tuning'] },

      { type: 'step', phase: 'Phase 3', short: '3', n: 1,
        title: 'Centre the servos before the horns.',
        parts: ['servo', 'horn'],
        media: { kind: 'svg', name: 'centerHorn' },
        instruction:
          '<p>With the production firmware running, both servos sit at 90°. <em>Only then</em> press the horns on, aimed mid-travel.</p>' +
          '<div class="callout callout--danger"><strong>No software fix for this</strong>Mount a horn at 0° and you lose half the aim range on that axis, permanently.</div>' },

      { type: 'step', phase: 'Phase 3', short: '3', n: 2,
        title: 'Stack the printed brackets, bottom-up.',
        parts: ['bracket', 'screws'],
        media: { kind: 'svg', name: 'assemblyStack' },
        instruction:
          '<p><strong>Pan base</strong> (pan servo from below) → <strong>tilt yoke</strong> on the pan horn → <strong>tilt servo</strong> in the yoke → <strong>camera + laser block</strong> on the tilt horn, so they move as one.</p>' },

      { type: 'step', phase: 'Phase 3', short: '3', n: 3,
        title: 'Seat the camera and laser.',
        parts: ['webcam', 'laser', 'bracket'],
        media: { kind: 'image', src: 'images/camera.png', alt: 'Camera and KY-008 laser strapped to the cardboard face with a rubber band' },
        instruction:
          '<p>KY-008 friction-fits the 6&nbsp;mm bore; the webcam sits below it. Align both at the same far point.</p>' +
          '<div class="callout callout--tip"><strong>In progress</strong>The printed bracket isn\'t final — right now it\'s cardboard and a rubber band. See the 3D Models page.</div>' },

      { type: 'step', phase: 'Phase 3', short: '3', n: 4,
        title: 'Run the tracker.',
        parts: ['webcam', 'laptop'],
        media: { kind: 'svg', name: 'cameraView' },
        instruction:
          '<p>Webcam in, then <span class="inline-code">python tracker.py</span>. Step into frame — a box locks your face and the turret turns to follow. The dot trails at first; that\'s the untuned PD controller.</p>' +
          '<div class="callout callout--mac"><strong>Wrong camera / black frame</strong>Set <span class="inline-code">CAMERA_INDEX = 1</span>, and allow Camera for Terminal in Privacy &amp; Security.</div>' },

      { type: 'check', phase: 'Phase 3', short: '3',
        title: 'Phase 3 checkpoint — handoff to tuning',
        media: { kind: 'svg', name: 'cameraView' },
        items: [
          'Live feed with a box on your face.',
          'Turret turns to follow you.',
          'Laser on (since Phase 2).',
        ] },

      /* ===================================================== */
      /* ONGOING — SOFTWARE TUNING */
      { type: 'chapter', phase: 'Ongoing', short: '∞', kind: 'current',
        n: '∞', title: 'Software tuning — current focus',
        goal: 'This chapter never gets a final checkmark. It\'s the <b>living</b> part of the build: chasing smoothness, FPS, and the lateral-tracking gremlin.',
        meta: ['continuous', 'in progress', 'no "done"'] },

      { type: 'step', phase: 'Ongoing', short: '∞', n: 1,
        title: 'Tune the PD gains.',
        parts: ['laptop'],
        media: { kind: 'svg', name: 'controlScene' },
        instruction:
          '<p>Raise <strong>KP</strong> to react faster; back off if it overshoots and oscillates. Then add <strong>KD</strong> to damp that oscillation — too much KD goes sluggish. Small steps.</p>' },

      { type: 'step', phase: 'Ongoing', short: '∞', n: 2,
        title: 'Set the dead-zone.',
        parts: ['laptop'],
        media: { kind: 'svg', name: 'deadzone' },
        instruction:
          '<p><strong>DEADZONE</strong> is the pixel radius around centre where the turret stops correcting — it kills the nervous hunting when the dot is basically on target.</p>' },

      { type: 'step', phase: 'Ongoing', short: '∞', n: 3,
        title: 'What I\'m chasing right now.',
        parts: ['laptop'],
        media: { kind: 'svg', name: 'controlScene' },
        instruction:
          '<p>This page is never "finished" — it\'s the running log.</p>' +
          '<div class="callout callout--tip"><strong>Open issues</strong>▸ an intermittent serial hang<br>▸ FPS dipping under YOLO load<br>▸ a lateral glitch on fast sideways motion</div>' },

      { type: 'cover', back: true,
        meta: 'End of manual',
        metaR: 'Build 01',
        kicker: 'Phase 3 reached · tuning ongoing',
        foot: 'My Builds · Bangkok · solder & serial' },
    ],
  },

  /* ---------------------------------------------------------
     PARTS — full BOM, grouped, with running cost.
     --------------------------------------------------------- */
  parts: {
    currency: '฿',
    groups: [
      { name: 'Compute & Control', items: [
        { icon: 'nano', name: 'Arduino Nano', sub: 'USB-C clone · CH340', qty: '×1', status: 'owned', cost: 147, url: 'https://shopee.co.th/product/944231623/20382516205', notes: 'USB serial → PWM bridge' },
        { icon: 'pca',  name: 'PCA9685', sub: '16-channel PWM driver', qty: '×1', status: 'owned', cost: 127, url: 'https://shopee.co.th/product/117988183/6951374745', notes: 'I²C, drives both servos' },
      ]},
      { name: 'Motion', items: [
        { icon: 'servo',   name: 'SG90 micro servo', sub: 'pan + tilt', qty: '×2', status: 'owned', cost: 84, url: 'https://shopee.co.th/product/944231623/23223080672', notes: '฿42 each · plastic-gear, plenty for this load' },
        { icon: 'battery', name: '5V servo-rail power', sub: '4×AA holder + cells', qty: '×1', status: 'buy', cost: 22, url: 'https://shopee.co.th/product/944231623/27124122099', notes: 'never power servos from USB — brownout risk' },
      ]},
      { name: 'Output', items: [
        { icon: 'laser', name: 'KY-008 laser module', sub: '650nm · 6mm · 5V', qty: '×1', status: 'owned', cost: 32, url: 'https://shopee.co.th/product/944231623/23922639053', notes: 'wired always-on, direct to 5V/GND' },
      ]},
      { name: 'Vision', items: [
        { icon: 'webcam', name: 'USB webcam', sub: 'OV3660 · 1080p · 110° FOV', qty: '×1', status: 'owned', cost: 416, url: 'https://shopee.co.th/product/1128156347/44307745789', notes: 'plug-and-play UVC' },
      ]},
      { name: 'Wiring & Mounting', items: [
        { icon: 'jumperFF', name: 'Jumper wires', sub: 'M-M, M-F, F-F · per set', qty: '—', status: 'owned', cost: 22, url: 'https://shopee.co.th/product/944231623/24520413128', notes: 'F-F for board hops, M-F for the laser' },
      ]},
    ],
    dropped: [
      { name: 'IRLZ44N MOSFET', reason: 'laser is always-on — no switching' },
      { name: '100Ω resistor', reason: 'no MOSFET gate circuit' },
      { name: '10kΩ resistor', reason: 'no MOSFET pull-down' },
      { name: 'IRFP250N MOSFET', reason: 'wrong part from the kit — shelved' },
    ],
    note: 'Originally a MOSFET + two resistors were planned to switch the laser. That whole sub-circuit was dropped in favour of always-on wiring, so it\'s struck through here and absent from the guide.',
  },

  /* ---------------------------------------------------------
     3D MODELS
     --------------------------------------------------------- */
  models: [
    { name: 'Pan + tilt base', status: 'done', statusLabel: 'Off-the-shelf',
      settings: { Type: 'SG90 2-axis', Material: 'ABS', Servos: '2 × SG90', Mount: 'desk', Source: 'Shopee' },
      notes: 'A standard white SG90 pan-tilt bracket holds both servos. Ready-made — buy online or swap in a custom print later.',
      image: 'images/pantilt.png',
      photo: { tag: 'Photo pending', sub: 'pan-tilt base' },
      buyUrl: 'https://shopee.co.th/Servo-bracket-PT-Pan-Tilt-Camera-Mount-FPV-for-9G-SG90-MG90S-(%E0%B9%84%E0%B8%A1%E0%B9%88%E0%B8%A1%E0%B8%B5%E0%B9%80%E0%B8%8B%E0%B8%AD%E0%B8%A3%E0%B9%8C%E0%B9%82%E0%B8%A7)-i.78966549.4145551146',
      stl: false, noStl: true },
    { name: 'Camera + laser face', status: 'wip', statusLabel: 'Cardboard',
      settings: { Material: 'cardboard', Hold: 'rubber band', Camera: '30×25mm', Laser: 'KY-008 6mm', Rev: 'v0.5' },
      notes: 'The camera and laser ride a cardboard face strapped on with a rubber band — the ODTS v0.5 prototype. A proper printed bracket (recessed camera pocket + 6mm laser cradle + horn boss) is still being modelled.',
      image: 'images/camera.png',
      photo: { tag: 'Prototype', sub: 'cardboard + rubber band' }, stl: false },
    { name: 'Assembled rig', status: 'done', statusLabel: 'Built',
      settings: { Axes: 'pan + tilt', Base: 'cardboard box', Label: 'ObTS v0.5', Camera: 'mounted', Laser: 'live' },
      notes: 'Everything together: pan-tilt base on the box, cardboard camera face, laser, wiring out to the Nano + PCA9685.',
      image: 'images/side.png',
      photo: { tag: 'Photo pending', sub: 'full build' }, stl: false, noStl: true },
  ],

  /* ---------------------------------------------------------
     SOFTWARE
     --------------------------------------------------------- */
  software: {
    repoUrl: 'https://github.com/K11mito/ODTS',
    repoLabel: 'K11mito/ODTS',
    zipUrl: 'https://github.com/K11mito/ODTS/archive/refs/heads/main.zip',
    arduinoUrl: 'https://www.arduino.cc/en/software',
    repoPlaceholder: false,
    intro: 'ODTS is an Electron app that spawns a Python backend. A USB webcam streams to a YOLOv8 detector, a P-controller turns the tracking error into <code>&lt;pan,tilt,0&gt;</code> frames over USB serial, and the Arduino steers the pan/tilt rig. The UI and the live MJPEG stream render inside the same window.',
    files: [
      { path: 'turret_track.py', kind: 'py', desc: 'The main loop: camera read → YOLOv8 detect → P-controller → <pan,tilt,0> over serial at 115200. Serial port is set at the top.' },
      { path: 'server.py', kind: 'py', desc: 'Python backend — serves the UI and the live MJPEG video stream into the Electron window.' },
      { path: 'face_detect_test.py', kind: 'py', desc: 'Standalone detection test — sanity-check the camera + YOLO before the servos are involved.' },
      { path: 'main.js', kind: 'js', desc: 'Electron main process — spawns the Python backend and owns the app window.' },
      { path: 'index.html', kind: 'js', desc: 'The in-app UI: camera launcher, target picker, and the live tracker HUD.' },
      { path: 'yolov8n-face.pt', kind: 'model', desc: 'YOLOv8n-face model weights, bundled in the repo.' },
    ],
    whyTitle: 'Design notes',
    why: 'Camera reads run on their own thread, so a glitchy USB webcam can\'t freeze the tracker — it shows NO SIGNAL instead. Detection runs in a second thread and pushes JPEGs into a one-slot buffer for the stream. Targets aren\'t just faces: Face / Person / Bottle / Cup / Phone / Book.',
    status: {
      done: [
        'Electron + Python pipeline, UI and video in one window',
        'Threaded camera reads — NO SIGNAL instead of a freeze',
        'Live MJPEG stream + HUD, multi-target detection',
      ],
      wip: [
        'P-controller tuning for smoother, less jittery follow',
        'Holding FPS under the YOLO load',
        '"Almost never finished" — constant improvement, per the repo',
      ],
    },
    codePeek:
      '<span class="c-comment"># turret_track.py — error → P-controller → serial</span>\nerr_x = cx - frame_w / <span class="c-str">2</span>\npan += <span class="c-key">KP</span> * err_x\nser.<span class="c-fn">write</span>(<span class="c-str">f"&lt;{pan:.1f},{tilt:.1f},0&gt;\\n"</span>.<span class="c-fn">encode</span>())',
  },
}
];
