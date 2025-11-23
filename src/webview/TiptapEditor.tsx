import React, { useEffect, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import { Extension, InputRule } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import { Markdown } from '@tiptap/markdown';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import Typography from '@tiptap/extension-typography';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import { TaskList } from '@tiptap/extension-task-list';
import { TaskItem } from '@tiptap/extension-task-item';
import { Image } from '@tiptap/extension-image';
import BulletList from '@tiptap/extension-bullet-list';
import OrderedList from '@tiptap/extension-ordered-list';
import ListItem from '@tiptap/extension-list-item';
import MathExtension from '@aarkue/tiptap-math-extension';
import 'katex/dist/katex.min.css';

// Declare vscode API
declare global {
  interface Window {
    acquireVsCodeApi: () => any;
  }
}

const vscode = window.acquireVsCodeApi();

const CustomTaskItemInputRule = Extension.create({
  name: 'customTaskItemInputRule',

  addInputRules() {
    return [
      new InputRule({
        find: /^\[([ |x])\]\s$/,
        handler: ({ state, range, match }) => {
          const { $from } = state.selection;
          const parent = $from.node($from.depth - 1);
          
          if (parent && parent.type.name === 'listItem') {
            const checked = match[1] === 'x';
            
            const chain = this.editor.chain()
              .focus()
              .deleteRange(range)
              .liftListItem('listItem')
              .toggleTaskList();
            
            if (checked) {
               chain.updateAttributes('taskItem', { checked: true });
            }

            chain.run();
          }
        },
      }),
    ];
  },
});

const TiptapEditor = () => {
  const [isSourceMode, setIsSourceMode] = useState(false);
  const [markdownContent, setMarkdownContent] = useState('');

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: false,
        orderedList: false,
        listItem: false,
      }),
      CustomTaskItemInputRule,
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      BulletList,
      OrderedList,
      ListItem,
      Link,
      Placeholder.configure({
        placeholder: 'Write something...',
      }),
      Typography,
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      Image,
      MathExtension as any,
      Markdown,
    ],
    content: '',
    onUpdate: ({ editor }) => {
      const markdown = (editor as any).getMarkdown();
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
             editor.commands.setContent(message.text, { contentType: 'markdown' } as any);
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
  }, [editor, isSourceMode]);

  const toggleMode = () => {
    if (isSourceMode) {
        // Switch to WYSIWYG
        if (editor) {
            editor.commands.setContent(markdownContent, { contentType: 'markdown' } as any);
        }
    } else {
        // Switch to Source
        if (editor) {
            const markdown = (editor as any).getMarkdown();
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
            padding: 10px;
            }
            .ProseMirror p {
                margin-top: 0.5em;
                margin-bottom: 0.5em;
            }
            /* Table Styles */
            .ProseMirror table {
              border-collapse: collapse;
              table-layout: fixed;
              width: 100%;
              margin: 0;
              overflow: hidden;
            }
            .ProseMirror td,
            .ProseMirror th {
              min-width: 1em;
              border: 2px solid var(--vscode-editor-lineHighlightBorder);
              padding: 3px 5px;
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
              left: 0; right: 0; top: 0; bottom: 0;
              background: rgba(200, 200, 255, 0.4);
              pointer-events: none;
            }
            .ProseMirror .column-resize-handle {
              position: absolute;
              right: -2px;
              top: 0;
              bottom: 0;
              width: 4px;
              background-color: #adf;
              pointer-events: none;
            }
            /* Task List Styles */
            ul[data-type="taskList"] {
              list-style: none;
              padding: 0;
            }
            ul + ul[data-type="taskList"],
            ul[data-type="taskList"] + ul {
              margin-top: 0;
            }
            ul[data-type="taskList"] li {
              display: flex;
              align-items: center;
            }
            ul[data-type="taskList"] li > label {
              flex: 0 0 auto;
              display: inline-flex;
              align-items: center;
              margin-right: 0.5rem;
              user-select: none;
            }
            ul[data-type="taskList"] li > div {
              flex: 1 1 auto;
            }
        `}</style>
        <div style={{ display: isSourceMode ? 'none' : 'flex', flexDirection: 'column', height: '100%' }}>
            <EditorContent editor={editor} style={{ flex: 1, overflow: 'hidden' }} />
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
