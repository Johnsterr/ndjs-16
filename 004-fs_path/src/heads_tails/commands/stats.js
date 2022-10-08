const path = require("path");
const fs = require("fs");
const {checkLogFileExist, createLogFilenameWithExtension} = require("../utils");
const {
  EVENT_WIN,
  EVENT_LOSE,
  EVENT_ERROR,
  LOGS_DEFAULT_EOL,
  LOGS_VALUES_DELIMETER,
  LOGS_DIR_PATH,
} = require("../constants.js");

const SIGNS_AFTER_DOT_IN_STATISTICS = 2;

const getLogFileStatistics = (filePath) =>
  new Promise((done, fail) => {
    const readableStream = fs.createReadStream(filePath, "UTF8");

    const logFileStatistic = {
      errorCounter: 0,
      lostCounter: 0,
      mainCounter: 0,
      winCounter: 0,
    };

    let prevChunkLastLine = null;

    readableStream.on("data", (chunk) => {
      const chunkLines = chunk.split(LOGS_DEFAULT_EOL);
      const [firstLine] = chunkLines.splice(0, 1);
      const [lastLine] = chunkLines.splice(chunkLines.length - 1, 1);

      const prevChunkLastLineExist =
        typeof prevChunkLastLine === "string" && prevChunkLastLine.length !== 0;

      if (prevChunkLastLineExist) {
        chunkLines.push(`${prevChunkLastLine}${firstLine}`);
      }

      chunkLines.forEach((line) => {
        const [status] = line.split(LOGS_VALUES_DELIMETER);
        logFileStatistic.mainCounter++;

        switch (status) {
          case EVENT_WIN: {
            logFileStatistic.winCounter++;
            break;
          }
          case EVENT_LOSE: {
            logFileStatistic.lostCounter++;
            break;
          }
          case EVENT_ERROR: {
            logFileStatistic.errorCounter++;
            break;
          }
        }
      });

      prevChunkFirstLine = firstLine;
      prevChunkLastLine = lastLine;
    });

    readableStream.on("close", () => done(logFileStatistic));

    readableStream.on("error", (error) => fail(error));
  });

const prepareStatisticsToShow = (logFileStatistics) =>
  [
    `Общее количество партий: ${logFileStatistics.mainCounter}`,
    `Кол-во побед: ${logFileStatistics.winCounter}`,
    `Кол-во проигрышей: ${logFileStatistics.lostCounter}`,
    `Кол-во ошибок: ${logFileStatistics.errorCounter}`,
    `Процент побед: ${(
      (logFileStatistics.winCounter / logFileStatistics.mainCounter) *
      100
    ).toFixed(SIGNS_AFTER_DOT_IN_STATISTICS)}%`,
    `Процент проигрышей: ${(
      (logFileStatistics.lostCounter / logFileStatistics.mainCounter) *
      100
    ).toFixed(SIGNS_AFTER_DOT_IN_STATISTICS)}%`,
    `Процент ошибок: ${(
      (logFileStatistics.errorCounter / logFileStatistics.mainCounter) *
      100
    ).toFixed(SIGNS_AFTER_DOT_IN_STATISTICS)}%\n`,
  ].join("\n");

module.exports.stats = {
  command: "stats",
  desc: "Get game statistics by filename",
  handler: async (argv) => {
    if (!argv.name) {
      throw new Error('Argument "name" is required');
    }
    const fileNameWithExtention = createLogFilenameWithExtension(argv.name);
    const logFileIsExist = await checkLogFileExist(fileNameWithExtention);

    if (!logFileIsExist) {
      process.stdout.write(`File with name ${argv.name} does\'t exist`);
      process.exit(1);
      return;
    }

    const filePath = path.join(LOGS_DIR_PATH, fileNameWithExtention);
    const logFileStatistics = await getLogFileStatistics(filePath);
    const formattedLogFileStatistics =
      prepareStatisticsToShow(logFileStatistics);

    process.stdout.write(formattedLogFileStatistics);
    process.exit(0);
  },
};
