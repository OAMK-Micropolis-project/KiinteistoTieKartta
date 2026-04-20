import { app, BrowserWindow } from "electron";
import path from "node:path";

function createWindow() {
  const win = new BrowserWindow({ 
    show: false,
    webPreferences: {
      preload: path.join(__dirname, "./preload.js"),
    }
  });
    win.maximize();
    win.show();

  if (process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(process.env.VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path.join(__dirname, "../dist/index.html"));
  }
}

app.whenReady().then(() => {
  createWindow()
});
