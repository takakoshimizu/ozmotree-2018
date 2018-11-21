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
  { pattern: allColor1, delay: 2970 },
  { pattern: allColor2, delay: 4320 },
  { pattern: allColor1, delay: 10962 },
  { pattern: allColor2, delay: 14364 },
  { pattern: allColor1, delay: 16038 },
  { pattern: allColor2, delay: 17820 },
  { pattern: allColor1, delay: 21168 },
  { pattern: allColor2, delay: 23382 },
  { pattern: allColor1, delay: 24570 },
  { pattern: allColor2, delay: 27432 },
  { pattern: allColor1, delay: 31914 }
];

const RockinAround = new Song("rocking-around.mp4");
for (const note of song) {
  RockinAround.addNote(Note(note.pattern, note.delay));
}

export default RockinAround;
