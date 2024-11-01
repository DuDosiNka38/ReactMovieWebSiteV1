

class CountDown {
  isCountdown = false;
  countdownSec = 0;

  runCountdown = (sec, cbStep = (seconds) => {}, cbEnd) => {
    this.isCountdown = true;
    this.countdownSec = sec;

    setTimeout(() => this.countdown(sec, cbStep, cbEnd), 100);
  };

  stopCountdown = () => {
    this.isCountdown = false;
    this.countdownSec = 0;
  };

  countdown = (sec, stepCb, endCb) => {
    this.countdownSec = sec;

    if (sec > 0 && this.isCountdown) {
      setTimeout(() => this.countdown(sec - 1, stepCb, endCb), 1000);

      if (typeof stepCb === "function") stepCb(sec, this);
    } else {
      this.stopCountdown();

      if (typeof endCb === "function") endCb();
    }
  };
}

export default CountDown;