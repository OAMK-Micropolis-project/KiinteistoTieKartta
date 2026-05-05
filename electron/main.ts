import { app, BrowserWindow } from "electron";
import path from "node:path";
import registerFsHandlers from "./utils/fsHandlers";
import registerPdfHandlers from "./utils/pdfHandlers";
import squirrelStartup from "electron-squirrel-startup";
import { appendFileSync, mkdirSync } from "node:fs";

function writeLog(message: string) {
  const logDir = app.getPath("userData");
  mkdirSync(logDir, { recursive: true });
  const logPath = path.join(logDir, "log.txt");
  const line = `${new Date().toISOString()} - ${message}\n`;
  appendFileSync(logPath, line, { encoding: "utf8" });
}

process.on("uncaughtException", (error) => {
  writeLog(`uncaughtException: ${error.message}`);
});

process.on("unhandledRejection", (reason) => {
  writeLog(`unhandledRejection: ${reason}`);
});

writeLog("app started");

if (squirrelStartup) {
  writeLog("squirrelStartup: quitting");
  app.quit();
}

function createWindow() {
  writeLog("createWindow: starting");
  const win = new BrowserWindow({
    show: false,
    webPreferences: {
      preload: path.join(__dirname, "./preload.js"),
    },
  });

  win.webContents.on(
    "did-fail-load",
    (event, errorCode, errorDescription, url) => {
      writeLog(`did-fail-load: ${errorCode} ${errorDescription} ${url}`);
    },
  );

  win.webContents.on("render-process-gone", (event, details) => {
    writeLog(`render-process-gone: ${details.reason}`);
  });

  win.webContents.on("did-finish-load", () => {
    writeLog("did-finish-load: finished");
  });

  const indexPath = path.join(__dirname, "../dist/index.html");
  writeLog(`preload path: ${path.join(__dirname, "./preload.js")}`);
  writeLog(`index path: ${indexPath}`);

  win.maximize();
  win.show();

  if (process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(process.env.VITE_DEV_SERVER_URL);
  } else {
    writeLog(`loading file: ${indexPath}`);
    win.loadFile(indexPath);
  }
}

app.whenReady().then(() => {
  writeLog("app.whenReady: starting");
  registerFsHandlers();
  writeLog("app.whenReady: fs handlers registered");
  registerPdfHandlers();
  writeLog("app.whenReady: pdf handlers registered");
  createWindow();
  writeLog("app.whenReady: window created");
});
