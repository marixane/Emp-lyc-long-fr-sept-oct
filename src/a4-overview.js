window.__a4OverviewZoomLevel = window.__a4OverviewZoomLevel || 0;

function applyA4OverviewZoom() {
  document.body.classList.remove(
    'a4-overview-zoom-1',
    'a4-overview-zoom-2',
    'a4-overview-zoom-3',
    'a4-overview-zoom-4'
  );

  var level = Number(window.__a4OverviewZoomLevel || 0);
  document.body.classList.toggle('a4-overview-mode', level > 0);
  if (level > 0) document.body.classList.add('a4-overview-zoom-' + level);
}

function disableA4OverviewForPdfButtons(panel) {
  panel.querySelectorAll(':scope > button').forEach(function (pdfButton) {
    var text = pdfButton.textContent || '';
    if (!text.includes('Voir PDF') && !text.includes('Exporter PDF')) return;
    if (pdfButton.dataset.a4OverviewPdfBound === 'true') return;
    pdfButton.dataset.a4OverviewPdfBound = 'true';
    pdfButton.addEventListener('click', function () {
      window.__a4OverviewZoomLevel = 0;
      applyA4OverviewZoom();
      syncA4OverviewButton();
    }, true);
  });
}

function focusArabicA4Overview() {
  if (window.__examLanguage !== 'ar') return;
  if (!document.body.classList.contains('a4-overview-mode')) return;

  var preview = document.querySelector('.preview-zone');
  var page = document.querySelector('.preview-zone .a4-page');
  if (!preview || !page) return;

  requestAnimationFrame(function () {
    preview.scrollTop = 0;
    preview.scrollLeft = 0;

    page.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      inline: 'start'
    });

    window.scrollBy({
      left: -12,
      top: 0,
      behavior: 'smooth'
    });
  });
}

function syncA4OverviewButton() {
  var panel = document.querySelector('.panel');
  if (!panel) return;

  disableA4OverviewForPdfButtons(panel);
  applyA4OverviewZoom();

  var button = document.querySelector('.a4-overview-toggle');
  if (!button) {
    button = document.createElement('button');
    button.type = 'button';
    button.className = 'a4-overview-toggle';
    button.addEventListener('click', function () {
      window.__a4OverviewZoomLevel = (Number(window.__a4OverviewZoomLevel || 0) + 1) % 5;
      applyA4OverviewZoom();
      syncA4OverviewButton();
      focusArabicA4Overview();
    });

    var pdfButton = Array.from(panel.querySelectorAll(':scope > button')).find(function (item) {
      return (item.textContent || '').includes('Voir PDF');
    });

    if (pdfButton && pdfButton.parentNode) {
      pdfButton.parentNode.insertBefore(button, pdfButton);
    } else {
      panel.appendChild(button);
    }
  }

  var level = Number(window.__a4OverviewZoomLevel || 0);
  button.textContent = level > 0 ? 'Zoom A4 ' + level + '/4' : 'Zoom A4';
  button.classList.toggle('active', level > 0);
}

syncA4OverviewButton();
setTimeout(syncA4OverviewButton, 100);
setTimeout(syncA4OverviewButton, 400);

new MutationObserver(syncA4OverviewButton).observe(document.body, { childList: true, subtree: true });
