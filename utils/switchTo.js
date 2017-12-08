const { exec } = require("child_process");

function switchTo(commit) {
  return new Promise((resolve, reject) => {
    exec(`git checkout ${commit}`, (err, stdout, stderr) => {
      if (!err) {
        return resolve("done");
      }
      console.log("err", err);
      console.log("stdout", stdout);
      console.log("stderr", stderr);
      console.log("not done");
    });
  });
}


module.exports = { switchTo };
