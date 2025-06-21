import React from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

// 设置PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

interface ThumbnailPanelProps {
  file: File | null;
  numPages: number;
  currentPage: number;
  onPageClick: (pageNumber: number) => void;
}

export const ThumbnailPanel: React.FC<ThumbnailPanelProps> = ({
  file,
  numPages,
  currentPage,
  onPageClick,
}) => {
  if (!file) {
    return (
      <div className="w-full h-full bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">请上传PDF文件</p>
      </div>
    );
  }

  return (
    <div className="h-full bg-white border-r border-gray-200 overflow-y-auto">
      <div className="p-4">
        <h3 className="text-sm font-medium text-gray-900 mb-4">页面缩略图</h3>
        <div className="space-y-3">
          {Array.from(Array(numPages).keys()).map((pageIndex) => {
            const pageNumber = pageIndex + 1;
            return (
              <div
                key={pageNumber}
                className={`cursor-pointer border-2 rounded-lg transition-all ${
                  currentPage === pageNumber
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => onPageClick(pageNumber)}
              >
                <div className="p-2">
                  <div className="text-xs text-center mb-2 text-gray-600">
                    第 {pageNumber} 页
                  </div>
                  <div className="flex justify-center">
                    <Document file={file} className="thumbnail-document">
                      <Page
                        pageNumber={pageNumber}
                        width={120}
                        renderTextLayer={false}
                        renderAnnotationLayer={false}
                        className="thumbnail-page"
                      />
                    </Document>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
