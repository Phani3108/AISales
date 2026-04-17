/**
 * Sales Copilot Widget — Embeddable JS for HighLevel Custom Code
 * 
 * Usage in HighLevel:
 *   Settings → Custom Code → Body:
 *   <script src="https://YOUR_VERCEL_URL/widget/copilot-widget.js" data-copilot-url="https://YOUR_VERCEL_URL"></script>
 */
(function () {
  'use strict';

  const script = document.currentScript;
  const rawUrl = script?.getAttribute('data-copilot-url') || window.location.origin;

  // Validate URL — reject dangerous schemes (XSS prevention)
  let COPILOT_URL;
  try {
    const parsed = new URL(rawUrl, window.location.origin);
    if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
      console.error('[Sales Copilot] Blocked unsafe URL scheme:', parsed.protocol);
      return;
    }
    COPILOT_URL = parsed.origin;
  } catch {
    console.error('[Sales Copilot] Invalid data-copilot-url:', rawUrl);
    return;
  }

  // Prevent double-init
  if (document.getElementById('sales-copilot-widget')) return;

  // ── Styles ──
  const style = document.createElement('style');
  style.textContent = `
    #sales-copilot-fab {
      position: fixed;
      bottom: 24px;
      right: 24px;
      width: 56px;
      height: 56px;
      border-radius: 16px;
      background: #4F46E5;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      box-shadow: 0 4px 24px rgba(79, 70, 229, 0.4);
      z-index: 99999;
      border: none;
      font-size: 24px;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    #sales-copilot-fab:hover {
      transform: scale(1.05);
      box-shadow: 0 6px 32px rgba(79, 70, 229, 0.5);
    }
    #sales-copilot-frame-container {
      position: fixed;
      bottom: 92px;
      right: 24px;
      width: 400px;
      height: 580px;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 8px 48px rgba(0, 0, 0, 0.4);
      z-index: 99998;
      display: none;
      border: 1px solid #374151;
    }
    #sales-copilot-frame-container.open {
      display: block;
      animation: copilotSlideUp 0.25s ease-out;
    }
    #sales-copilot-frame {
      width: 100%;
      height: 100%;
      border: none;
    }
    @keyframes copilotSlideUp {
      from { opacity: 0; transform: translateY(16px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `;
  document.head.appendChild(style);

  // ── FAB Button ──
  const fab = document.createElement('button');
  fab.id = 'sales-copilot-fab';
  fab.innerHTML = '🤖';
  fab.title = 'Open Sales Copilot';
  document.body.appendChild(fab);

  // ── Iframe Container ──
  const container = document.createElement('div');
  container.id = 'sales-copilot-frame-container';
  const iframe = document.createElement('iframe');
  iframe.id = 'sales-copilot-frame';
  iframe.src = COPILOT_URL;
  iframe.allow = 'clipboard-write';
  container.appendChild(iframe);
  document.body.appendChild(container);

  // ── Toggle ──
  let isOpen = false;
  fab.addEventListener('click', () => {
    isOpen = !isOpen;
    container.classList.toggle('open', isOpen);
    fab.innerHTML = isOpen ? '✕' : '🤖';
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen) {
      isOpen = false;
      container.classList.remove('open');
      fab.innerHTML = '🤖';
    }
  });
})();
