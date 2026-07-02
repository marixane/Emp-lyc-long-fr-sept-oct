function ensureBarRibbonPageStyle() {
  if (document.getElementById('bar-ribbon-page-position-style')) return;

  var style = document.createElement('style');
  style.id = 'bar-ribbon-page-position-style';
  style.textContent = '.a4-page{position:relative!important}.bar-ribbon-toggle.on-a4-page,.pdf-lines-toggle.on-a4-page-lines,.language-toggle.on-a4-page-language,.individual-toggle.on-a4-page-free{position:absolute!important;top:calc(var(--exam-header-height, 104px) + 5px)!important;transform:translateX(-50%)!important;z-index:1000!important;pointer-events:auto!important;margin:0!important;width:34px!important;min-width:34px!important;height:34px!important;min-height:34px!important;padding:0!important;border-radius:6px!important;line-height:1!important;display:inline-flex!important;align-items:center!important;justify-content:center!important;box-sizing:border-box!important;white-space:nowrap!important;overflow:hidden!important}.bar-ribbon-toggle.on-a4-page,.pdf-lines-toggle.on-a4-page-lines{font-size:0!important}.language-toggle.on-a4-page-language,.individual-toggle.on-a4-page-free{font-size:13px!important;font-weight:900!important}.bar-ribbon-toggle.on-a4-page{left:calc(50% - 60px)!important}.pdf-lines-toggle.on-a4-page-lines{left:calc(50% - 20px)!important}.language-toggle.on-a4-page-language{left:calc(50% + 20px)!important}.individual-toggle.on-a4-page-free{left:calc(50% + 60px)!important}.bar-ribbon-toggle.on-a4-page::after{content:""!important;width:15px!important;height:18px!important;display:block!important;border-left:5px solid currentColor!important;border-right:5px solid currentColor!important;border-top:3px solid currentColor!important;border-bottom:3px solid currentColor!important;box-sizing:border-box!important;opacity:.95!important}.pdf-lines-toggle.on-a4-page-lines::after{content:""!important;width:18px!important;height:16px!important;display:block!important;background:repeating-linear-gradient(to bottom,currentColor 0,currentColor 2px,transparent 2px,transparent 5px)!important;border-top:2px solid currentColor!important;border-bottom:2px solid currentColor!important;box-sizing:border-box!important;opacity:.95!important}.note-scale-buttons.on-a4-note-scale{position:absolute!important;left:calc(50% + 126px)!important;top:calc(var(--exam-header-height, 104px) + 5px)!important;transform:translateX(-50%)!important;z-index:1000!important;pointer-events:auto!important;margin:0!important;padding:0!important;display:inline-flex!important;align-items:center!important;justify-content:center!important;gap:6px!important;box-sizing:border-box!important}.note-scale-buttons.on-a4-note-scale .note-scale-button{width:42px!important;min-width:42px!important;height:34px!important;min-height:34px!important;padding:0!important;margin:0!important;border-radius:6px!important;font-size:12px!important;font-weight:900!important;line-height:1!important;display:inline-flex!important;align-items:center!important;justify-content:center!important;box-sizing:border-box!important;white-space:nowrap!important}.preview-pdf-button.on-a4-footer-preview{position:absolute!important;left:calc(50% + 54px)!important;bottom:5px!important;z-index:1000!important;pointer-events:auto!important;margin:0!important;width:58px!important;min-width:58px!important;height:22px!important;min-height:22px!important;padding:0!important;border-radius:6px!important;font-size:10px!important;font-weight:900!important;line-height:1!important;display:inline-flex!important;align-items:center!important;justify-content:center!important;box-sizing:border-box!important;white-space:nowrap!important;overflow:hidden!important}.export-pdf-button.on-a4-footer-export{position:absolute!important;left:calc(50% - 70px)!important;bottom:5px!important;z-index:1000!important;pointer-events:auto!important;margin:0!important;width:68px!important;min-width:68px!important;height:22px!important;min-height:22px!important;padding:0!important;border-radius:6px!important;font-size:10px!important;font-weight:900!important;line-height:1!important;display:inline-flex!important;align-items:center!important;justify-content:center!important;box-sizing:border-box!important;white-space:nowrap!important;overflow:hidden!important}.two-page-view-toggle.on-a4-footer-two-page{position:absolute!important;left:calc(50% + 104px)!important;bottom:5px!important;z-index:1000!important;pointer-events:auto!important;margin:0!important;width:28px!important;min-width:28px!important;height:22px!important;min-height:22px!important;padding:0!important;border-radius:6px!important;display:inline-flex!important;align-items:center!important;justify-content:center!important;box-sizing:border-box!important}.exam-page.is-exporting .bar-ribbon-toggle.on-a4-page,.exam-page.is-exporting .pdf-lines-toggle.on-a4-page-lines,.exam-page.is-exporting .language-toggle.on-a4-page-language,.exam-page.is-exporting .individual-toggle.on-a4-page-free,.exam-page.is-exporting .note-scale-buttons.on-a4-note-scale,.exam-page.is-exporting .preview-pdf-button.on-a4-footer-preview,.exam-page.is-exporting .export-pdf-button.on-a4-footer-export,.exam-page.is-exporting .two-page-view-toggle.on-a4-footer-two-page{display:none!important}@media print{.bar-ribbon-toggle.on-a4-page,.pdf-lines-toggle.on-a4-page-lines,.language-toggle.on-a4-page-language,.individual-toggle.on-a4-page-free,.note-scale-buttons.on-a4-note-scale,.preview-pdf-button.on-a4-footer-preview,.export-pdf-button.on-a4-footer-export,.two-page-view-toggle.on-a4-footer-two-page{display:none!important}}';
  document.head.appendChild(style);
}

