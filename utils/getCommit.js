const { exec } = require("child_process");

function getCommit(commit) {
  return new Promise((resolve, reject) => {
    exec(`git log ${commit}`, (stderr, stdout, err) => {
      if (stdout) {
        const [
          _,
          hash,
          author,
          date,
          message
        ] = /commit\s(.*)\nAuthor:\s(.*)\nDate:\s(.*)\n.*\n\s*(.*)/g.exec(stdout);
        return resolve({ hash, author, date, message });
      }
    });
  });
}

function getCommits(from, to) {
  return new Promise((resolve, reject) => {
    exec("git log", (stderr, stdout, err) => {
      if (stdout) {
        const commitList = stdout
          .match(/(commit.*\n.*\n.*\n.*\n.*/g)
          .map(str => {
            const [
              _,
              hash,
              author,
              date,
              message
            ] = /commit\s(.*)\nAuthor:\s(.*)\nDate:\s(.*)\n.*\n\s*(.*)/g.exec(str);
            console.log(hash, _, str);
            return { hash, author, date, message };
          });

        if (!from && !to) {
          resolve([commitList[0]]);
        }
        if (from && !to) {
          const lastIndex = commitList.indexOf(from);
          const commits = commitList.slice(0, lastIndex);
          resolve(commits);
        }
        if (from && to) {
          const firstIndex = commitList.indexOf(to);
          const lastIndex = commitList.indexOf(from);
          const commits = commitList.slice(firstIndex, lastIndex);
          resolve(commits);
        }
      }
    });
  });
}

module.exports = { getCommit, getCommits };
