import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Document, Page, pdfjs} from 'react-pdf';
import {ChevronLeft, ChevronRight, Download, RotateCw, ZoomIn, ZoomOut} from 'lucide-react';
import {Note, PdfSource, Selection} from '../types/pdf';

// 设置PDF.js worker
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
  const [rotation, setRotation] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const pageRef = useRef<HTMLDivElement>(null);
  const pdfPageRef = useRef<HTMLDivElement>(null);

  const handleDocumentLoadSuccess = ({numPages}: { numPages: number }) => {
    onNumPagesChange(numPages);
    setIsLoading(false);
  };

  const handleDocumentLoadError = (error: Error) => {
    console.error('PDF加载失败:', error);
    setIsLoading(false);
    alert('PDF文件加载失败，请检查文件是否损坏');
  };

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.2, 3));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev - 0.2, 0.5));
  };

  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360);
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

  // 处理文本选择
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

    // Calculate position based on rotation
    let x = rect.left - containerRect.left;
    let y = rect.top - containerRect.top;
    let width = rect.width;
    let height = rect.height;

    // Adjust position based on rotation
    if (rotation === 90) {
      const pageWidth = pdfPageRef.current?.clientWidth || 0;
      const tempX = y;
      y = pageWidth - x - width;
      x = tempX;
      const tempWidth = width;
      width = height;
      height = tempWidth;
    } else if (rotation === 180) {
      const pageWidth = pdfPageRef.current?.clientWidth || 0;
      const pageHeight = pdfPageRef.current?.clientHeight || 0;
      x = pageWidth - x - width;
      y = pageHeight - y - height;
    } else if (rotation === 270) {
      const pageHeight = pdfPageRef.current?.clientHeight || 0;
      const tempY = x;
      x = pageHeight - y - height;
      y = tempY;
      const tempWidth = width;
      width = height;
      height = tempWidth;
    }

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

  const downloadFile = () => {
    if (!source) return;

    if (typeof source === 'string') {
      // For URL source
      const a = document.createElement('a');
      a.href = source;
      a.target = '_blank';
      a.download = fileName || 'document.pdf';
      a.click();
    } else {
      // For File source
      const url = URL.createObjectURL(source);
      const a = document.createElement('a');
      a.href = url;
      a.download = source.name;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  if (!source) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">请上传PDF文件或输入URL开始阅读</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-gray-100">
      {/* 工具栏 */}
      <div className="bg-white border-b border-gray-200 p-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* 页面导航 */}
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
          {/* 缩放控制 */}
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
            onClick={handleZoomIn}
            className="p-2 rounded bg-gray-100 hover:bg-gray-200"
          >
            <ZoomIn className="w-4 h-4"/>
          </button>

          {/* 旋转控制 */}
          <button
            onClick={handleRotate}
            className="p-2 rounded bg-gray-100 hover:bg-gray-200"
          >
            <RotateCw className="w-4 h-4"/>
          </button>

          {/* 下载按钮 */}
          <button
            onClick={downloadFile}
            className="p-2 rounded bg-gray-100 hover:bg-gray-200"
          >
            <Download className="w-4 h-4"/>
          </button>
        </div>
      </div>

      {/* PDF显示区域 */}
      <div className="flex-1 overflow-auto p-4">
        <div
          ref={pageRef}
          className="flex justify-center"
          onMouseUp={handleTextSelection}
        >
          <div className="relative inline-block shadow-lg">
            {isLoading && (
              <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
                <div className="text-gray-600">加载中...</div>
              </div>
            )}

            <Document
              file={source}
              onLoadSuccess={handleDocumentLoadSuccess}
              onLoadError={handleDocumentLoadError}
              loading={<div className="p-8 text-center text-gray-600">加载PDF文档中...</div>}
              error={<div className="p-8 text-center text-red-600">PDF文档加载失败</div>}
            >
              <Page
                pageNumber={currentPage}
                scale={scale}
                rotate={rotation}
                renderTextLayer={true}
                renderAnnotationLayer={false}
                className="pdf-page"
                loading={<div className="p-8 text-center text-gray-600">加载页面中...</div>}
                error={<div className="p-8 text-center text-red-600">页面加载失败</div>}
                inputRef={pdfPageRef}
              />
            </Document>

            {/* 高亮显示备注位置 */}
            {highlightedNotes
              .filter(note => note.pageNumber === currentPage)
              .map(note => {
                // Calculate position based on rotation
                let style: React.CSSProperties = {};

                if (rotation === 0) {
                  style = {
                    left: note.position.x * scale,
                    top: note.position.y * scale,
                    width: note.position.width * scale,
                    height: note.position.height * scale,
                  };
                } else if (rotation === 90) {
                  const pageWidth = pdfPageRef.current?.clientWidth || 0;
                  style = {
                    left: note.position.y * scale,
                    top: pageWidth - (note.position.x + note.position.width) * scale,
                    width: note.position.height * scale,
                    height: note.position.width * scale,
                    transform: 'rotate(90deg)',
                    transformOrigin: 'top left',
                  };
                } else if (rotation === 180) {
                  const pageWidth = pdfPageRef.current?.clientWidth || 0;
                  const pageHeight = pdfPageRef.current?.clientHeight || 0;
                  style = {
                    left: pageWidth - (note.position.x + note.position.width) * scale,
                    top: pageHeight - (note.position.y + note.position.height) * scale,
                    width: note.position.width * scale,
                    height: note.position.height * scale,
                    transform: 'rotate(180deg)',
                    transformOrigin: 'center',
                  };
                } else if (rotation === 270) {
                  const pageHeight = pdfPageRef.current?.clientHeight || 0;
                  style = {
                    left: pageHeight - (note.position.y + note.position.height) * scale,
                    top: note.position.x * scale,
                    width: note.position.height * scale,
                    height: note.position.width * scale,
                    transform: 'rotate(270deg)',
                    transformOrigin: 'top left',
                  };
                }

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

      {/* 操作提示 */}
      <div className="bg-gray-50 border-t border-gray-200 p-2">
        <p className="text-xs text-gray-500 text-center">
          提示：选择文本添加备注 • 使用方向键翻页 • 使用 +/- 键缩放
        </p>
      </div>
    </div>
  );
};
