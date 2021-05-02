function nested() {
  for (let i = 1; i < 13; i++) {
    for (let j = 1; j < 13; j++) {
      log(`${j} times ${i} is ${i * j}`);
    }
  }
}
