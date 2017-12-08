const { calculatePercentage, roundAverage } = require("./calculations.js");

function reduceStrings(strings, initial) {
  return strings.reduce(
    (string, substring) => `${string}
    ${substring}`,
    initial
  );
}

function commitOutput(commit) {
  return `
    Commit Message: ${commit.message}
    Link: https://www.github.com/devtools-html/debugger.html/commit/${commit.hash}
    Author: ${commit.author}
    Date: ${commit.date}

    Averages:
  `;
}

const baseCommit = {};
function averagesOutput(subtest) {
  const { name, value, unit } = subtest;
  const roundedValue = roundAverage(value);
  if (baseCommit[name]) {
    const percentageDifference = calculatePercentage(baseCommit[name], value);
    return `${name}: ${roundedValue}${unit} (${percentageDifference}% difference)`;
  }
  baseCommit[name] = value;
  return `${name}: ${roundedValue}${unit} (0.00% difference BASECOMMIT)`;
}

module.exports = { reduceStrings, commitOutput, averagesOutput };
