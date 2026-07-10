const CAHIER_PREVIEW_BUTTON_ID = 'cahier-pdf-preview-stable';

const protectCahierPreviewButton = () => {
  const button = document.getElementById(CAHIER_PREVIEW_BUTTON_ID);
  if (!button) return;

  // Le générateur PDF des examens intercepte globalement les boutons
  // dont le texte contient exactement « Voir PDF ».
  // Ce libellé distinct laisse le clic au générateur PDF du cahier.
  if (button.textContent?.trim() === 'Voir PDF') {
    button.textContent = 'Aperçu PDF';
  }
  button.title = 'Générer et afficher le PDF complet du cahier de texte';
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', protectCahierPreviewButton, { once: true });
} else {
  protectCahierPreviewButton();
}

window.setTimeout(protectCahierPreviewButton, 100);
window.setTimeout(protectCahierPreviewButton, 500);
