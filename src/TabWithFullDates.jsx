import { useEffect } from 'react';
import Tab from './Tab.jsx';

const DATE_PATTERN = /\b(\d{2})\/(\d{2})(?!\/\d{4})\b/g;

const getSchoolStartYear = () => {
  const today = new Date();
  return today.getMonth() >= 8 ? today.getFullYear() : today.getFullYear() - 1;
};

const addSchoolYearToDates = (text) => {
  const startYear = getSchoolStartYear();
  return String(text ?? '').replace(DATE_PATTERN, (_, day, month) => {
    const year = Number(month) >= 9 ? startYear : startYear + 1;
    return `${day}/${month}/${year}`;
  });
};

const updateDisplayedDates = () => {
  document.querySelectorAll('.homework-date').forEach((element) => {
    const nextText = addSchoolYearToDates(element.textContent);
    if (element.textContent !== nextText) element.textContent = nextText;
  });

  document.querySelectorAll('.cahier-exams-list tbody tr').forEach((row) => {
    Array.from(row.cells).slice(0, 2).forEach((cell) => {
      const nextText = addSchoolYearToDates(cell.textContent);
      if (cell.textContent !== nextText) cell.textContent = nextText;
    });
  });
};

export default function TabWithFullDates() {
  useEffect(() => {
    updateDisplayedDates();

    const observer = new MutationObserver(updateDisplayedDates);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, []);

  return <>
    <style>{`
      .homework-date {
        border-bottom: 2px dotted rgba(63, 64, 80, 0.5) !important;
        padding-bottom: 8px !important;
      }
    `}</style>
    <Tab />
  </>;
}
