// source ./emsdk/emsdk_env.sh
// source ../../../LuxAI/transpilers/emsdk/emsdk_env.sh
// emcc -s FORCE_FILESYSTEM=1 --pre-js internals/init_fs.js myBot.cpp 

const sleep = (time) => {
  return new Promise((res) => {
    setTimeout(() => {
      res();
    }, time);
  });
}
const reader = require("./internals/readline-sync/lib/readline-sync"); //npm install readline-sync
const fs = require('fs');
var Module = {
  preRun: function() {
    let i = 0;
    let input = [];
    function stdin() {
      if (input.length === 0) {
        let rawInput = Buffer.alloc(1024);
        fs.readSync(0, rawInput, 0, 1024);
        let rawString = rawInput.toString("utf-8");
        let i = 0;
        for (let char of rawString) {
          i++;
          if (char == '\x00') {
            break;
          }
        }
        rawString = rawString.slice(0, i);
        input.push(...(rawString).split(""), -1);
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