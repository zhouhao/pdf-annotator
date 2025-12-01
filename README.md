# PDF Reader & Annotator

A modern, feature-rich PDF reader and annotation tool built with React and TypeScript. This application provides a professional reading experience with support for annotations, notes, and seamless document management.

## ✨ Features

### 📄 Document Management
- **Multiple Input Sources**: Upload PDF files or load from URLs
- **Thumbnail Navigation**: Visual page previews for quick navigation
- **File Information**: Display document name and source type

### 🎯 Reading Experience
- **Responsive Layout**: Three-panel design with resizable sections
- **Zoom Controls**: Adjustable zoom levels (0.2x to 3x)
- **Page Navigation**: Easy page-by-page navigation with keyboard shortcuts
- **Full-Screen Mode**: Distraction-free reading experience

### 📝 Annotation System
- **Text Selection**: Select any text portion to add notes
- **Note Creation**: Add detailed notes to selected text with position tracking
- **Note Management**: View, edit, and delete annotations
- **Page-Specific Notes**: Filter notes by current page
- **Persistent Storage**: Notes are saved locally and persist between sessions

### 🎨 User Interface
- **Modern Design**: Clean, intuitive interface built with Tailwind CSS
- **Responsive Panels**: Resizable thumbnail, viewer, and notes panels
- **Visual Feedback**: Hover effects and smooth transitions
- **Professional Icons**: Lucide React icons for consistent visual language

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- pnpm package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/pdf-reader-app.git
   cd pdf-reader-app
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Start development server**
   ```bash
   pnpm dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

### Building for Production

```bash
# Build the application
pnpm build

# Preview the production build
pnpm preview
```

## 🛠️ Usage

### Loading PDF Documents

**From Local File:**
1. Click the "Choose PDF File" button
2. Select a PDF file from your device
3. The document will load automatically

**From URL:**
1. Enter the PDF URL in the input field
2. Click the "Load" button
3. The document will be fetched and loaded

### Navigation

- **Thumbnail Panel**: Click on any page thumbnail to navigate
- **Navigation Controls**: Use previous/next buttons or keyboard arrows
- **Page Indicator**: Shows current page and total pages

### Creating Annotations

1. **Select Text**: Click and drag to highlight text in the PDF
2. **Add Note**: A modal will appear automatically
3. **Enter Note**: Type your annotation text
4. **Save**: Click "Save Note" to create the annotation

### Managing Notes

- **View Notes**: All annotations appear in the right panel
- **Navigate to Note**: Click on any note to jump to its location
- **Edit Note**: Click the edit button to modify note text
- **Delete Note**: Click the delete button to remove an annotation

### Zoom Controls

- **Zoom In**: Click the magnifying glass with + icon
- **Zoom Out**: Click the magnifying glass with - icon
- **Reset View**: Click the maximize icon to reset zoom

## 🏗️ Technical Architecture

### Core Technologies
- **React 18**: Modern React with hooks and concurrent features
- **TypeScript**: Type-safe development with full IntelliSense support
- **Vite**: Fast build tool and development server
- **Tailwind CSS**: Utility-first CSS framework for styling

### Key Libraries
- **react-pdf**: PDF rendering and interaction
- **react-resizable-panels**: Draggable panel resizing
- **lucide-react**: Modern icon library
- **uuid**: Unique identifier generation for notes

### Project Structure
```
src/
├── components/          # React components
│   ├── FileUpload.tsx   # File upload functionality
│   ├── ThumbnailPanel.tsx # Page navigation thumbnails
│   ├── PdfViewer.tsx    # Main PDF display component
│   ├── NotesPanel.tsx   # Annotations management
│   ├── NoteModal.tsx    # Note creation/editing modal
│   └── ErrorBoundary.tsx # Error handling
├── types/
│   └── pdf.ts          # TypeScript type definitions
├── lib/
│   └── storage.ts      # Local storage utilities
├── App.tsx            # Main application component
└── main.tsx           # Application entry point
```

### Data Storage
- Notes are stored in browser's `localStorage`
- Each note includes:
  - Unique identifier
  - Page number and text selection
  - Position coordinates for highlighting
  - Timestamp for tracking
  - Custom annotation text

## 🌐 Live Demo

Try the live demo: **[https://pdf-annotator.pages.dev/](https://pdf-annotator.pages.dev/)**

## 🔧 Development Scripts

```bash
# Start development server
pnpm dev

# Build for production
pnpm build

# Run ESLint
pnpm lint

# Preview production build
pnpm preview
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Development Guidelines
- Follow existing code style and patterns
- Use TypeScript for type safety
- Test thoroughly before submitting
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Originally generated by minimax agent and subsequently enhanced
- Built with modern web technologies and best practices
- Inspired by professional PDF reading applications

## 🔮 Future Enhancements

- [ ] Export annotations to different formats
- [ ] Support for PDF bookmarks and outlines
- [ ] Dark mode theme
- [ ] Highlight colors and styles
- [ ] Search functionality within documents
- [ ] Cloud storage integration
- [ ] Collaboration features
- [ ] Drawing and sketching tools
- [ ] Document printing and export options