const path = require("path");

// Игра
const EVENT_WIN = "win";
const EVENT_LOSE = "lose";
const EVENT_ERROR = "error";
const GAME_VALUES = [1, 2];
const PLAY_AGAIN_YES = "Y";
const PLAY_AGAIN_NO = "N";

// Логи
const LOGS_DIR_NAME = "logs";
const LOGS_DIR_PATH = path.resolve(__dirname, LOGS_DIR_NAME);
const LOGS_DEFAULT_EXTENSION = ".csv";
const LOGS_DEFAULT_EOL = "\n";
const LOGS_VALUES_DELIMETER = ";";
const LOGS_RECORDS_HEADERS = {
  DATE: "date",
  GAMER_VALUE: "inputtedValue",
  GAME_VALUE: "secretValue",
  STATUS: "status",
};
const LOGS_RECORDS_HEADERS_MAP = [
  LOGS_RECORDS_HEADERS.STATUS,
  LOGS_RECORDS_HEADERS.INPUTTED_VALUE,
  LOGS_RECORDS_HEADERS.SECRET_VALUE,
  LOGS_RECORDS_HEADERS.DATE,
];

module.exports = {
  EVENT_WIN,
  EVENT_LOSE,
  EVENT_ERROR,
  GAME_VALUES,
  PLAY_AGAIN_YES,
  PLAY_AGAIN_NO,
  LOGS_DIR_NAME,
  LOGS_DIR_PATH,
  LOGS_DEFAULT_EXTENSION,
  LOGS_DEFAULT_EOL,
  LOGS_VALUES_DELIMETER,
  LOGS_RECORDS_HEADERS,
  LOGS_RECORDS_HEADERS_MAP,
};