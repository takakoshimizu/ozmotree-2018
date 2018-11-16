export default class Song {
  constructor(filename) {
    this.notes = [];
    this.position = -1;
    this.filename = filename;

    this.nextNoteTimeout = null;
    this.advanceNote = this.advanceNote.bind(this);
    this.start = this.advanceNote;
    this.stop = this.reset;
  }

  getFilename() {
    return this.filename;
  }

  advanceNote() {
    this.position++;
    if (this.position >= this.notes.length) {
      this.position = 0;
    }

    const note = this.getCurrent();
    const nextTimeout = note.getDuration();

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