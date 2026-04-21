"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const node_path_1 = __importDefault(require("node:path"));
const pdfHandlers_1 = __importDefault(require("./utils/pdfHandlers"));
const fsHandlers_1 = __importDefault(require("./utils/fsHandlers"));
function createWindow() {
    const win = new electron_1.BrowserWindow({
        show: false,
        webPreferences: {
            preload: node_path_1.default.join(__dirname, "./preload.js"),
        },
    });
    win.maximize();
    win.show();
    if (process.env.VITE_DEV_SERVER_URL) {
        win.loadURL(process.env.VITE_DEV_SERVER_URL);
    }
    else {
        win.loadFile(node_path_1.default.join(__dirname, "../dist/index.html"));
    }
}
electron_1.app.whenReady().then(() => {
    createWindow();
    (0, pdfHandlers_1.default)();
    (0, fsHandlers_1.default)();
});
