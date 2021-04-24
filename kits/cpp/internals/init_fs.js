// source ./emsdk/emsdk_env.sh
// emcc -s FORCE_FILESYSTEM=1 --pre-js internals/init_fs.js myBot.cpp 

const sleep = (time) => {
  return new Promise((res) => {
    setTimeout(() => {
      res();
    }, time);
  });
}
const reader = require("./internals/readline-sync/lib/readline-sync"); //npm install readline-sync
var Module = {
  preRun: function() {
    let i = 0;
    let input = [];
    function stdin() {
      if (input.length === 0) {
        console.log("Prompted");
        let rawInput = reader.question();
        input.push(...rawInput.split(""), "\n", -1);
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
        console.log(stderrBuffer);
        stderrBuffer = "";
      } else {
        stderrBuffer += String.fromCharCode(code);
      }
    }

    FS.init(stdin, stdout, stderr);
  }
};