export default class Note {
  constructor(pattern, duration) {
    this.pattern = pattern;
    this.duration = duration;
  }

  getPattern() {
    return this.pattern;
  }

  getDuration() {
    return this.duration;
  }

  getNextTime() {
    const now = new Date();
    return now.getTime() + this.duration;
  }
}