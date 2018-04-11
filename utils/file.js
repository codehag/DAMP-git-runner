const fs = require("fs");
const { exec } = require("child_process");

function readResults(commit) {
  const data = JSON.parse(
    fs.readFileSync(`./damp/.tmp/${commit.hash}.json`, "utf8")
  );
  return {...commit, data};
}

function copyToTarget(commit) {
  console.log("copy target", commit);
  return new Promise((resolve, reject) => {
    exec("yarn copy-assets", (stderr, stdout, err) => {
      return resolve("done");
    });
  });
}

function saveFile(commit, saveLocation) {
  console.log("save file", commit);
  return new Promise((resolve, reject) => {
    exec(
      `cp ${saveLocation} ./damp/.tmp/${commit}.json`,
      (stderr, stdout, err) => {
        return resolve("done");
      }
    );
  });
}


module.exports = { readResults, copyToTarget, saveFile };
