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
  { pattern: startChaserIn, delay: 2970 },
  { pattern: startChaserOut, delay: 4320 },
  { pattern: refrainChaserIn, delay: 10962 },
  { pattern: spread(-1, 200), delay: 14364 },
  { pattern: twoThree, delay: 16038 },
  { pattern: spread(0, 200), delay: 17820 },
  { pattern: startChaserIn, delay: 21168 },
  { pattern: startChaserOut, delay: 23382 },
  { pattern: refrainChaserIn, delay: 24570 },
  { pattern: refrainChaserOut, delay: 27432 },
  { pattern: spread(-1, 200), delay: 31914 }
];

const RockinAround = new Song("rocking-around.mp4");
for (const note of song) {
  RockinAround.addNote(Note(note.pattern, note.delay));
}

export default RockinAround;
