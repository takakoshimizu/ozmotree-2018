import { chaserGen } from '../services/patterns';
import createPattern from '../services/pattern';

import Song from '../services/songs';
import Note from '../services/notes';

const startChaser = chaserGen(20, 0, 10, 5);
const startChaserIn = createPattern(startChaser(-1));
const startChaserOut = createPattern(startChaser(1, 80));

const refrainChaser = chaserGen(20, 0, 3, 3);
const refrainChaserIn = createPattern(refrainChaser(-1));
const refrainChaserOut = createPattern(refrainChaser(1));

const song = [
  { pattern: startChaserIn, delay: 584 },
  { pattern: startChaserOut, delay: 1460 },
  { pattern: startChaserIn, delay: 2701 },
  { pattern: startChaserOut, delay: 3869 },
  { pattern: startChaserIn, delay: 5110 },
  { pattern: startChaserOut, delay: 6205 },
  { pattern: startChaserIn, delay: 7373 },
  { pattern: startChaserOut, delay: 8541 },
  { pattern: refrainChaserIn, delay: 9709 },
  { pattern: refrainChaserOut, delay: 14381 },
  { pattern: refrainChaserIn, delay: 19053 },
  { pattern: refrainChaserOut, delay: 23652 },
  { pattern: refrainChaserIn, delay: 27156 },
  /*{ pattern: true, delay: 28324 },
  { pattern: false, delay: 28616 },
  { pattern: true, delay: 28908 },
  { pattern: false, delay: 29492 },
  { pattern: true, delay: 29711 },
  { pattern: false, delay: 30076 },
  { pattern: true, delay: 30660 },
  { pattern: false, delay: 30952 },
  { pattern: true, delay: 31244 },
  { pattern: false, delay: 31828 },
  { pattern: true, delay: 32996 },
  { pattern: false, delay: 33288 },
  { pattern: true, delay: 33580 },
  { pattern: false, delay: 34164 },
  { pattern: true, delay: 34456 },
  { pattern: false, delay: 34748 },
  { pattern: true, delay: 35259 },
  { pattern: false, delay: 35551 },
  { pattern: true, delay: 35916 },
  { pattern: false, delay: 36427 },
  { pattern: true, delay: 37011 },
  { pattern: false, delay: 37668 },
  { pattern: true, delay: 37960 },
  { pattern: false, delay: 38252 },
  { pattern: true, delay: 38836 },
  { pattern: false, delay: 39055 },
  { pattern: true, delay: 39347 },
  { pattern: false, delay: 39931 },
  { pattern: true, delay: 40223 },
  { pattern: false, delay: 40515 },
  { pattern: true, delay: 41172 },
  { pattern: false, delay: 42267 },
  { pattern: true, delay: 42559 },
  { pattern: false, delay: 42851 },
  { pattern: true, delay: 43435 },
  { pattern: false, delay: 43727 },
  { pattern: true, delay: 44019 },
  { pattern: false, delay: 44676 },
  { pattern: true, delay: 45260 },
  { pattern: false, delay: 45844 }*/
];

const JingleBells = new Song('jingle-bells.mp3');
for (const note of song) {
  JingleBells.addNote(Note(note.pattern, note.delay));
}

export default JingleBells;
