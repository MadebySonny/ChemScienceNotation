# ScienceNotations

A copy-paste library of mathematical, physics, and chemistry notations and constants for STEM
lab reports — restyled to match the [ChemBench](https://o-tran.github.io/chembench/) theme.
Click any button to copy it; formatted notations (exponents, subscripts) paste correctly into
Word and Google Docs instead of as raw text.

No build step, no dependencies — just static HTML, CSS, and vanilla JS.

## File structure

```
.
├── index.html            # main notations page (12 sections)
├── greek-alphabet.html   # Greek alphabet (uppercase + lowercase)
├── reactions.html        # copy-paste chemical reactions (8 categories, 64 equations)
├── qr-generator.html     # QR code generator (text/URL → downloadable PNG)
├── styles.css            # shared stylesheet (ChemBench design tokens)
├── script.js             # shared copy-to-clipboard + toast logic
└── qr.js                 # QR generator logic (only loaded by qr-generator.html)
```

## Running it locally

No install needed. Either:

- Open `index.html` directly in a browser
- Go to the GitHub-hosted page: [Chem Science Notation](https://madebysonny.github.io/ChemScienceNotation/index.html)
- Serve the folder so relative paths and the clipboard API behave exactly like production:
  ```
  npx serve .
  ```
  or, with Python:
  ```
  python3 -m http.server
  ```

## Deploying to GitHub Pages

1. Push these files to the root of your `ScienceNotations` repo (replacing the old `index.html`
   and `GreekAlphabet.html`).
2. In the repo's **Settings → Pages**, set the source to the `main` branch, root folder.
3. That's it — GitHub Pages serves static files directly, no Action or build step required.

## Updating the ChemBench link

The header badge and nav link both point to `https://o-tran.github.io/chembench/` to match
ChemBench's configured base path. If ChemBench ends up at a different URL, update it in two
places in each HTML file:

- `<a class="badge" href="...">`
- `<a class="nav-link external" href="...">`

## Adding a new notation or constant

Each entry is one `<button class="copy-chip">` inside a `.copy-grid` (or `.copy-grid constants`
for the amber-accented reference values). Two copy modes are available:

- **Plain symbols** (no formatting needed), e.g. `π`, `σ`, `Δ`:
  ```html
  <button class="copy-chip" onclick="copyPlain('π', this)"><span class="sym">π</span> Pi</button>
  ```
- **Rich/formatted text** (needs real superscript or subscript so it pastes correctly into Word
  or Docs), e.g. `10ⁿ`, `k_B`. Takes the HTML to copy, then a plain-text fallback for the toast
  and for apps that reject rich paste:
  ```html
  <button class="copy-chip" onclick="copyRich('10<sup>n</sup>&nbsp;', '10^n', this)">
    <span class="sym">10ⁿ</span> Exponents
  </button>
  ```

To add a whole new section, copy an existing `<section class="notation-section" id="section-N">`
block and add a matching entry to the `<nav class="toc">` list at the top of `index.html` — the
scroll-spy highlighting in `script.js` picks up any section with an `id` automatically.

## Adding a new reaction (reactions.html)

`reactions.html` follows the same page skeleton (header, nav, hero, `.toc` + `.sections`
workbench) as `index.html`, but each `<section class="notation-section">` groups reactions by
type (Acid–Base, Combustion, Synthesis, Decomposition, Single/Double Displacement, Redox,
Equilibrium) inside a `.copy-grid.reaction-grid` instead of `.copy-grid`. Every reaction is a
`copyRich()` chip so subscripts and charges paste into Word/Docs as real formatting, with an
`.rx-label` caption underneath naming the reaction:

```html
<button class="copy-chip reaction-chip"
        onclick="copyRich('HCl + NaOH &rarr; NaCl + H<sub>2</sub>O&nbsp;', 'HCl + NaOH → NaCl + H2O', this)">
  <span class="sym">HCl + NaOH → NaCl + H₂O</span>
  <span class="rx-label">Strong acid + strong base</span>
</button>
```

Notes on the pattern:
- Use real `<sub>N</sub>` tags around subscript numbers in the copied HTML, and matching unicode
  subscript digits (₀–₉) in the visible `.sym` label so it reads correctly on the page too.
- Charges use `<sup>` in the HTML and unicode superscripts (⁺ ⁻ ⁰–⁹) in the `.sym` label, e.g.
  `Fe<sup>3+</sup>` → `Fe³⁺`.
- Reaction arrows don't need markup — just the unicode character: `→` for one-way reactions, `⇌`
  for equilibrium.
- Precipitates get a trailing `↓` right after the formula (e.g. `AgCl↓`).
- To add a new category, copy a whole `<section id="rx-...">` block, add a matching `<li>` to the
  `.toc` list, and give the section a unique `rx-` id — scroll-spy picks it up automatically, same
  as `index.html`.
- `reactions.html` is linked from the shared nav bar (`.nav-link`) in every page, the same way
  `greek-alphabet.html` is — add it to that same nav block in any future page you create.

## QR code generator (qr-generator.html)

A standalone tool page — type or paste text/a URL and it renders a live QR code (debounced as you
type), with **Download PNG** and **Copy Image** buttons. Good for putting a scannable link to
ChemBench, a worksheet, or a reaction lookup on a handout or slide.

- Uses the [qrcodejs](https://github.com/davidshimjs/qrcodejs) library (MIT, ~4KB) loaded from
  cdnjs — no npm install or build step, consistent with the rest of the site.
- All logic lives in `qr.js`, loaded only by `qr-generator.html`, so it doesn't bloat the shared
  `script.js` used on every other page.
- `qr.js` renders into a `<canvas>` (the library's default when supported) so the download/copy
  buttons can read the pixels directly via `canvas.toDataURL()` / `canvas.toBlob()`.
- "Copy Image" uses the Clipboard API's `ClipboardItem` with an `image/png` blob; if the browser
  blocks it (older Safari, insecure context), the error banner tells the user to use Download PNG
  instead — there's no silent failure.
- Size (180–512px) and error-correction level (L/M/Q/H) are both selectable; higher correction
  levels tolerate more damage/dirt but produce a denser pattern, which is called out in the label.
- Same nav-link pattern as the other pages — add `qr-generator.html` to the shared nav block if
  you build more standalone tool pages later.

## Content notes

A few bugs from the original site were fixed during this restyle — see the conversation this was
built in for the full list (mislabeled units on Light Year, Solar Mass, and electron/proton mass;
a couple of stray characters in copied values; a malformed HTML tag). No numeric values were
changed, only unit labels, copy-value typos, and one label that didn't match its actual copied
value (Pico).
