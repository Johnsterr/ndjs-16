const {
  EVENT_WIN,
  EVENT_LOSE,
  EVENT_ERROR,
  PLAY_AGAIN_YES,
  PLAY_AGAIN_NO,
  LOGS_RECORDS_HEADERS_MAP,
  LOGS_VALUES_DELIMETER,
  LOGS_DEFAULT_EOL,
  LOGS_DIR_PATH,
} = require("../constants.js");

const {HeadsAndTails} = require("../heads_tails_game.js");
const {readlineInterface} = require("../utils");

const createLogRecord = ({
  inputtedValue,
  secretValue = "",
  status,
  date = new Date().toISOString(),
}) => {
  const logData = {date, inputtedValue, secretValue, status};
  const mappedLogRecord = LOGS_RECORDS_HEADERS_MAP.reduce((acc, itemName) => {
    if (itemName in logData) {
      acc.push(logData[itemName]);
    }
    return acc;
  }, []);

  return `${mappedLogRecord.join(LOGS_VALUES_DELIMETER)}${LOGS_DEFAULT_EOL}`;
};

const saveLogRecord = async (logFileName, logRecord) => {
  const fileNameWithExtention = createLogFilenameWithExtension(logFileName);
  const filePath = path.join(LOGS_DIR_PATH, fileNameWithExtention);
  const logFileIsExist = await checkLogFileExist(fileNameWithExtention);

  if (!logFileIsExist) {
    fs.appendFile(
      filePath,
      `${LOGS_RECORDS_HEADERS_MAP.join(
        LOGS_VALUES_DELIMETER
      )}${LOGS_DEFAULT_EOL}`,
      "UTF8",
      (err) => {
        if (err) {
          throw err;
        }
      }
    );
  }

  fs.appendFile(filePath, logRecord, "UTF8", (err) => {
    if (err) {
      throw err;
    }
  });
};

const createEventHandlerCreator =
  (eventName, eventCallback) =>
  (logFileName) =>
  (inputtedValue, secretValue) => {
    const logRecord = createLogRecord({
      inputtedValue,
      secretValue,
      status: eventName,
    });
    saveLogRecord(logFileName, logRecord);
    eventCallback(inputtedValue, secretValue);
  };

const createWinEventHandler = createEventHandlerCreator(
  EVENT_WIN,
  (_, secretValue) => {
    process.stdout.write(`You are win! Correct answer is: ${secretValue}!\n`);
  }
);

const createLostEventHandler = createEventHandlerCreator(
  EVENT_LOSE,
  (_, secretValue) => {
    process.stdout.write(`You are lost... Correct answer is: ${secretValue}\n`);
  }
);

const createErrorEventHandler = createEventHandlerCreator(EVENT_ERROR, () => {
  process.stdout.write(`Please, input correct value.\n`);
});

module.exports.start = {
  command: "start",
  desc: "Input you're profile name (filename) and start the game",
  handler: (argv) => {
    if (!argv.name) {
      throw new Error('Argument "name" is required');
    }

    const HEADS_AND_TAILS = new HeadsAndTails();
    process.stdout.write(HEADS_AND_TAILS.greetingMessage);

    HEADS_AND_TAILS.on(EVENT_WIN, createWinEventHandler(fileName));

    HEADS_AND_TAILS.on(EVENT_LOSE, createLostEventHandler(fileName));

    HEADS_AND_TAILS.on(EVENT_ERROR, createErrorEventHandler(fileName));

    readlineInterface.on("line", (inputedValue) => {
      if (HEADS_AND_TAILS.gameIsStopped) {
        switch (inputedValue.toLocaleLowerCase()) {
          case PLAY_AGAIN_YES.toLowerCase(): {
            HEADS_AND_TAILS.toggleGameIsStopped(false);
            process.stdout.write(HEADS_AND_TAILS.inputMessage);
            break;
          }
          case PLAY_AGAIN_NO.toLowerCase(): {
            process.exit(0);
            break;
          }
          default: {
            process.stdout.write(HEADS_AND_TAILS.needToPlayAgainMessage);
            break;
          }
        }
      } else {
        HEADS_AND_TAILS.play(inputedValue);
        process.stdout.write(HEADS_AND_TAILS.needToPlayAgainMessage);
      }
    });
  },
};
