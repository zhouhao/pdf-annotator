import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Document, Page, pdfjs} from 'react-pdf';
import {ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Maximize} from 'lucide-react';
import {Note, PdfSource, Selection} from '../types/pdf';

// Set up PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

interface PdfViewerProps {
  source: PdfSource | null;
  currentPage: number;
  numPages: number;
  onPageChange: (pageNumber: number) => void;
  onNumPagesChange: (numPages: number) => void;
  onTextSelect: (selection: Selection) => void;
  highlightedNotes: Note[];
  fileName?: string;
}

export const PdfViewer: React.FC<PdfViewerProps> = ({
                                                      source,
                                                      currentPage,
                                                      numPages,
                                                      onPageChange,
                                                      onNumPagesChange,
                                                      onTextSelect,
                                                      highlightedNotes,
                                                      fileName,
                                                    }) => {
  const [scale, setScale] = useState(1.2);
  const [isLoading, setIsLoading] = useState(false);
  const pageRef = useRef<HTMLDivElement>(null);
  const pdfPageRef = useRef<HTMLDivElement>(null);

  const handleDocumentLoadSuccess = ({numPages}: { numPages: number }) => {
    onNumPagesChange(numPages);
    setIsLoading(false);
  };

  const handleDocumentLoadError = (error: Error) => {
    console.error('PDF loading failed:', error);
    setIsLoading(false);
    alert('PDF file loading failed, please check if the file is corrupted');
  };

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.2, 3));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev - 0.2, 0.5));
  };

  const handleResetZoom = () => {
    setScale(1.0);
  };


  const handlePrevPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < numPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key === 'ArrowLeft') {
      handlePrevPage();
    } else if (event.key === 'ArrowRight') {
      handleNextPage();
    } else if (event.key === '+' || event.key === '=') {
      handleZoomIn();
    } else if (event.key === '-') {
      handleZoomOut();
    }
  }, [currentPage, numPages]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Handle text selection
  const handleTextSelection = () => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed || !pageRef.current) return;

    const selectedText = selection.toString().trim();
    if (!selectedText) return;

    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    // Find the relative container which is the parent of the PDF page
    const relativeContainer = pageRef.current.querySelector('.relative');
    if (!relativeContainer) return;

    const containerRect = relativeContainer.getBoundingClientRect();

    // Calculate position
    let x = rect.left - containerRect.left;
    let y = rect.top - containerRect.top;
    let width = rect.width;
    let height = rect.height;

    // Adjust for scale (divide by scale since we'll multiply by scale when rendering)
    x = x / scale;
    y = y / scale;
    width = width / scale;
    height = height / scale;

    const selectionData: Selection = {
      text: selectedText,
      pageNumber: currentPage,
      position: {
        x,
        y,
        width,
        height,
      },
    };

    onTextSelect(selectionData);
    selection.removeAllRanges();
  };


  if (!source) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">Please upload a PDF file or enter a URL to start reading</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-gray-100">
      {/* Toolbar */}
      <div className="bg-white border-b border-gray-200 p-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Page navigation */}
          <button
            onClick={handlePrevPage}
            disabled={currentPage <= 1}
            className="p-2 rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4"/>
          </button>

          <span className="px-3 py-1 bg-gray-100 rounded text-sm">
            {currentPage} / {numPages}
          </span>

          <button
            onClick={handleNextPage}
            disabled={currentPage >= numPages}
            className="p-2 rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-4 h-4"/>
          </button>
        </div>

        <div className="flex items-center gap-2">
          {/* Zoom control */}
          <button
            onClick={handleZoomOut}
            className="p-2 rounded bg-gray-100 hover:bg-gray-200"
          >
            <ZoomOut className="w-4 h-4"/>
          </button>

          <span className="px-3 py-1 bg-gray-100 rounded text-sm min-w-[60px] text-center">
            {Math.round(scale * 100)}%
          </span>

          <button
            onClick={handleResetZoom}
            className="p-2 rounded bg-gray-100 hover:bg-gray-200"
          >
            <Maximize className="w-4 h-4"/>
          </button>

          <button
            onClick={handleZoomIn}
            className="p-2 rounded bg-gray-100 hover:bg-gray-200"
          >
            <ZoomIn className="w-4 h-4"/>
          </button>

        </div>
      </div>

      {/* PDF display area */}
      <div className="flex-1 overflow-auto p-4">
        <div
          ref={pageRef}
          className="flex justify-center"
          onMouseUp={handleTextSelection}
        >
          <div className="relative inline-block shadow-lg">
            {isLoading && (
              <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
                <div className="text-gray-600">Loading...</div>
              </div>
            )}

            <Document
              file={source}
              onLoadSuccess={handleDocumentLoadSuccess}
              onLoadError={handleDocumentLoadError}
              loading={<div className="p-8 text-center text-gray-600">Loading PDF document...</div>}
              error={<div className="p-8 text-center text-red-600">PDF document loading failed</div>}
            >
              <Page
                pageNumber={currentPage}
                scale={scale}
                renderTextLayer={true}
                renderAnnotationLayer={false}
                className="pdf-page"
                loading={<div className="p-8 text-center text-gray-600">Loading page...</div>}
                error={<div className="p-8 text-center text-red-600">Page loading failed</div>}
                inputRef={pdfPageRef}
              />
            </Document>

            {/* Highlight notes position */}
            {highlightedNotes
              .filter(note => note.pageNumber === currentPage)
              .map(note => {
                // Set position
                const style: React.CSSProperties = {
                  left: note.position.x * scale,
                  top: note.position.y * scale,
                  width: note.position.width * scale,
                  height: note.position.height * scale,
                };

                return (
                  <div
                    key={note.id}
                    className="absolute border-2 border-yellow-400 bg-yellow-200 bg-opacity-30 pointer-events-none"
                    style={style}
                  />
                );
              })}
          </div>
        </div>
      </div>

      {/* Operation tips */}
      <div className="bg-gray-50 border-t border-gray-200 p-2">
        <p className="text-xs text-gray-500 text-center">
          Tips: Select text to add notes • Use arrow keys to turn pages • Use +/- keys to zoom
        </p>
      </div>
    </div>
  );
};
