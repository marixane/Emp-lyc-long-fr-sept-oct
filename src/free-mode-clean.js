var previousTitleMode = null;

function getTitleModeValue() {
  var title = document.querySelector('.title-line-top');
  return ((title && (title.value || title.textContent)) || '').trim();
}

function getTitleModeKind() {
  var value = getTitleModeValue();
  if (value === 'Devoir libre' || value === 'Devoir à la maison' || value === 'فرض منزلي') return 'free';
  if (value === 'Devoir individuel' || value === 'فرض محروس') return 'individual';
  return 'other';
}

function isFreeModeActive() {
  var notes = document.querySelector('.note-scale-control:not(.homework-disabled-note)');
  if (!notes) return false;

  return getTitleModeKind() === 'free';
}

function isIndividualButton(node) {
  var button = node && node.closest && node.closest('button');
  if (!button) return false;
  var text = (button.textContent || '').replace(/\s+/g, ' ').trim();
  return button.classList.contains('individual-toggle') || text === 'Individuel' || text === 'Devoir individuel' || text === 'فرض محروس' || text.indexOf('individuel') !== -1 || text.indexOf('محروس') !== -1;
}

function activateBarRibbonOnce() {
  if (isFreeModeActive()) return;
  var button = document.querySelector('.bar-ribbon-toggle');
  if (!button) return;

  button.disabled = false;
  button.removeAttribute('aria-disabled');
  button.style.pointerEvents = '';
  button.style.opacity = '';
  button.style.cursor = '';
  button.title = '';

  if (button.classList.contains('off')) {
    button.click();
  }
}

function activateBarRibbonOnceWithRetries() {
  setTimeout(activateBarRibbonOnce, 0);
  setTimeout(activateBarRibbonOnce, 60);
  setTimeout(activateBarRibbonOnce, 150);
  setTimeout(activateBarRibbonOnce, 350);
  setTimeout(activateBarRibbonOnce, 700);
}

function updateDisplay(node, hidden) {
  if (!node) return;
  if (hidden) node.style.display = 'none';
  else node.style.display = '';
}

function syncFreeModeBodyClass() {
  if (!document.body) return;
  document.body.classList.toggle('no-title-points', isFreeModeActive());
}

function syncFreeModeBarRibbon(freeMode) {
  var button = document.querySelector('.bar-ribbon-toggle');
  if (!button) return;

  var currentMode = getTitleModeKind();

  if (freeMode && button.classList.contains('on')) {
    button.click();
  }

  if (currentMode === 'individual' && previousTitleMode === 'free') {
    activateBarRibbonOnce();
  }

  button.disabled = !!freeMode;
  button.setAttribute('aria-disabled', freeMode ? 'true' : 'false');
  button.style.pointerEvents = freeMode ? 'none' : '';
  button.style.opacity = freeMode ? '0.45' : '';
  button.style.cursor = freeMode ? 'not-allowed' : '';
  button.title = freeMode ? 'Barème désactivé en devoir libre' : '';

  previousTitleMode = currentMode;
}

function hideOnlyPointControls(title, hidden) {
  Array.from(title.children).forEach(function (node) {
    if (node.classList && node.classList.contains('exercise-line-count-controls')) return;
    if (node.tagName === 'BUTTON' || node.tagName === 'STRONG' || (node.classList && node.classList.contains('points-decoration'))) {
      updateDisplay(node, hidden);
    }
  });
}

function cleanFreeModeExerciseTitles() {
  var freeMode = isFreeModeActive();
  syncFreeModeBodyClass();
  syncFreeModeBarRibbon(freeMode);

  document.querySelectorAll('.exam-exercise:not(.blank-exercise) .exercise-title-controls').forEach(function (title) {
    var span = title.querySelector('span:first-child');
    var text = (span && span.textContent) || '';
    var match = text.match(/(Exercice|تمرين)\s*(\d+)/i);

    if (freeMode && span && match) span.textContent = match[1] + ' ' + match[2] + ' :';

    hideOnlyPointControls(title, freeMode);
  });

  if (typeof window.syncExerciseLineControls === 'function') {
    setTimeout(window.syncExerciseLineControls, 20);
  }
}

function syncFreeModeClean() {
  cleanFreeModeExerciseTitles();
}

syncFreeModeClean();
setTimeout(syncFreeModeClean, 100);
setTimeout(syncFreeModeClean, 300);
setTimeout(syncFreeModeClean, 700);

window.setInterval(syncFreeModeClean, 400);

document.addEventListener('click', function (event) {
  if (isIndividualButton(event.target)) {
    activateBarRibbonOnceWithRetries();
  }
  setTimeout(syncFreeModeClean, 20);
  setTimeout(syncFreeModeClean, 80);
  setTimeout(syncFreeModeClean, 250);
});

document.addEventListener('input', function () {
  setTimeout(syncFreeModeClean, 20);
  setTimeout(syncFreeModeClean, 80);
});

window.cleanFreeModeExerciseTitles = cleanFreeModeExerciseTitles;
window.syncFreeModeBodyClass = syncFreeModeBodyClass;
window.syncFreeModeBarRibbon = syncFreeModeBarRibbon;
window.activateBarRibbonOnce = activateBarRibbonOnce;
