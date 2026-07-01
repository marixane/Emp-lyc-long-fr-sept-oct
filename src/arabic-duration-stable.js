function stabilizeArabicDurationText() {
  var map = {
    '30 \u062f': '30 min',
    '1 \u0633': '1 h',
    '1 \u0633 30 \u062f': '1 h 30',
    '2 \u0633': '2 h',
    '2 \u0633 30 \u062f': '2 h 30',
    '3 \u0633': '3 h',
    '3 \u0633 30 \u062f': '3 h 30',
    '4 \u0633': '4 h'
  };
  document.querySelectorAll('.tiny-duration-control strong').forEach(function (node) {
    var text = (node.textContent || '').trim();
    if (map[text]) node.textContent = map[text];
  });
}

function stabilizeArabicDurationSoon() {
  stabilizeArabicDurationText();
  setTimeout(stabilizeArabicDurationText, 40);
  setTimeout(stabilizeArabicDurationText, 120);
  setTimeout(stabilizeArabicDurationText, 300);
}

stabilizeArabicDurationSoon();

document.addEventListener('click', function (event) {
  if (!event.target || !event.target.closest) return;
  if (event.target.closest('.tiny-duration-control') || event.target.closest('.language-toggle')) {
    stabilizeArabicDurationSoon();
  }
});

window.stabilizeArabicDurationText = stabilizeArabicDurationText;
