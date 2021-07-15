const exec = require("child_process").exec;

module.exports = {
  isRunningAsync: (query) =>
    new Promise((resolve, reject) => {
      let platform = process.platform;
      let cmd = "";
      switch (platform) {
        case "win32":
          cmd = `tasklist`;
          break;
        case "darwin":
          cmd = `ps -ax | grep ${query}`;
          break;
        case "linux":
          cmd = `ps -A`;
          break;
        default:
          break;
      }
      exec(cmd, (err, stdout, stderr) => {
        if (err || stderr) {
          reject(err);
        }
        resolve(stdout.toLowerCase().indexOf(query.toLowerCase()) > -1);
      });
    }),
  startProcessAsync: ({ directory, program }) => {
    return new Promise((resolve, reject) => {
      exec(`start /d "${directory}" ${program}`, (err, stdout, stderr) => {
        if (err || stderr) {
          reject(err);
        }

        resolve(stdout);
      });
    });
  },
  stopProcessAsync: ({ program }) => {
    new Promise((resolve, reject) => {
      exec(`taskkill /F /IM ${program}`, (err, stdout, stderr) => {
        if (err || stderr) {
          reject(err);
        }

        resolve(stdout);
      });
    });
  },
};
