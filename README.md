# Tiptap WYSIWYG Editor

A WYSIWYG Markdown editor for VS Code using Tiptap.

## Features

- WYSIWYG editing for Markdown files.
- Switch between WYSIWYG and Source mode.
- Real-time synchronization with VS Code document.

### Enhanced Markdown Support

- **Tables**: Full table support with resizable columns
  - Create and edit tables in WYSIWYG mode
  - Markdown table syntax is preserved
  
- **Task Lists**: Checkbox lists with nested support
  - `- [ ]` for uncompleted tasks
  - `- [x]` for completed tasks
  - Supports nested task items
  
- **Images**: Inline and base64 image support
  - Paste or drag images into the editor
  - Images are displayed inline
  
- **Math**: KaTeX-based mathematical expressions
  - Inline math: `$E = mc^2$`
  - Block math: `$$...$$`
  - Full LaTeX syntax support via KaTeX

## Usage

1. Open any `.md` file in VS Code
2. The Tiptap WYSIWYG editor will open automatically
3. Edit your content in visual mode
4. Click "Switch to Source" to view/edit raw Markdown
5. All changes are saved automatically

## Testing

See `TEST_FEATURES.md` for a comprehensive example of all supported features.
