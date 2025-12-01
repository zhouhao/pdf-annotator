import React, {useState} from 'react';
import {Note} from '../types/pdf';
import {Trash2, Edit3, MapPin, Calendar} from 'lucide-react';

interface NotesPanelProps {
  notes: Note[];
  onNoteClick: (note: Note) => void;
  onNoteDelete: (noteId: string) => void;
  onNoteUpdate: (noteId: string, noteText: string) => void;
}

export const NotesPanel: React.FC<NotesPanelProps> = ({
                                                        notes,
                                                        onNoteClick,
                                                        onNoteDelete,
                                                        onNoteUpdate,
                                                      }) => {
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');

  const handleEditStart = (note: Note) => {
    setEditingNoteId(note.id);
    setEditText(note.noteText);
  };

  const handleEditSave = (noteId: string) => {
    onNoteUpdate(noteId, editText);
    setEditingNoteId(null);
    setEditText('');
  };

  const handleEditCancel = () => {
    setEditingNoteId(null);
    setEditText('');
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  if (notes.length === 0) {
    return (
      <div className="w-full h-full bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Edit3 className="w-12 h-12 mx-auto text-gray-400 mb-4"/>
          <p className="text-gray-500">No Notes</p>
          <p className="text-sm text-gray-400 mt-2">
            Select text in PDF to add notes
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-white border-l border-gray-200 overflow-y-auto">
      <div className="p-4">
        <h3 className="text-sm font-medium text-gray-900 mb-4">
          My Notes ({notes.length})
        </h3>
        <div className="space-y-4">
          {notes.map((note) => (
            <div
              key={note.id}
              className="border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => !editingNoteId && onNoteClick(note)}
            >
              {/* Page info and time */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <MapPin className="w-3 h-3"/>
                  Page {note.pageNumber}
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-400">
                  <Calendar className="w-3 h-3"/>
                  {formatDate(note.timestamp)}
                </div>
              </div>

              {/* Selected text */}
              <div className="mb-2">
                <div className="text-xs text-gray-500 mb-1">Selected text:</div>
                <div className="text-sm bg-yellow-50 border-l-4 border-yellow-400 pl-2 py-1">
                  "{truncateText(note.selectedText, 80)}"
                </div>
              </div>

              {/* Note content */}
              <div className="mb-3">
                <div className="text-xs text-gray-500 mb-1">My note:</div>
                {editingNoteId === note.id ? (
                  <div className="space-y-2">
                    <textarea
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="w-full p-2 text-sm border border-gray-300 rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={3}
                      placeholder="Enter your note..."
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditSave(note.id);
                        }}
                        className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        Save
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditCancel();
                        }}
                        className="px-3 py-1 text-xs bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-gray-800 bg-gray-50 p-2 rounded">
                    {note.noteText || '(No note content)'}
                  </div>
                )}
              </div>

              {/* Action buttons */}
              {editingNoteId !== note.id && (
                <div className="flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditStart(note);
                    }}
                    className="flex items-center gap-1 px-2 py-1 text-xs text-blue-600 hover:bg-blue-50 rounded"
                  >
                    <Edit3 className="w-3 h-3"/>
                    Edit
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm('Are you sure you want to delete this note?')) {
                        onNoteDelete(note.id);
                      }
                    }}
                    className="flex items-center gap-1 px-2 py-1 text-xs text-red-600 hover:bg-red-50 rounded"
                  >
                    <Trash2 className="w-3 h-3"/>
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};