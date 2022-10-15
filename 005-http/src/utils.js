const prepareWeatherResponse = ({current}) =>
  [
    `Температура: ${current.temperature} градусов`,
    `Давление: ${current.pressure} мбар`,
    `Скорость ветра: ${current.visibility} км/ч\n`,
  ].join("\n");

module.exports = {
  prepareWeatherResponse,
};
