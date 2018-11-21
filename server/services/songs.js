const { spawn } = require("child_process");
const path = require("path");

export default class Song {
  constructor(filename) {
    this.notes = [];
    this.position = -1;
    this.filename = filename;

    this.nextNoteTimeout = null;
    this.advanceNote = this.advanceNote.bind(this);
    this.stop = this.reset;
  }

  start(doneCb) {
    this.notes.forEach(n => n.getPattern().reset());

    const songPath = path.resolve(__dirname, "..", "songs", this.getFilename());
    console.log("starting:", songPath);
    const song = spawn("mplayer", [songPath]);
    if (doneCb) song.on("close", doneCb);
    song.stderr.on("data", data => console.error(data.toString()));
    song.stdout.on("data", () => {});

    this.advanceNote();
  }

  getFilename() {
    return this.filename;
  }

  advanceNote() {
    const currentNote = this.getCurrent();
    let currentDuration = 0;
    if (currentNote) {
      currentDuration = currentNote.getDuration();
    }

    this.position++;
    if (this.position >= this.notes.length) {
      this.position = 0;
    }

    const nextNote = this.getCurrent();
    const nextTimeout = nextNote.getDuration() - currentDuration;

    if (this.nextNoteTimeout) clearTimeout(this.nextNoteTimeout);
    this.nextNoteTimeout = setTimeout(this.advanceNote, nextTimeout);
  }

  getCurrent() {
    const note = this.notes[this.position];
    return note;
  }

  reset() {
    this.position = -1;
    if (this.nextNoteTimeout) clearTimeout(this.nextNoteTimeout);
  }

  isRunning() {
    return this.position !== -1;
  }

  addNote(note) {
    this.notes.push(note);
  }
}
