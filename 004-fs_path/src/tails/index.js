#!/usr/bin/env node

const yargs = require("yargs/yargs");
const {hideBin} = require("yargs/helpers");

const {start, stats} = require("./commands.js");

const argv = hideBin(process.argv);

yargs(argv)
  .command(start)
  .command(stats)
  .option("n", {
    alias: "name",
    demandOption: true,
    describe: "Filename for save logs (without extension)",
    type: "string",
  })
  .help("h")
  .alias("help", "h")
  .strict(true).argv;
