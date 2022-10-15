require("dotenv").config();

const API_KEY = process.env.WEATHERSTACK_API_KEY;
const API_ENDPOINT = "http://api.weatherstack.com/current";

module.exports = {API_KEY, API_ENDPOINT};
