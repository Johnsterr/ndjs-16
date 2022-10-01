const formatISO = require("date-fns/formatISO");
const getYear = require("date-fns/getYear");
const getMonth = require("date-fns/getMonth");
const getDate = require("date-fns/getDate");
const add = require("date-fns/add");
const sub = require("date-fns/sub");

const {YEAR_FLAGS, MONTH_FLAGS, DATE_FLAGS} = require("./constants");

const getCurrentDate = (argv) => {
  const date = new Date();

  if (YEAR_FLAGS.some((option) => option in argv)) {
    return getYear(date);
  }

  if (MONTH_FLAGS.some((option) => option in argv)) {
    return getMonth(date);
  }

  if (DATE_FLAGS.some((option) => option in argv)) {
    return getDate(date);
  }

  return formatISO(date);
};

const getDateOperation = (argv) => {
  const operation = {};

  const [yearFlag] = YEAR_FLAGS;
  if (argv[yearFlag]) {
    Object.assign(operation, {years: argv[yearFlag]});
  }

  const [monthFlag] = MONTH_FLAGS;
  if (argv[monthFlag]) {
    Object.assign(operation, {months: argv[monthFlag]});
  }

  const [dateFlag] = DATE_FLAGS;
  if (argv[dateFlag]) {
    Object.assign(operation, {days: argv[dateFlag]});
  }

  return Object.entries(operation).length === 0 ? null : operation;
};

const logError = (errorMessage) => {
  console.log(`\x1b[31m${errorMessage}`);
};

module.exports.currentModule = {
  command: "current",
  aliases: ["c"],
  desc: "Get current date or year/month/day separately",
  handler: (argv) => {
    const currentDate = getCurrentDate(argv);

    console.log(currentDate);
  },
};

module.exports.addModule = {
  command: "add",
  aliases: ["a"],
  desc: "Add years/month/days to current date",
  handler: (argv) => {
    const operation = getDateOperation(argv);

    if (operation === null) {
      logError(
        `Parameter should be passed to 'add' function and it should be a number...`
      );
      process.exit(1);
    }

    const calculatedDate = add(new Date(), operation);

    console.log(formatISO(calculatedDate));
  },
};

module.exports.subModule = {
  command: "sub",
  aliases: ["s"],
  desc: "Subtract years/month/days from current date",
  handler: (argv) => {
    const operation = getDateOperation(argv);

    if (operation === null) {
      logError(
        `Parameter should be passed to 'sub' function and it should be a number...`
      );
      process.exit(1);
    }

    const calculatedDate = sub(new Date(), operation);

    console.log(formatISO(calculatedDate));
  },
};
