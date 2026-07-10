const PLACEHOLDER_TEXT = 'Déposer ici';
let scheduled = false;

const hideDropPlaceholder = () => {
  scheduled = false;

  document.querySelectorAll('.cahier-page div').forEach((element) => {
    if (element.children.length > 0) return;
    if (String(element.textContent || '').trim() !== PLACEHOLDER_TEXT) return;
    element.textContent = '';
    element.setAttribute('aria-label', 'Zone de dépôt');
  });
};

const scheduleHide = () => {
  if (scheduled) return;
  scheduled = true;
  requestAnimationFrame(hideDropPlaceholder);
};

const observer = new MutationObserver(scheduleHide);
observer.observe(document.documentElement, { childList: true, subtree: true });

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', scheduleHide, { once: true });
} else {
  scheduleHide();
}
