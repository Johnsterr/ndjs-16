const fs = require("fs");
const readline = require("readline");
const {LOGS_DEFAULT_EXTENSION, LOGS_DIR_PATH} = require("../constants.js");

const readlineInterface = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false,
});

const getRandomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

const createLogFilenameWithExtension = (filename) =>
  `${filename}${LOGS_DEFAULT_EXTENSION}`;

const checkLogFileExist = async (filename) => {
  const filesList = await fs.promises.readdir(LOGS_DIR_PATH);

  return filesList.includes(filename);
};

module.exports = {
  checkLogFileExist,
  createLogFilenameWithExtension,
  getRandomItem,
  readlineInterface,
};
