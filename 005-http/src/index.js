#!/usr/bin/env node

const {API_KEY, API_ENDPOINT} = require("./config.js");
const http = require("http");
const yargs = require("yargs/yargs");
const {hideBin} = require("yargs/helpers");
const {prepareWeatherResponse} = require("./utils.js");

const argv = hideBin(process.argv);

yargs(argv)
  .option("c", {
    alias: "city",
    demandOption: true,
    description: "City name",
    type: "string",
  })
  .help("h")
  .alias("help", "h")
  .strict(true).argv;

if (!argv[1]) {
  process.stderr.write('Parameter "city" is required\n');
  process.exit(1);
}

const apiUrl = new URL(API_ENDPOINT);
apiUrl.searchParams.append("access_key", API_KEY);
apiUrl.searchParams.append("query", argv[1]);

http.get(apiUrl, (res) => {
  let responseBody = "";

  res.setEncoding("UTF8");
  res.on("data", (chunk) => (responseBody += chunk));
  res.on("end", () => {
    const result = JSON.parse(responseBody);

    if (result.error) {
      process.stdout.write(result?.error?.info + "\n" || "Unhandable error\n");
      process.exit(0);
    }

    const formattedResponse = prepareWeatherResponse(result);
    process.stdout.write(formattedResponse);
    process.exit(0);
  });

  res.on("error", (error) => {
    process.stdout.write(error);
    process.exit(-1);
  });
});
