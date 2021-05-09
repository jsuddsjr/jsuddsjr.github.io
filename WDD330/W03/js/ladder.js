function testLadder() {
  let ladder = {
    step: 0,
    up() {
      this.step++;
      return this;
    },
    down() {
      this.step--;
      return this;
    },
    showStep: function () {
      // shows the current step
      log(this.step);
      return this;
    },
  };

  ladder.up();
  ladder.up();
  ladder.down();
  ladder.showStep(); // 1

  // Now make the calls chainable, like this:
  ladder.up().up().down().showStep(); // 2
}
