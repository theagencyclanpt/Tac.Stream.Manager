const exec = require("child_process").exec;

module.exports = {
  isRunningPowershellAsync: (process) => {
    return new Promise((resolve, reject) => {
      exec(`Get-Process ${process} -ErrorAction SilentlyContinue`, { shell: "powershell" }, (err, stdout) => {
        if (err) {
          reject(err);
        }

        if (stdout) {
          resolve(true)
        } else {
          resolve(false);
        }
      });
    });

  },
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
  startProcessAsync: ({ directory = null, program }) => {
    if (!program) {
      throw new Error("Argument program is missing.");
    }

    if (directory === null) {
      return new Promise((resolve, reject) => {
        exec(`start ${program}`, (err, stdout, stderr) => {
          if (err || stderr) {
            reject(err);
          }

          resolve(stdout);
        });
      });
    }

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
      exec(`taskkill /F /fi ${program}`, (err, stdout, stderr) => {
        if (err || stderr) {
          reject(err);
        }

        resolve(stdout);
      });
    });
  },
  stopProcessPowershellAsync: ({ program }) => {
    new Promise((resolve, reject) => {
      exec(`Stop-Process -Name "${program}"`, { shell: "powershell" }, (err, stdout, stderr) => {
        if (err || stderr) {
          reject(err);
        }

        resolve(stdout);
      });
    });
  },
};
