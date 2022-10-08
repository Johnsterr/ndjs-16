const EventEmmiter = require("events");
const {
  EVENT_WIN,
  EVENT_LOSE,
  EVENT_ERROR,
  GAME_VALUES,
  PLAY_AGAIN_YES,
  PLAY_AGAIN_NO,
} = require("./constants.js");
const {getRandomItem} = require("./utils");

class HeadsAndTails extends EventEmmiter {
  constructor() {
    super();
    this.gameIsStopped = false;
  }

  get greetingMessage() {
    return `Game is started! ${this.inputMessage}`;
  }

  get inputMessage() {
    return `Input one of the values: ${GAME_VALUES.join(", ")}\n`;
  }

  get needToPlayAgainMessage() {
    return `Need to play again? [${PLAY_AGAIN_YES}/${PLAY_AGAIN_NO}]\n`;
  }

  toggleGameIsStopped(newState) {
    this.gameIsStopped =
      newState === undefined ? !this.gameIsStopped : newState;
  }

  play(inputedValue) {
    const formattedValue = Number(inputedValue);
    const secretValue = getRandomItem(GAME_VALUES);

    if (!isFinite(formattedValue)) {
      this.emit(EVENT_ERROR, inputedValue);
    } else if (formattedValue === secretValue) {
      this.emit(EVENT_WIN, formattedValue, secretValue);
    } else {
      this.emit(EVENT_LOSE, formattedValue, secretValue);
    }

    this.toggleGameIsStopped(true);
  }
}

module.exports = {
  HeadsAndTails,
};
