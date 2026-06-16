# MENOOWEL — BrewLab Studio

An interactive, bilingual (🇮🇩/🇬🇧) studio for manual / filter coffee. Configure every
meaningful brew variable, get a **predicted result** plotted on the **SCA Brewing
Control Chart**, run a **guided pour timer**, save **named presets**, and keep a
**brew log** with tasting feedback and improvement suggestions.

## Variables modeled
- **Water** — temperature + SCA mineral targets (total hardness, alkalinity, TDS).
- **Grind** — hand/electric grinder brands + models, target micron, suggested clicks; grind chart by method (Honest Coffee Guide).
- **Beans** — origin, variety, post-harvest process (washed, natural, honey, ferment, anaerobic, carbonic, wet-hulled).
- **Roast** — ultra-light → dark via Agtron.
- **Dripper** — conical / flat-bottom / hybrid (V60, Origami, Switch, Kalita, Solo, Suji Panca, Beandy, Orea, Chemex, Clever…) with flow characteristics.
- **Paper filter** — brands + flow/drawdown traits (Hario, CAFEC, Kalita, Sibarist, Chemex…).
- **Recipe** — ratio, dose, flow rate, and pours. **Editable** for custom recipes, **fixed** for champion presets (Tetsu Kasuya 4:6, James Hoffmann, Lance Hendrick, Matt Winton, Ryan Wibawa).

## Results
- Predicted **yield**, **TDS%**, **extraction yield %** via a transparent heuristic model.
- **Manual measured-TDS override** (refractometer) recomputes EY and replots.
- Plotted on a custom SVG **SCA Brewing Control Chart** with the Gold Cup ideal zone and ratio diagonals.

## Persistence
All presets and brew history live in the browser via `localStorage` — no account, works offline.

## Develop
```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production build to dist/
npm run preview  # serve the production build
```

## Deploy to Vercel
This is a static Vite app — Vercel auto-detects it.
1. Push this repo to GitHub.
2. In Vercel → **New Project** → import the repo.
3. Framework preset **Vite** is detected; Build Command `npm run build`, Output `dist`.
4. Deploy. `vercel.json` adds an SPA rewrite so refreshes resolve.

Or from the CLI: `npm i -g vercel && vercel`.

---
The prediction is a heuristic estimate, not lab-accurate — use measured TDS for the precise point.
The previous single-file prototype is preserved in [`legacy/index.html`](legacy/index.html).
