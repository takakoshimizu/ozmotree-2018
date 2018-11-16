import { createLight } from '../../common/lights';
import jingleBells from '../songs/jingle-bells';

const NUM_LIGHTS = process.env.NUM_LIGHTS || 2;
const TOTAL_LIGHTS = process.env.TOTAL_LIGHTS || 900;

export default class Lights {
  constructor() {
    this.lights = new Array(NUM_LIGHTS).fill(createLight(0, 0, 0));
    this.song = jingleBells;
  }

  lightId(id) {
    return parseInt(id, 10) - 1;
  }

  async find() {
    if (!this.song.isRunning()) {
      this.song.start();
    }

    const note = this.song.getCurrent();
    const pattern = note.getPattern();
    const lights = pattern(this.lights, TOTAL_LIGHTS);
    const doneTime = note.getNextTime();

    return { lights, next: doneTime };
  }

  async get(id) {
    const light = this.lights[this.lightId(id)];

    if (!light) {
      throw new Error('Light index out of bounds.');
    }

    return light;
  }

  async patch(id, light) {
    this.lights[this.lightId(id)] = createLight(light.r, light.g, light.b);
    return this.lights[this.lightId(id)];
  }
}