/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/TiptapEditorProvider.ts":
/*!*************************************!*\
  !*** ./src/TiptapEditorProvider.ts ***!
  \*************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TiptapEditorProvider = void 0;
const vscode = __importStar(__webpack_require__(/*! vscode */ "vscode"));
class TiptapEditorProvider {
    static register(context) {
        const provider = new TiptapEditorProvider(context);
        const providerRegistration = vscode.window.registerCustomEditorProvider(TiptapEditorProvider.viewType, provider);
        return providerRegistration;
    }
    constructor(context) {
        this.context = context;
    }
    async resolveCustomTextEditor(document, webviewPanel, _token) {
        webviewPanel.webview.options = {
            enableScripts: true,
            localResourceRoots: [
                vscode.Uri.joinPath(this.context.extensionUri, 'dist')
            ]
        };
        webviewPanel.webview.html = this.getHtmlForWebview(webviewPanel.webview);
        // Update webview when the document changes
        const changeDocumentSubscription = vscode.workspace.onDidChangeTextDocument((e) => {
            if (e.document.uri.toString() === document.uri.toString()) {
                webviewPanel.webview.postMessage({
                    type: 'update',
                    text: document.getText(),
                });
            }
        });
        // Receive message from the webview.
        webviewPanel.webview.onDidReceiveMessage((e) => {
            switch (e.type) {
                case 'ready':
                    webviewPanel.webview.postMessage({
                        type: 'update',
                        text: document.getText(),
                    });
                    return;
                case 'update':
                    this.updateTextDocument(document, e.text);
                    return;
            }
        });
        // Initial update is handled by the 'ready' message from the webview
        // webviewPanel.webview.postMessage({
        // 	type: 'update',
        // 	text: document.getText(),
        // });
        webviewPanel.onDidDispose(() => {
            changeDocumentSubscription.dispose();
        });
    }
    getHtmlForWebview(webview) {
        const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(this.context.extensionUri, 'dist', 'webview.js'));
        return `
			<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">
				<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource} 'unsafe-inline'; script-src ${webview.cspSource} 'unsafe-inline';">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<title>Tiptap Editor</title>
				<style>
					body {
						background-color: var(--vscode-editor-background);
						color: var(--vscode-editor-foreground);
						font-family: var(--vscode-font-family);
						padding: 0;
						margin: 0;
					}
					#root {
						height: 100vh;
						display: flex;
						flex-direction: column;
					}
				</style>
			</head>
			<body>
				<div id="root">Loading Tiptap Editor...</div>
				<script>
					window.addEventListener('error', function (e) {
						const root = document.getElementById('root');
						if (root) {
							root.innerHTML = '<div style="color: red; padding: 20px;">' + 
								'<h3>Runtime Error</h3>' +
								'<pre>' + e.message + '\\n' + e.filename + ':' + e.lineno + '</pre>' +
								'</div>';
						}
					});
				</script>
				<script src="${scriptUri}"></script>
			</body>
			</html>`;
    }
    updateTextDocument(document, text) {
        const edit = new vscode.WorkspaceEdit();
        // Just replace the entire document. 
        // In a real implementation, we would compute a diff to be more efficient and preserve cursor position if possible.
        edit.replace(document.uri, new vscode.Range(0, 0, document.lineCount, 0), text);
        return vscode.workspace.applyEdit(edit);
    }
}
exports.TiptapEditorProvider = TiptapEditorProvider;
TiptapEditorProvider.viewType = 'tiptap-wysiwyg.markdownEditor';


/***/ }),

/***/ "vscode":
/*!*************************!*\
  !*** external "vscode" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("vscode");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;
/*!**************************!*\
  !*** ./src/extension.ts ***!
  \**************************/

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.activate = activate;
const TiptapEditorProvider_1 = __webpack_require__(/*! ./TiptapEditorProvider */ "./src/TiptapEditorProvider.ts");
function activate(context) {
    context.subscriptions.push(TiptapEditorProvider_1.TiptapEditorProvider.register(context));
}

})();

var __webpack_export_target__ = exports;
for(var __webpack_i__ in __webpack_exports__) __webpack_export_target__[__webpack_i__] = __webpack_exports__[__webpack_i__];
if(__webpack_exports__.__esModule) Object.defineProperty(__webpack_export_target__, "__esModule", { value: true });
/******/ })()
;
//# sourceMappingURL=extension.js.map