#!/usr/bin/env node
const { compareCommits } = require("./utils/compareCommits.js");

const commitList = process.argv.slice(2);

compareCommits(commitList).then(output => console.log(output));

