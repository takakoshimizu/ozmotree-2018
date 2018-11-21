import { createLight } from "../../common/lights";
import { singleChaser } from "./patterns";

import jingleBells from "../songs/jingle-bells";
import letItSnow from "../songs/let-it-snow";
import rockinAround from '../songs/rocking-around';
import babyShark from '../songs/baby-shark';

const playlist = [babyShark, rockinAround, letItSnow, jingleBells];

const IDLE_PATTERN = singleChaser;
const IDLE_TIME = process.env.IDLE_TIME
  ? parseInt(process.env.IDLE_TIME, 10)
  : 1000 * 60 * 5;

const TOTAL_LIGHTS = process.env.TOTAL_LIGHTS || 900;

export default class Lights {
  constructor() {
    this.lights = [createLight(0, 144, 255), createLight(0, 219, 197)];
    this.songIdx = 0;
    this.song = playlist[this.songIdx];
  }

  lightId(id) {
    return parseInt(id, 10) - 1;
  }

  beginIdle() {
    this.song.reset();
    this.song = null;
    setTimeout(this.nextSong.bind(this), IDLE_TIME);
  }

  nextSong() {
    this.songIdx++;
    if (this.songIdx >= playlist.length) {
      this.songIdx = 0;
    }

    this.song = playlist[this.songIdx];
  }

  async find() {
    if (this.song && !this.song.isRunning()) {
      console.log("starting song");
      this.song.start(this.beginIdle.bind(this));
    }

    if (this.song) {
      const note = this.song.getCurrent();
      const pattern = note.getPattern();
      const lights = pattern(this.lights, TOTAL_LIGHTS);
      const doneTime = note.getNextTime();

      return { lights: lights.map(l => [l.r, l.g, l.b]), next: doneTime };
    }

    const lights = IDLE_PATTERN(this.lights, TOTAL_LIGHTS);
    return { lights: lights.map(l => [l.r, l.g, l.b]), next: new Date() + 100 };
  }

  async get(id) {
    const light = this.lights[this.lightId(id)];

    if (!light) {
      throw new Error("Light index out of bounds.");
    }

    return light;
  }

  async patch(id, light) {
    this.lights[this.lightId(id)] = createLight(light.r, light.g, light.b);
    if (!this.song) this.nextSong();
    return this.lights[this.lightId(id)];
  }
}
