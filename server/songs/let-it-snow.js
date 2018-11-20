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

const startChaser = chaserGen(20, 0, 12, 3);
const startChaserIn = createPattern(startChaser(-1));
const startChaserOut = createPattern(startChaser(1));

const refrainChaser = chaserGen(40, 0, 5, 3);
const refrainChaserIn = createPattern(refrainChaser(-1));
const refrainChaserOut = createPattern(refrainChaser(1));

const song = [
  { pattern: startChaserIn, delay: 3710 },
  { pattern: startChaserOut, delay: 6890 },
  { pattern: spread(0, 100), delay: 10123 },
  { pattern: spread(1, 100), delay: 13303 },
  { pattern: allColor1, delay: 13462 },
  { pattern: allColor1, delay: 13939 },
  { pattern: refrainChaserIn, delay: 16483 },
  { pattern: refrainChaserOut, delay: 19557 },
  { pattern: startChaserIn, delay: 19981 },
  { pattern: refrainChaserOut, delay: 20405 },
  { pattern: refrainChaserIn, delay: 23267 },
  { pattern: refrainChaserOut, delay: 26553 },
  { pattern: startChaserIn, delay: 27030 },
  { pattern: refrainChaserOut, delay: 29839 },
  { pattern: spread(-1, 100), delay: 32000 }
];

const LetItSnow = new Song("let-it-snow.mp3");
for (const note of song) {
  LetItSnow.addNote(Note(note.pattern, note.delay));
}

export default LetItSnow;
