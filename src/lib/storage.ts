import { Note } from '../types/pdf';

const STORAGE_KEY = 'pdf-reader-notes';

export class NotesStorage {
  static saveNotes(notes: Note[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
    } catch (error) {
      console.error('Failed to save notes:', error);
    }
  }

  static loadNotes(): Note[] {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Failed to load notes:', error);
      return [];
    }
  }

  static addNote(note: Note): Note[] {
    const notes = this.loadNotes();
    notes.push(note);
    this.saveNotes(notes);
    return notes;
  }

  static removeNote(noteId: string): Note[] {
    const notes = this.loadNotes().filter(note => note.id !== noteId);
    this.saveNotes(notes);
    return notes;
  }

  static updateNote(noteId: string, updates: Partial<Note>): Note[] {
    const notes = this.loadNotes().map(note => 
      note.id === noteId ? { ...note, ...updates } : note
    );
    this.saveNotes(notes);
    return notes;
  }
}
