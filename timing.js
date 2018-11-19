const { spawn } = require('child_process');

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
let lastStep = true;
const BPM = process.env.BPM ? parseInt(process.env.BPM, 10) : 80;
const MSPERB = Math.round((1000 * 60) / BPM);
const EIGTH_NOTE = Math.round(MSPERB / 8);

const quantize = delay => {
  const rem = delay % EIGTH_NOTE;
  const halfB = EIGTH_NOTE / 2;
  if (rem > halfB) return Math.round(delay - rem + halfB * 2);
  return Math.round(delay - rem);
};

// start song
const songFile = process.argv[2];

(async () => {
  console.log('3...');
  await new Promise(resolve => setTimeout(resolve, 1000));
  console.log('2...');
  await new Promise(resolve => setTimeout(resolve, 1000));
  console.log('1...');
  await new Promise(resolve => setTimeout(resolve, 1000));

  const song = spawn('mplayer', [songFile]);
  song.stdout.on('data', () => {});
  song.on('close', () => { console.log('song ended') });

  let startTime = new Date();

  while(true) {
    await keypress();
    const time = new Date();

    const delay = time - startTime;

    lastStep = !lastStep;
    const event = { pattern: lastStep, delay: quantize(delay) };
    notes.push(event);
  }
})();

