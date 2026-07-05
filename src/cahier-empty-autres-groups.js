const markEmptyAutresGroups = () => {
  if (!document.body.classList.contains('cahier-tab-active')) return false;
  const timetablePage = Array.from(document.querySelectorAll('.cahier-page'))
    .find((page) => page.querySelector('.timetable-table'));
  if (!timetablePage) return false;

  const groupsWrap = Array.from(timetablePage.children).find((child) => {
    const style = child.getAttribute('style') || '';
    return style.includes('grid-template-columns: repeat(5');
  });
  if (!groupsWrap) return false;

  Array.from(groupsWrap.children).forEach((group) => {
    const title = String(group.children?.[0]?.textContent || '').trim().toUpperCase();
    const body = group.children?.[1];
    const hasRealClass = Boolean(body?.querySelector('span'));
    const wantedClass = title === 'AUTRES' ? (hasRealClass ? 'cahier-filled-other-group' : 'cahier-empty-other-group') : '';

    if (group.dataset.autresState === wantedClass) return;
    group.dataset.autresState = wantedClass;
    group.classList.remove('cahier-empty-other-group', 'cahier-filled-other-group');
    if (wantedClass) group.classList.add(wantedClass);
  });
  return true;
};

let autresGroupsRaf = 0;
const scheduleMarkEmptyAutresGroups = () => {
  if (autresGroupsRaf) return;
  autresGroupsRaf = window.requestAnimationFrame(() => {
    autresGroupsRaf = 0;
    markEmptyAutresGroups();
  });
};

let autresGroupsRetryCount = 0;
const retryMarkEmptyAutresGroups = () => {
  const done = markEmptyAutresGroups();
  if (!done && autresGroupsRetryCount < 18) {
    autresGroupsRetryCount += 1;
    window.setTimeout(retryMarkEmptyAutresGroups, 250);
  }
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', retryMarkEmptyAutresGroups, { once: true });
} else {
  retryMarkEmptyAutresGroups();
}

document.addEventListener('input', scheduleMarkEmptyAutresGroups, { passive: true });
document.addEventListener('drop', () => window.setTimeout(scheduleMarkEmptyAutresGroups, 120), { passive: true });
document.addEventListener('mouseup', () => window.setTimeout(scheduleMarkEmptyAutresGroups, 120), { passive: true });
