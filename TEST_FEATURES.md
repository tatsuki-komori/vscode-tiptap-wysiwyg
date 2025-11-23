# Test Document for Enhanced Markdown Features

This document tests all the new Markdown features added to the Tiptap WYSIWYG editor.

## 1. Tables

Tables should now be fully supported with resizable columns:

| Feature | Status | Notes |
|---------|--------|-------|
| Tables | ✅ Implemented | Supports resizable columns |
| Task Lists | ✅ Implemented | With nested support |
| Images | ✅ Implemented | Inline and base64 support |
| Math | ✅ Implemented | KaTeX rendering |

## 2. Task Lists

Task lists with checkboxes are now supported:

- [ ] Uncompleted task
- [x] Completed task
- [ ] Task with nested items
  - [ ] Nested task 1
  - [x] Nested task 2
    - [ ] Double nested task

## 3. Images

Images can now be embedded (you can test by pasting or dragging images):

![Sample Image](https://via.placeholder.com/150)

## 4. Math Expressions

### Inline Math

You can write inline math like $E = mc^2$ or $\pi r^2$.

### Block Math

$$
\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}
$$

$$
f(x) = \frac{1}{\sigma\sqrt{2\pi}} e^{-\frac{1}{2}\left(\frac{x-\mu}{\sigma}\right)^2}
$$

## Summary

All four enhanced Markdown features have been successfully implemented:

1. ✅ **Tables** - Full table support with resizing
2. ✅ **Task Lists** - Checkbox lists with nesting support
3. ✅ **Images** - Inline and base64 image support
4. ✅ **Math** - KaTeX-based math rendering (inline and block)
