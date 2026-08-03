// Shared copy-to-clipboard + toast logic for ScienceNotations.
// Two copy modes, same as the original site:
//  - copyPlain(): plain text symbols (π, σ, Δ, ...)
//  - copyRich(): HTML with real <sup>/<sub> formatting, so it pastes correctly
//    formatted into Word/Google Docs instead of as raw "x2" text.

let toastTimer;

function showToast(label, symbolHTML) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.innerHTML = `Copied: <span class="toast-sym">${symbolHTML}</span>`;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2200);
}

function flashChip(chipEl) {
  chipEl.classList.add('copied');
  setTimeout(() => chipEl.classList.remove('copied'), 900);
}

async function copyPlain(text, chipEl) {
  try {
    await navigator.clipboard.writeText(text);
  } catch (err) {
    // fallback for older browsers / non-secure contexts
    const el = document.createElement('textarea');
    el.value = text;
    el.style.position = 'fixed';
    el.style.opacity = '0';
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
  }
  flashChip(chipEl);
  showToast(text, text);
}

async function copyRich(html, plainFallback, chipEl) {
  try {
    const blob = new Blob([html], { type: 'text/html' });
    const textBlob = new Blob([plainFallback], { type: 'text/plain' });
    const item = new ClipboardItem({ 'text/html': blob, 'text/plain': textBlob });
    await navigator.clipboard.write([item]);
  } catch (err) {
    // fallback: plain text only
    try {
      await navigator.clipboard.writeText(plainFallback);
    } catch (err2) {
      const el = document.createElement('textarea');
      el.value = plainFallback;
      el.style.position = 'fixed';
      el.style.opacity = '0';
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    }
  }
  flashChip(chipEl);
  showToast(plainFallback, html);
}

// Highlights the active section in the sticky table-of-contents as the user scrolls.
function initScrollSpy() {
  const sections = document.querySelectorAll('.notation-section[id]');
  const tocLinks = document.querySelectorAll('.toc a');
  if (!sections.length || !tocLinks.length) return;

  const map = new Map();
  tocLinks.forEach((link) => map.set(link.getAttribute('href').slice(1), link));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const link = map.get(entry.target.id);
        if (!link) return;
        if (entry.isIntersecting) {
          tocLinks.forEach((l) => l.classList.remove('active-section'));
          link.classList.add('active-section');
        }
      });
    },
    { rootMargin: '-80px 0px -70% 0px' }
  );

  sections.forEach((s) => observer.observe(s));
}

document.addEventListener('DOMContentLoaded', initScrollSpy);
