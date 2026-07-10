const PREVIEW_BUTTON_ID = 'cahier-pdf-preview-stable';
const DOWNLOAD_BUTTON_ID = 'cahier-pdf-button-stable';
const PDF_ENDPOINT = '/api/cahier-pdf';

const writeLoadingPage = (previewWindow) => {
  previewWindow.document.open();
  previewWindow.document.write(`<!doctype html>
    <html lang="fr">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width,initial-scale=1">
        <title>Préparation du PDF…</title>
      </head>
      <body style="margin:0;display:flex;min-height:100vh;align-items:center;justify-content:center;background:#f8fafc;font-family:Arial,sans-serif;color:#0f172a">
        <div style="text-align:center;padding:32px">
          <h2 style="margin:0 0 12px">Préparation du PDF…</h2>
          <p style="margin:0">Veuillez patienter pendant la génération complète.</p>
        </div>
      </body>
    </html>`);
  previewWindow.document.close();
};

const isPdfEndpoint = (input) => {
  try {
    const value = input instanceof Request ? input.url : String(input || '');
    return new URL(value, window.location.origin).pathname === PDF_ENDPOINT;
  } catch {
    return false;
  }
};

const hasPdfSignature = (buffer) => {
  if (!buffer || buffer.byteLength < 5) return false;
  const bytes = new Uint8Array(buffer, 0, 5);
  return String.fromCharCode(...bytes) === '%PDF-';
};

const replacePreviewBehavior = () => {
  const previewButton = document.getElementById(PREVIEW_BUTTON_ID);
  const downloadButton = document.getElementById(DOWNLOAD_BUTTON_ID);
  if (!previewButton || !downloadButton || previewButton.dataset.pdfPreviewFixed === 'response') return;

  const replacement = previewButton.cloneNode(true);
  replacement.dataset.pdfPreviewFixed = 'response';
  previewButton.replaceWith(replacement);

  replacement.addEventListener('click', () => {
    const previewWindow = window.open('about:blank', '_blank');
    if (!previewWindow) {
      alert('Autorisez les fenêtres surgissantes pour voir le PDF.');
      return;
    }

    writeLoadingPage(previewWindow);

    const originalText = replacement.textContent;
    const originalFetch = window.fetch.bind(window);
    let completed = false;
    let restored = false;
    let pdfUrl = '';

    replacement.disabled = true;
    replacement.textContent = 'Préparation PDF...';

    const stopDownload = (event) => {
      const link = event.target?.closest?.('a[download]');
      if (!link || !String(link.download).toLowerCase().endsWith('.pdf')) return;
      event.preventDefault();
      event.stopImmediatePropagation();
    };

    const restore = () => {
      if (restored) return;
      restored = true;
      window.fetch = originalFetch;
      document.removeEventListener('click', stopDownload, true);
      replacement.disabled = false;
      window.setTimeout(() => { replacement.textContent = originalText; }, 900);
    };

    const fail = (error) => {
      restore();
      if (!previewWindow.closed) previewWindow.close();
      alert(`Erreur PDF : ${error?.message || 'aperçu impossible'}`);
    };

    document.addEventListener('click', stopDownload, true);

    window.fetch = async (...args) => {
      const response = await originalFetch(...args);

      if (!isPdfEndpoint(args[0]) || !response.ok) return response;

      const previewResponse = response.clone();

      previewResponse.arrayBuffer().then((buffer) => {
        if (!hasPdfSignature(buffer)) {
          throw new Error('La réponse reçue n’est pas un fichier PDF valide.');
        }

        const blob = new Blob([buffer], { type: 'application/pdf' });
        if (blob.size < 1000) {
          throw new Error('Le fichier PDF généré est vide.');
        }

        completed = true;
        replacement.textContent = 'Ouverture PDF...';
        pdfUrl = URL.createObjectURL(blob);
        previewWindow.location.replace(pdfUrl);
        replacement.textContent = 'PDF ouvert';
        restore();

        window.setTimeout(() => {
          if (pdfUrl) URL.revokeObjectURL(pdfUrl);
        }, 60 * 60 * 1000);
      }).catch(fail);

      return response;
    };

    downloadButton.click();

    window.setTimeout(() => {
      if (completed) return;
      fail(new Error('Le PDF n’a pas été généré dans le délai prévu.'));
    }, 120000);
  });
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', replacePreviewBehavior, { once: true });
} else {
  replacePreviewBehavior();
}

window.setTimeout(replacePreviewBehavior, 500);
