'use strict';

const { app, BrowserWindow } = require('electron');
const path = require('path');
const url = require('url');
const DiscordRPC = require('../');

if (require('electron-squirrel-startup')) { 
  app.quit();
}

let mainWindow;

const createWindow = () => {
  
  
  mainWindow = new BrowserWindow({
    width: 800,
    height: 450,
    webPreferences: {
      nodeIntegration: true
    }
  });

  // mainWindow.openDevTools();

  mainWindow.removeMenu();

  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  mainWindow.on('closed', () => {

    mainWindow = null;

  });
};

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    createWindow();
  }
});

app.on('activate', () => {

  if (mainWindow === null) {
    createWindow();
  }

});
