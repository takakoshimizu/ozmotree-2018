import {
  chaserGen,
  spread,
  allColor1,
  allColor2,
  twoThree,
  threeTwo
} from "../services/patterns";
import createPattern from "../services/pattern";

import Song from "../services/songs";
import Note from "../services/notes";

const startChaser = chaserGen(20, 0, 7, 3);
const startChaserIn = createPattern(startChaser(-1));
const startChaserOut = createPattern(startChaser(1, 80));

const refrainChaser = chaserGen(20, 0, 3, 3);
const refrainChaserIn = createPattern(refrainChaser(-1));
const refrainChaserOut = createPattern(refrainChaser(1));

const song = [
  { pattern: startChaserIn, delay: 2628 },
  { pattern: startChaserOut, delay: 4745 },
  { pattern: startChaserIn, delay: 7300 },
  { pattern: spread(-1, 20), delay: 8979 },
  { pattern: allColor1, delay: 9344 },
  { pattern: refrainChaserIn, delay: 9636 },
  { pattern: refrainChaserOut, delay: 14162 },
  { pattern: refrainChaserIn, delay: 18907 },
  { pattern: refrainChaserOut, delay: 23433 },
  { pattern: refrainChaserIn, delay: 28251 },
  { pattern: twoThree, delay: 28324 },
  { pattern: threeTwo, delay: 28543 },
  { pattern: twoThree, delay: 28835 },
  { pattern: threeTwo, delay: 29419 },
  { pattern: twoThree, delay: 29638 },
  { pattern: threeTwo, delay: 29930 },
  { pattern: threeTwo, delay: 30587 },
  { pattern: twoThree, delay: 30806 },
  { pattern: threeTwo, delay: 31171 },
  { pattern: twoThree, delay: 31755 },
  { pattern: threeTwo, delay: 32923 },
  { pattern: twoThree, delay: 33142 },
  { pattern: threeTwo, delay: 33434 },
  { pattern: twoThree, delay: 34018 },
  { pattern: threeTwo, delay: 34310 },
  { pattern: twoThree, delay: 34602 },
  { pattern: threeTwo, delay: 35186 },
  { pattern: twoThree, delay: 35478 },
  { pattern: threeTwo, delay: 35770 },
  { pattern: twoThree, delay: 36354 },
  { pattern: threeTwo, delay: 37595 },
  { pattern: twoThree, delay: 37814 },
  { pattern: threeTwo, delay: 38179 },
  { pattern: twoThree, delay: 38763 },
  { pattern: threeTwo, delay: 38982 },
  { pattern: twoThree, delay: 39274 },
  { pattern: threeTwo, delay: 39858 },
  { pattern: twoThree, delay: 40150 },
  { pattern: threeTwo, delay: 40442 },
  { pattern: twoThree, delay: 41026 },
  { pattern: threeTwo, delay: 42194 },
  { pattern: twoThree, delay: 42486 },
  { pattern: threeTwo, delay: 42851 },
  { pattern: twoThree, delay: 43362 },
  { pattern: threeTwo, delay: 43654 },
  { pattern: twoThree, delay: 43946 },
  { pattern: threeTwo, delay: 44530 },
  { pattern: twoThree, delay: 45187 },
  { pattern: threeTwo, delay: 45771 }
];

const JingleBells = new Song("jingle-bells.mp4");
for (const note of song) {
  JingleBells.addNote(Note(note.pattern, note.delay));
}

export default JingleBells;
