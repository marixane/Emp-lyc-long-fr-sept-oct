const isAfterJuly10 = (text) => {
  const match = String(text || '').match(/(\d{1,2})\/07(?:\/\d{4})?/);
  return match ? Number(match[1]) > 10 : false;
};

const updateJulyVisibility = () => {
  document.querySelectorAll('.homework-page').forEach((page) => {
    const entries = Array.from(page.querySelectorAll('.homework-entry'));

    entries.forEach((entry) => {
      const dateText = entry.querySelector('.homework-date')?.textContent || '';
      const shouldHide = isAfterJuly10(dateText);
      entry.hidden = shouldHide;

      if (shouldHide) {
        entry.style.setProperty('display', 'none', 'important');
      } else {
        entry.style.removeProperty('display');
      }
    });

    const hasVisibleEntry = entries.some((entry) => !entry.hidden);
    page.hidden = entries.length > 0 && !hasVisibleEntry;

    if (page.hidden) {
      page.style.setProperty('display', 'none', 'important');
    } else {
      page.style.removeProperty('display');
    }
  });
};

let scheduled = false;
const scheduleUpdate = () => {
  if (scheduled) return;
  scheduled = true;
  requestAnimationFrame(() => {
    scheduled = false;
    updateJulyVisibility();
  });
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', scheduleUpdate, { once: true });
} else {
  scheduleUpdate();
}

new MutationObserver(scheduleUpdate).observe(document.documentElement, {
  childList: true,
  subtree: true
});
