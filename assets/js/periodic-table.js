// Periodic table page logic.
// - Renders all 118 elements into a CSS grid from the ELEMENTS data array.
// - Each cell shows a miniature "card" (number / symbol / name / mass) at rest;
//   CSS transform: scale() on hover/focus pops it up to full size, matching the
//   reference layout: atomic number on top, big symbol in the middle, name below,
//   then molar mass in g/mol at the bottom.
// - Click behavior (uses copyPlain() from script.js for the actual clipboard write
//   + toast + flash, so it stays consistent with the rest of the site):
//     1 click  -> copy the chemical symbol
//     2 clicks -> copy the element name
//     3 clicks -> copy the molar mass (as "12.011 g/mol")

const CLICK_WINDOW_MS = 450;

function buildElementCell(el) {
  const btn = document.createElement('button');
  btn.className = `element el-${el.cat}`;
  btn.style.gridColumn = String(el.col);
  btn.style.gridRow = String(el.row);
  btn.setAttribute('type', 'button');
  btn.setAttribute('aria-label', `${el.name} (${el.s}), atomic number ${el.n}, molar mass ${el.mass} g/mol`);
  btn.setAttribute('title', `${el.name} — click: symbol, double-click: name, triple-click: molar mass`);
  btn.innerHTML = `
    <span class="num">${el.n}</span>
    <span class="sym">${el.s}</span>
    <span class="ename">${el.name}</span>
    <span class="mass">${el.mass}<span class="unit"> g/mol</span></span>
  `;

  let clickCount = 0;
  let clickTimer = null;

  btn.addEventListener('click', () => {
    clickCount++;

    if (clickCount >= 3) {
      clearTimeout(clickTimer);
      clickCount = 0;
      copyPlain(`${el.massPlain} g/mol`, btn);
      return;
    }

    clearTimeout(clickTimer);
    clickTimer = setTimeout(() => {
      if (clickCount === 1) {
        copyPlain(el.s, btn);
      } else if (clickCount === 2) {
        copyPlain(el.name, btn);
      }
      clickCount = 0;
    }, CLICK_WINDOW_MS);
  });

  return btn;
}

function buildPeriodicTable() {
  const grid = document.getElementById('ptable');
  if (!grid || typeof ELEMENTS === 'undefined') return;
  const frag = document.createDocumentFragment();
  ELEMENTS.forEach((el) => frag.appendChild(buildElementCell(el)));
  grid.appendChild(frag);
}

document.addEventListener('DOMContentLoaded', buildPeriodicTable);