function shortenLanguageButton() {
  var langButton = document.querySelector('.language-toggle');
  if (!langButton) return;
  langButton.textContent = window.__examLanguage === 'ar' ? 'Fr' : 'Ar';
}

function shortenFreeModeButton() {
  var freeButton = document.querySelector('.individual-toggle');
  if (!freeButton) return;
  freeButton.textContent = document.body.classList.contains('no-title-points') ? 'D' : 'L';
}

function shortenNoteScaleButtons() {
  document.querySelectorAll('.note-scale-button').forEach(function (button) {
    var text = String(button.textContent || '').trim();
    if (text === 'Sur 10' || text === '/ 10' || text === '/10') button.textContent = '/10';
    if (text === 'Sur 20' || text === '/ 20' || text === '/20') button.textContent = '/20';
  });
}

function findPreviewPdfButton() {
  var buttons = Array.from(document.querySelectorAll('button'));
  return buttons.find(function (button) {
    if (button.classList.contains('secondary')) return false;
    if (button.classList.contains('pdf-lines-toggle')) return false;
    if (button.classList.contains('bar-ribbon-toggle')) return false;
    if (button.classList.contains('two-page-view-toggle')) return false;
    var text = String(button.textContent || '').trim();
    return text === 'Voir PDF' || text === 'Préparation...';
  }) || null;
}

function findExportPdfButton() {
  var buttons = Array.from(document.querySelectorAll('button.secondary'));
  return buttons.find(function (button) {
    var text = String(button.textContent || '').trim();
    return text === 'Exporter PDF A4' || text === 'Export en cours...';
  }) || null;
}

function moveBarRibbonToggleToPage() {
  ensureBarRibbonPageStyle();

  var barButton = document.querySelector('.bar-ribbon-toggle');
  var linesButton = document.querySelector('.pdf-lines-toggle');
  var langButton = document.querySelector('.language-toggle');
  var freeButton = document.querySelector('.individual-toggle');
  var noteButtons = document.querySelector('.note-scale-buttons');
  var previewButton = findPreviewPdfButton();
  var exportButton = findExportPdfButton();
  var twoPageButton = document.querySelector('.two-page-view-toggle');
  var firstPage = document.querySelector('.a4-page');
  if (!firstPage) return;

  if (barButton) {
    barButton.classList.add('on-a4-page');
    if (barButton.parentElement !== firstPage) firstPage.appendChild(barButton);
  }

  if (linesButton) {
    linesButton.classList.add('on-a4-page-lines');
    if (linesButton.parentElement !== firstPage) firstPage.appendChild(linesButton);
  }

  if (langButton) {
    langButton.classList.add('on-a4-page-language');
    shortenLanguageButton();
    if (langButton.parentElement !== firstPage) firstPage.appendChild(langButton);
  }

  if (freeButton) {
    freeButton.classList.add('on-a4-page-free');
    shortenFreeModeButton();
    if (freeButton.parentElement !== firstPage) firstPage.appendChild(freeButton);
  }

  if (noteButtons) {
    noteButtons.classList.add('on-a4-note-scale');
    shortenNoteScaleButtons();
    if (noteButtons.parentElement !== firstPage) firstPage.appendChild(noteButtons);
  }

  if (previewButton) {
    previewButton.classList.add('preview-pdf-button', 'on-a4-footer-preview');
    if (previewButton.parentElement !== firstPage) firstPage.appendChild(previewButton);
  }

  if (exportButton) {
    exportButton.classList.add('export-pdf-button', 'on-a4-footer-export');
    if (exportButton.parentElement !== firstPage) firstPage.appendChild(exportButton);
  }

  if (twoPageButton) {
    twoPageButton.classList.add('on-a4-footer-two-page');
    if (twoPageButton.parentElement !== firstPage) firstPage.appendChild(twoPageButton);
  }
}

moveBarRibbonToggleToPage();
setTimeout(moveBarRibbonToggleToPage, 100);
setTimeout(moveBarRibbonToggleToPage, 300);
setTimeout(moveBarRibbonToggleToPage, 700);
setInterval(moveBarRibbonToggleToPage, 500);
window.addEventListener('resize', moveBarRibbonToggleToPage);
window.moveBarRibbonToggleToPage = moveBarRibbonToggleToPage;
