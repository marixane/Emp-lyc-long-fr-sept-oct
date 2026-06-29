function clearMarksInExercise(exercise) {
  if (!exercise) return;

  function removeOneBatch() {
    var mark = exercise.querySelector('.bar-mark');
    if (!mark) return;
    mark.dispatchEvent(new MouseEvent('dblclick', { bubbles: true, cancelable: true }));
    setTimeout(removeOneBatch, 0);
  }

  removeOneBatch();
}

document.addEventListener('click', function (event) {
  var button = event.target && event.target.closest && event.target.closest('.exercise-title-controls button');
  if (!button || button.disabled) return;
  var exercise = button.closest('.exam-exercise');
  setTimeout(function () {
    clearMarksInExercise(exercise);
  }, 30);
}, true);
