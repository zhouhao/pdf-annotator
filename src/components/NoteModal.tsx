import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { Selection } from '../types/pdf';

interface NoteModalProps {
  isOpen: boolean;
  selection: Selection | null;
  onClose: () => void;
  onSave: (noteText: string) => void;
}

export const NoteModal: React.FC<NoteModalProps> = ({
  isOpen,
  selection,
  onClose,
  onSave,
}) => {
  const [noteText, setNoteText] = useState('');

  useEffect(() => {
    if (isOpen) {
      setNoteText('');
    }
  }, [isOpen]);

  const handleSave = () => {
    if (noteText.trim()) {
      onSave(noteText.trim());
      setNoteText('');
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      handleSave();
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen || !selection) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        {/* 头部 */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">添加备注</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 内容 */}
        <div className="p-4">
          {/* 显示选中的文本 */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              选中的文本 (第 {selection.pageNumber} 页):
            </label>
            <div className="p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded">
              <p className="text-sm text-gray-800">"{selection.text}"</p>
            </div>
          </div>

          {/* 备注输入框 */}
          <div className="mb-4">
            <label htmlFor="noteText" className="block text-sm font-medium text-gray-700 mb-2">
              您的备注:
            </label>
            <textarea
              id="noteText"
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="在此输入您的备注内容..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={4}
              autoFocus
            />
            <p className="text-xs text-gray-500 mt-1">
              按 Ctrl+Enter 快速保存，按 Esc 取消
            </p>
          </div>
        </div>

        {/* 底部按钮 */}
        <div className="flex justify-end gap-3 p-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            取消
          </button>
          <button
            onClick={handleSave}
            disabled={!noteText.trim()}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Save className="w-4 h-4" />
            保存备注
          </button>
        </div>
      </div>
    </div>
  );
};
