import React, { useEffect, useMemo, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Markdown } from '@tiptap/markdown';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import Typography from '@tiptap/extension-typography';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Image from '@tiptap/extension-image';
import MathExtension from '@aarkue/tiptap-math-extension';
import 'katex/dist/katex.min.css';
import MarkdownIt from 'markdown-it';

// Declare vscode API
declare global {
  interface Window {
    acquireVsCodeApi: () => any;
  }
}

const vscode = window.acquireVsCodeApi();

const TiptapEditor = () => {
  const [isSourceMode, setIsSourceMode] = useState(false);
  const [markdownContent, setMarkdownContent] = useState('');

  const mdParser = useMemo(() => new MarkdownIt(), []);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Markdown,
      Link,
      Placeholder.configure({
        placeholder: 'Write something...',
      }),
      Typography,
      // Table support
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      // Task list support
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      // Image support
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
      // Math support
      // Note: Type assertion needed due to TypeScript compatibility issue between
      // @aarkue/tiptap-math-extension and @tiptap/core peer dependencies
      MathExtension as any,
    ],
    content: '',
    onUpdate: ({ editor }) => {
      const markdown = (editor.storage.markdown as any).getMarkdown();
      setMarkdownContent(markdown);
      vscode.postMessage({
        type: 'update',
        text: markdown,
      });
    },
  });

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const message = event.data;
      switch (message.type) {
        case 'update':
          setMarkdownContent(message.text);
          if (editor && !editor.isFocused && !isSourceMode) {
             // Convert incoming markdown to HTML for Tiptap
             const newHtml = mdParser.render(message.text);
             editor.commands.setContent(newHtml);
          }
          break;
      }
    };

    window.addEventListener('message', handleMessage);
    
    // Signal that the webview is ready to receive the initial content
    vscode.postMessage({ type: 'ready' });

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [editor, mdParser, isSourceMode]);

  const toggleMode = () => {
    if (isSourceMode) {
        // Switch to WYSIWYG
        if (editor) {
            const newHtml = mdParser.render(markdownContent);
            editor.commands.setContent(newHtml);
        }
    } else {
        // Switch to Source
        if (editor) {
            const markdown = (editor.storage.markdown as any).getMarkdown();
            setMarkdownContent(markdown);
        }
    }
    setIsSourceMode(!isSourceMode);
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const val = e.target.value;
      setMarkdownContent(val);
      vscode.postMessage({ type: 'update', text: val });
  };

  if (!editor) {
    return null;
  }

  return (
    <div className="editor-container" style={{ display: 'flex', flexDirection: 'column', height: '100%', boxSizing: 'border-box', position: 'relative' }}>
      <div style={{ flex: 1, overflow: 'hidden', position: 'relative', padding: '1rem' }}>
        <style>{`
            .ProseMirror {
            outline: none;
            min-height: 100px;
            height: 100%;
            overflow-y: auto;
            }
            .ProseMirror p {
                margin-top: 0.5em;
                margin-bottom: 0.5em;
            }
            
            /* Table styles */
            .ProseMirror table {
              border-collapse: collapse;
              table-layout: fixed;
              width: 100%;
              margin: 1em 0;
              overflow: hidden;
            }
            .ProseMirror td,
            .ProseMirror th {
              min-width: 1em;
              border: 1px solid var(--vscode-editorWidget-border);
              padding: 6px 8px;
              vertical-align: top;
              box-sizing: border-box;
              position: relative;
            }
            .ProseMirror th {
              font-weight: bold;
              text-align: left;
              background-color: var(--vscode-editor-inactiveSelectionBackground);
            }
            .ProseMirror .selectedCell:after {
              z-index: 2;
              position: absolute;
              content: "";
              left: 0;
              right: 0;
              top: 0;
              bottom: 0;
              background: var(--vscode-editor-selectionBackground);
              pointer-events: none;
            }
            /* Column resize handle - values from Tiptap table documentation */
            .ProseMirror .column-resize-handle {
              position: absolute;
              right: -2px; /* Offset to center on column border */
              top: 0;
              bottom: -2px; /* Extend slightly below table */
              width: 4px; /* Handle width for easier dragging */
              background-color: var(--vscode-editorWidget-border);
              pointer-events: none;
            }
            
            /* Task list styles */
            .ProseMirror ul[data-type="taskList"] {
              list-style: none;
              padding: 0;
            }
            .ProseMirror ul[data-type="taskList"] li {
              display: flex;
              align-items: flex-start;
            }
            .ProseMirror ul[data-type="taskList"] li > label {
              flex: 0 0 auto;
              margin-right: 0.5rem;
              user-select: none;
            }
            .ProseMirror ul[data-type="taskList"] li > div {
              flex: 1 1 auto;
            }
            .ProseMirror ul[data-type="taskList"] input[type="checkbox"] {
              cursor: pointer;
            }
            .ProseMirror ul[data-type="taskList"] ul[data-type="taskList"] {
              margin: 0;
              padding-left: 1.5rem;
            }
            
            /* Image styles */
            .ProseMirror img {
              max-width: 100%;
              height: auto;
            }
            .ProseMirror img.ProseMirror-selectednode {
              outline: 3px solid var(--vscode-focusBorder);
            }
        `}</style>
        <div style={{ display: isSourceMode ? 'none' : 'block', height: '100%' }}>
            <EditorContent editor={editor} style={{ height: '100%' }} />
        </div>
        {isSourceMode && (
            <textarea 
                value={markdownContent} 
                onChange={handleTextareaChange}
                style={{
                    width: '100%',
                    height: '100%',
                    resize: 'none',
                    border: 'none',
                    outline: 'none',
                    backgroundColor: 'var(--vscode-editor-background)',
                    color: 'var(--vscode-editor-foreground)',
                    fontFamily: 'var(--vscode-editor-font-family)',
                    fontSize: 'var(--vscode-editor-font-size)'
                }}
            />
        )}
      </div>
      <div style={{ 
          position: 'absolute', 
          bottom: '20px', 
          right: '20px', 
          zIndex: 100,
      }}>
        <button 
            onClick={toggleMode}
            style={{
                backgroundColor: 'var(--vscode-editor-background)',
                color: 'var(--vscode-descriptionForeground)',
                border: '1px solid var(--vscode-widget-border)',
                padding: '4px 10px',
                cursor: 'pointer',
                borderRadius: '12px',
                fontSize: '12px',
                opacity: 0.6,
                transition: 'opacity 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
            onMouseLeave={(e) => e.currentTarget.style.opacity = '0.6'}
        >
            {isSourceMode ? 'Switch to WYSIWYG' : 'Switch to Source'}
        </button>
      </div>
    </div>
  );
};

export default TiptapEditor;
