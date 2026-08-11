// QR code generator logic for qr-generator.html.
// Uses the qrcodejs library (davidshimjs), loaded via CDN in the page <head>/<body>.
// Renders into a canvas so we can offer PNG download + clipboard-image copy.

let qrInstance = null;
let debounceTimer = null;

function getPreviewEl() {
  return document.getElementById('qr-preview');
}

function getCanvas() {
  const preview = getPreviewEl();
  return preview ? preview.querySelector('canvas') : null;
}

function showQrError(message) {
  const errEl = document.getElementById('qr-error');
  if (!errEl) return;
  errEl.textContent = message || '';
  errEl.style.display = message ? 'block' : 'none';
}

function setActionsEnabled(enabled) {
  const dl = document.getElementById('qr-download-btn');
  const copy = document.getElementById('qr-copy-btn');
  [dl, copy].forEach((btn) => {
    if (!btn) return;
    btn.disabled = !enabled;
  });
}

function generateQr() {
  const textEl = document.getElementById('qr-text');
  const sizeEl = document.getElementById('qr-size');
  const levelEl = document.getElementById('qr-level');
  const preview = getPreviewEl();
  if (!textEl || !sizeEl || !levelEl || !preview) return;

  const text = textEl.value.trim();
  preview.innerHTML = '';
  showQrError('');

  if (!text) {
    preview.classList.add('qr-empty');
    preview.innerHTML = '<span>Your QR code will appear here</span>';
    setActionsEnabled(false);
    qrInstance = null;
    return;
  }

  if (text.length > 1800) {
    preview.classList.add('qr-empty');
    preview.innerHTML = '<span>Text is too long for a reliable QR code</span>';
    showQrError('Try shortening the text — very long input makes the code dense and hard to scan.');
    setActionsEnabled(false);
    qrInstance = null;
    return;
  }

  preview.classList.remove('qr-empty');
  const size = parseInt(sizeEl.value, 10) || 256;
  const levelKey = levelEl.value || 'M';

  try {
    qrInstance = new QRCode(preview, {
      text: text,
      width: size,
      height: size,
      colorDark: '#142524',
      colorLight: '#ffffff',
      correctLevel: QRCode.CorrectLevel[levelKey]
    });
    setActionsEnabled(true);
  } catch (err) {
    preview.classList.add('qr-empty');
    preview.innerHTML = '<span>Could not generate a QR code</span>';
    showQrError('Something about that input could not be encoded. Try shortening or simplifying it.');
    setActionsEnabled(false);
    qrInstance = null;
  }
}

function scheduleGenerate() {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(generateQr, 350);
}

function downloadQr() {
  const canvas = getCanvas();
  if (!canvas) return;
  const link = document.createElement('a');
  link.download = 'qr-code.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
}

async function copyQrImage(btnEl) {
  const canvas = getCanvas();
  if (!canvas) return;
  try {
    const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
    if (!blob) throw new Error('no blob');
    await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
    if (btnEl) {
      const original = btnEl.textContent;
      btnEl.textContent = 'Copied!';
      setTimeout(() => { btnEl.textContent = original; }, 1400);
    }
  } catch (err) {
    showQrError('Your browser blocked copying the image — use Download PNG instead.');
  }
}

function initQrGenerator() {
  const textEl = document.getElementById('qr-text');
  const sizeEl = document.getElementById('qr-size');
  const levelEl = document.getElementById('qr-level');
  const genBtn = document.getElementById('qr-generate-btn');
  const dlBtn = document.getElementById('qr-download-btn');
  const copyBtn = document.getElementById('qr-copy-btn');

  if (!textEl) return; // not on this page

  textEl.addEventListener('input', scheduleGenerate);
  sizeEl.addEventListener('change', generateQr);
  levelEl.addEventListener('change', generateQr);
  genBtn.addEventListener('click', generateQr);
  dlBtn.addEventListener('click', downloadQr);
  copyBtn.addEventListener('click', () => copyQrImage(copyBtn));

  setActionsEnabled(false);
}

document.addEventListener('DOMContentLoaded', initQrGenerator);
