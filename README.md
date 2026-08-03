# ScienceNotations

A copy-paste library of mathematical, physics, and chemistry notations and constants for STEM
lab reports restyled to match the [ChemBench](https://o-tran.github.io/chembench/) theme.
Click any button to copy it; formatted notations (exponents, subscripts) paste correctly into
Word and Google Docs instead of as raw text.

No build step, no dependencies — just static HTML, CSS, and vanilla JS.

## File structure

```
.
├── index.html            # main notations page (12 sections)
├── greek-alphabet.html   # Greek alphabet (uppercase + lowercase)
├── styles.css            # shared stylesheet (ChemBench design tokens)
└── script.js             # shared copy-to-clipboard + toast logic
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

## Content notes

Original Version: [Science notation](https://o-tran.github.io/ScienceNotations/)

A few bugs from the original site were fixed during this restyle — see the conversation this was
built in for the full list (mislabeled units on Light Year, Solar Mass, and electron/proton mass;
a couple of stray characters in copied values; a malformed HTML tag). No numeric values were
changed, only unit labels, copy-value typos, and one label that didn't match its actual copied
value (Pico).
