import { createLight } from "../../common/lights";
import { singleChaser } from "./patterns";

import jingleBells from "../songs/jingle-bells";
import letItSnow from "../songs/let-it-snow";
import rockinAround from '../songs/rocking-around';
import babyShark from '../songs/baby-shark';

const playlist = [rockinAround, letItSnow, jingleBells];

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
    const rand = Math.floor(Math.random() * 20 + 1);
    if (rand === 1) {
      this.songIdx = -1;
    } else {
      this.songIdx++;
      if (this.songIdx >= playlist.length) {
        this.songIdx = 0;
      }
    }

    this.song = playlist[this.songIdx];
  }

  async find(params) {
    if (this.song && !this.song.isRunning()) {
      console.log("starting song");
      this.song.start(this.beginIdle.bind(this));
    }
    console.log(params);

    if (this.song) {
      const note = this.song.getCurrent();
      const pattern = note.getPattern();
      const lights = pattern(this.lights, TOTAL_LIGHTS);
      const doneTime = note.getNextTime();

      if (params.query.type === 'csv') {
        return lights.map(l => `${l.r},${l.g},${l.b}`).join('\n');
      }
      return lights.map(l => [l.r, l.g, l.b]);
    }

    const lights = IDLE_PATTERN(this.lights, TOTAL_LIGHTS);
    if (params.query.type === 'csv') {
      return lights.map(l => `${l.r},${l.g},${l.b}`).join('\n');
    }
    
    return lights.map(l => [l.r, l.g, l.b]);
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
    //if (!this.song) this.nextSong();
    return this.lights[this.lightId(id)];
  }
}
