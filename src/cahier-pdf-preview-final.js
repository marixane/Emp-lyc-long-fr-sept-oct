const PREVIEW_BUTTON_ID = 'cahier-pdf-preview-stable';
const DOWNLOAD_BUTTON_ID = 'cahier-pdf-button-stable';

const replacePreviewBehavior = () => {
  const previewButton = document.getElementById(PREVIEW_BUTTON_ID);
  const downloadButton = document.getElementById(DOWNLOAD_BUTTON_ID);
  if (!previewButton || !downloadButton || previewButton.dataset.pdfPreviewFixed === 'true') return;

  const replacement = previewButton.cloneNode(true);
  replacement.dataset.pdfPreviewFixed = 'true';
  previewButton.replaceWith(replacement);

  replacement.addEventListener('click', () => {
    const previewWindow = window.open('about:blank', '_blank');
    if (!previewWindow) {
      alert('Autorisez les fenêtres surgissantes pour voir le PDF.');
      return;
    }

    previewWindow.document.open();
    previewWindow.document.write('<!doctype html><html><head><meta charset="utf-8"><title>Préparation du PDF…</title></head><body style="font-family:Arial,sans-serif;padding:32px"><h2>Préparation du PDF…</h2><p>Veuillez patienter pendant la génération complète.</p></body></html>');
    previewWindow.document.close();

    const originalText = replacement.textContent;
    replacement.disabled = true;
    replacement.textContent = 'Préparation PDF...';

    let completed = false;

    const interceptDownload = async (event) => {
      const link = event.target?.closest?.('a[download]');
      if (!link || !String(link.download).toLowerCase().endsWith('.pdf') || !String(link.href).startsWith('blob:')) return;

      event.preventDefault();
      event.stopImmediatePropagation();
      completed = true;
      document.removeEventListener('click', interceptDownload, true);

      try {
        replacement.textContent = 'Ouverture PDF...';
        const response = await fetch(link.href);
        const buffer = await response.arrayBuffer();
        const pdfBlob = new Blob([buffer], { type: 'application/pdf' });
        const pdfUrl = URL.createObjectURL(pdfBlob);

        previewWindow.location.replace(pdfUrl);
        replacement.textContent = 'PDF ouvert';
        window.setTimeout(() => URL.revokeObjectURL(pdfUrl), 10 * 60 * 1000);
      } catch (error) {
        if (!previewWindow.closed) previewWindow.close();
        alert(`Erreur PDF : ${error?.message || 'aperçu impossible'}`);
      } finally {
        replacement.disabled = false;
        window.setTimeout(() => { replacement.textContent = originalText; }, 900);
      }
    };

    document.addEventListener('click', interceptDownload, true);
    downloadButton.click();

    window.setTimeout(() => {
      if (completed) return;
      document.removeEventListener('click', interceptDownload, true);
      replacement.disabled = false;
      replacement.textContent = originalText;
      if (!previewWindow.closed) previewWindow.close();
      alert('Le PDF n’a pas été généré dans le délai prévu.');
    }, 120000);
  });
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', replacePreviewBehavior, { once: true });
} else {
  replacePreviewBehavior();
}

window.setTimeout(replacePreviewBehavior, 500);
