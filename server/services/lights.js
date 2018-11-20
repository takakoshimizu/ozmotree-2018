import { createLight } from '../../common/lights';
import jingleBells from '../songs/jingle-bells';

const TOTAL_LIGHTS = process.env.TOTAL_LIGHTS || 900;

const nextSong = _this => () => {
  _this.song.reset(); // testing purposes
};

export default class Lights {
  constructor() {
    this.lights = [createLight(0, 144, 255), createLight(0, 219, 197)];
    this.song = jingleBells;
  }

  lightId(id) {
    return parseInt(id, 10) - 1;
  }

  async find() {
    if (!this.song.isRunning()) {
      console.log('starting song');
      this.song.start(nextSong(this));
    }

    const note = this.song.getCurrent();
    const pattern = note.getPattern();
    const lights = pattern(this.lights, TOTAL_LIGHTS);
    const doneTime = note.getNextTime();

    return { lights: lights.map(l => [l.r, l.g, l.b]), next: doneTime };
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