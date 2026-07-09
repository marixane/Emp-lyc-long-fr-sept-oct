const DATE_PATTERN = /\b(\d{2})\/(\d{2})(?!\/\d{4})\b/g;
const FULL_DATE_PATTERN = /\b(\d{2})\/(\d{2})\/(\d{4})\b/;
const DAY_NAMES = ['DIMANCHE', 'LUNDI', 'MARDI', 'MERCREDI', 'JEUDI', 'VENDREDI', 'SAMEDI'];

const EVENTS = [
  { start: '31/10/2026', end: '31/10/2026', label: 'Nationale', text: 'Fête nationale : Fête de l’Unité', type: 'holiday' },
  { start: '20/01/2027', end: '24/01/2027', label: 'Primaire', text: 'Examen : Examen normalisé local', type: 'exam' },
  { start: '15/03/2027', end: '22/03/2027', label: 'Scolaire', text: 'Vacance scolaire : Vacances intermédiaires 3', type: 'holiday' },
  { start: '01/06/2027', end: '04/06/2027', label: 'Lycée', text: 'Examen : Examen national 2ème Bac', type: 'exam' },
  { start: '16/06/2027', end: '17/06/2027', label: 'Collège', text: 'Examen : Examen régional', type: 'exam' },
  { start: '23/06/2027', end: '24/06/2027', label: 'Primaire', text: 'Examen : Examen normalisé provincial', type: 'exam' },
  { start: '03/07/2027', end: '04/07/2027', label: 'Lycée', text: 'Rattrapage : 1ère Bac', type: 'exam' },
  { start: '06/07/2027', end: '09/07/2027', label: 'Lycée', text: 'Rattrapage : 2ème Bac', type: 'exam' },
  { start: '10/07/2027', end: '10/07/2027', label: 'Lycée', text: 'Signature du Procès-verbal de sortie', type: 'exam' }
];

const addYear = (text) => String(text || '').replace(DATE_PATTERN, (_, day, month) => {
  const year = Number(month) >= 9 ? 2026 : 2027;
  return `${day}/${month}/${year}`;
});

const parseDate = (value) => {
  const [day, month, year] = value.split('/').map(Number);
  return new Date(year, month - 1, day);
};

const formatDate = (date) => `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
const dayAndDate = (value) => {
  const date = parseDate(value);
  return `${DAY_NAMES[date.getDay()]} ${formatDate(date)}`;
};
const eventDate = (event) => event.start === event.end ? dayAndDate(event.start) : `${dayAndDate(event.start)} - ${dayAndDate(event.end)}`;
const firstDate = (entry) => entry.querySelector('.homework-date')?.textContent.match(FULL_DATE_PATTERN)?.[0] || '';
const eventText = (entry) => entry.querySelector('.homework-text')?.textContent || '';
const isNormalEntry = (entry) => !/Vacance|Fête nationale|Examen|Rattrapage|Procès-verbal/i.test(eventText(entry));

const styleEventEntry = (entry, event) => {
  const dateElement = entry.querySelector('.homework-date');
  const textElement = entry.querySelector('.homework-text');
  const subjectElement = entry.querySelector('.homework-subject');

  if (dateElement) dateElement.textContent = eventDate(event);
  if (textElement) textElement.textContent = event.text;
  if (subjectElement) {
    subjectElement.innerHTML = `<div style="display:flex;align-items:center;justify-content:center;min-height:42px;border:1px solid rgba(63,64,80,.18);border-radius:10px;background:rgba(63,64,80,.045)"><span style="display:inline-flex;align-items:center;justify-content:center;min-width:112px;height:34px;border-radius:999px;background:var(--homework-color);color:#fff;font-size:12px;font-weight:900">${event.label}</span></div>`;
  }

  entry.dataset.fixedEvent = event.text;
  entry.classList.toggle('cahier-exam-entry', event.type === 'exam');
  entry.classList.toggle('cahier-extra-holiday-entry', event.type === 'holiday');
};

const findEntryByText = (event) => [...document.querySelectorAll('.homework-entry')].find((entry) => {
  const key = event.text.replace(/^.*?:\s*/, '').toLowerCase();
  return eventText(entry).toLowerCase().includes(key);
});

const findNormalEntryAt = (date) => [...document.querySelectorAll('.homework-entry')].find((entry) => firstDate(entry) === date && isNormalEntry(entry));

const ensureEvent = (event) => {
  let entry = findEntryByText(event);
  if (!entry) entry = findNormalEntryAt(event.start);

  if (!entry && event.start === '16/06/2027') {
    const source = [...document.querySelectorAll('.homework-entry')].find((item) => firstDate(item) === event.start);
    if (source) {
      entry = source.cloneNode(true);
      source.insertAdjacentElement('afterend', entry);
    }
  }

  if (entry) styleEventEntry(entry, event);
};

const removeNormalDuplicates = () => {
  const eventStarts = new Set(EVENTS.map((event) => event.start));
  document.querySelectorAll('.homework-entry').forEach((entry) => {
    if (isNormalEntry(entry) && eventStarts.has(firstDate(entry))) entry.remove();
  });
};

const removeEventDuplicates = () => {
  const seen = new Set();
  document.querySelectorAll('.homework-entry').forEach((entry) => {
    const key = entry.dataset.fixedEvent;
    if (!key) return;
    if (seen.has(key)) entry.remove();
    else seen.add(key);
  });
};

const applyCorrections = () => {
  document.querySelectorAll('.homework-date').forEach((element) => {
    const next = addYear(element.textContent);
    if (element.textContent !== next) element.textContent = next;
  });

  document.querySelectorAll('.cahier-exams-list tbody tr').forEach((row) => {
    Array.from(row.cells).slice(0, 2).forEach((cell) => {
      const next = addYear(cell.textContent);
      if (cell.textContent !== next) cell.textContent = next;
    });
  });

  document.querySelectorAll('.holidays-page td').forEach((cell) => {
    const next = addYear(cell.textContent);
    if (cell.textContent !== next) cell.textContent = next;
  });

  EVENTS.forEach(ensureEvent);
  removeNormalDuplicates();
  removeEventDuplicates();

  document.querySelectorAll('.homework-page').forEach((page) => {
    if (!page.querySelector('.homework-entry')) page.remove();
  });
};

const scheduleApply = () => {
  requestAnimationFrame(applyCorrections);
  window.setTimeout(applyCorrections, 50);
  window.setTimeout(applyCorrections, 150);
};

export const scheduleFullDates = () => {
  applyCorrections();
  scheduleApply();

  const events = ['click', 'input', 'change', 'keyup', 'drop'];
  events.forEach((eventName) => document.addEventListener(eventName, scheduleApply, true));
  const interval = window.setInterval(applyCorrections, 500);

  return () => {
    events.forEach((eventName) => document.removeEventListener(eventName, scheduleApply, true));
    window.clearInterval(interval);
  };
};
