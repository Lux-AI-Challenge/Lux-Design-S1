// source ../../../../LuxAI/transpilers/emsdk/emsdk_env.sh
const sleep = (time) => {
  return new Promise((res) => {
    setTimeout(() => {
      res();
    }, time);
  });
}
const reader = require("./internals/readline-sync/lib/readline-sync");
const fs = require('fs');
const readSize = 4096;
var Module = {
  preRun: function() {
    let i = 0;
    let input = [];
    function stdin() {
      if (input.length === 0) {
        while(true) {
          let rawInput = Buffer.alloc(readSize);
          fs.readSync(0, rawInput, 0, readSize);

          let rawString = rawInput.toString("utf-8");
          let i = 0;
          for (let char of rawString) {
            if (char == '\x00') {
              break;
            }
            i++;
          }
          rawString = rawString.slice(0, i);
          input.push(...(rawString).split(""));

          if (input.slice(-7).join("") === "D_DONE\n") {
            break;
          }
        }
        input.push(-1);
      }
      if (input[0] === -1) {
        input.shift();
        return null;
      }
      return input.shift().charCodeAt(0);;
    }

    let stdoutBuffer = "";
    function stdout(code) {
      if (code === "\n".charCodeAt(0) && stdoutBuffer !== "") {
        console.log(stdoutBuffer);
        stdoutBuffer = "";
      } else {
        stdoutBuffer += String.fromCharCode(code);
      }
    }

    let stderrBuffer = "";
    function stderr(code) {
      if (code === "\n".charCodeAt(0) && stderrBuffer !== "") {
        console.error(stderrBuffer);
        stderrBuffer = "";
      } else {
        stderrBuffer += String.fromCharCode(code);
      }
    }

    FS.init(stdin, stdout, stderr);
  }
};