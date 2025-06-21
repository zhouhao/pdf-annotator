export interface Note {
  id: string;
  pageNumber: number;
  selectedText: string;
  noteText: string;
  position: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  timestamp: number;
}

export type PdfSource = File | string;

export interface PdfDocument {
  name: string;
  source: PdfSource;
  numPages: number;
}

export interface Selection {
  text: string;
  pageNumber: number;
  position: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}
