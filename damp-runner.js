#!/usr/bin/env node
// libs
const { spawn, exec } = require("child_process");
const path = require("path");

// utils
const { getSubtests } = require("./utils/compareCommits.js");
const { readResults, saveFile, copyToTarget } = require("./utils/file.js");
const { reduceStrings } = require("./utils/strings.js");
const { getCommit, getCommits } = require("./utils/getCommit.js");
const { switchTo } = require("./utils/switchTo.js");
const args = process.argv.slice(2);

const keyRegex = new RegExp("--");
const conf = {};
args.reduce((currentConfigKey, arg) => {
  if (keyRegex.test(arg)) {
    const sanitizedArg = arg.replace("--", "");
    if (!conf[sanitizedArg]) {
      currentConfigKey = [];
      conf[sanitizedArg] = currentConfigKey;
      return currentConfigKey;
    }
  }
  currentConfigKey.push(arg);
  return currentConfigKey;
}, []);

async function runProcess(config) {
  const command = `${config.target}/mach`;
  let localJSON = "";

  const argsTalos = [
    "talos-test",
    "--activeTests",
    "damp",
    "--subtests",
    config.tool
  ];

  let commits = [];
  if (!config.commits) {
    commits = await getCommits(config.from, config.to);
  } else {
    for (commitHash of config.commits) {
      const doneSwitch = await switchTo(commitHash);
      const commit = await getCommit(commitHash);
      commits = [...commits, commit];
    }
  }

  function runDamp(commit) {
    return new Promise(async (resolve, reject) => {
      await switchTo(commit);
      await copyToTarget(commit);

      console.log(`starting...${commit}`);
      const damp = spawn(command, argsTalos);
      damp.on("exit", async code => {
        const saved = await saveFile(commit, localJSON);
        resolve(saved);
      });
      damp.stderr.on("data", data => {
        if (!localJSON) {
          const match = data.toString().match(/Results are in (\S*)/);
          if (match) {
            localJSON = match[1].replace("['", "").replace("']", "");
          }
        }
        if (config.debug) {
          console.log(data.toString());
        }
      });
    });
  }

  for (const commit of commits) {
    await runDamp(commit.hash);
  }

  const results = commits.map(readResults);
  const output = results.map(getSubtests);

  console.log(reduceStrings(output, "\n\n"));
}

runProcess(conf);
