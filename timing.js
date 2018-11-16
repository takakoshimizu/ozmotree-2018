const keypress = async () => {
  process.stdin.setRawMode(true)
  return new Promise(resolve => process.stdin.once('data', data => {
    const byteArray = [...data]
    if (byteArray.length > 0 && byteArray[0] === 3) {
      console.log('^C')

      console.log('created events:');
      console.log(JSON.stringify(notes));
      process.exit(1)
    }
    process.stdin.setRawMode(false)
    resolve()
  }))
}

let notes = [];
let lastTime = 0;
let lastStep = true;

(async () => {
  while(true) {
    await keypress();
    const time = new Date();
    if (lastTime === 0) {
      lastTime = time;
    }

    const delay = time - lastTime;

    lastTime = time;
    lastStep = !lastStep;
    const event = { pattern: lastStep, delay };
    notes.push(event);
  }
})();

