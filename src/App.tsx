import React, { useState, useCallback } from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { FileUpload } from './components/FileUpload';
import { ThumbnailPanel } from './components/ThumbnailPanel';
import { PdfViewer } from './components/PdfViewer';
import { NotesPanel } from './components/NotesPanel';
import { NoteModal } from './components/NoteModal';
import { Note, PdfSource, Selection } from './types/pdf';
import { NotesStorage } from './lib/storage';
import { v4 as uuidv4 } from 'uuid';
import { BookOpen, FileText, Link } from 'lucide-react';

function App() {
  const [pdfSource, setPdfSource] = useState<PdfSource | null>(null);
  const [fileName, setFileName] = useState<string | undefined>(undefined);
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [notes, setNotes] = useState<Note[]>(NotesStorage.loadNotes());
  const [selectedText, setSelectedText] = useState<Selection | null>(null);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [urlInput, setUrlInput] = useState('');

  const handleFileSelect = useCallback((selectedFile: File) => {
    setPdfSource(selectedFile);
    setFileName(selectedFile.name);
    setCurrentPage(1);
    setNumPages(0);
  }, []);

  const handleUrlSubmit = useCallback((url: string) => {
    if (url && url.trim()) {
      setPdfSource(url.trim());
      setFileName(url.split('/').pop() || 'document.pdf');
      setCurrentPage(1);
      setNumPages(0);
    }
  }, []);

  const handlePageChange = useCallback((pageNumber: number) => {
    setCurrentPage(pageNumber);
  }, []);

  const handleNumPagesChange = useCallback((pages: number) => {
    setNumPages(pages);
  }, []);

  const handleTextSelect = useCallback((selection: Selection) => {
    setSelectedText(selection);
    setIsNoteModalOpen(true);
  }, []);

  const handleNoteSave = useCallback((noteText: string) => {
    if (!selectedText) return;

    const newNote: Note = {
      id: uuidv4(),
      pageNumber: selectedText.pageNumber,
      selectedText: selectedText.text,
      noteText,
      position: selectedText.position,
      timestamp: Date.now(),
    };

    const updatedNotes = NotesStorage.addNote(newNote);
    setNotes(updatedNotes);
    setSelectedText(null);
  }, [selectedText]);

  const handleNoteClick = useCallback((note: Note) => {
    setCurrentPage(note.pageNumber);
  }, []);

  const handleNoteDelete = useCallback((noteId: string) => {
    const updatedNotes = NotesStorage.removeNote(noteId);
    setNotes(updatedNotes);
  }, []);

  const handleNoteUpdate = useCallback((noteId: string, noteText: string) => {
    const updatedNotes = NotesStorage.updateNote(noteId, { noteText });
    setNotes(updatedNotes);
  }, []);

  const currentPageNotes = notes.filter(note => note.pageNumber === currentPage);

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header title bar */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BookOpen className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">PDF Reader</h1>
                <p className="text-sm text-gray-600">Professional PDF reading and annotation tool</p>
              </div>
            </div>

            {pdfSource ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-gray-600">
                  {typeof pdfSource === 'string' ? (
                    <Link className="w-4 h-4" />
                  ) : (
                    <FileText className="w-4 h-4" />
                  )}
                  <span className="text-sm font-medium">{fileName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex">
                    <input
                      type="text"
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                      placeholder="https://example.com/document.pdf"
                      className="px-3 py-1 text-sm border border-gray-300 rounded-l-lg focus:outline-none focus:ring-1 focus:ring-blue-500 w-64"
                    />
                    <button
                      onClick={() => handleUrlSubmit(urlInput)}
                      className="px-3 py-1 text-sm bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 transition-colors"
                    >
                      Load
                    </button>
                  </div>
                  <FileUpload onFileSelect={handleFileSelect} hasFile={true} />
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <div className="flex">
                  <input
                    type="text"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder="https://example.com/document.pdf"
                    className="px-3 py-1 text-sm border border-gray-300 rounded-l-lg focus:outline-none focus:ring-1 focus:ring-blue-500 w-64"
                  />
                  <button
                    onClick={() => handleUrlSubmit(urlInput)}
                    className="px-3 py-1 text-sm bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 transition-colors"
                  >
                    Load
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main content area */}
      <main className="flex-1 overflow-hidden">
        {!pdfSource ? (
          <FileUpload onFileSelect={handleFileSelect} hasFile={false} />
        ) : (
          <PanelGroup direction="horizontal" className="h-full">
            {/* Left thumbnail panel */}
            <Panel defaultSize={20} minSize={15} maxSize={30}>
              <ThumbnailPanel
                source={pdfSource}
                numPages={numPages}
                currentPage={currentPage}
                onPageClick={handlePageChange}
                fileName={fileName}
              />
            </Panel>

            <PanelResizeHandle className="w-2 bg-gray-200 hover:bg-gray-300 transition-colors" />

            {/* Middle PDF reader */}
            <Panel defaultSize={60} minSize={40}>
              <PdfViewer
                source={pdfSource}
                currentPage={currentPage}
                numPages={numPages}
                onPageChange={handlePageChange}
                onNumPagesChange={handleNumPagesChange}
                onTextSelect={handleTextSelect}
                highlightedNotes={currentPageNotes}
                fileName={fileName}
              />
            </Panel>

            <PanelResizeHandle className="w-2 bg-gray-200 hover:bg-gray-300 transition-colors" />

            {/* Right notes panel */}
            <Panel defaultSize={20} minSize={15} maxSize={35}>
              <NotesPanel
                notes={notes}
                onNoteClick={handleNoteClick}
                onNoteDelete={handleNoteDelete}
                onNoteUpdate={handleNoteUpdate}
              />
            </Panel>
          </PanelGroup>
        )}
      </main>

      {/* Note addition modal */}
      <NoteModal
        isOpen={isNoteModalOpen}
        selection={selectedText}
        onClose={() => {
          setIsNoteModalOpen(false);
          setSelectedText(null);
        }}
        onSave={handleNoteSave}
      />
    </div>
  );
}

export default App;
