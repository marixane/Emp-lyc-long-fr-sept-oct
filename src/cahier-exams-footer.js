const EXAM_ROWS = [
  ['Primaire', 'Examen normalisé local', '18–19 janvier 2027'],
  ['Lycée', 'Examen régional 1ère Bac', '28–29 mai 2027'],
  ['Lycée', 'Examen national 2ème Bac', '01–03 juin 2027'],
  ['Collège', 'Examen régional', '23–24 juin 2027'],
  ['Primaire', 'Examen normalisé provincial', '25–26 juin 2027'],
  ['Lycée', 'Rattrapage 1ère Bac', '28–29 juin 2027'],
  ['Lycée', 'Rattrapage 2ème Bac', '01–03 juillet 2027']
];

const makeExamCell = (text, header = false) => {
  const cell = document.createElement(header ? 'th' : 'td');
  cell.textContent = text;
  if (!header) {
    cell.contentEditable = 'true';
    cell.setAttribute('suppresscontenteditablewarning', 'true');
    cell.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        cell.blur();
      }
    });
  }
  return cell;
};

const buildExamTable = () => {
  const wrap = document.createElement('div');
  wrap.className = 'cahier-exams-footer';

  const title = document.createElement('div');
  title.className = 'cahier-exams-title';
  title.textContent = 'Tableau des examens 2026-2027';

  const table = document.createElement('table');
  table.className = 'cahier-exams-table';

  const thead = document.createElement('thead');
  const headerRow = document.createElement('tr');
  ['Cycle', 'Examen', 'Date'].forEach((text) => headerRow.append(makeExamCell(text, true)));
  thead.append(headerRow);

  const tbody = document.createElement('tbody');
  EXAM_ROWS.forEach((row) => {
    const tr = document.createElement('tr');
    row.forEach((text) => tr.append(makeExamCell(text)));
    tbody.append(tr);
  });

  table.append(thead, tbody);
  wrap.append(title, table);
  return wrap;
};

const getTimetablePage = () => Array.from(document.querySelectorAll('.cahier-page'))
  .find((page) => page.querySelector('.timetable-table'));

const applyCahierExamsFooter = () => {
  if (!document.body.classList.contains('cahier-tab-active')) return false;
  const page = getTimetablePage();
  if (!page) return false;

  page.querySelectorAll('.cahier-footer').forEach((footer) => footer.remove());

  if (!page.querySelector('.cahier-exams-footer')) page.append(buildExamTable());
  return true;
};

let examsFooterRetryCount = 0;
const scheduleCahierExamsFooter = () => window.requestAnimationFrame(() => {
  const done = applyCahierExamsFooter();
  if (!done && examsFooterRetryCount < 18) {
    examsFooterRetryCount += 1;
    window.setTimeout(scheduleCahierExamsFooter, 250);
  }
});

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', scheduleCahierExamsFooter, { once: true });
} else {
  scheduleCahierExamsFooter();
}

document.addEventListener('click', () => window.setTimeout(scheduleCahierExamsFooter, 120), { passive: true });
