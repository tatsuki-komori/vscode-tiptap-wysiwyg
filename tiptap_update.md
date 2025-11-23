# Tiptap Update Plan

This document outlines the plan to update the Tiptap libraries to their latest versions and introduce the `@tiptap/markdown` extension.

## Packages to be Updated

| Package                      | Current Version     | Target Version |
| ---------------------------- | ------------------- | -------------- |
| `@tiptap/extension-link`     | `^2.0.0-beta.220`   | `^3.11.0`      |
| `@tiptap/extension-placeholder`| `^2.0.0-beta.220`   | `^3.11.0`      |
| `@tiptap/extension-typography` | `^2.0.0-beta.220`   | `^3.11.0`      |
| `@tiptap/react`              | `^2.0.0-beta.220`   | `^3.11.0`      |
| `@tiptap/starter-kit`        | `^2.0.0-beta.220`   | `^3.11.0`      |

## New Package to be Added

| Package            | Version   |
| ------------------ | --------- |
| `@tiptap/markdown` | `^3.11.0` |

## Installation Commands

The following commands will be run to update the dependencies:

```bash
npm install @tiptap/extension-link@latest @tiptap/extension-placeholder@latest @tiptap/extension-typography@latest @tiptap/react@latest @tiptap/starter-kit@latest @tiptap/markdown@latest
```
