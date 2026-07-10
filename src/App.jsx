import { useEffect, useLayoutEffect } from 'react';
import CoverPage from './CoverPage.jsx';
import TabWithFullDates from './TabWithFullDates.jsx';
import { scheduleFullDates } from './force-full-cahier-dates.js';

const removeOldFirstPages = () => {
  document.querySelectorAll('.holidays-page').forEach((page) => page.remove());

  document.querySelectorAll('.a4-page').forEach((page) => {
    const text = String(page.textContent || '').replace(/\s+/g, ' ').trim().toLowerCase();
    const isOldCover = text.includes('mon cahier') || text.includes("classes remplies dans l'emploi du temps");
    if (isOldCover) page.remove();
  });
};

const moveGroupsBelowTimetable = () => {
  const timetable = document.querySelector('.timetable-table');
  const timetablePage = timetable?.closest('.a4-page.cahier-page');
  if (!timetable || !timetablePage) return;

  const groupsContainer = [...document.querySelectorAll('.a4-page.cahier-page div')].find((element) => {
    const children = [...element.children];
    if (children.length !== 3) return false;

    const titles = children.map((child) => String(child.textContent || '').replace(/\s+/g, ' ').trim().toUpperCase());
    return titles[0].startsWith('TRONC COMMUN')
      && titles[1].startsWith('1ÈRES BAC')
      && titles[2].startsWith('2ÈME BAC');
  });

  if (!groupsContainer) return;

  groupsContainer.classList.add('groups-under-timetable');
  timetable.insertAdjacentElement('afterend', groupsContainer);
};

const refreshLayout = () => {
  removeOldFirstPages();
  moveGroupsBelowTimetable();
};

export default function App() {
  useEffect(() => {
    document.body.classList.add('cahier-tab-active');
    document.body.classList.remove('devoir-tab-active');

    let scheduled = false;
    const scheduleRefresh = () => {
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(() => {
        scheduled = false;
        refreshLayout();
      });
    };

    const observer = new MutationObserver(scheduleRefresh);
    observer.observe(document.body, { childList: true, subtree: true });
    scheduleRefresh();

    return () => {
      observer.disconnect();
      document.body.classList.remove('cahier-tab-active');
    };
  }, []);

  useLayoutEffect(() => {
    scheduleFullDates();
    refreshLayout();
  });

  return <>
    <style>{`
      .groups-under-timetable {
        display: grid !important;
        grid-template-columns: repeat(3, 1fr) !important;
        gap: 18px !important;
        width: calc(100% - 132px) !important;
        margin: 28px auto 0 !important;
      }

      .groups-under-timetable > div {
        min-height: 190px !important;
      }
    `}</style>
    <CoverPage />
    <TabWithFullDates />
  </>;
}