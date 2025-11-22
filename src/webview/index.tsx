import React from 'react';
import { createRoot } from 'react-dom/client';
import TiptapEditor from './TiptapEditor';

const container = document.getElementById('root');
console.log('Webview script starting...');
if (container) {
    console.log('Root element found, mounting React app...');
    const root = createRoot(container);
    root.render(<TiptapEditor />);
} else {
    console.error('Root element not found');
}
