const resizeClassLabels = () => {
  if (!document.body.classList.contains('cahier-tab-active')) return;

  document.querySelectorAll('.homework-subject > div').forEach((line) => {
    const label = line.querySelector('span:nth-child(2)');
    if (!label) return;

    const count = line.parentElement?.children?.length || 1;
    const startSize = count >= 4 ? 18 : count === 3 ? 22 : 26;
    const minSize = 8;
    const availableWidth = Math.max(label.clientWidth - 2, 0);

    label.style.setProperty('font-weight', '900', 'important');
    label.style.setProperty('transform', 'none', 'important');
    label.style.setProperty('overflow', 'hidden', 'important');
    label.style.setProperty('text-overflow', 'clip', 'important');
    label.style.setProperty('white-space', 'nowrap', 'important');

    let size = startSize;
    label.style.setProperty('font-size', `${size}px`, 'important');

    while (size > minSize && label.scrollWidth > availableWidth) {
      size = Math.max(minSize, size - 2);
      label.style.setProperty('font-size', `${size}px`, 'important');
    }
  });
};

let classLabelFrame = 0;
const scheduleClassLabelResize = () => {
  cancelAnimationFrame(classLabelFrame);
  classLabelFrame = requestAnimationFrame(() => {
    resizeClassLabels();
    setTimeout(resizeClassLabels, 80);
  });
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', scheduleClassLabelResize, { once: true });
} else {
  scheduleClassLabelResize();
}

document.addEventListener('input', scheduleClassLabelResize, true);
document.addEventListener('focusout', scheduleClassLabelResize, true);
document.addEventListener('drop', scheduleClassLabelResize, true);
document.addEventListener('click', scheduleClassLabelResize, true);
