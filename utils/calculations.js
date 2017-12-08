function calculatePercentage(first, second) {
  const percentage = first / second * 100;
  return Math.round((100 - percentage)*100)/100;
}

function roundAverage(average) {
  return Math.round(average*1000)/1000
}

module.exports = { roundAverage, calculatePercentage };
