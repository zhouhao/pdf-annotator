import React, { useRef } from 'react';
import { Upload, FileText } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  hasFile: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, hasFile }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      onFileSelect(file);
    } else {
      alert('请选择一个有效的PDF文件');
    }
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && file.type === 'application/pdf') {
      onFileSelect(file);
    } else {
      alert('请选择一个有效的PDF文件');
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  if (hasFile) {
    return (
      <button
        onClick={openFileDialog}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        <FileText className="w-4 h-4" />
        更换PDF文件
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          className="hidden"
        />
      </button>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-full bg-gray-50">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="w-full max-w-md p-8 border-2 border-dashed border-gray-300 rounded-lg text-center hover:border-blue-400 transition-colors cursor-pointer"
        onClick={openFileDialog}
      >
        <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          上传PDF文件
        </h3>
        <p className="text-gray-600 mb-4">
          拖拽PDF文件到此处，或点击选择文件
        </p>
        <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          选择文件
        </button>
        <p className="text-sm text-gray-500 mt-2">
          支持PDF格式文件
        </p>
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
    </div>
  );
};
