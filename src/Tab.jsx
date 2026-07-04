import { useState } from 'react';

const DAYS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
const HOURS = ['08:00 - 09:00', '09:00 - 10:00', '10:00 - 11:00', '11:00 - 12:00', '14:00 - 15:00', '15:00 - 16:00', '16:00 - 17:00', '17:00 - 18:00'];

const createRows = () => HOURS.map((hour) => ({
  hour,
  cells: DAYS.reduce((acc, day) => ({ ...acc, [day]: '' }), {})
}));

export default function Tab() {
  const [school, setSchool] = useState('Établissement :');
  const [teacher, setTeacher] = useState('Professeur :');
  const [year, setYear] = useState('Année scolaire : 2026 / 2027');
  const [rows, setRows] = useState(createRows);

  const updateHour = (index, value) => {
    setRows((current) => current.map((row, i) => i === index ? { ...row, hour: value } : row));
  };

  const updateCell = (index, day, value) => {
    setRows((current) => current.map((row, i) => i === index ? {
      ...row,
      cells: { ...row.cells, [day]: value }
    } : row));
  };

  const addRow = () => {
    setRows((current) => [...current, {
      hour: '',
      cells: DAYS.reduce((acc, day) => ({ ...acc, [day]: '' }), {})
    }]);
  };

  const removeRow = () => {
    setRows((current) => current.length > 1 ? current.slice(0, -1) : current);
  };

  const clearTable = () => {
    setRows(createRows());
  };

  const printPage = () => {
    window.print();
  };

  return <main className="cahier-shell">
    <section className="cahier-panel no-print">
      <p className="eyebrow">Tab</p>
      <h1>Cahier de texte</h1>
      <p className="intro">Remplis l’emploi du temps, puis imprime la page A4 ou sauvegarde en PDF.</p>

      <button type="button" onClick={addRow}>Ajouter une ligne horaire</button>
      <button type="button" className="secondary" onClick={removeRow}>Supprimer la dernière ligne</button>
      <button type="button" className="secondary" onClick={clearTable}>Vider le tableau</button>
      <button type="button" onClick={printPage}>Imprimer / PDF A4</button>
    </section>

    <section className="cahier-preview-zone">
      <div className="a4-page cahier-page">
        <header className="cahier-header">
          <input value={school} onChange={(e) => setSchool(e.target.value)} />
          <h2>Cahier de texte</h2>
          <input value={teacher} onChange={(e) => setTeacher(e.target.value)} />
          <input value={year} onChange={(e) => setYear(e.target.value)} />
        </header>

        <table className="timetable-table">
          <thead>
            <tr>
              <th>Horaire</th>
              {DAYS.map((day) => <th key={day}>{day}</th>)}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => <tr key={index}>
              <td className="hour-cell">
                <textarea value={row.hour} onChange={(e) => updateHour(index, e.target.value)} rows="2" />
              </td>
              {DAYS.map((day) => <td key={day}>
                <textarea
                  value={row.cells[day]}
                  onChange={(e) => updateCell(index, day, e.target.value)}
                  placeholder="Classe / matière / salle"
                  rows="3"
                />
              </td>)}
            </tr>)}
          </tbody>
        </table>

        <footer className="cahier-footer">
          <span>Signature :</span>
          <span>Observations :</span>
        </footer>
      </div>
    </section>
  </main>;
}
