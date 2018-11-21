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

const song = [
  { pattern: allColor1, delay: 650 },
  { pattern: allColor2, delay: 845 },
  { pattern: allColor1, delay: 1170 },
  { pattern: allColor2, delay: 1365 },
  { pattern: allColor1, delay: 1625 },
  { pattern: allColor2, delay: 2470 },
  { pattern: allColor1, delay: 2730 },
  { pattern: allColor2, delay: 2990 },
  { pattern: allColor1, delay: 3380 },
  { pattern: allColor2, delay: 4615 },
  { pattern: allColor1, delay: 6630 },
  { pattern: allColor2, delay: 6890 },
  { pattern: allColor1, delay: 7150 },
  { pattern: allColor2, delay: 7540 },
  { pattern: allColor1, delay: 8970 },
  { pattern: allColor2, delay: 9230 },
  { pattern: allColor1, delay: 9555 },
  { pattern: allColor2, delay: 9880 },
  { pattern: allColor1, delay: 11115 },
  { pattern: allColor2, delay: 11310 },
  { pattern: allColor1, delay: 11635 },
  { pattern: allColor2, delay: 11960 },
  { pattern: allColor1, delay: 13325 },
  { pattern: allColor2, delay: 15015 },
  { pattern: allColor1, delay: 15275 },
  { pattern: allColor2, delay: 15535 },
  { pattern: allColor1, delay: 15860 },
  { pattern: allColor2, delay: 17355 },
  { pattern: allColor1, delay: 17615 },
  { pattern: allColor2, delay: 17940 },
  { pattern: allColor1, delay: 18200 },
  { pattern: allColor2, delay: 19435 },
  { pattern: allColor1, delay: 19695 },
  { pattern: allColor2, delay: 19955 },
  { pattern: allColor1, delay: 20345 },
  { pattern: allColor2, delay: 23335 },
  { pattern: allColor1, delay: 23595 },
  { pattern: allColor2, delay: 23855 },
  { pattern: allColor1, delay: 24245 },
  { pattern: allColor2, delay: 25675 },
  { pattern: allColor1, delay: 25935 },
  { pattern: allColor2, delay: 26260 },
  { pattern: allColor1, delay: 26585 },
  { pattern: allColor2, delay: 27755 },
  { pattern: allColor1, delay: 28015 },
  { pattern: allColor2, delay: 28340 },
  { pattern: allColor1, delay: 28730 },
  { pattern: allColor2, delay: 31590 }
];

const BabyShark = new Song("baby-shark.mp4");
for (const note of song) {
  BabyShark.addNote(Note(note.pattern, note.delay));
}

export default BabyShark;
