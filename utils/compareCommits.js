const { getCommit } = require("./getCommit.js");
const { switchTo } = require("./switchTo.js");
const { readResults } = require("./readResults.js");
const { reduceStrings, commitOutput, averagesOutput } = require("./strings.js");

function getSubtests(result) {
  const subtests = result.data.suites[0].subtests;
  const strings = subtests.map(averagesOutput);
  return reduceStrings(strings, commitOutput(result));
}

async function compareCommits(list) {
  let commits = [];
  for (commitHash of list) {
    const doneSwitch = await switchTo(commitHash);
    const commit = await getCommit(commitHash);
    commits = [...commits, commit];
  }

  const results = commits.map(readResults);
  const output = results.map(getSubtests);

  return reduceStrings(output, "\n\n")
}

module.exports = { compareCommits, getSubtests };
