import React, { useState, useCallback } from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { FileUpload } from './components/FileUpload';
import { ThumbnailPanel } from './components/ThumbnailPanel';
import { PdfViewer } from './components/PdfViewer';
import { NotesPanel } from './components/NotesPanel';
import { NoteModal } from './components/NoteModal';
import { Note, Selection } from './types/pdf';
import { NotesStorage } from './lib/storage';
import { v4 as uuidv4 } from 'uuid';
import { BookOpen, FileText } from 'lucide-react';

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [notes, setNotes] = useState<Note[]>(NotesStorage.loadNotes());
  const [selectedText, setSelectedText] = useState<Selection | null>(null);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);

  const handleFileSelect = useCallback((selectedFile: File) => {
    setFile(selectedFile);
    setCurrentPage(1);
    setNumPages(0);
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
      {/* 头部标题栏 */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BookOpen className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">PDF阅读器</h1>
                <p className="text-sm text-gray-600">专业的PDF阅读和备注工具</p>
              </div>
            </div>
            
            {file && (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-gray-600">
                  <FileText className="w-4 h-4" />
                  <span className="text-sm font-medium">{file.name}</span>
                </div>
                <FileUpload onFileSelect={handleFileSelect} hasFile={true} />
              </div>
            )}
          </div>
        </div>
      </header>

      {/* 主内容区域 */}
      <main className="flex-1 overflow-hidden">
        {!file ? (
          <FileUpload onFileSelect={handleFileSelect} hasFile={false} />
        ) : (
          <PanelGroup direction="horizontal" className="h-full">
            {/* 左侧缩略图面板 */}
            <Panel defaultSize={20} minSize={15} maxSize={30}>
              <ThumbnailPanel
                file={file}
                numPages={numPages}
                currentPage={currentPage}
                onPageClick={handlePageChange}
              />
            </Panel>

            <PanelResizeHandle className="w-2 bg-gray-200 hover:bg-gray-300 transition-colors" />

            {/* 中间PDF阅读器 */}
            <Panel defaultSize={60} minSize={40}>
              <PdfViewer
                file={file}
                currentPage={currentPage}
                numPages={numPages}
                onPageChange={handlePageChange}
                onNumPagesChange={handleNumPagesChange}
                onTextSelect={handleTextSelect}
                highlightedNotes={currentPageNotes}
              />
            </Panel>

            <PanelResizeHandle className="w-2 bg-gray-200 hover:bg-gray-300 transition-colors" />

            {/* 右侧备注面板 */}
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

      {/* 备注添加模态框 */}
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
