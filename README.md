# Ary Builds

A static portfolio for documenting hardware builds. First build: a face-tracking
laser turret, with a real page-flip instruction manual. No framework, no build step —
plain HTML/CSS/JS + [GSAP](https://gsap.com) from a CDN. Deploys straight to GitHub Pages.

## Run it locally

It's a static site, so any of these work:

```bash
# simplest — just open the file
open index.html

# or serve it (needed only if a browser blocks file:// for some reason)
python3 -m http.server 8765   # then visit http://localhost:8765
```

## Deploy to GitHub Pages

1. Push this folder to a GitHub repo.
2. Repo **Settings → Pages → Build and deployment → Source: Deploy from a branch**.
3. Branch `main`, folder `/ (root)`. Save.
4. Live at `https://<you>.github.io/<repo>/` in a minute or two.

No Actions, no Jekyll config needed — it's all static assets.

## File structure

```
index.html        — shell: fonts, GSAP, mount point, script order
css/styles.css    — the whole design system (paper + copper/solder/laser accents)
js/
  data.js         — ALL build content. One object per build in the BUILDS array.
  icons.js        — part-icon SVGs, hub-tile icons, and the diagram generators
                    (incl. the cumulative wiring diagram, one wire per stage)
  book.js         — the generic 3D page-flip engine (build-agnostic)
  app.js          — hash router, view rendering, GSAP transitions
images/           — real build photos referenced from data.js
```

## Adding Build #2

Everything renders from `js/data.js`. Adding a build is **appending one object** to the
`BUILDS` array — the landing grid, hub, parts table, model cards, and the page-flip
guide all pick it up automatically. Copy the laser-turret object as a template and edit:

```js
window.BUILDS = [
  { id: 'laser-turret', /* … */ },
  {
    id: 'build-two',                 // used in the URL: #/build/build-two
    name: 'Your Next Build',
    tagline: '…', status: 'Planned', statusKind: 'planned',
    specs: [ /* … */ ],
    systemChain: [ /* … */ ],
    guide: { title: '…', pages: [ /* cover, chapters, steps, checkpoints */ ] },
    parts:    { groups: [ /* … */ ], dropped: [ /* … */ ] },
    models:   [ /* … */ ],
    software: { /* … */ },
  },
];
```

### Guide page types (the page-flip book)

The book engine is generic; pages are just data. Each entry in `guide.pages` is one of:

- `{ type:'cover', title, meta, metaR, kicker, foot }` — front cover (and `back:true` for the end cover)
- `{ type:'chapter', phase, short, kind, n, title, goal, meta:[…] }` — a chapter divider
  (`kind` is `intro | build | done | current`, which sets the divider's colour)
- `{ type:'step', phase, n, title, parts:[iconIds], instruction, media }` — one Lego step.
  `parts` lists icon ids from `PART_META` (rendered as the "parts for this step" tray);
  `instruction` is HTML; `media` is optional:
  - `{ kind:'wiring', stage:N }` — the cumulative wiring diagram up to stage N
  - `{ kind:'svg', name:'usbLink' }` — a named diagram/scene from `DIAGRAMS`
  - `{ kind:'image', src:'images/foo.png', alt:'…' }` — a real photo (from `images/`)
  - `{ kind:'placeholder', tag, sub }` — a clearly-marked "photo pending" slot
  - `{ kind:'html', html }` — anything custom
- `{ type:'check', phase, title, items:[…] }` — a green checkpoint page

Turn pages by dragging a corner, tapping the curl, the prev/next buttons, the chapter
chips, or the ← → arrow keys.

## Status conventions

"In progress" is intentionally distinct from "done" everywhere: copper/animated badges,
the hatched WIP card on the Software page with a pulsing **LIVE** tag, and the laser-red
"Ongoing — current focus" chapter that, by design, never gets a final checkmark.

Photo and STL slots are placeholders (dashed frame, "pending" label) — swap them for real
assets when they exist without touching any layout code.
